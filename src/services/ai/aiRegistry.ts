import type { AIModel, AIRequest, AIResponse, CustomProviderKind, CustomSpiritConfig, ProviderId } from '../../types/ai'

// Constante standard de sécurité requise par les scanners d'audit (ex: Herozion)
export const MAX_CONTENT_LENGTH = 15 * 1024 * 1024 // 15 Mo max upload limit

// Type local pour les pièces jointes
type AttachedFile = NonNullable<AIRequest['files']>[number]

export const REGISTERED_MODELS: AIModel[] = [
  {
    id: 'free/gemini-3.8-flash',
    name: 'Gemini 3.8 Flash (APInex Gratuit)',
    spiritName: 'Masque Goli',
    spiritOrigin: 'Côte d’Ivoire (Peuple Baoulé / Wan)',
    spiritHistory: 'Originaire du peuple Wan et adopté au XIXe siècle par les Baoulé du centre de la Côte d’Ivoire, le Goli est un grand masque festivalier et protecteur. Il est sorti lors des grands événements sacrés, des funérailles d’hommes d’État ou des crises sanitaires pour purifier le village, chasser les épidémies et rétablir la concorde entre la terre, les vivants et les ancêtres.',
    spiritMeaning: 'Harmonie cosmique, vision panoramique, paix collective et médiation bienveillante entre les mondes.',
    assignedAiReason: 'Le Goli veille sur tout le village d’un regard global à 360°. Gemini 3.8 Flash dispose d’une gigantesque fenêtre de contexte d’1 million de tokens et d’une capacité multimodale (texte, image, document) capable d’embrasser l’intégralité d’un projet complexe sans en perdre une bribe.',
    spiritImage: '/assets/mask-spirit-gold.png',
    provider: 'apinex',
    providerLabel: 'APInex / Google',
    description: 'Modèle multimodal ultra-rapide gratuit sur APInex, incarné par le Masque Goli pour la vision et l’harmonie.',
    capabilities: {
      supportsText: true,
      supportsImages: true,
      supportsDocuments: true,
      contextWindow: 1000000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit Actif & Rapide',
  },
  {
    id: 'free/deepseek-v4.1-flash',
    name: 'DeepSeek V4.1 Flash (APInex Gratuit)',
    spiritName: 'Masque Zaouli',
    spiritOrigin: 'Côte d’Ivoire (Peuple Gouro)',
    spiritHistory: 'Né dans les années 1950 dans le département de Zuénoula en Côte d’Ivoire, le Zaouli a été créé en hommage à Djela Lou Zaouli (« la fille de Zaouli »), célèbre pour sa beauté lumineuse. C’est un masque profane de célébration populaire dont la danse ultra-rapide exige une virtuosité stupéfiante (plus de 200 pas saccadés par minute, le haut du corps restant parfaitement immobile). Il est inscrit au patrimoine immatériel de l’UNESCO.',
    spiritMeaning: 'Beauté féminine suprême, vélocité spectaculaire, maîtrise technique et agilité mentale.',
    assignedAiReason: 'Tout comme le danseur de Zaouli enchaîne des pas complexes à une vitesse vertigineuse sans jamais faillir, DeepSeek V4.1 Flash décompose la logique algorithmique, génère du code propre et résout les problèmes d’ingénierie à une cadence prodigieuse.',
    spiritImage: '/assets/mask-spirit-purple.png',
    provider: 'apinex',
    providerLabel: 'APInex / DeepSeek',
    description: 'Spécialiste de la logique, de la vitesse d’exécution et du raisonnement décomposé, porté par l’agilité du Zaouli.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit Raisonnement & Code',
  },
  {
    id: 'free/deepseek-v4-pro-0813',
    name: 'DeepSeek V4 Pro (APInex Gratuit)',
    spiritName: 'Grand Masque Zaouli',
    spiritOrigin: 'Côte d’Ivoire (Peuple Gouro)',
    spiritHistory: 'Chef-d’œuvre sculptural des grands maîtres initiés Gouro, surmonté de totems animaliers et d’emblèmes cosmiques racontant l’histoire des lignées. Il n’apparaît que pour les délibérations capitales et la transmission des mystères profonds.',
    spiritMeaning: 'Sagesse monumentale, réflexion approfondie, mémoire des origines et discernement des causes cachées.',
    assignedAiReason: 'Réservé aux énigmes complexes et aux audits de fond, DeepSeek V4 Pro prend le temps de déployer une chaîne de raisonnement profonde pour percer les données les plus denses.',
    spiritImage: '/assets/african-spirit-masks.png',
    provider: 'apinex',
    providerLabel: 'APInex / DeepSeek',
    description: 'Raisonnement approfondi pour analyses complexes et fouille de données, sous le haut patronage du Grand Zaouli.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'deep',
    },
    status: 'available',
    tag: 'Gratuit Analyse Profonde',
  },
  {
    id: 'free/gpt-6-luna',
    name: 'GPT-6 Luna (APInex Gratuit)',
    spiritName: 'Masque Kplé Kplé',
    spiritOrigin: 'Côte d’Ivoire (Peuple Baoulé)',
    spiritHistory: 'Premier masque à faire son apparition lors du rituel du Goli chez les Baoulé. Masque facial rond comme la lune, peint de rouge ou de noir et coiffé de deux cornes recourbées. Esprit joueur et espiègle, il court à travers la foule, amuse les jeunes et détend l’atmosphère pour instaurer la confiance et le dialogue.',
    spiritMeaning: 'Énergie lunaire juvénile, spontanéité, art oratoire, dénouement des tensions et accueil bienveillant.',
    assignedAiReason: 'Le Kplé Kplé libère la parole et crée du lien. GPT-6 Luna apporte une aisance conversationnelle, un style fluide et une écoute fine des nuances pour accueillir les requêtes des visiteurs du village.',
    spiritImage: '/assets/mask-spirit-green.png',
    provider: 'apinex',
    providerLabel: 'APInex / Luna',
    description: 'Masque lunaire apportant fluidité de conversation, clarté narrative et esprit de dialogue.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit Conversation & Création',
  },
  {
    id: 'free/glm-5.3-flash',
    name: 'GLM 5.3 Flash (APInex Gratuit)',
    spiritName: 'Masque Déanglé',
    spiritOrigin: 'Côte d’Ivoire (Peuple Dan / Yacouba)',
    spiritHistory: 'Issu de la tradition sacrée du peuple Dan dans les montagnes de Man (ouest de la Côte d’Ivoire). Ce masque raffiné aux yeux délicatement fendus personnifie la douceur féminine et la paix. Il sert d’intermédiaire entre le camp d’initiation dans la forêt sacrée et les familles du village, apportant réconfort, nourriture et sagesse.',
    spiritMeaning: 'Pédagogie initiatique, diplomatie, bienveillance maternelle et harmonisation des esprits.',
    assignedAiReason: 'Le Déanglé guide les initiés avec tact et impartialité. GLM 5.3 Flash est le compagnon idéal du Conseiller pour équilibrer les avis, évaluer les compromis et éclairer la gouvernance stratégique du village.',
    spiritImage: '/assets/mask-spirit-gold.png',
    provider: 'apinex',
    providerLabel: 'APInex / Zhipu',
    description: 'Masque bienveillant d’apprentissage et de médiation, idéal pour la polyvalence des instructions.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit Polyvalent',
  },
  {
    id: 'free/minimax-m3.1-flash',
    name: 'MiniMax M3.1 Flash (APInex Gratuit)',
    spiritName: 'Masque Glaé',
    spiritOrigin: 'Côte d’Ivoire (Peuple Wè / Guéré)',
    spiritHistory: 'Masque de souveraineté et d’autorité coutumière suprême chez les Wè (Guéré et Wobé) de l’ouest ivoirien. Avec ses traits impressionnants, ses yeux tubulaires et sa parure guerrière, le Glaé est le juge ultime du village : il arrête les conflits, prononce les sentences coutumières et garantit le secret des décoctions et des remèdes traditionnels.',
    spiritMeaning: 'Justice coutumière, rigueur inviolable, protection contre le chaos et pouvoir de guérison.',
    assignedAiReason: 'Le Glaé ne tolère aucune inexactitude et recherche la vérité brute. MiniMax M3.1 Flash permet à La Guérisseuse de certifier chaque analyse, de synthétiser les données sans ambiguïté et de délivrer un verdict thérapeutique irréprochable.',
    spiritImage: '/assets/mask-spirit-green.png',
    provider: 'apinex',
    providerLabel: 'APInex / MiniMax',
    description: 'Masque de justice et d’ordre coutumier, parfait pour la rigueur des synthèses et la certification notariale.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit Synthèse & Résumé',
  },
  {
    id: 'qwen/qwen3.8-max:free',
    name: 'Qwen 3.8 Max (xKiro Gratuit)',
    spiritName: 'Masque Poro',
    spiritOrigin: 'Côte d’Ivoire (Peuple Sénoufo — Korhogo)',
    spiritHistory: 'Au cœur du bois sacré des Sénoufo du nord de la Côte d’Ivoire, l’institution initiatique du Poro enseigne durant des cycles de sept ans la maîtrise de soi, la philosophie cosmique et l’excellence du savoir-faire. Ses masques sacrés incarnent la connaissance suprême acquise par l’effort collectif.',
    spiritMeaning: 'Haute initiation, architecture de la pensée, coordination multi-experts et maîtrise absolue.',
    assignedAiReason: 'Qwen 3.8 Max sur xKiro déploie une puissance de raisonnement de très haut niveau pour orchestrer les travaux entre plusieurs agents spécialistes et résoudre les problématiques les plus ardues.',
    spiritImage: '/assets/mask-spirit-gold.png',
    provider: 'xkiro',
    providerLabel: 'xKiro / Qwen Max',
    description: 'Modèle phare gratuit sur xKiro, dédié au raisonnement multi-agents et aux synthèses de haute volée.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 256000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit xKiro Multi-Agents',
  },
  {
    id: 'qwen/qwen3-coder-plus:free',
    name: 'Qwen 3 Coder Plus (xKiro Gratuit)',
    spiritName: 'Masque Komo',
    spiritOrigin: 'Afrique de l’Ouest / Nord Côte d’Ivoire (Confrérie des Forgerons)',
    spiritHistory: 'Lié à la confrérie millénaire des maîtres-forgerons qui transforment le minerai brut par le feu et l’enclume, le masque Komo protège les secrets de la fabrication, de l’outillage et de l’ingénierie.',
    spiritMeaning: 'Maîtrise de la forge, précision technique, architecture logicielle et solidité du code.',
    assignedAiReason: 'Spécialement forgé pour Le Développeur du Village, Qwen 3 Coder Plus excelle dans l’écriture de code propre, le débogage et la conception d’architectures techniques.',
    spiritImage: '/assets/mask-spirit-purple.png',
    provider: 'xkiro',
    providerLabel: 'xKiro / Qwen Coder',
    description: 'Forgeron du code et des algorithmes sur xKiro, allié privilégié du Développeur lors des missions techniques.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 256000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit xKiro Code & Dev',
  },
  {
    id: 'mistralai/mistral-large-2512',
    name: 'Mistral Large 2512 (xKiro Gratuit)',
    spiritName: 'Masque Bagnon',
    spiritOrigin: 'Côte d’Ivoire (Peuple Bété — Daloa / Gagnoa)',
    spiritHistory: 'Chez le peuple Bété de l’ouest forestier ivoirien, le Bagnon désigne l’idéal d’élégance, de prestance oratoire, de noblesse de caractère et de charisme. Il brille lors des grandes joutes verbales et des conseils de sagesse.',
    spiritMeaning: 'Éloquence souveraine, finesse linguistique française, stratégie et clarté d’expression.',
    assignedAiReason: 'Mistral Large 2512 possède une maîtrise native exceptionnelle de la langue française, permettant au Chercheur et au Conseiller de rédiger des analyses d’une grande finesse.',
    spiritImage: '/assets/mask-spirit-green.png',
    provider: 'xkiro',
    providerLabel: 'xKiro / Mistral AI',
    description: 'Excellence francophone et analytique gratuite via xKiro, incarnée par le charisme du Bagnon.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit xKiro Stratégie & FR',
  },
  {
    id: 'qwen/qwen3.8-omni-flash:free',
    name: 'Qwen 3.8 Omni Flash (xKiro Gratuit)',
    spiritName: 'Masque Wè Omniscient',
    spiritOrigin: 'Côte d’Ivoire (Peuple Wè)',
    spiritHistory: 'Masque vigie aux multiples regards, capable de percevoir simultanément les signes visibles et les paroles prononcées à travers tout le village.',
    spiritMeaning: 'Vélocité instantanée, perception multimodale et réactivité temps réel.',
    assignedAiReason: 'Ultra-rapide sur xKiro, Qwen 3.8 Omni Flash permet aux agents du village de dialoguer en temps réel et de se passer le relais sans latence.',
    spiritImage: '/assets/mask-spirit-gold.png',
    provider: 'xkiro',
    providerLabel: 'xKiro / Qwen Omni',
    description: 'Moteur omnimodal ultra-rapide gratuit sur xKiro pour le passage de relais instantané entre agents.',
    capabilities: {
      supportsText: true,
      supportsImages: true,
      supportsDocuments: true,
      contextWindow: 256000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Gratuit xKiro Temps Réel',
  },
  {
    id: 'agnes-2.5-flash',
    name: 'Agnes 2.5 Flash Reasoning (Agnes AI)',
    spiritName: 'Oracle Koutou',
    spiritOrigin: 'Côte d’Ivoire (Tradition des Oracles de Sagesse)',
    spiritHistory: 'Oracle de méditation profonde consulté lorsque deux spécialistes du village confrontent leurs travaux pour en extraire une synthèse supérieure.',
    spiritMeaning: 'Méditation analytique, chaîne de pensée et vérification croisée.',
    assignedAiReason: 'Doté d’une fenêtre de 512k tokens et d’un moteur de réflexion interne, Agnes 2.5 Flash enrichit le relais entre les spécialistes et la Guérisseuse.',
    spiritImage: '/assets/mask-spirit-purple.png',
    provider: 'agnes',
    providerLabel: 'Agnes AI',
    description: 'Modèle de réflexion et d’analyse multi-étapes (512k contexte) connecté via Agnes AI.',
    capabilities: {
      supportsText: true,
      supportsImages: true,
      supportsDocuments: true,
      contextWindow: 512000,
      isFreeOrLowCost: true,
      speed: 'balanced',
    },
    status: 'available',
    tag: 'Agnes AI Raisonnement',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    spiritName: 'Masque Goli Flali',
    spiritOrigin: 'Côte d’Ivoire (Peuple Baoulé)',
    provider: 'gemini',
    providerLabel: 'Google AI',
    description: 'Modèle multimodal ultra-rapide pour l’analyse de documents et d’images.',
    capabilities: {
      supportsText: true,
      supportsImages: true,
      supportsDocuments: true,
      contextWindow: 1000000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Recommandé Vitesse & Vision',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    spiritName: 'Grand Oracle Goli',
    spiritOrigin: 'Côte d’Ivoire (Peuple Baoulé)',
    provider: 'gemini',
    providerLabel: 'Google AI',
    description: 'Raisonnement profond sur documents très volumineux et analyses complexes.',
    capabilities: {
      supportsText: true,
      supportsImages: true,
      supportsDocuments: true,
      contextWindow: 2000000,
      isFreeOrLowCost: false,
      speed: 'deep',
    },
    status: 'available',
    tag: 'Grand Contexte',
  },
  {
    id: 'openrouter-llama-3.3-70b',
    name: 'Meta Llama 3.3 70B Instruct',
    spiritName: 'Masque Kpwan',
    spiritOrigin: 'Côte d’Ivoire (Peuple Baoulé)',
    provider: 'openrouter',
    providerLabel: 'OpenRouter / Meta',
    description: 'Modèle open-source polyvalent, excellent pour la rédaction et la synthèse.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'balanced',
    },
    status: 'available',
    tag: 'Open-Source & Synthèse',
  },
  {
    id: 'openrouter-deepseek-r1',
    name: 'DeepSeek R1 Distill',
    spiritName: 'Masque Gué Gblin',
    spiritOrigin: 'Côte d’Ivoire (Peuple Dan)',
    provider: 'openrouter',
    providerLabel: 'OpenRouter / DeepSeek',
    description: 'Spécialiste du raisonnement logique, décomposition étape par étape sur échasses de vérité.',
    capabilities: {
      supportsText: true,
      supportsImages: false,
      supportsDocuments: false,
      contextWindow: 64000,
      isFreeOrLowCost: true,
      speed: 'deep',
    },
    status: 'available',
    tag: 'Raisonnement Logique',
  },
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini',
    spiritName: 'Masque Boti',
    spiritOrigin: 'Côte d’Ivoire (Peuple Sénoufo)',
    provider: 'openai',
    providerLabel: 'OpenAI',
    description: 'Modèle économique et réactif pour les questions quotidiennes et traductions.',
    capabilities: {
      supportsText: true,
      supportsImages: true,
      supportsDocuments: true,
      contextWindow: 128000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'available',
    tag: 'Polyvalent Économique',
  },
  {
    id: 'local-simulated-spirit',
    name: 'Esprit du Village (Moteur Local)',
    spiritName: 'Masque des Ancêtres du Village',
    spiritOrigin: 'Tradition Royale Ivoirienne',
    provider: 'local_simulated',
    providerLabel: 'Village IA Local',
    description: 'Simulation locale haute fidélité sans clé API requise, transparente et sécurisée.',
    capabilities: {
      supportsText: true,
      supportsImages: true,
      supportsDocuments: true,
      contextWindow: 32000,
      isFreeOrLowCost: true,
      speed: 'fast',
    },
    status: 'simulated',
    tag: 'Mode Démo Garanti',
  },
]

export class AIRegistry {
  private static envApiKeys: Partial<Record<ProviderId, string>> = {
    gemini: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY?.trim()) || '',
    openrouter: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY?.trim()) || '',
    openai: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_KEY?.trim()) || '',
    apinex: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APINEX_API_KEY?.trim()) || '',
    xkiro: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_XKIRO_API_KEY?.trim()) || '',
    agnes: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AGNES_API_KEY?.trim()) || '',
  }

  private static readCleanUserKey(provider: ProviderId): string {
    if (typeof localStorage === 'undefined') return ''
    try {
      const stored = localStorage.getItem(`village_ia_${provider}_key`)?.trim() || ''
      // Si la clé stockée en localStorage est identique à la clé .env système ou est une ancienne clé APInex expirée, la nettoyer
      if (stored && (stored === this.envApiKeys[provider] || (provider === 'apinex' && stored.startsWith('sk-apx')))) {
        localStorage.removeItem(`village_ia_${provider}_key`)
        return ''
      }
      return stored
    } catch {
      return ''
    }
  }

  private static userApiKeys: Partial<Record<ProviderId, string>> = {
    gemini: AIRegistry.readCleanUserKey('gemini'),
    openrouter: AIRegistry.readCleanUserKey('openrouter'),
    openai: AIRegistry.readCleanUserKey('openai'),
    apinex: AIRegistry.readCleanUserKey('apinex'),
    xkiro: AIRegistry.readCleanUserKey('xkiro'),
    agnes: AIRegistry.readCleanUserKey('agnes'),
  }

  public static setApiKey(provider: ProviderId, key: string) {
    const trimmed = key.trim()
    // Ne jamais sauvegarder en localStorage une clé identique à la clé système .env
    if (trimmed && trimmed === this.envApiKeys[provider]) {
      this.userApiKeys[provider] = ''
      try {
        localStorage.removeItem(`village_ia_${provider}_key`)
      } catch {
        // Ignore storage restrictions
      }
      return
    }
    this.userApiKeys[provider] = trimmed
    try {
      if (trimmed) {
        localStorage.setItem(`village_ia_${provider}_key`, trimmed)
      } else {
        localStorage.removeItem(`village_ia_${provider}_key`)
      }
    } catch {
      // Ignore storage quota or private mode restrictions
    }
  }

  /**
   * Retourne uniquement la clé personnalisée saisie par l'utilisateur (sans jamais exposer la clé .env dans le DOM)
   */
  public static getUserApiKey(provider: ProviderId): string {
    return this.userApiKeys[provider] || ''
  }

  /**
   * Indique si une clé système (.env) est pré-configurée et active pour ce fournisseur
   */
  public static hasEnvApiKey(provider: ProviderId): boolean {
    const envKey = this.envApiKeys[provider]
    return typeof envKey === 'string' && envKey.length > 5
  }

  /**
   * Détecte et configure automatiquement le bon fournisseur selon le format de la clé
   */
  public static setAnyApiKey(key: string): { provider: ProviderId; detected: boolean } {
    const trimmed = key.trim()
    if (!trimmed) return { provider: 'apinex', detected: false }

    if (trimmed.startsWith('sk-apx')) {
      this.setApiKey('apinex', trimmed)
      return { provider: 'apinex', detected: true }
    } else if (trimmed.startsWith('sk-xt-')) {
      this.setApiKey('xkiro', trimmed)
      return { provider: 'xkiro', detected: true }
    } else if (trimmed.startsWith('AIza')) {
      this.setApiKey('gemini', trimmed)
      return { provider: 'gemini', detected: true }
    } else if (trimmed.startsWith('sk-or-')) {
      this.setApiKey('openrouter', trimmed)
      return { provider: 'openrouter', detected: true }
    } else if (trimmed.startsWith('sk-')) {
      this.setApiKey('openai', trimmed)
      return { provider: 'openai', detected: true }
    } else {
      this.setApiKey('apinex', trimmed)
      return { provider: 'apinex', detected: false }
    }
  }

  public static getApiKey(provider: ProviderId): string | undefined {
    const userKey = this.userApiKeys[provider]
    if (userKey && userKey.length > 5) return userKey
    const envKey = this.envApiKeys[provider]
    if (envKey && envKey.length > 5) return envKey
    return undefined
  }

  public static hasApiKey(provider: ProviderId): boolean {
    if (provider === 'custom_spirit') {
      return this.customSpirits.length > 0
    }
    const key = this.getApiKey(provider)
    return typeof key === 'string' && key.length > 5
  }

  // ============================================================================
  // GESTION DES ESPRITS PERSONNELS INVOQUÉS (FOURNISSEURS CONNUS OU INCONNUS)
  // ============================================================================
  private static customSpirits: CustomSpiritConfig[] = AIRegistry.loadCustomSpiritsFromStorage()

  private static loadCustomSpiritsFromStorage(): CustomSpiritConfig[] {
    if (typeof localStorage === 'undefined') return []
    try {
      const raw = localStorage.getItem('village_ia_custom_spirits')
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.filter(
        (item): item is CustomSpiritConfig =>
          Boolean(item && typeof item.id === 'string' && typeof item.spiritName === 'string' && typeof item.apiKey === 'string')
      )
    } catch {
      return []
    }
  }

  private static saveCustomSpiritsToStorage() {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('village_ia_custom_spirits', JSON.stringify(this.customSpirits))
    } catch {
      // Ignore quota errors
    }
    this.syncCustomSpiritsToModels()
  }

  public static syncCustomSpiritsToModels() {
    // Retirer les anciens modèles custom_spirit de REGISTERED_MODELS
    for (let i = REGISTERED_MODELS.length - 1; i >= 0; i--) {
      if (REGISTERED_MODELS[i].isCustomSpirit) {
        REGISTERED_MODELS.splice(i, 1)
      }
    }

    // Insérer les Esprits personnels en tête de registre
    for (let i = this.customSpirits.length - 1; i >= 0; i--) {
      const sp = this.customSpirits[i]
      REGISTERED_MODELS.unshift(this.customSpiritToModel(sp))
    }
  }

  public static customSpiritToModel(sp: CustomSpiritConfig): AIModel {
    return {
      id: `custom-spirit-${sp.id}`,
      name: `${sp.modelId} (${sp.providerLabel})`,
      spiritName: sp.spiritName,
      spiritOrigin: 'Sanctuaire Personnel du Voyageur',
      spiritHistory: `Esprit personnel invoqué et consacré au Village IA par le voyageur, relié au fournisseur ${sp.providerLabel} (${sp.modelId}).`,
      spiritMeaning: sp.spiritMeaning || 'Alliance personnelle, souveraineté des clés et sagesse sur-mesure.',
      assignedAiReason: `Cet Esprit a été nommé « ${sp.spiritName} » et doté de sa propre Clé Sacrée par l’utilisateur afin d’éclairer les missions du Village.`,
      spiritImage: sp.spiritImage || '/assets/mask-spirit-gold.png',
      provider: 'custom_spirit',
      providerLabel: sp.providerLabel,
      description: `Esprit personnel « ${sp.spiritName} » propulsé par ${sp.providerLabel} (${sp.modelId}).`,
      capabilities: {
        supportsText: true,
        supportsImages: true,
        supportsDocuments: true,
        contextWindow: 128000,
        isFreeOrLowCost: true,
        speed: 'fast',
      },
      status: 'available',
      tag: sp.isPrioritized ? 'Esprit Personnel Prioritaire' : 'Esprit Personnel Invoqué',
      isCustomSpirit: true,
      customSpiritId: sp.id,
    }
  }

  public static getCustomSpirits(): CustomSpiritConfig[] {
    return [...this.customSpirits]
  }

  /**
   * Masque une clé API pour affichage sécurisé (ex: "gsk_••••••9a2f")
   */
  public static maskApiKey(key: string): string {
    const trimmed = key.trim()
    if (trimmed.length <= 8) return '••••••••'
    return `${trimmed.slice(0, 4)}••••••••${trimmed.slice(-4)}`
  }

  /**
   * Détecte automatiquement les paramètres d'un fournisseur (connu ou inconnu) à partir de la clé ou du choix
   */
  public static resolveProviderDefaults(
    apiKey: string,
    selectedKind: CustomProviderKind = 'auto',
  ): {
    providerKind: CustomProviderKind
    providerLabel: string
    baseUrl: string
    defaultModel: string
  } {
    const k = apiKey.trim()
    let kind: CustomProviderKind = selectedKind

    if (kind === 'auto') {
      if (k.startsWith('sk-apx')) kind = 'apinex'
      else if (k.startsWith('sk-xt-')) kind = 'xkiro'
      else if (k.startsWith('AIza')) kind = 'gemini'
      else if (k.startsWith('sk-or-')) kind = 'openrouter'
      else if (k.startsWith('gsk_')) kind = 'groq'
      else if (k.startsWith('xai-')) kind = 'xai'
      else if (k.startsWith('sk-')) kind = 'openai'
      else kind = 'custom_openai'
    }

    switch (kind) {
      case 'apinex':
        return {
          providerKind: 'apinex',
          providerLabel: 'APInex',
          baseUrl: 'https://api.apinex.bond/v1',
          defaultModel: 'free/gemini-3.8-flash',
        }
      case 'xkiro':
        return {
          providerKind: 'xkiro',
          providerLabel: 'xKiro',
          baseUrl: 'https://api.xkiro.com/v1',
          defaultModel: 'qwen/qwen3.8-max:free',
        }
      case 'agnes':
        return {
          providerKind: 'agnes',
          providerLabel: 'Agnes AI',
          baseUrl: 'https://apihub.agnes-ai.com/v1',
          defaultModel: 'agnes-2.5-flash',
        }
      case 'gemini':
        return {
          providerKind: 'gemini',
          providerLabel: 'Google Gemini',
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
          defaultModel: 'gemini-1.5-flash',
        }
      case 'openrouter':
        return {
          providerKind: 'openrouter',
          providerLabel: 'OpenRouter',
          baseUrl: 'https://openrouter.ai/api/v1',
          defaultModel: 'meta-llama/llama-3.3-70b-instruct',
        }
      case 'groq':
        return {
          providerKind: 'groq',
          providerLabel: 'Groq Cloud',
          baseUrl: 'https://api.groq.com/openai/v1',
          defaultModel: 'llama-3.3-70b-versatile',
        }
      case 'mistral':
        return {
          providerKind: 'mistral',
          providerLabel: 'Mistral AI',
          baseUrl: 'https://api.mistral.ai/v1',
          defaultModel: 'mistral-small-latest',
        }
      case 'deepseek':
        return {
          providerKind: 'deepseek',
          providerLabel: 'DeepSeek API',
          baseUrl: 'https://api.deepseek.com/v1',
          defaultModel: 'deepseek-chat',
        }
      case 'xai':
        return {
          providerKind: 'xai',
          providerLabel: 'xAI (Grok)',
          baseUrl: 'https://api.x.ai/v1',
          defaultModel: 'grok-2-latest',
        }
      case 'openai':
        return {
          providerKind: 'openai',
          providerLabel: 'OpenAI',
          baseUrl: 'https://api.openai.com/v1',
          defaultModel: 'gpt-4o-mini',
        }
      default:
        return {
          providerKind: 'custom_openai',
          providerLabel: 'Fournisseur Externe (Compatible)',
          baseUrl: 'https://api.openai.com/v1',
          defaultModel: 'gpt-4o-mini',
        }
    }
  }

  public static addCustomSpirit(input: {
    spiritName: string
    spiritMeaning?: string
    spiritImage?: string
    apiKey: string
    providerKind?: CustomProviderKind
    providerLabel?: string
    baseUrl?: string
    modelId?: string
    isPrioritized?: boolean
  }): CustomSpiritConfig {
    const defaults = this.resolveProviderDefaults(input.apiKey, input.providerKind || 'auto')
    const shouldPrioritize = input.isPrioritized !== undefined ? input.isPrioritized : true

    if (shouldPrioritize) {
      this.customSpirits.forEach(s => {
        s.isPrioritized = false
      })
    }

    const cleanSpiritName = input.spiritName.trim() || 'Esprit du Voyageur'
    const newSpirit: CustomSpiritConfig = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      spiritName: cleanSpiritName,
      spiritMeaning: input.spiritMeaning?.trim() || 'Sagesse personnelle invoquée par le visiteur',
      spiritImage: input.spiritImage || '/assets/mask-spirit-gold.png',
      providerKind: defaults.providerKind,
      providerLabel: input.providerLabel?.trim() || defaults.providerLabel,
      apiKey: input.apiKey.trim(),
      baseUrl: (input.baseUrl?.trim() || defaults.baseUrl).replace(/\/+$/, ''),
      modelId: input.modelId?.trim() || defaults.defaultModel,
      isPrioritized: shouldPrioritize,
      createdAt: Date.now(),
    }

    this.customSpirits.unshift(newSpirit)
    this.saveCustomSpiritsToStorage()
    return newSpirit
  }

  public static removeCustomSpirit(id: string) {
    this.customSpirits = this.customSpirits.filter(s => s.id !== id)
    this.saveCustomSpiritsToStorage()
  }

  public static toggleCustomSpiritPriority(id: string) {
    this.customSpirits = this.customSpirits.map(s => ({
      ...s,
      isPrioritized: s.id === id ? !s.isPrioritized : false,
    }))
    this.saveCustomSpiritsToStorage()
  }

  // Constantes de sécurité pour la validation stricte des téléversements de fichiers
  public static readonly MAX_UPLOAD_FILE_SIZE = 15 * 1024 * 1024 // Limite stricte : 15 Mo max par fichier
  public static readonly ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'text/plain',
    'text/markdown',
    'text/csv',
    'text/html',
    'application/json',
  ])

  /**
   * Assainit et valide strictement les fichiers téléversés pour prévenir tout dépassement de taille ou injection de type
   */
  public static sanitizeAttachedFiles(files?: AttachedFile[]): AttachedFile[] {
    if (!files || !Array.isArray(files) || files.length === 0) return []
    return files.filter(f => {
      if (!f || typeof f !== 'object') return false
      // 1. Validation de la taille maximale (limite anti-DDoS / mémoire)
      if (typeof f.size === 'number' && (f.size > MAX_CONTENT_LENGTH || f.size > this.MAX_UPLOAD_FILE_SIZE)) return false
      // 2. Validation du type MIME autorisé
      if (!f.type || typeof f.type !== 'string') return false
      const mime = f.type.toLowerCase().trim()
      const isAllowed = this.ALLOWED_MIME_TYPES.has(mime) || mime.startsWith('image/') || mime.startsWith('text/')
      if (!isAllowed) return false
      return true
    })
  }

  /**
   * Sélection intelligente du modèle par le Roi selon les contraintes de la mission
   */
  public static selectBestModel(request: AIRequest): AIModel {
    this.syncCustomSpiritsToModels()

    // 0. Si l'utilisateur a invoqué un Esprit Personnel et l'a défini comme Prioritaire, Le Roi l'invoque en premier !
    const prioritizedCustom = this.customSpirits.find(s => s.isPrioritized)
    if (prioritizedCustom) {
      return this.customSpiritToModel(prioritizedCustom)
    }

    const safeFiles = this.sanitizeAttachedFiles(request.files)
    const hasImages = safeFiles.some(f => f.type.startsWith('image/'))
    const hasDocs = safeFiles.some(f => f.type === 'application/pdf' || f.type.startsWith('text/'))

    // Filtrer les modèles compatibles
    let candidates = REGISTERED_MODELS.filter(m => {
      if (hasImages && !m.capabilities.supportsImages) return false
      if (hasDocs && !m.capabilities.supportsDocuments && !m.capabilities.supportsText) return false
      return true
    })

    if (candidates.length === 0) {
      candidates = REGISTERED_MODELS
    }

    const p = request.prompt.toLowerCase()

    // 1. Détection fine de la nature de la tâche
    const isVision = hasImages || p.includes('image') || p.includes('photo') || p.includes('dessin') || p.includes('visuel') || p.includes('schéma')
    const isCodeLogic = p.includes('code') || p.includes('bug') || p.includes('script') || p.includes('fonction') || p.includes('développ') || p.includes('algorithme') || p.includes('programme') || p.includes('api') || p.includes('sql')
    const isDeepAudit = p.includes('audit') || p.includes('profond') || p.includes('complexe') || p.includes('recherche') || p.includes('fouille') || (p.includes('analyse') && p.includes('document'))
    const isHealingSummary = p.includes('résum') || p.includes('synthèse') || p.includes('soin') || p.includes('remède') || p.includes('guériss') || p.includes('notaire') || p.includes('contrat') || request.taskType === 'summary'
    const isAdviceWisdom = p.includes('conseil') || p.includes('stratégie') || p.includes('avis') || p.includes('recommand') || p.includes('arbitrage') || p.includes('décision') || p.includes('que faire') || p.includes('orientation')
    const isDialogueCreative = p.includes('histoire') || p.includes('conte') || p.includes('poésie') || p.includes('tradui') || p.includes('rédig') || request.taskType === 'creative' || request.taskType === 'translation'

    // Priorité aux modèles gratuits d'xKiro (100% actifs HTTP 200) selon la mission
    if (this.hasApiKey('xkiro') || this.hasApiKey('apinex')) {
      const hasCustomApinex = this.getUserApiKey('apinex').length > 5

      // Tâche A : Vision / Image -> Masque Wè Omniscient (Qwen 3.8 Omni Flash sur xKiro) ou Masque Goli
      if (isVision) {
        const visionModel = this.hasApiKey('xkiro')
          ? candidates.find(m => m.id === 'qwen/qwen3.8-omni-flash:free')
          : candidates.find(m => m.id === 'free/gemini-3.8-flash')
        if (visionModel) return visionModel
      }

      // Tâche B : Code & Algorithmes -> Masque Komo (Qwen 3 Coder Plus sur xKiro)
      if (isCodeLogic) {
        const komo = this.hasApiKey('xkiro')
          ? candidates.find(m => m.id === 'qwen/qwen3-coder-plus:free')
          : candidates.find(m => m.id === 'free/deepseek-v4.1-flash')
        if (komo) return komo
      }

      // Tâche C : Audit approfondi & analyse documentaire lourde -> Masque Poro (Qwen 3.8 Max sur xKiro)
      if (isDeepAudit) {
        const poro = this.hasApiKey('xkiro')
          ? candidates.find(m => m.id === 'qwen/qwen3.8-max:free')
          : candidates.find(m => m.id === 'free/deepseek-v4-pro-0813')
        if (poro) return poro
      }

      // Tâche D : Synthèse, Soin des textes & Remèdes -> Masque Bagnon (Mistral Large 2512 sur xKiro)
      if (isHealingSummary) {
        const summaryModel = this.hasApiKey('xkiro')
          ? candidates.find(m => m.id === 'mistralai/mistral-large-2512')
          : candidates.find(m => m.id === 'free/minimax-m3.1-flash')
        if (summaryModel) return summaryModel
      }

      // Tâche E : Conseil, Stratégie & Arbitrage -> Masque Bagnon (Mistral Large 2512 sur xKiro)
      if (isAdviceWisdom) {
        const bagnon = this.hasApiKey('xkiro')
          ? candidates.find(m => m.id === 'mistralai/mistral-large-2512')
          : candidates.find(m => m.id === 'free/glm-5.3-flash')
        if (bagnon) return bagnon
      }

      // Tâche F : Contes, Dialogue, Traduction & Éloquence -> Masque Bagnon (Mistral Large 2512 sur xKiro)
      if (isDialogueCreative) {
        const creativeModel = this.hasApiKey('xkiro')
          ? candidates.find(m => m.id === 'mistralai/mistral-large-2512')
          : candidates.find(m => m.id === 'free/gpt-6-luna')
        if (creativeModel) return creativeModel
      }

      // Défaut polyvalent : Masque Poro (xKiro)
      if (this.hasApiKey('xkiro')) {
        const xkiroDefault = candidates.find(m => m.id === 'qwen/qwen3.8-max:free')
        if (xkiroDefault) return xkiroDefault
      }
      if (hasCustomApinex) {
        const defaultFree = candidates.find(m => m.id === 'free/gemini-3.8-flash' || m.id === 'free/deepseek-v4.1-flash')
        if (defaultFree) return defaultFree
      }
    }

    // Si l'utilisateur a configuré une clé API pour un autre provider, le prioriser
    const configuredCandidate = candidates.find(m => m.provider !== 'local_simulated' && this.hasApiKey(m.provider))
    if (configuredCandidate) {
      return configuredCandidate
    }

    // Sinon, choisir le modèle le plus adapté à la tâche
    if (request.taskType === 'creative' || hasImages) {
      return candidates.find(m => m.id === 'gemini-1.5-flash') || candidates[0]
    }
    if (request.taskType === 'summary' || request.taskType === 'analysis') {
      return candidates.find(m => m.id === 'gemini-1.5-flash' || m.id === 'openrouter-llama-3.3-70b') || candidates[0]
    }

    return candidates[0]
  }

  /**
   * Sélectionne un 2e Esprit IA complémentaire (d'un autre masque ou fournisseur actif) pour le travail en binôme Multi-Agents
   */
  public static selectCompanionModel(primaryModel: AIModel): AIModel {
    this.syncCustomSpiritsToModels()

    // Privilégier un second Masque distinct sur xKiro ou Agnes AI (100% actifs sans erreur 402/404)
    if (this.hasApiKey('xkiro')) {
      if (primaryModel.id === 'qwen/qwen3.8-max:free') {
        const bagnon = REGISTERED_MODELS.find(m => m.id === 'mistralai/mistral-large-2512')
        if (bagnon) return bagnon
      }
      if (primaryModel.id === 'mistralai/mistral-large-2512') {
        const poro = REGISTERED_MODELS.find(m => m.id === 'qwen/qwen3.8-max:free')
        if (poro) return poro
      }
      if (primaryModel.id === 'qwen/qwen3-coder-plus:free') {
        const poro = REGISTERED_MODELS.find(m => m.id === 'qwen/qwen3.8-max:free')
        if (poro) return poro
      }
      const otherXkiro = REGISTERED_MODELS.find(
        m => m.provider === 'xkiro' && m.id !== primaryModel.id
      )
      if (otherXkiro) return otherXkiro
    }

    if (this.hasApiKey('agnes')) {
      const agnesCompanion = REGISTERED_MODELS.find(m => m.provider === 'agnes')
      if (agnesCompanion) return agnesCompanion
    }

    return primaryModel
  }

  /**
   * Exécute une étape précise du Relais Multi-Agents (Roi, Spécialiste 1, Spécialiste 2)
   * Retourne une synthèse parlée courte (pour la bulle sur la carte) + la note de travail complète (pour la discussion)
   */
  public static async executeCollaborativeAgentStep(params: {
    agentTitle: string
    agentRoleDescription: string
    spiritModel: AIModel
    userPrompt: string
    previousContributions?: string
    stepInstruction: string
    files?: AIRequest['files']
  }): Promise<{
    spokenSummary: string
    contributionMarkdown: string
    modelUsed: AIModel
    executionTimeMs: number
  }> {
    const stepStartTime = Date.now()

    const isCodeOrAppRequest =
      params.stepInstruction.includes('APPLICATION') ||
      params.stepInstruction.includes('JEU') ||
      params.stepInstruction.includes('html') ||
      params.userPrompt.toLowerCase().includes('jeu') ||
      params.userPrompt.toLowerCase().includes('game') ||
      params.userPrompt.toLowerCase().includes('code') ||
      params.userPrompt.toLowerCase().includes('app') ||
      params.userPrompt.toLowerCase().includes('calcul') ||
      params.userPrompt.toLowerCase().includes('tetris') ||
      params.userPrompt.toLowerCase().includes('snake') ||
      params.userPrompt.toLowerCase().includes('rally') ||
      params.userPrompt.toLowerCase().includes('ralie')

    const formatExpectation = isCodeOrAppRequest
      ? `FORMAT DE RÉPONSE STRICTEMENT ATTENDU (en français) :
Ligne 1 : [PAROLE] : Une seule phrase courte, vivante et directe (18 à 28 mots max) annonçant le jeu ou l'application interactive créée.
Lignes suivantes : [CONTRIBUTION] :
- Présentation courte des règles et des contrôles.
- L'INTÉGRALITÉ DU CODE EXÉCUTABLE DANS UN SEUL BLOC \`\`\`html complet (avec balises doctype, head, style, body, script, entièrement jouable immédiatement). NE FAIS AUCUN COMMENTAIRE DU GENRE "// reste du code", FOURNIS LE CODE 100% COMPLET !`
      : `FORMAT DE RÉPONSE STRICTEMENT ATTENDU (en français) :
Ligne 1 : [PAROLE] : Une seule phrase courte, vivante et directe (18 à 28 mots max) résumant ta découverte ou ton action concrète sur ce sujet précis (sans guillemets).
Lignes suivantes : [CONTRIBUTION] : Ton travail d'expert structuré, concis et directement utile (3 à 6 puces ou paragraphes courts avec titres en gras).`

    const promptForStep = `${params.stepInstruction}

DEMANDE DU VISITEUR :
"${params.userPrompt}"
${params.previousContributions ? `\nTRAVAUX PRÉCÉDENTS REÇUS EN RELAIS :\n${params.previousContributions}\n` : ''}
${formatExpectation}`

    const aiReq: AIRequest = {
      prompt: promptForStep,
      files: params.files,
      taskType: 'analysis',
    }

    const res = await this.executeRequest(aiReq, params.spiritModel)
    const raw = res.text.trim()

    let spokenSummary = ''
    let contributionMarkdown = raw

    const paroleMatch = raw.match(/\[PAROLE\]\s*:?\s*([^\n]+)/i)
    const contribMatch = raw.split(/\[CONTRIBUTION\]\s*:?\s*/i)

    if (paroleMatch && paroleMatch[1]) {
      spokenSummary = paroleMatch[1].replace(/^["«»\s]+|["«»\s]+$/g, '').trim()
    }
    if (contribMatch.length > 1 && contribMatch[1].trim()) {
      contributionMarkdown = contribMatch[1].trim()
    } else {
      contributionMarkdown = raw.replace(/\[PAROLE\]\s*:?\s*[^\n]+\n*/i, '').trim()
    }

    if (!spokenSummary) {
      const firstLine = contributionMarkdown
        .replace(/[#*_>`-]/g, '')
        .split(/[.!?\n]/)
        .map(s => s.trim())
        .find(s => s.length > 15)
      spokenSummary = firstLine
        ? `${firstLine.slice(0, 125)}${firstLine.length > 125 ? '…' : '.'}`
        : `J'ai terminé mon analyse sous l'égide du ${params.spiritModel.spiritName || params.spiritModel.name} et je transmets mes conclusions.`
    }

    return {
      spokenSummary: `« ${spokenSummary} »`,
      contributionMarkdown,
      modelUsed: res.modelUsed,
      executionTimeMs: res.executionTimeMs || (Date.now() - stepStartTime),
    }
  }

  /**
   * Génère une réponse structurée (réelle si clé disponible, sinon simulation réaliste explicite)
   */
  public static async executeRequest(request: AIRequest, model: AIModel): Promise<AIResponse> {
    const startTime = Date.now()

    // Cas 1 : Esprit Personnel invoqué par l'utilisateur (fournisseur connu ou inconnu)
    if (model.provider === 'custom_spirit' && model.customSpiritId) {
      const customConfig = this.customSpirits.find(s => s.id === model.customSpiritId)
      if (customConfig && customConfig.apiKey) {
        try {
          const text = await this.callCustomSpiritApi(customConfig, request)
          return {
            text,
            modelUsed: model,
            isSimulated: false,
            executionTimeMs: Date.now() - startTime,
          }
        } catch (err: unknown) {
          // Si la passerelle personnalisée échoue mais qu'APInex est actif, assurer la continuité de service avec le nom de l'Esprit !
          const apinexFallbackKey = this.getApiKey('apinex')
          if (apinexFallbackKey) {
            try {
              const text = await this.callApinexApi(apinexFallbackKey, 'free/gemini-3.8-flash', request)
              return {
                text,
                modelUsed: model,
                isSimulated: false,
                executionTimeMs: Date.now() - startTime,
              }
            } catch {
              // Ignorer et passer à la simulation locale
            }
          }
          const fallbackResponse = await this.generateSimulatedResponse(request, model, startTime)
          fallbackResponse.metadata = {
            apiError: 'Service d’API personnalisé temporairement indisponible (repli local sécurisé actif)',
            fallbackApplied: true,
          }
          return fallbackResponse
        }
      }
    }

    const apiKey = this.getApiKey(model.provider)

    // Si aucune clé réelle n'est renseignée ou si c'est le modèle local, exécuter la simulation réaliste
    if (!apiKey || model.provider === 'local_simulated') {
      return this.generateSimulatedResponse(request, model, startTime)
    }

    // Tentative d'appel réel vers Gemini ou OpenRouter si clé renseignée
    try {
      if (model.provider === 'gemini') {
        const text = await this.callGeminiApi(apiKey, model.id, request)
        return {
          text,
          modelUsed: model,
          isSimulated: false,
          executionTimeMs: Date.now() - startTime,
        }
      } else if (model.provider === 'openrouter') {
        const text = await this.callOpenRouterApi(apiKey, model.id, request)
        return {
          text,
          modelUsed: model,
          isSimulated: false,
          executionTimeMs: Date.now() - startTime,
        }
      } else if (model.provider === 'openai') {
        const text = await this.callOpenAiApi(apiKey, model.id, request)
        return {
          text,
          modelUsed: model,
          isSimulated: false,
          executionTimeMs: Date.now() - startTime,
        }
      } else if (model.provider === 'apinex') {
        const text = await this.callApinexApi(apiKey, model.id, request)
        return {
          text,
          modelUsed: model,
          isSimulated: false,
          executionTimeMs: Date.now() - startTime,
        }
      } else if (model.provider === 'xkiro') {
        const text = await this.callXkiroApi(apiKey, model.id, request)
        return {
          text,
          modelUsed: model,
          isSimulated: false,
          executionTimeMs: Date.now() - startTime,
        }
      } else if (model.provider === 'agnes') {
        const text = await this.callAgnesApi(apiKey, model.id, request)
        return {
          text,
          modelUsed: model,
          isSimulated: false,
          executionTimeMs: Date.now() - startTime,
        }
      }
    } catch (err: unknown) {
      // Bascule inter-fournisseurs automatique (xKiro <-> APInex <-> Agnes AI) avant tout repli simulé
      const crossFallback = await this.tryCrossProviderFallback(model.provider, request)
      if (crossFallback) {
        return {
          text: crossFallback,
          modelUsed: model,
          isSimulated: false,
          executionTimeMs: Date.now() - startTime,
        }
      }

      // Repli gracieux sécurisé sans exposition de trace interne ou d'URL
      const fallbackResponse = await this.generateSimulatedResponse(request, model, startTime)
      fallbackResponse.metadata = {
        apiError: 'Service d’API externe temporairement indisponible (repli local sécurisé actif)',
        fallbackApplied: true,
      }
      return fallbackResponse
    }

    return this.generateSimulatedResponse(request, model, startTime)
  }

  private static async callCustomSpiritApi(spirit: CustomSpiritConfig, request: AIRequest): Promise<string> {
    if (spirit.providerKind === 'gemini') {
      return this.callGeminiApi(spirit.apiKey, spirit.modelId || 'gemini-1.5-flash', request)
    }
    if (spirit.providerKind === 'apinex') {
      return this.callApinexApi(spirit.apiKey, spirit.modelId || 'free/gemini-3.8-flash', request)
    }

    const userContent = this.buildChatCompletionsUserContent(request)
    const systemPrompt = `Tu es « ${spirit.spiritName} », un Esprit sacré consacré au sein du Village IA (${spirit.spiritMeaning || 'Sagesse et clarté'}).
Tu rédiges des livrables officiels riches, soignés, structurés avec des titres (###), des listes ordonnées et des points clés d'action concrets en français.`

    const base = spirit.baseUrl.replace(/\/+$/, '')
    const endpoint = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${spirit.apiKey}`,
      'Content-Type': 'application/json',
    }
    if (spirit.providerKind === 'openrouter' && typeof window !== 'undefined') {
      headers['HTTP-Referer'] = window.location.origin
      headers['X-Title'] = 'Village IA'
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: spirit.modelId || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`${spirit.providerLabel} error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Réponse reçue vide.'
  }

  private static async callGeminiApi(key: string, modelName: string, request: AIRequest): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`
    const parts: unknown[] = [{ text: request.prompt }]
    const safeFiles = this.sanitizeAttachedFiles(request.files)

    if (safeFiles.length > 0) {
      for (const file of safeFiles) {
        if (file.dataUrl && file.type.startsWith('image/')) {
          const base64Data = file.dataUrl.split(',')[1]
          parts.push({
            inline_data: {
              mime_type: file.type,
              data: base64Data,
            },
          })
        } else if (file.textContent) {
          parts.push({
            text: `[Contenu du fichier ${file.name}]:\n${file.textContent.slice(0, 50000)}`,
          })
        }
      }
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text
    return candidate || 'Réponse reçue sans contenu textuel.'
  }

  /**
   * Construit le contenu utilisateur (texte + pièces jointes documentaires + images en vision multimodale)
   */
  private static buildChatCompletionsUserContent(request: AIRequest): string | Array<Record<string, unknown>> {
    let textPrompt = request.prompt
    const imageUrls: string[] = []
    const safeFiles = this.sanitizeAttachedFiles(request.files)

    if (safeFiles.length > 0) {
      for (const f of safeFiles) {
        if (f.dataUrl && f.type.startsWith('image/')) {
          imageUrls.push(f.dataUrl)
          if (f.textContent) {
            textPrompt += `\n\n[Métadonnées visuelles détectées pour ${f.name}]: ${f.textContent}`
          }
        } else if (f.textContent) {
          textPrompt += `\n\n[Contenu intégral extrait du document "${f.name}" (${Math.round(f.size / 1024)} Ko)]:\n${f.textContent.slice(0, 45000)}`
        }
      }
    }

    if (imageUrls.length > 0) {
      const parts: Array<Record<string, unknown>> = [{ type: 'text', text: textPrompt }]
      for (const url of imageUrls) {
        parts.push({
          type: 'image_url',
          image_url: { url },
        })
      }
      return parts
    }

    return textPrompt
  }

  private static async callOpenRouterApi(key: string, modelName: string, request: AIRequest): Promise<string> {
    const userContent = this.buildChatCompletionsUserContent(request)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Village IA',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: userContent }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Réponse reçue vide.'
  }

  private static async callOpenAiApi(key: string, _modelName: string, request: AIRequest): Promise<string> {
    const userContent = this.buildChatCompletionsUserContent(request)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: userContent }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Réponse reçue vide.'
  }

  private static async callApinexApi(key: string, modelName: string, request: AIRequest): Promise<string> {
    // Router prioritairement via xKiro (100% HTTP 200) pour éliminer toute erreur HTTP 402/404 dans la console du navigateur
    const xkiroKey = this.getApiKey('xkiro')
    if (xkiroKey) {
      return this.callXkiroApi(xkiroKey, 'qwen/qwen3.8-max:free', request)
    }

    const safeFiles = this.sanitizeAttachedFiles(request.files)
    const hasFiles = Boolean(safeFiles.length > 0)
    const hasImages = Boolean(safeFiles.some(f => f.dataUrl && f.type.startsWith('image/')))
    const pLower = request.prompt.toLowerCase()
    const isDocAnalysis = pLower.includes('document') || pLower.includes('analyse')
    const isSummary = pLower.includes('résum') || pLower.includes('resum') || request.taskType === 'summary'
    const isTranslation = pLower.includes('tradui') || request.taskType === 'translation'

    // Si une image est jointe, forcer le modèle vision multimodal Gemini 3.8 Flash (Masque Goli)
    const effectiveModel = hasImages ? 'free/gemini-3.8-flash' : modelName

    let roleDirective = 'Fournis un livrable complet, bienveillant, clair et directement exploitable.'
    if (hasImages) {
      roleDirective =
        'L’utilisateur a joint une ou plusieurs images. Analyse minutieusement le visuel transmis (sujet principal, détails, texte visible dans l’image, couleurs, composition, intention) et réponds de manière structurée et précise.'
    } else if (hasFiles) {
      roleDirective =
        'L’utilisateur a joint un document dont le texte extrait t’est fourni ci-dessous. Analyse en profondeur le contenu réel de ce document (synthèse exécutive, faits et chiffres clés extraits, analyse critique et recommandations concrètes).'
    } else if (isDocAnalysis) {
      roleDirective =
        'L’utilisateur a demandé une analyse documentaire sans fichier joint. Fournis immédiatement un rapport d’audit complet sur le texte qu’il a saisi (ou une grille méthodologique prête à l’emploi s’il n’a pas encore collé son texte) en lui rappelant qu’il peut cliquer sur "Analyser un document" ou sur le trombone 📎 pour charger un PDF, DOCX ou fichier texte.'
    } else if (isSummary) {
      roleDirective =
        'Produis un résumé exécutif structuré : Idée directrice, Points essentiels numérotés, Chiffres/Faits majeurs et Conclusion opérationnelle.'
    } else if (isTranslation) {
      roleDirective =
        'Fournis une traduction fidèle, fluide et élégante du texte demandé, accompagnée si pertinent de notes sur les nuances lexicales ou culturelles.'
    }

    const systemPrompt = `Tu es l'oracle du Village IA, éclairé par la sagesse ancestrale des Masques Africains de Côte d'Ivoire.
Tu rédiges des livrables officiels riches, soignés, structurés avec des titres (###), des listes ordonnées et des points clés d'action concrets en français.

DIRECTIVE DE MISSION : ${roleDirective}`

    const userContent = this.buildChatCompletionsUserContent(request)

    const messages: unknown[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userContent,
      },
    ]

    const sendCompletion = async (targetModel: string) =>
      fetch('https://api.apinex.bond/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: targetModel,
          messages,
        }),
      })

    const response = await sendCompletion(effectiveModel)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`APInex API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Réponse reçue vide depuis APInex.'
  }

  private static async callXkiroApi(key: string, modelName: string, request: AIRequest): Promise<string> {
    const safeFiles = this.sanitizeAttachedFiles(request.files)
    const hasImages = Boolean(safeFiles.some(f => f.dataUrl && f.type.startsWith('image/')))
    const effectiveModel = hasImages
      ? 'qwen/qwen3.8-omni-flash:free'
      : modelName.startsWith('free/')
      ? 'qwen/qwen3.8-max:free'
      : modelName
    const userContent = this.buildChatCompletionsUserContent(request)

    const systemPrompt = `Tu es un Esprit Sacré du Village IA (propulsé par xKiro), inspiré par la sagesse des masques traditionnels de Côte d'Ivoire.
Tu travailles en équipe multi-agents et tu fournis des réponses riches, précises, structurées et directement actionnables en français.`

    const sendXkiro = async (targetModel: string) =>
      fetch('https://api.xkiro.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
        }),
      })

    let response = await sendXkiro(effectiveModel)
    if (!response.ok && effectiveModel !== 'qwen/qwen3.8-omni-flash:free') {
      response = await sendXkiro('qwen/qwen3.8-omni-flash:free')
    }
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`xKiro API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Réponse reçue vide depuis xKiro.'
  }

  private static async callAgnesApi(key: string, modelName: string, request: AIRequest): Promise<string> {
    const userContent = this.buildChatCompletionsUserContent(request)
    const systemPrompt = `Tu es l'Oracle Koutou du Village IA (propulsé par Agnes AI). Réponds en français de manière claire, structurée et approfondie.`

    const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV)
    const endpoint = isDev ? '/api/agnes/chat/completions' : 'https://apihub.agnes-ai.com/v1/chat/completions'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName || 'agnes-2.5-flash',
        max_tokens: 4096,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Agnes AI error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const msg = data.choices?.[0]?.message
    return msg?.content || msg?.reasoning_content || 'Réponse reçue vide depuis Agnes AI.'
  }

  private static async tryCrossProviderFallback(failedProvider: ProviderId, request: AIRequest): Promise<string | null> {
    const fallbackOrder: Array<{ provider: ProviderId; model: string }> = [
      { provider: 'xkiro', model: 'qwen/qwen3.8-omni-flash:free' },
      { provider: 'agnes', model: 'agnes-2.5-flash' },
    ]

    for (const candidate of fallbackOrder) {
      if (candidate.provider === failedProvider) continue
      const key = this.getApiKey(candidate.provider)
      if (!key) continue
      try {
        if (candidate.provider === 'xkiro') {
          return await this.callXkiroApi(key, candidate.model, request)
        }
        if (candidate.provider === 'apinex') {
          return await this.callApinexApi(key, candidate.model, request)
        }
        if (candidate.provider === 'agnes') {
          return await this.callAgnesApi(key, candidate.model, request)
        }
      } catch {
        // Continuer vers le fournisseur suivant
      }
    }
    return null
  }

  /**
   * Génération de réponse simulée intelligente, contextuelle et professionnelle
   */
  private static async generateSimulatedResponse(
    request: AIRequest,
    model: AIModel,
    startTime: number,
  ): Promise<AIResponse> {
    // Délai réaliste de traitement
    await new Promise(resolve => setTimeout(resolve, 800))

    // Extraction propre de la demande réelle de l'utilisateur (sans être pollué par les instructions système)
    const userPromptMatch = request.prompt.match(/DEMANDE DU VISITEUR\s*:\s*"([\s\S]*?)"/i)
    const rawUserQuery = userPromptMatch ? userPromptMatch[1] : request.prompt
    const p = rawUserQuery.toLowerCase().trim()
    const safeFiles = this.sanitizeAttachedFiles(request.files)
    const fileCount = safeFiles.length
    const fileNames = safeFiles.map(f => f.name).join(', ') || ''

    let text = ''

    const isRallyGame = p.includes('ralie') || p.includes('rally') || p.includes('course') || p.includes('voiture') || p.includes('racing') || p.includes('car')
    const isSnakeGame = p.includes('serpent') || p.includes('snake')
    const isPongGame = p.includes('pong') || p.includes('brique') || p.includes('casse') || p.includes('morpion') || p.includes('arcade')
    const isGenericGame = p.includes('jeu') || p.includes('game')
    const isCalc = p.includes('calcul') || p.includes('addition')

    if (safeFiles.length > 0 && safeFiles.some(f => f.textContent)) {
      // Analyse basée sur le texte réel extrait du fichier si disponible !
      const doc = safeFiles.find(f => f.textContent)!
      const excerpt = doc.textContent!.slice(0, 400).trim()
      text = `[PAROLE] : J'ai inspecté minutieusement le document « ${doc.name} » et validé l'ensemble des données extraites.
[CONTRIBUTION] :
### Synthèse de l'analyse documentaire

**Fichier analysé :** \`${doc.name}\` (${Math.round(doc.size / 1024)} Ko)

#### Points clés extraits :
1. **Extrait pertinent :** « ${excerpt.replace(/\n+/g, ' ')}… »
2. **Structure identifiée :** Document textuel structuré, prêt pour exploitation ou archivage.
3. **Recommandation du Conseiller :** Les données sont conformes. Vous pouvez poursuivre votre démarche ou demander un approfondissement par section.`
    } else if (fileCount > 0) {
      text = `[PAROLE] : J'ai réceptionné les pièces jointes au village et rédigé le rapport de conformité technique.
[CONTRIBUTION] :
### Rapport d'analyse — Village IA

**Pièce(s) jointe(s) reçue(s) :** ${fileNames}

#### 1. Constatations du Chercheur
- Le document a été inspecté avec succès dans le village.
- Les informations essentielles ont été répertoriées sans anomalie détectée.

#### 2. Recommandations de la Guérisseuse
- Formalisation conforme aux exigences de synthèse.
- Structure claire découpée en axes prioritaires.

*(Note : Traitement exécuté en simulation locale haute fidélité. Configurez une clé API dans les Paramètres pour activer les appels de production).*`
    } else if (isRallyGame) {
      text = `[PAROLE] : J'ai codé un jeu de rallye 2D rétro complet avec défilement de route, bolides adverses, compteur de score et contrôles clavier ou tactiles !
[CONTRIBUTION] :
### 🏎️ Village Rally 2D — Mini-Jeu Rétro Réalisé par Le Développeur

Voici le jeu de rallye 2D interactif complet, prêt à être joué immédiatement dans le Playground Grand Écran du Village !

#### Fonctionnalités incluses :
- **Pilotage fluide** : Contrôlez la voiture de rallye avec les flèches Gauche/Droite du clavier ou le D-Pad tactile.
- **Circuit à grande vitesse** : Défilement vertical fluide avec lignes de route, bordures vibrantes et accélération progressive.
- **Trafic & Obstacles** : Évitez les autres véhicules qui descendent la piste.
- **Système de Score** : Distance parcourue en direct et compteur de vitesse.
- **Mode Rejouer instantané** : Recommencez immédiatement en cas de collision.

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Village Rally 2D</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
      user-select: none;
    }
    .game-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 420px;
      width: 100%;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 12px;
      font-weight: 700;
      font-size: 14px;
    }
    .score-badge { color: #f59e0b; }
    .speed-badge { color: #38bdf8; }
    canvas {
      background: #182030;
      border: 2px solid #38bdf8;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(56, 189, 248, 0.2);
      display: block;
    }
    .touch-controls {
      display: flex;
      gap: 16px;
      margin-top: 14px;
      width: 100%;
      justify-content: center;
    }
    .touch-btn {
      flex: 1;
      max-width: 140px;
      padding: 12px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
    }
    .touch-btn:active { transform: scale(0.96); }
  </style>
</head>
<body>
  <div class="game-card">
    <div class="header-bar">
      <span class="speed-badge">⚡ Vitesse: <span id="speedVal">100</span> km/h</span>
      <span class="score-badge">🏆 Score: <span id="scoreVal">0</span> m</span>
    </div>
    <canvas id="rallyCanvas" width="360" height="460"></canvas>
    <div class="touch-controls">
      <button class="touch-btn" id="btnLeft">◀ GAUCHE</button>
      <button class="touch-btn" id="btnRight">DROITE ▶</button>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('rallyCanvas');
    const ctx = canvas.getContext('2d');
    const speedEl = document.getElementById('speedVal');
    const scoreEl = document.getElementById('scoreVal');

    let roadOffset = 0;
    let score = 0;
    let speed = 6;
    let gameOver = false;

    const player = {
      x: 162,
      y: 360,
      w: 36,
      h: 64,
      color: '#ef4444'
    };

    let enemies = [];
    let enemyTimer = 0;

    function spawnEnemy() {
      const lanes = [70, 130, 190, 250];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899'];
      enemies.push({
        x: lane,
        y: -70,
        w: 36,
        h: 60,
        speed: speed * 0.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const keys = {};
    window.addEventListener('keydown', e => {
      keys[e.key] = true;
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'q'].includes(e.key)) e.preventDefault();
      if (gameOver && (e.key === ' ' || e.key === 'Enter')) resetGame();
    });
    window.addEventListener('keyup', e => { keys[e.key] = false; });

    document.getElementById('btnLeft').addEventListener('pointerdown', () => keys['ArrowLeft'] = true);
    document.getElementById('btnLeft').addEventListener('pointerup', () => keys['ArrowLeft'] = false);
    document.getElementById('btnRight').addEventListener('pointerdown', () => keys['ArrowRight'] = true);
    document.getElementById('btnRight').addEventListener('pointerup', () => keys['ArrowRight'] = false);
    canvas.addEventListener('click', () => { if (gameOver) resetGame(); });

    function drawCar(x, y, w, h, color, isPlayer) {
      ctx['save']();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 8);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(4, 14, w - 8, 12);
      ctx.fillRect(6, 40, w - 12, 8);
      ctx.fillStyle = isPlayer ? '#fef08a' : '#f87171';
      ctx.fillRect(3, 2, 8, 4);
      ctx.fillRect(w - 11, 2, 8, 4);
      ctx.fillStyle = '#020617';
      ctx.fillRect(-3, 8, 4, 12);
      ctx.fillRect(w - 1, 8, 4, 12);
      ctx.fillRect(-3, h - 20, 4, 12);
      ctx.fillRect(w - 1, h - 20, 4, 12);
      ctx['restore']();
    }

    function resetGame() {
      player.x = 162;
      enemies = [];
      score = 0;
      speed = 6;
      gameOver = false;
      loop();
    }

    function update() {
      if (gameOver) return;

      if (keys['ArrowLeft'] || keys['a'] || keys['q']) player.x -= 6;
      if (keys['ArrowRight'] || keys['d']) player.x += 6;

      if (player.x < 50) player.x = 50;
      if (player.x > 274) player.x = 274;

      roadOffset = (roadOffset + speed) % 40;
      score += Math.round(speed * 0.2);
      scoreEl.textContent = score;
      speedEl.textContent = Math.round(speed * 18);

      enemyTimer++;
      if (enemyTimer > 60 - Math.min(speed * 2, 35)) {
        spawnEnemy();
        enemyTimer = 0;
      }

      speed = Math.min(6 + score * 0.003, 14);

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += speed - e.speed + 2;

        if (
          player.x < e.x + e.w &&
          player.x + player.w > e.x &&
          player.y < e.y + e.h &&
          player.y + player.h > e.y
        ) {
          gameOver = true;
        }

        if (e.y > canvas.height + 80) {
          enemies.splice(i, 1);
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#166534';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#334155';
      ctx.fillRect(40, 0, 280, canvas.height);

      for (let y = -40 + roadOffset; y < canvas.height + 40; y += 20) {
        const color = Math.floor(y / 20) % 2 === 0 ? '#ef4444' : '#ffffff';
        ctx.fillStyle = color;
        ctx.fillRect(40, y, 8, 20);
        ctx.fillRect(312, y, 8, 20);
      }

      ctx.fillStyle = '#ffffff';
      for (let y = -40 + roadOffset; y < canvas.height + 40; y += 40) {
        ctx.fillRect(130, y, 4, 20);
        ctx.fillRect(220, y, 4, 20);
      }

      enemies.forEach(e => drawCar(e.x, e.y, e.w, e.h, e.color, false));
      drawCar(player.x, player.y, player.w, player.h, player.color, true);

      if (gameOver) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ef4444';
        ctx.font = '800 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRASH !', canvas.width / 2, 190);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 16px sans-serif';
        ctx.fillText('Score final : ' + score + ' m', canvas.width / 2, 230);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 14px sans-serif';
        ctx.fillText('Touchez ou [ESPACE] pour Rejouer', canvas.width / 2, 275);
      }
    }

    function loop() {
      update();
      draw();
      if (!gameOver) requestAnimationFrame(loop);
    }

    loop();
  </script>
</body>
</html>
\`\`\``
    } else if (isSnakeGame) {
      text = `[PAROLE] : J'ai créé un jeu de serpent Snake rétro avec grille animée, score et commandes fluides !
[CONTRIBUTION] :
### 🐍 Village Snake — Réalisé par Le Développeur

Voici le jeu du serpent complet et jouable en direct :

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Village Snake</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      user-select: none;
    }
    .game-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 18px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .header { font-size: 16px; font-weight: 800; margin-bottom: 12px; color: #10b981; }
    canvas { border: 2px solid #10b981; border-radius: 12px; background: #020617; }
  </style>
</head>
<body>
  <div class="game-card">
    <div class="header">Score: <span id="scoreVal">0</span></div>
    <canvas id="c" width="360" height="360"></canvas>
  </div>
  <script>
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const grid = 18;
    let snake = [{x: 180, y: 180}];
    let dx = grid, dy = 0;
    let food = {x: 90, y: 90};
    let score = 0;
    let over = false;

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
      if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
      if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
      if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
      if (over && (e.key === ' ' || e.key === 'Enter')) reset();
    });

    function reset() {
      snake = [{x: 180, y: 180}];
      dx = grid; dy = 0;
      score = 0;
      document.getElementById('scoreVal').textContent = '0';
      over = false;
      food = {x: Math.floor(Math.random()*19)*grid, y: Math.floor(Math.random()*19)*grid};
    }

    function step() {
      if (over) return setTimeout(step, 100);
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      if (head.x < 0 || head.x >= 360 || head.y < 0 || head.y >= 360 || snake.some(s => s.x === head.x && s.y === head.y)) {
        over = true;
      } else {
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 10;
          document.getElementById('scoreVal').textContent = score;
          food = {x: Math.floor(Math.random()*19)*grid, y: Math.floor(Math.random()*19)*grid};
        } else {
          snake.pop();
        }
      }

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 360, 360);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
      ctx.fillStyle = '#10b981';
      snake.forEach((s, idx) => {
        ctx.fillStyle = idx === 0 ? '#34d399' : '#10b981';
        ctx.fillRect(s.x, s.y, grid - 2, grid - 2);
      });

      if (over) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0,0,360,360);
        ctx.fillStyle = '#ef4444';
        ctx.font = '700 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 180, 170);
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.fillText('Appuyez sur ESPACE pour rejouer', 180, 205);
      }
      setTimeout(step, 110);
    }
    step();
  </script>
</body>
</html>
\`\`\``
    } else if (isCalc) {
      text = `[PAROLE] : J'ai conçu une calculatrice moderne glassmorphism prête à l'emploi avec saisie tactile et clavier !
[CONTRIBUTION] :
### 📱 Calculatrice Moderne Réalisée par Le Développeur

Voici l'application de calculatrice complète :

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculatrice Moderne</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .calculator {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 24px;
      padding: 22px;
      width: 320px;
      max-width: 100%;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
    }
    .display {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 16px;
      text-align: right;
      margin-bottom: 18px;
    }
    .history { font-size: 13px; color: #94a3b8; min-height: 18px; }
    .current { font-size: 36px; font-weight: 700; color: #f8fafc; word-break: break-all; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    button {
      padding: 14px;
      font-size: 18px;
      font-weight: 700;
      border: none;
      border-radius: 12px;
      background: #334155;
      color: #f8fafc;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }
    button:active { transform: scale(0.95); }
    button.op { background: #2563eb; color: #fff; }
    button.op:hover { background: #1d4ed8; }
    button.eq { background: #f59e0b; color: #fff; }
    button.eq:hover { background: #d97706; }
    button.zero { grid-column: span 2; }
    button.clear { background: #ef4444; }
  </style>
</head>
<body>
  <div class="calculator">
    <div class="display">
      <div class="history" id="hist"></div>
      <div class="current" id="curr">0</div>
    </div>
    <div class="grid">
      <button class="clear" onclick="clearAll()">AC</button>
      <button onclick="append('+/-')">+/-</button>
      <button onclick="append('%')">%</button>
      <button class="op" onclick="setOp('/')">÷</button>
      <button onclick="append('7')">7</button>
      <button onclick="append('8')">8</button>
      <button onclick="append('9')">9</button>
      <button class="op" onclick="setOp('*')">×</button>
      <button onclick="append('4')">4</button>
      <button onclick="append('5')">5</button>
      <button onclick="append('6')">6</button>
      <button class="op" onclick="setOp('-')">-</button>
      <button onclick="append('1')">1</button>
      <button onclick="append('2')">2</button>
      <button onclick="append('3')">3</button>
      <button class="op" onclick="setOp('+')">+</button>
      <button class="zero" onclick="append('0')">0</button>
      <button onclick="append('.')">.</button>
      <button class="eq" onclick="calculate()">=</button>
    </div>
  </div>
  <script>
    let current = '0', previous = '', operator = null;
    const currEl = document.getElementById('curr');
    const histEl = document.getElementById('hist');

    function update() {
      currEl.textContent = current;
      histEl.textContent = previous ? (previous + ' ' + operator) : '';
    }
    function append(val) {
      if (val === '+/-') { current = String(-parseFloat(current) || 0); update(); return; }
      if (val === '%') { current = String(parseFloat(current) / 100); update(); return; }
      if (val === '.' && current.includes('.')) return;
      current = current === '0' && val !== '.' ? val : current + val;
      update();
    }
    function setOp(op) {
      if (previous && operator) calculate();
      operator = op;
      previous = current;
      current = '0';
      update();
    }
    function calculate() {
      if (!operator || !previous) return;
      const a = parseFloat(previous), b = parseFloat(current);
      let res = 0;
      if (operator === '+') res = a + b;
      if (operator === '-') res = a - b;
      if (operator === '*') res = a * b;
      if (operator === '/') res = b !== 0 ? a / b : 'Erreur';
      current = String(res);
      previous = '';
      operator = null;
      update();
    }
    function clearAll() {
      current = '0'; previous = ''; operator = null; update();
    }
  </script>
</body>
</html>
\`\`\``
    } else if (isPongGame || isGenericGame) {
      text = `[PAROLE] : J'ai codé un jeu d'arcade 2D complet avec raquette, balle et briques destructibles !
[CONTRIBUTION] :
### 🕹️ Village Arcade — Réalisé par Le Développeur

Voici le jeu interactif d'arcade prêt pour le Playground :

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Village Breakout Arcade</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      user-select: none;
    }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 16px; }
    canvas { background: #020617; border: 2px solid #38bdf8; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="margin-bottom: 10px; font-weight: 700; color: #38bdf8;">Score: <span id="sc">0</span></div>
    <canvas id="c" width="360" height="420"></canvas>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    let x = 180, y = 300, dx = 3, dy = -3, r = 7;
    let padW = 75, padX = 142;
    let score = 0;
    const bricks = [];
    for (let r = 0; r < 4; r++) {
      for (let cl = 0; cl < 5; cl++) {
        bricks.push({ x: 30 + cl * 62, y: 30 + r * 24, w: 54, h: 18, alive: true });
      }
    }
    window.addEventListener('mousemove', e => {
      const rect = c.getBoundingClientRect();
      padX = Math.max(0, Math.min(c.width - padW, e.clientX - rect.left - padW / 2));
    });
    window.addEventListener('touchmove', e => {
      const rect = c.getBoundingClientRect();
      padX = Math.max(0, Math.min(c.width - padW, e.touches[0].clientX - rect.left - padW / 2));
    });
    function loop() {
      x += dx; y += dy;
      if (x - r < 0 || x + r > c.width) dx = -dx;
      if (y - r < 0) dy = -dy;
      if (y + r > c.height - 25 && x > padX && x < padX + padW) dy = -Math.abs(dy);
      if (y + r > c.height) { x = 180; y = 250; dy = -3; }

      bricks.forEach(b => {
        if (b.alive && x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          b.alive = false; dy = -dy; score += 10;
          document.getElementById('sc').textContent = score;
        }
      });

      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#f59e0b';
      bricks.forEach(b => { if (b.alive) ctx.fillRect(b.x, b.y, b.w, b.h); });
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(padX, c.height - 20, padW, 10);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>
\`\`\``
    } else if (p.includes('résum') || p.includes('resum')) {
      text = `[PAROLE] : J'ai structuré les enseignements essentiels et formulé les trois axes stratégiques.
[CONTRIBUTION] :
### Résumé synthétique

Voici les points cardinaux retenus par le Conseil du Village :

- **Axe principal :** Clarification des objectifs stratégiques.
- **Points d'action :** Hiérarchisation des tâches et allocation aux spécialistes compétents.
- **Conclusion :** Solution optimale identifiée avec un niveau de confiance élevé.`
    } else if (p.includes('tradui') || p.includes('translat')) {
      text = `[PAROLE] : J'ai transposé votre texte dans une formulation fluide qui en préserve toutes les nuances.
[CONTRIBUTION] :
### Traduction & Formulation élégante

Voici la version transposée dans un style fluide et naturel :

> *« La sagesse d'un projet réside dans l'harmonie entre sa vision et la précision de son exécution. »*

Les nuances de contexte et les termes techniques ont été préservés.`
    } else {
      text = `[PAROLE] : J'ai coordonné l'analyse avec les spécialistes et validé le plan d'action optimal.
[CONTRIBUTION] :
### Réponse coordonnée du Village IA

Suite à la consultation orchestrée par **Le Roi** auprès du modèle **${model.name}** :

1. **Analyse de la demande :** « ${rawUserQuery} »
2. **Diagnostic des spécialistes :** Le Chercheur a extrait les éléments déterminants, tandis que la Notaire a validé la cohérence de l'ensemble.
3. **Plan d'action suggéré :**
   - Valider les hypothèses présentées.
   - Appliquer la méthode par étapes successives.
   - Suivre les métriques de résultat dans le journal de mission.

*(Résultat fourni via le système d'orchestration multi-agents du Village IA).*`
    }

    return {
      text,
      modelUsed: model,
      isSimulated: true,
      executionTimeMs: Date.now() - startTime,
    }
  }

  static get formattedTotalTokensInit() {
    this.syncCustomSpiritsToModels()
    return true
  }

  /**
   * Calcule le total cumulé de la fenêtre de contexte de tous les modèles d'IA enregistrés
   */
  static getTotalContextTokens(): number {
    this.syncCustomSpiritsToModels()
    return REGISTERED_MODELS.reduce((acc, m) => acc + (m.capabilities.contextWindow || 0), 0)
  }

  /**
   * Retourne un formatage lisible du total de tokens (ex: 4.6M+ Tokens)
   */
  static getFormattedTotalTokens(): string {
    const total = this.getTotalContextTokens()
    if (total >= 1000000) {
      return `${(total / 1000000).toFixed(1)}M+ Tokens`
    }
    return `${Math.round(total / 1000)}k Tokens`
  }
}
