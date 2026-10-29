import type { AgentKind } from '../types/agent'

// Voix système "gadgets" ou robotiques sur macOS/navigateurs à exclure absolument
const ROBOTIC_OR_NOVELTY_VOICES = [
  'flo',
  'grandpa',
  'grandma',
  'reed',
  'rocko',
  'sandy',
  'shelley',
  'eddy',
  'bells',
  'zarvox',
  'trinoids',
  'whisper',
  'boing',
  'ALBERT',
  'bad news',
  'good news',
  'organ',
  'cellos',
  'jester',
  'superstar',
]

const FEMALE_VOICE_HINTS = [
  'amélie',
  'amelie',
  'audrey',
  'aurélie',
  'aurelie',
  'marie',
  'julie',
  'hortense',
  'denise',
  'eloise',
  'éloïse',
  'brigitte',
  'celeste',
  'céleste',
  'chloé',
  'chloe',
  'google français',
  'siri',
]

const MALE_VOICE_HINTS = [
  'thomas',
  'nicolas',
  'paul',
  'henri',
  'daniel',
  'claude',
  'remy',
  'rémy',
  'alain',
  'bernard',
  'jerome',
  'jérôme',
  'mathieu',
]

class VillageVoiceService {
  private enabled: boolean = true
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null
  private voices: SpeechSynthesisVoice[] = []
  private currentSpeechPromise: Promise<void> = Promise.resolve()
  private resolveCurrentSpeech: (() => void) | null = null
  private lastSpokenText: string = ''
  private lastSpokenAt: number = 0

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis
      this.loadVoices()
      try {
        if (typeof this.synth.addEventListener === 'function') {
          this.synth.addEventListener('voiceschanged', () => this.loadVoices())
        } else if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices()
        }
      } catch {
        // Fallback transparent si le navigateur restreint l'écouteur
      }
    }
  }

  private scoreVoiceQuality(v: SpeechSynthesisVoice): number {
    const nameLower = v.name.toLowerCase()
    let score = 0

    // Exclure fortement les voix robotiques / effets spéciaux
    if (ROBOTIC_OR_NOVELTY_VOICES.some(bad => nameLower.includes(bad))) {
      return -100
    }

    // Privilégier fr-FR et fr-CA
    if (v.lang === 'fr-FR') score += 25
    else if (v.lang.startsWith('fr')) score += 15

    // Voix Neuronales / Haute Qualité (Google, Microsoft Natural, Apple Premium/Enhanced)
    if (nameLower.includes('natural') || nameLower.includes('neural')) score += 60
    if (nameLower.includes('google')) score += 55
    if (nameLower.includes('premium') || nameLower.includes('enhanced') || nameLower.includes('améliorée')) score += 50
    if (nameLower.includes('siri')) score += 45
    if (nameLower.includes('thomas') || nameLower.includes('amélie') || nameLower.includes('amelie') || nameLower.includes('audrey') || nameLower.includes('aurélie') || nameLower.includes('paul') || nameLower.includes('julie') || nameLower.includes('denise') || nameLower.includes('henri')) {
      score += 35
    }
    if (!v.localService) score += 15 // Les voix cloud (Google/Edge) sont souvent neuronales

    return score
  }

  private loadVoices() {
    if (!this.synth) return
    const allFrench = this.synth
      .getVoices()
      .filter(v => v.lang.toLowerCase().startsWith('fr'))
      .sort((a, b) => this.scoreVoiceQuality(b) - this.scoreVoiceQuality(a))

    const cleanVoices = allFrench.filter(v => this.scoreVoiceQuality(v) > 0)
    this.voices = cleanVoices.length > 0 ? cleanVoices : allFrench
  }

  private pickVoiceForAgent(agentKind?: AgentKind): {
    voice: SpeechSynthesisVoice | null
    pitch: number
    rate: number
  } {
    if (this.voices.length === 0) {
      this.loadVoices()
    }

    const wantsFemale = agentKind === 'notary' || agentKind === 'creative' || agentKind === 'spirits'

    const matchingGenderVoice = this.voices.find(v => {
      const lower = v.name.toLowerCase()
      return wantsFemale
        ? FEMALE_VOICE_HINTS.some(h => lower.includes(h))
        : MALE_VOICE_HINTS.some(h => lower.includes(h))
    })

    const chosenVoice = matchingGenderVoice || this.voices[0] || null

    // On garde le pitch très proche de 1.0 (entre 0.96 et 1.05) pour éviter toute distorsion robotique
    switch (agentKind) {
      case 'king':
        return { voice: chosenVoice, pitch: 0.95, rate: 0.96 }
      case 'griot':
        return { voice: chosenVoice, pitch: 1.03, rate: 1.03 }
      case 'notary':
        return { voice: chosenVoice, pitch: 1.04, rate: 0.98 }
      case 'creative':
        return { voice: chosenVoice, pitch: 1.05, rate: 1.0 }
      case 'advisor':
        return { voice: chosenVoice, pitch: 0.96, rate: 0.95 }
      case 'developer':
        return { voice: chosenVoice, pitch: 0.99, rate: 1.02 }
      case 'spirits':
        return { voice: chosenVoice, pitch: 1.02, rate: 0.95 }
      default:
        return { voice: chosenVoice, pitch: 1.0, rate: 1.0 }
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setEnabled(val: boolean) {
    this.enabled = val
    if (!val && this.synth) {
      this.synth.cancel()
      if (this.resolveCurrentSpeech) {
        this.resolveCurrentSpeech()
        this.resolveCurrentSpeech = null
      }
    }
  }

  public cleanText(text: string): string {
    return text
      .replace(/[#*`_~>[\]«»"]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  public speak(text: string, agentKind?: AgentKind) {
    const clean = this.cleanText(text)
    if (!clean) return

    // Éviter de relancer exactement la même phrase si React re-rend le composant à quelques millisecondes d'intervalle
    const now = Date.now()
    if (clean === this.lastSpokenText && now - this.lastSpokenAt < 900) {
      return
    }
    this.lastSpokenText = clean
    this.lastSpokenAt = now

    // Résoudre proprement toute promesse précédente
    if (this.resolveCurrentSpeech) {
      this.resolveCurrentSpeech()
      this.resolveCurrentSpeech = null
    }

    const wordCount = clean.split(/\s+/).length
    const fallbackDurationMs = Math.min(Math.max(wordCount * 360 + 900, 2800), 11000)

    if (!this.enabled || !this.synth) {
      this.currentSpeechPromise = new Promise(resolve => {
        this.resolveCurrentSpeech = resolve
        window.setTimeout(() => {
          if (this.resolveCurrentSpeech === resolve) {
            this.resolveCurrentSpeech = null
          }
          resolve()
        }, fallbackDurationMs)
      })
      return
    }

    this.synth.cancel()

    const { voice, pitch, rate } = this.pickVoiceForAgent(agentKind)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = voice?.lang || 'fr-FR'
    utterance.rate = rate
    utterance.pitch = pitch
    if (voice) {
      utterance.voice = voice
    }

    this.currentSpeechPromise = new Promise(resolve => {
      let finished = false
      const done = () => {
        if (finished) return
        finished = true
        if (this.resolveCurrentSpeech === done) {
          this.resolveCurrentSpeech = null
        }
        resolve()
      }
      this.resolveCurrentSpeech = done

      utterance.onend = () => {
        // Pause naturelle de respiration (350ms) après la fin réelle de la phrase
        window.setTimeout(done, 350)
      }

      utterance.onerror = () => {
        done()
      }

      // Sécurité si le navigateur met en pause l'onglet
      window.setTimeout(done, fallbackDurationMs + 2500)

      // Vérifier si l'utilisateur a interagi avec la page pour respecter les règles d'autoplay du navigateur
      const hasUserActivated = typeof navigator !== 'undefined' && 'userActivation' in navigator
        ? (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? true
        : true

      if (!hasUserActivated) {
        window.setTimeout(done, fallbackDurationMs)
        return
      }

      try {
        this.synth!.speak(utterance)
      } catch {
        done()
      }
    })
  }

  /**
   * Permet au moteur de mission d'attendre que l'avatar actuel ait VRAIMENT terminé sa phrase
   * avant de donner la parole à l'avatar suivant.
   */
  public async waitForCurrentSpeech(minMs = 2600, signal?: AbortSignal): Promise<void> {
    const start = Date.now()
    await Promise.race([
      this.currentSpeechPromise,
      new Promise<void>(resolve => {
        if (!signal) return
        if (signal.aborted) {
          resolve()
          return
        }
        signal.addEventListener('abort', () => resolve(), { once: true })
      }),
    ])
    const elapsed = Date.now() - start
    if (elapsed < minMs && (!signal || !signal.aborted)) {
      await new Promise<void>(resolve => {
        const t = window.setTimeout(resolve, minMs - elapsed)
        signal?.addEventListener(
          'abort',
          () => {
            window.clearTimeout(t)
            resolve()
          },
          { once: true }
        )
      })
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel()
    }
    if (this.resolveCurrentSpeech) {
      this.resolveCurrentSpeech()
      this.resolveCurrentSpeech = null
    }
  }
}

export const villageVoice = new VillageVoiceService()


