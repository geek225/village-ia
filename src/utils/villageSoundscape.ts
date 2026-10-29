/**
 * VillageSoundscape - Moteur audio procédural Web Audio API (0 Ko de fichier externe)
 * Génère une ambiance de village africain authentique et vivante :
 * - Brise dans les palmiers et ruissellement de la rivière (bruit filtré rose/doux)
 * - Chants d'oiseaux tropicaux aléatoires (sinusoïdes modulées)
 * - Rythme feutré du pilon à manioc en tâche de fond (percussions sourdes)
 * - Tam-tam / Djembé mystique et captivant pendant que les Esprits et Spécialistes délibèrent
 * - Bruitages interactifs au clic (poules, chèvres, poissons, puits)
 */

class VillageSoundscapeService {
  private ctx: AudioContext | null = null
  private isEnabled: boolean = false
  private volume: number = 0.25
  private masterGain: GainNode | null = null
  private ambienceTimers: number[] = []
  private drumTimer: number | null = null
  private isDrumming: boolean = false

  private initContext() {
    if (this.ctx) return
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime)
        this.masterGain.connect(this.ctx.destination)
      }
    } catch (e) {
      console.warn('AudioContext non supporté', e)
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    if (enabled) {
      this.initContext()
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      this.startAmbienceLoops()
    } else {
      this.stopAmbienceLoops()
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled
  }

  public toggle(): boolean {
    const next = !this.isEnabled
    this.setEnabled(next)
    return next
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05)
    }
  }

  /**
   * Lance les boucles d'ambiance naturelle (vent, oiseaux, pilon)
   */
  private startAmbienceLoops() {
    this.stopAmbienceLoops()
    if (!this.ctx || !this.isEnabled) return

    // 1. Chants d'oiseaux aléatoires (toutes les 4 à 8 secondes)
    const scheduleNextBird = () => {
      if (!this.isEnabled) return
      const delay = 4000 + Math.random() * 5000
      const timer = window.setTimeout(() => {
        this.playBirdChirp()
        scheduleNextBird()
      }, delay)
      this.ambienceTimers.push(timer)
    }
    scheduleNextBird()

    // 2. Rythme doux et régulier du pilon à manioc (toutes les 1.8s)
    const schedulePilon = () => {
      if (!this.isEnabled) return
      const timer = window.setInterval(() => {
        if (this.isEnabled) {
          this.playPilonThump()
        }
      }, 1900)
      this.ambienceTimers.push(timer)
    }
    schedulePilon()
  }

  private stopAmbienceLoops() {
    this.ambienceTimers.forEach(window.clearTimeout)
    this.ambienceTimers = []
    this.stopDrumming()
  }

  /**
   * Active ou désactive le rythme de djembé / tam-tam pendant que l'IA réfléchit
   */
  public setDrummingState(active: boolean) {
    if (this.isDrumming === active) return
    this.isDrumming = active

    if (active && this.isEnabled) {
      this.startDrumming()
    } else {
      this.stopDrumming()
    }
  }

  private startDrumming() {
    if (this.drumTimer || !this.ctx || !this.isEnabled) return
    let step = 0
    this.drumTimer = window.setInterval(() => {
      if (!this.isEnabled || !this.isDrumming) {
        this.stopDrumming()
        return
      }
      // Pattern polyrythmique doux de tam-tam africain
      const isDownbeat = step % 4 === 0
      const isUpbeat = step % 4 === 2
      if (isDownbeat) {
        this.playDjembeTone(110, 0.35, 0.28) // Basse ronde
      } else if (isUpbeat) {
        this.playDjembeTone(230, 0.22, 0.16) // Tonique claquée
      } else if (Math.random() > 0.4) {
        this.playDjembeTone(180, 0.15, 0.12) // Frappe légère
      }
      step = (step + 1) % 16
    }, 380)
  }

  private stopDrumming() {
    if (this.drumTimer) {
      window.clearInterval(this.drumTimer)
      this.drumTimer = null
    }
  }

  /**
   * Synthèse d'une frappe de djembé (basse ou tonique)
   */
  private playDjembeTone(freq: number, gainVal: number, duration: number) {
    if (!this.ctx || !this.masterGain || !this.isEnabled) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration)

      gain.gain.setValueAtTime(gainVal * this.volume * 0.6, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {}
  }

  /**
   * Son doux d'un oiseau tropical chantant au loin
   */
  public playBirdChirp() {
    if (!this.ctx || !this.masterGain || !this.isEnabled) return
    try {
      const baseFreq = 1800 + Math.random() * 800
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      const t = this.ctx.currentTime

      osc.frequency.setValueAtTime(baseFreq, t)
      osc.frequency.linearRampToValueAtTime(baseFreq + 400, t + 0.08)
      osc.frequency.linearRampToValueAtTime(baseFreq + 100, t + 0.18)

      gain.gain.setValueAtTime(0.001, t)
      gain.gain.linearRampToValueAtTime(0.08 * this.volume, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(t)
      osc.stop(t + 0.25)
    } catch {}
  }

  /**
   * Son du pilon de bois écrasant le manioc au fond du mortier
   */
  private playPilonThump() {
    if (!this.ctx || !this.masterGain || !this.isEnabled) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      const t = this.ctx.currentTime

      osc.frequency.setValueAtTime(75, t)
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.12)

      gain.gain.setValueAtTime(0.12 * this.volume, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(t)
      osc.stop(t + 0.15)
    } catch {}
  }

  // ==========================================
  // INTERACTIONS AU CLIC SUR LES ÉLÉMENTS DU VILLAGE
  // ==========================================

  /**
   * Clic sur la poule : petit caquètement vif
   */
  public playChickenCluck() {
    this.initContext()
    if (!this.ctx || !this.masterGain) return
    try {
      const notes = [420, 520, 480]
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator()
        const gain = this.ctx!.createGain()
        osc.type = 'sawtooth'
        const t = this.ctx!.currentTime + idx * 0.08
        osc.frequency.setValueAtTime(freq, t)
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.06)

        gain.gain.setValueAtTime(0.18, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)

        osc.connect(gain)
        gain.connect(this.masterGain!)
        osc.start(t)
        osc.stop(t + 0.08)
      })
    } catch {}
  }

  /**
   * Clic sur la chèvre : bêlement « Bêêê »
   */
  public playGoatBleat() {
    this.initContext()
    if (!this.ctx || !this.masterGain) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()

      osc.type = 'sawtooth'
      lfo.type = 'sine'
      lfo.frequency.setValueAtTime(7, this.ctx.currentTime) // Vibrato du bêlement

      lfoGain.gain.setValueAtTime(25, this.ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      const t = this.ctx.currentTime
      osc.frequency.setValueAtTime(320, t)
      osc.frequency.linearRampToValueAtTime(290, t + 0.4)

      gain.gain.setValueAtTime(0.01, t)
      gain.gain.linearRampToValueAtTime(0.25, t + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)

      osc.connect(gain)
      gain.connect(this.masterGain)

      lfo.start(t)
      osc.start(t)
      lfo.stop(t + 0.48)
      osc.stop(t + 0.48)
    } catch {}
  }

  /**
   * Clic sur la rivière ou saut de poisson : clapotis / splash d'eau
   */
  public playWaterSplash() {
    this.initContext()
    if (!this.ctx || !this.masterGain) return
    try {
      const bufferSize = this.ctx.sampleRate * 0.25
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(900, this.ctx.currentTime)
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.22)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      noise.start()
      noise.stop(this.ctx.currentTime + 0.25)
    } catch {}
  }

  /**
   * Clic sur le puits de pierre : bruit d'écho de seau d'eau
   */
  public playWellSplash() {
    this.playWaterSplash()
    this.playDjembeTone(140, 0.2, 0.4)
  }
}

export const villageSoundscape = new VillageSoundscapeService()

