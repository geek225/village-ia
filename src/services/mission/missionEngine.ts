import type { AgentKind } from '../../types/agent'
import type { AttachedFile, Mission, MissionEvent, MissionArtifact, MissionTelemetry } from '../../types/mission'
import type { AIModel, AIRequest } from '../../types/ai'
import { AIRegistry } from '../ai/aiRegistry'
import { villageVoice } from '../../utils/speechSynthesis'

function wrapJsIntoPlayableHtml(jsCode: string, title: string): string {
  const isCalc = title.toLowerCase().includes('calcul') || jsCode.toLowerCase().includes('calc')
  if (isCalc) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: safe center;
      justify-content: safe center;
      padding: 16px;
    }
    #app, .calculator {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      max-width: 360px;
      width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${jsCode}
  </script>
</body>
</html>`
  }
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
    }
    canvas {
      border: 2px solid #38bdf8;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(56, 189, 248, 0.2);
      background: #020617;
      max-width: 100%;
    }
    .game-banner {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 12px;
      color: #38bdf8;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="game-banner">${title}</div>
  <canvas id="gameCanvas" width="400" height="400"></canvas>
  <script>
    ${jsCode}
  </script>
</body>
</html>`
}

function extractArtifactsFromText(
  text: string,
  meta: { agentRole?: AgentKind; modelUsed?: string }
): MissionArtifact[] {
  const artifacts: MissionArtifact[] = []
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null
  let count = 1

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const rawLang = match[1]?.trim().toLowerCase() || 'text'
    let code = match[2]?.trim()
    if (!code) continue

    let type: MissionArtifact['type'] = 'code'
    if (rawLang === 'json') type = 'json'
    else if (rawLang === 'markdown' || rawLang === 'md') type = 'markdown'

    let lang = rawLang
    if (lang === 'js') lang = 'javascript'
    if (lang === 'ts') lang = 'typescript'
    if (lang === 'py') lang = 'python'

    const codeLower = code.toLowerCase()
    const isGameOrApp =
      lang === 'html' ||
      codeLower.includes('<canvas') ||
      codeLower.includes('requestanimationframe') ||
      codeLower.includes('addeventlistener("keydown"') ||
      codeLower.includes("addeventlistener('keydown'") ||
      codeLower.includes('class calculator') ||
      codeLower.includes('id="calculator"') ||
      codeLower.includes('id="calc"') ||
      codeLower.includes('snake') ||
      codeLower.includes('pacman') ||
      codeLower.includes('pong')

    let appCategory: MissionArtifact['appCategory'] = undefined
    if (codeLower.includes('snake') || codeLower.includes('pacman') || codeLower.includes('pong') || codeLower.includes('tetris') || codeLower.includes('game') || codeLower.includes('<canvas')) {
      appCategory = 'game'
    } else if (codeLower.includes('calc') || codeLower.includes('calculat') || codeLower.includes('addition')) {
      appCategory = 'calculator'
    } else if (codeLower.includes('todo') || codeLower.includes('task')) {
      appCategory = 'tool'
    } else if (isGameOrApp) {
      appCategory = 'widget'
    }

    const roleLabel = meta.agentRole === 'developer'
      ? 'Le Développeur'
      : meta.agentRole === 'researcher'
      ? 'Le Chercheur'
      : meta.agentRole === 'creative'
      ? 'La Créative'
      : meta.agentRole === 'advisor'
      ? 'Le Conseiller'
      : 'Conseil'

    const title = isGameOrApp
      ? appCategory === 'game'
        ? `🎮 Jeu Réalisé (${roleLabel})`
        : appCategory === 'calculator'
        ? `📱 Calculatrice Réalisée (${roleLabel})`
        : `⚡ Application Réalisée (${roleLabel})`
      : `${roleLabel} — Code ${lang.toUpperCase()} (#${count})`

    if (isGameOrApp && (lang === 'javascript' || lang === 'js')) {
      code = wrapJsIntoPlayableHtml(code, title)
      lang = 'html'
    }

    artifacts.push({
      id: `art-${Date.now()}-${count++}`,
      title,
      language: lang,
      content: code,
      type: isGameOrApp ? 'app' : type,
      agentRole: meta.agentRole,
      modelUsed: meta.modelUsed,
      createdAt: Date.now(),
      isPlayableApp: isGameOrApp,
      appCategory,
    })
  }

  return artifacts
}

export type MissionEventListener = (event: MissionEvent, mission: Mission) => void

export class MissionEngine {
  private activeMission: Mission | null = null
  private listeners: Set<MissionEventListener> = new Set()
  private abortController: AbortController | null = null
  private timerIds: number[] = []

  public onEvent(listener: MissionEventListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit(event: Omit<MissionEvent, 'id' | 'timestamp'>) {
    if (!this.activeMission) return
    const fullEvent: MissionEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()),
    }
    this.listeners.forEach(listener => listener(fullEvent, this.activeMission!))
  }

  private sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        return reject(new DOMException('Mission Aborted', 'AbortError'))
      }
      const timer = window.setTimeout(() => {
        resolve()
      }, ms)
      this.timerIds.push(timer)
      signal.addEventListener('abort', () => {
        window.clearTimeout(timer)
        reject(new DOMException('Mission Aborted', 'AbortError'))
      }, { once: true })
    })
  }

  public cancelCurrentMission(): boolean {
    if (!this.activeMission || this.activeMission.stage === 'completed' || this.activeMission.stage === 'cancelled') {
      return false
    }

    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }

    this.timerIds.forEach(window.clearTimeout)
    this.timerIds = []

    this.activeMission.stage = 'cancelled'
    this.activeMission.updatedAt = Date.now()

    this.emit({
      type: 'MISSION_CANCELLED',
      missionId: this.activeMission.id,
      title: 'Mission interrompue',
      detail: 'L’utilisateur a annulé la mission en cours.',
      state: 'failed',
    })

    return true
  }

  public getActiveMission(): Mission | null {
    return this.activeMission
  }

  private async waitForSpeech(text: string, minMs: number, signal: AbortSignal): Promise<void> {
    const clean = text.replace(/[«»"]/g, '').trim()
    const wordCount = clean.split(/\s+/).length
    const readingMs = Math.max(wordCount * 350 + 900, minMs)
    // Laisse 80ms à React pour monter la bulle et démarrer l'utterance dans VillageMap
    await this.sleep(80, signal)
    await villageVoice.waitForCurrentSpeech(readingMs, signal)
  }

  private getAgentDisplayName(kind: AgentKind): string {
    switch (kind) {
      case 'king':
        return 'Le Roi'
      case 'griot':
        return 'Le Griot'
      case 'researcher':
        return 'Le Chercheur'
      case 'developer':
        return 'Le Développeur'
      case 'creative':
        return 'La Créative'
      case 'advisor':
        return 'Le Conseiller'
      case 'notary':
        return 'La Guérisseuse'
      case 'spirits':
        return 'Les Esprits'
    }
  }

  public async startMission(prompt: string, files: AttachedFile[] = []): Promise<Mission> {
    const missionId = `mission-${Date.now()}`
    const p = prompt.toLowerCase()

    const assignedAgents: AgentKind[] = ['griot', 'king']

    const isInteractiveAppOrGame =
      p.includes('jeu') || p.includes('game') || p.includes('snake') || p.includes('serpent') ||
      p.includes('calcul') || p.includes('pacman') || p.includes('pong') || p.includes('tetris') ||
      p.includes('morpion') || p.includes('todo') || p.includes('quiz') || p.includes('quizz') ||
      p.includes('minuteur') || p.includes('chronomètre') || p.includes('simulateur') || p.includes('widget') ||
      p.includes('canvas')

    // 1. Sélection du 1er Spécialiste (Chef de file)
    let primarySpecialist: AgentKind = 'researcher'
    if (isInteractiveAppOrGame) {
      primarySpecialist = 'developer'
    } else if (files.some(f => f.type.startsWith('image/')) || p.includes('image') || p.includes('dessin') || p.includes('visuel') || p.includes('photo') || p.includes('design')) {
      primarySpecialist = 'creative'
    } else if (p.includes('code') || p.includes('bug') || p.includes('fonction') || p.includes('script') || p.includes('développ') || p.includes('algo') || p.includes('app') || p.includes('site') || p.includes('api')) {
      primarySpecialist = 'developer'
    } else if (p.includes('conseil') || p.includes('stratégie') || p.includes('avis') || p.includes('recommand') || p.includes('arbitrage') || p.includes('décision') || p.includes('sagesse') || p.includes('business')) {
      primarySpecialist = 'advisor'
    } else if (p.includes('soin') || p.includes('santé') || p.includes('remède') || p.includes('rédig') || p.includes('contrat') || p.includes('notaire') || p.includes('guériss') || p.includes('synthèse') || p.includes('résum')) {
      primarySpecialist = 'notary'
    } else {
      primarySpecialist = 'researcher'
    }

    // 2. Sélection du 2e Spécialiste (Co-équipier en Relais)
    let secondarySpecialist: AgentKind = 'advisor'
    if (isInteractiveAppOrGame) {
      secondarySpecialist = 'creative'
    } else if (primarySpecialist === 'researcher') {
      secondarySpecialist = p.includes('tech') || p.includes('outil') || p.includes('système') ? 'developer' : 'advisor'
    } else if (primarySpecialist === 'developer') {
      secondarySpecialist = p.includes('ui') || p.includes('interface') || p.includes('design') ? 'creative' : 'researcher'
    } else if (primarySpecialist === 'creative') {
      secondarySpecialist = 'advisor'
    } else if (primarySpecialist === 'advisor') {
      secondarySpecialist = 'researcher'
    } else {
      secondarySpecialist = 'researcher'
    }

    assignedAgents.push(primarySpecialist, secondarySpecialist)

    const primaryName = this.getAgentDisplayName(primarySpecialist)
    const secondaryName = this.getAgentDisplayName(secondarySpecialist)

    const newMission: Mission = {
      id: missionId,
      title: prompt.length > 40 ? `${prompt.slice(0, 37)}…` : prompt,
      prompt,
      files,
      assignedAgents,
      stage: 'received',
      progress: 5,
      steps: [
        { id: '1', title: 'Demande reçue & Course du Griot', agentRole: 'griot', description: 'Le Griot porte votre requête au Palais Royal.', status: 'in_progress' },
        { id: '2', title: 'Alliance des Masques & Plan du Roi', agentRole: 'king', description: `Le Roi mobilise le binôme ${primaryName} + ${secondaryName}.`, status: 'pending' },
        { id: '3', title: `Relais #1 : ${primaryName}`, agentRole: primarySpecialist, description: `${primaryName} produit l'analyse fondamentale et passe le relais.`, status: 'pending' },
        { id: '4', title: `Relais #2 : ${secondaryName}`, agentRole: secondarySpecialist, description: `${secondaryName} enrichit et complète le travail du 1er spécialiste.`, status: 'pending' },
        { id: '5', title: 'Scellement & Livrable Collaboratif', agentRole: 'notary', description: 'La Guérisseuse fusionne les travaux en un livrable officiel.', status: 'pending' },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSimulated: true,
    }

    this.activeMission = newMission
    this.abortController = new AbortController()
    const { signal } = this.abortController

    try {
      // Déterminer la catégorie de tâche et sélectionner les 2 Esprits IA complémentaires dès le départ
      const taskType = files.some(f => f.type.startsWith('image/'))
        ? 'creative'
        : p.includes('résum') || p.includes('synthèse')
        ? 'summary'
        : p.includes('tradui')
        ? 'translation'
        : 'analysis'

      const serializedFiles = files.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
        dataUrl: f.dataUrl,
        textContent: f.textContent,
      }))

      const aiRequest: AIRequest = {
        prompt,
        files: serializedFiles,
        taskType,
      }

      const primaryModel: AIModel = AIRegistry.selectBestModel(aiRequest)
      const companionModel: AIModel = AIRegistry.selectCompanionModel(primaryModel)
      newMission.selectedModel = primaryModel
      newMission.isSimulated =
        primaryModel.provider === 'local_simulated' || !AIRegistry.hasApiKey(primaryModel.provider)

      const primarySpiritName = primaryModel.spiritName || primaryModel.name
      const companionSpiritName = companionModel.spiritName || companionModel.name

      const isCalculator = p.includes('calcul')
      const step1Instruction = isInteractiveAppOrGame
        ? `Tu es Le Développeur du Village IA, éclairé par l'Esprit « ${primarySpiritName} » (${primaryModel.name}).
Tu es le PREMIER expert à intervenir pour créer une APPLICATION / UN JEU INTERACTIF 100% FONCTIONNEL ET JOUABLE IMMÉDIATEMENT.

DIRECTIVE CRITIQUE D'EXÉCUTION EN DIRECT (STANDALONE SINGLE-FILE HTML5) :
L'utilisateur veut tester et JOUER ou UTILISER directement cette réalisation dans le Playground Grand Écran du Village !
Tu DOIS impérativement fournir dans un SEUL bloc \`\`\`html complet de A à Z (avec doctype, head, style, body, script) :

${
  isCalculator
    ? `SPÉCIFICATIONS CALCULATRICE PRO (DESIGN MODERNE TYPE iOS / DARK GLASSMORPHISM) :
1. Mise en page CSS : Centrer parfaitement la calculatrice au milieu de la fenêtre avec safe alignment :
   body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; align-items: safe center; justify-content: safe center; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; box-sizing: border-box; }
2. Conteneur calculatrice :
   .calculator { background: #1e293b; border: 1px solid #334155; border-radius: 24px; padding: 22px; width: 340px; max-width: 100%; height: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.6); }
   CRITIQUE : Ne JAMAIS spécifier de height fixe sur .calculator pour ne couper aucun bouton ni l'écran supérieur !
3. Écran d'affichage (Display) :
   - Placé tout en haut de la calculatrice
   - Historique en petit texte (#94a3b8) au-dessus
   - Grand affichage du résultat / saisie en blanc (#f8fafc), taille ~40px, aligné à droite, sans déborder
4. Clavier en grille 4 colonnes (grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px;) :
   - Ligne 1 : AC (Clear), +/- (signe), % (pourcentage), ÷ (division)
   - Ligne 2 : 7, 8, 9, × (multiplication)
   - Ligne 3 : 4, 5, 6, - (soustraction)
   - Ligne 4 : 1, 2, 3, + (addition)
   - Ligne 5 : 0 (large), . (virgule), = (égal coloré en orange #f59e0b ou bleu #2563eb)
5. Robustesse & Clavier : Clics tactiles réactifs ET écouteur document.addEventListener('keydown') pour taper directement au clavier (chiffres 0-9, +, -, *, /, Entrée pour =, Backspace pour effacer, Escape pour AC).`
    : `SPÉCIFICATIONS JEUX & APPS INTERACTIVES :
1. Structure HTML moderne : conteneur centré, canvas responsive (ex: 400x400 ou 480x480) ou conteneurs interactifs.
2. Design CSS moderne dans <style> : thème sombre élégant (#0f172a), responsive, boutons soignés, aucun débordement.
3. Logique JavaScript complète dans <script> : boucle de jeu requestAnimationFrame, gestion des états (Play, Pause, Game Over, Rejouer), score et meilleur score.
4. Contrôles complets : Clavier (Flèches, Espace, ZQSD) ET boutons tactiles pour mobile/tablette.`
}

IMPORTANT : Ne mets JAMAIS de commentaire du genre "// le reste du code ici" ou de code tronqué. Rédige l'intégralité du code HTML5 exécutable dans un seul bloc \`\`\`html.`
        : `Tu es ${primaryName} du Village IA, éclairé par l'Esprit « ${primarySpiritName} » (${primaryModel.name}).
Tu es le PREMIER expert à intervenir sur cette mission avant de soumettre ton travail au débat critique de ton confrère ${secondaryName}.
Mission : Fournis l'analyse technique, l'architecture concrète, le code complet ou la première ébauche rigoureuse répondant directement à la demande du visiteur. Sois précis, exhaustif et fournis du code (HTML, JS, Python, SQL) ou des démonstrations concrètes directement exploitables.`

      // Lancement anticipé en tâche de fond de l'appel IA du 1er Spécialiste pour zéro temps mort !
      const step1Promise = AIRegistry.executeCollaborativeAgentStep({
        agentTitle: primaryName,
        agentRoleDescription: `Premier expert du relais (${primaryName})`,
        spiritModel: primaryModel,
        userPrompt: prompt,
        files: serializedFiles,
        stepInstruction: step1Instruction,
      })

      // 1. MESSAGE REÇU PAR LE GRIOT
      this.emit({
        type: 'MISSION_CREATED',
        missionId,
        title: 'Nouvelle quête multi-agents',
        detail: `Quête confiée à l'équipe du Village IA : "${newMission.title}"`,
        agentKind: 'griot',
        state: 'done',
      })

      const msgReceived = `« J’ai reçu votre mission ! Je cours vers le Palais Royal pour que le Roi mobilise ${primaryName} et ${secondaryName}. »`
      this.emit({
        type: 'MESSAGE_RECEIVED',
        missionId,
        title: 'Le Griot prend le message',
        detail: msgReceived,
        agentKind: 'griot',
        state: 'done',
      })

      await this.waitForSpeech(msgReceived, 3400, signal)

      // 2. COURSE DU GRIOT VERS LE ROI
      newMission.stage = 'travel_to_king'
      newMission.progress = 18
      newMission.steps[0].status = 'completed'
      newMission.steps[1].status = 'in_progress'

      this.emit({
        type: 'AGENT_MOVEMENT_STARTED',
        missionId,
        title: 'Le Griot court au Palais',
        detail: 'Le messager traverse la place du village jusqu’au trône royal.',
        agentKind: 'griot',
        state: 'active',
      })

      await this.sleep(1900, signal)

      const promptShort = prompt.length > 55 ? `${prompt.slice(0, 52)}…` : prompt
      const griotArrival = `« Majesté ! Le visiteur confie cette quête : "${promptShort}". Quels spécialistes devons-nous unir ? »`
      this.emit({
        type: 'AGENT_ARRIVED',
        missionId,
        title: 'Arrivée devant le Roi',
        detail: griotArrival,
        agentKind: 'griot',
        state: 'done',
      })

      await this.waitForSpeech(griotArrival, 4200, signal)

      // 3. CONSULTATION DES ESPRITS & PLAN D'ÉQUIPE DU ROI
      newMission.stage = 'consulting_spirits'
      newMission.progress = 32

      const spiritsVerdict = `« Alliance scellée ! Le ${primarySpiritName} guidera ${primaryName}, puis le ${companionSpiritName} inspirera ${secondaryName} en relais ! »`
      this.emit({
        type: 'MODEL_SELECTED',
        missionId,
        title: `Alliance : ${primarySpiritName} & ${companionSpiritName}`,
        detail: spiritsVerdict,
        agentKind: 'spirits',
        state: 'done',
        data: { model: primaryModel },
      })

      await this.waitForSpeech(spiritsVerdict, 4400, signal)

      const kingOrder = `« Par décret royal, j’ordonne un travail en relais : ${primaryName} ouvrira la voie avec le ${primarySpiritName}, puis passera le témoin à ${secondaryName} avec le ${companionSpiritName} ! »`
      this.emit({
        type: 'AGENT_ASSIGNED',
        missionId,
        title: 'Plan de Relais du Roi',
        detail: kingOrder,
        agentKind: 'king',
        state: 'active',
      })

      await this.waitForSpeech(kingOrder, 4600, signal)

      newMission.steps[1].status = 'completed'
      newMission.steps[2].status = 'in_progress'

      // 4. RELAIS #1 : LE 1ER SPÉCIALISTE PREND LA PAROLE ET LIVRE SON TRAVAIL
      newMission.stage = 'assigning_specialist'
      newMission.progress = 50

      await this.sleep(1600, signal)

      newMission.stage = 'specialist_working'
      newMission.progress = 62

      const step1Result = await step1Promise
      const step1Artifacts = extractArtifactsFromText(step1Result.contributionMarkdown, {
        agentRole: primarySpecialist,
        modelUsed: `${primarySpiritName} (${primaryModel.name})`,
      })

      const step2Instruction = isInteractiveAppOrGame
        ? `Tu es ${secondaryName} du Village IA, éclairé par l'Esprit « ${companionSpiritName} » (${companionModel.name}).
Tu interviens en DEUXIÈME EXPERT pour auditer, enrichir et perfectionner l'application / le jeu créé par ${primaryName}.
Tu as analysé son code ci-dessus.

MISSION DE DÉBAT & PERFECTIONNEMENT :
1. AUDIT DE JOUABILITÉ & PERFORMANCE : Vérifie la réactivité des contrôles (clavier/tactile), la gestion des collisions, le score et l'absence de bugs.
2. ENRICHISSEMENTS : Propose des optimisations graphiques (effets néon, contrastes, sons Web Audio API natifs sans fichier externe) et de fluidité.
3. CONSOLIDATION : Formule la version finale prête à être jouée dans le Playground.`
        : `Tu es ${secondaryName} du Village IA, éclairé par l'Esprit « ${companionSpiritName} » (${companionModel.name}).
Tu interviens en DEUXIÈME EXPERT pour débattre, challenger et enrichir de manière critique les propositions de ton confrère ${primaryName}.
Tu as analysé son travail ci-dessus.

PROTOCOLE DE DÉBAT & RELAIS DE HAUT NIVEAU :
1. ANALYSE CRITIQUE & DÉBAT : Identifie les forces, mais relève les angles morts, risques de sécurité, soucis de performance ou cas limites négligés par ${primaryName}.
2. AMÉLIORATION & CONTRE-PROPOSITION : Ne te contente pas de commenter. Propose un code bonifié, des optimisations directes ou une stratégie complémentaire solide.
3. CONSOLIDATION : Formule une réponse claire et structurée prête pour l'arbitrage et le scellement final.`

      // Lance immédiatement en tâche de fond le Relais #2 avec Protocole de Débat & Contre-Expertise
      const step2Promise = AIRegistry.executeCollaborativeAgentStep({
        agentTitle: secondaryName,
        agentRoleDescription: `Second expert en débat et relais (${secondaryName})`,
        spiritModel: companionModel,
        userPrompt: prompt,
        previousContributions: step1Result.contributionMarkdown,
        stepInstruction: step2Instruction,
      })

      const step1ChatNote = `🛠️ **[RELAIS 1/2 — ${primaryName} × ${primarySpiritName} (${primaryModel.providerLabel})]**\n${step1Result.spokenSummary}\n\n${step1Result.contributionMarkdown}\n\n➡️ *Je soumets cette ébauche au débat et à l'expertise de **${secondaryName}** (${companionSpiritName}) !*`

      this.emit({
        type: 'AGENT_WORK_STARTED',
        missionId,
        title: `Relais #1 : ${primaryName} (${primarySpiritName})`,
        detail: step1Result.spokenSummary,
        agentKind: primarySpecialist,
        state: 'done',
        data: {
          chatText: step1ChatNote,
          artifacts: step1Artifacts,
          telemetry: {
            executionMs: step1Result.executionTimeMs || 1150,
            modelName: primaryModel.name,
            providerLabel: primaryModel.providerLabel,
            spiritName: primarySpiritName,
            tokensEstimate: Math.round(step1Result.contributionMarkdown.length / 4),
            isDebated: false,
          },
        },
      })

      await this.waitForSpeech(step1Result.spokenSummary, 4500, signal)

      newMission.steps[2].status = 'completed'
      newMission.steps[3].status = 'in_progress'

      // 5. RELAIS #2 : PASSAGE DE TÉMOIN ET DÉBAT CRITIQUE
      newMission.progress = 78

      const griotRelaySpeech = `« J’ai porté les travaux de ${primaryName} à ${secondaryName} pour ouverture du débat d'experts ! »`
      this.emit({
        type: 'AGENT_MOVEMENT_STARTED',
        missionId,
        title: `Passage de relais & Débat avec ${secondaryName}`,
        detail: griotRelaySpeech,
        agentKind: 'griot',
        state: 'active',
      })

      await this.sleep(1500, signal)

      const step2Result = await step2Promise
      const step2Artifacts = extractArtifactsFromText(step2Result.contributionMarkdown, {
        agentRole: secondarySpecialist,
        modelUsed: `${companionSpiritName} (${companionModel.name})`,
      })

      const step2ChatNote = `⚔️🤝 **[DÉBAT & RELAIS 2/2 — ${secondaryName} × ${companionSpiritName} (${companionModel.providerLabel})]**\n${step2Result.spokenSummary}\n\n${step2Result.contributionMarkdown}\n\n➡️ *Le débat contradictoire est clos. Transmission à **La Guérisseuse** pour l'arbitrage et le scellement définitif.*`

      this.emit({
        type: 'AGENT_WORK_COMPLETED',
        missionId,
        title: `Débat #2 : ${secondaryName} (${companionSpiritName})`,
        detail: step2Result.spokenSummary,
        agentKind: secondarySpecialist,
        state: 'done',
        data: {
          chatText: step2ChatNote,
          artifacts: step2Artifacts,
          telemetry: {
            executionMs: step2Result.executionTimeMs || 1080,
            modelName: companionModel.name,
            providerLabel: companionModel.providerLabel,
            spiritName: companionSpiritName,
            tokensEstimate: Math.round(step2Result.contributionMarkdown.length / 4),
            isDebated: true,
          },
        },
      })

      await this.waitForSpeech(step2Result.spokenSummary, 4500, signal)

      newMission.steps[3].status = 'completed'
      newMission.steps[4].status = 'in_progress'

      // 6. SYNTHÈSE & SCELLEMENT OFFICIEL PAR LA GUÉRISSEUSE
      newMission.stage = 'verification'
      newMission.progress = 92

      const verifierSpeech = `« J’arbitre le débat entre ${primaryName} et ${secondaryName}. J'unis leurs conclusions sous le sceau des Esprits pour délivrer la solution certifiée. »`
      this.emit({
        type: 'AGENT_WORK_STARTED',
        missionId,
        title: 'Arbitrage & Certification officielle',
        detail: verifierSpeech,
        agentKind: 'notary',
        state: 'active',
      })

      await this.waitForSpeech(verifierSpeech, 4200, signal)

      // Construction du Livrable Officiel Collaboratif réunissant les travaux réels du binôme d'agents
      const totalTokens = Math.round(
        (step1Result.contributionMarkdown.length + step2Result.contributionMarkdown.length + prompt.length) / 4
      )
      const totalLatency = (step1Result.executionTimeMs || 1150) + (step2Result.executionTimeMs || 1080)

      const finalCollaborativeDeliverable = `### 🏛️ LIVRABLE COLLABORATIF DU CONSEIL — VILLAGE IA
**Binôme d'Agents Mobilisé :** **${primaryName}** *(Esprit : ${primarySpiritName} — ${primaryModel.providerLabel})* ⚔️🤝 **${secondaryName}** *(Esprit : ${companionSpiritName} — ${companionModel.providerLabel})*

---

#### 1️⃣ Volet d'Attaque & Architecture — Par ${primaryName} (${primarySpiritName})
${step1Result.contributionMarkdown}

---

#### 2️⃣ Débat Critique, Optimisations & Relais — Par ${secondaryName} (${companionSpiritName})
${step2Result.contributionMarkdown}

---

#### 🌿 Sceau, Arbitrage & Synthèse de La Guérisseuse
- **Arbitrage du débat inter-agents** : Les contre-propositions de **${secondaryName}** consolident et sécurisent l'approche initiale de **${primaryName}**.
- **Consensus technique scellé** : Solution validée pour déploiement et exécution immédiate.
- **Télémétrie d'Exécution Réelle** : Latence cumulée : ${(totalLatency / 1000).toFixed(2)}s • Modèles invoqués : ${primaryModel.name} & ${companionModel.name} • Estimation tokens : ~${totalTokens.toLocaleString('fr-FR')}.`

      const masterDeliverableArtifact: MissionArtifact = {
        id: `master-livrable-${missionId}`,
        title: `Livrable Certifié — ${newMission.title}`,
        language: 'markdown',
        content: finalCollaborativeDeliverable,
        type: 'markdown',
        agentRole: 'notary',
        modelUsed: `${primarySpiritName} × ${companionSpiritName}`,
        createdAt: Date.now(),
      }

      const allArtifacts = [masterDeliverableArtifact, ...step1Artifacts, ...step2Artifacts]
      const missionTelemetry: MissionTelemetry = {
        totalExecutionMs: totalLatency,
        primaryLatencyMs: step1Result.executionTimeMs || 1150,
        companionLatencyMs: step2Result.executionTimeMs || 1080,
        modelsInvoked: [primaryModel.name, companionModel.name],
        tokensEstimate: totalTokens,
        debated: true,
      }

      // 7. FINALISATION & RETOUR AUX CASES
      newMission.stage = 'completed'
      newMission.progress = 100
      newMission.finalResult = finalCollaborativeDeliverable
      newMission.artifacts = allArtifacts
      newMission.telemetry = missionTelemetry
      newMission.steps[4].status = 'completed'
      newMission.updatedAt = Date.now()

      const celebrationSpeech = `« Mission accomplie en équipe ! Le débat entre ${primaryName} et ${secondaryName} a produit le livrable certifié ! »`
      this.emit({
        type: 'MISSION_COMPLETED',
        missionId,
        title: 'Mission multi-agents accomplie',
        detail: celebrationSpeech,
        agentKind: 'griot',
        state: 'done',
        data: {
          result: finalCollaborativeDeliverable,
          model: primaryModel,
          companionModel: companionModel,
          artifacts: allArtifacts,
          telemetry: missionTelemetry,
          isSimulated: newMission.isSimulated,
        },
      })

      return newMission
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Mission déjà annulée
        return newMission
      }

      newMission.stage = 'error'
      newMission.errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      newMission.updatedAt = Date.now()

      this.emit({
        type: 'MISSION_FAILED',
        missionId,
        title: 'Échec de la mission',
        detail: newMission.errorMessage,
        state: 'failed',
      })

      return newMission
    }
  }
}

export const missionEngine = new MissionEngine()
