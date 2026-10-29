import { useEffect, useMemo, useState, type SyntheticEvent } from 'react'
import { Globe2, Volume2, VolumeX, Music } from 'lucide-react'
import type { AgentKind } from '../../types/agent'
import type { Mission } from '../../types/mission'
import { SpiritOrbit } from './SpiritOrbit'
import { VillageLandscape } from './VillageLandscape'
import { CharacterArt } from './CharacterArt'
import { VillageLivingEcosystem } from './VillageLivingEcosystem'
import { villageVoice } from '../../utils/speechSynthesis'
import { villageSoundscape } from '../../utils/villageSoundscape'

interface VillageMapProps {
  mission: Mission | null
  activeBubble: { target: AgentKind; text: string } | null
  onAgentClick?: (agentKind: AgentKind) => void
}

interface AgentHotspot {
  kind: AgentKind
  name: string
  title: string
  desc: string
  x: number // percentage
  y: number // percentage
  bubbleX: number
  bubbleY: number
  defaultSpeech: string
  pitch: number
  rate: number
}

const AGENT_HOTSPOTS: Record<AgentKind, AgentHotspot> = {
  king: {
    kind: 'king',
    name: 'Le Roi',
    title: 'Coordonne et décide',
    desc: 'Souverain coordonnateur du village.',
    x: 48,
    y: 28,
    bubbleX: 55,
    bubbleY: 8,
    defaultSpeech: 'Je veille sur la sérénité du village et la sagesse de chaque décision.',
    pitch: 0.9,
    rate: 0.95,
  },
  griot: {
    kind: 'griot',
    name: 'Le Griot',
    title: 'Transmet les messages',
    desc: 'Messager vif et porteur de voix.',
    x: 41.5,
    y: 47,
    bubbleX: 47,
    bubbleY: 42,
    defaultSpeech: 'La parole est un trésor, je cours porter vos messages sans tarder !',
    pitch: 1.15,
    rate: 1.05,
  },
  researcher: {
    kind: 'researcher',
    name: 'Le Chercheur',
    title: 'Analyse et trouve des informations',
    desc: 'Spécialiste de la fouille documentaire.',
    x: 12,
    y: 33,
    bubbleX: 14,
    bubbleY: 17,
    defaultSpeech: 'J’analyse les documents et les données pour en extraire la substantifique moelle.',
    pitch: 1.0,
    rate: 1.0,
  },
  notary: {
    kind: 'notary',
    name: 'La Guérisseuse',
    title: 'Soigne les écrits et prépare les remèdes',
    desc: 'Maîtresse des remèdes de sagesse et des synthèses bienveillantes.',
    x: 83,
    y: 34,
    bubbleX: 77,
    bubbleY: 21,
    defaultSpeech: 'Je soigne chaque mot et chaque idée pour vous délivrer un remède clair et apaisant.',
    pitch: 1.2,
    rate: 0.98,
  },
  developer: {
    kind: 'developer',
    name: 'Le Développeur',
    title: 'Analyse du code et explications',
    desc: 'Architecte des systèmes et des codes.',
    x: 15,
    y: 69,
    bubbleX: 17,
    bubbleY: 60,
    defaultSpeech: 'Chaque ligne de code est une brique solide bâtie pour l’avenir.',
    pitch: 0.95,
    rate: 1.05,
  },
  creative: {
    kind: 'creative',
    name: 'La Créative',
    title: 'Analyse les images et le contenu visuel',
    desc: 'Visionnaire artistique et multimodale.',
    x: 50,
    y: 78,
    bubbleX: 50,
    bubbleY: 65,
    defaultSpeech: 'Les couleurs, les contrastes et les formes insufflent l’âme à vos créations.',
    pitch: 1.25,
    rate: 1.0,
  },
  advisor: {
    kind: 'advisor',
    name: 'Le Conseiller',
    title: 'Synthèse et recommandations',
    desc: 'Sage garant de l’orientation finale.',
    x: 83,
    y: 72,
    bubbleX: 77,
    bubbleY: 59,
    defaultSpeech: 'La mesure, le recul et l’expérience éclairent la meilleure décision.',
    pitch: 0.85,
    rate: 0.92,
  },
  spirits: {
    kind: 'spirits',
    name: 'Les Esprits',
    title: 'Oracles ancestraux',
    desc: 'Masques et esprits sacrés qui guident le trône.',
    x: 48.7,
    y: 12,
    bubbleX: 48.7,
    bubbleY: 2,
    defaultSpeech: 'Nous guidons les décisions du trône et bénissons les œuvres du village.',
    pitch: 1.25,
    rate: 0.92,
  },
}

export function VillageMap({ mission, activeBubble, onAgentClick }: VillageMapProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentKind | null>(null)
  const [displayedText, setDisplayedText] = useState('')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isAmbienceEnabled, setIsAmbienceEnabled] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)
  const [failedSprites, setFailedSprites] = useState<Record<string, boolean>>({})

  const toggleAmbience = () => {
    const nextVal = !isAmbienceEnabled
    setIsAmbienceEnabled(nextVal)
    villageSoundscape.setEnabled(nextVal)
  }

  const stage = mission?.stage || 'idle'
  const isConsulting = stage === 'consulting_spirits'
  const activeSpeaker = activeBubble?.target || selectedAgent
  const primarySpecialist = (mission?.assignedAgents?.[2] || 'researcher') as AgentKind
  const secondarySpecialist = (mission?.assignedAgents?.[3] || 'advisor') as AgentKind
  // Lors du relais collaboratif, le Griot se déplace vers le spécialiste qui prend la parole (ou le 1er par défaut)
  const activeSpecialist = (
    activeBubble?.target &&
    (activeBubble.target === primarySpecialist || activeBubble.target === secondarySpecialist)
      ? activeBubble.target
      : primarySpecialist
  ) as AgentKind

  const isInSpecialistSquad = (kind: AgentKind) =>
    kind === primarySpecialist || kind === secondarySpecialist

  // 1. Position et orientation dynamiques du Griot
  const { griotPosition, griotFacingLeft, isGriotMoving } = useMemo(() => {
    if (stage === 'travel_to_king') {
      // Course vers le Palais Royal du Roi
      return { griotPosition: { x: 45.5, y: 28 }, griotFacingLeft: false, isGriotMoving: true }
    }
    if (stage === 'consulting_spirits') {
      // Devant le trône royal, le Griot s'incline pendant que le Roi consulte les esprits
      return { griotPosition: { x: 43.5, y: 28 }, griotFacingLeft: false, isGriotMoving: false }
    }
    if (stage === 'assigning_specialist' || stage === 'specialist_working') {
      // Déplacement vers la case du spécialiste actif (relais 1/2 puis relais 2/2)
      if (activeSpecialist === 'researcher') return { griotPosition: { x: 28, y: 36 }, griotFacingLeft: true, isGriotMoving: true }
      if (activeSpecialist === 'developer') return { griotPosition: { x: 28, y: 66 }, griotFacingLeft: true, isGriotMoving: true }
      if (activeSpecialist === 'creative') return { griotPosition: { x: 44, y: 69 }, griotFacingLeft: false, isGriotMoving: true }
      if (activeSpecialist === 'notary') return { griotPosition: { x: 67, y: 36 }, griotFacingLeft: false, isGriotMoving: true }
      if (activeSpecialist === 'advisor') return { griotPosition: { x: 67, y: 66 }, griotFacingLeft: false, isGriotMoving: true }
      return { griotPosition: { x: 28, y: 36 }, griotFacingLeft: true, isGriotMoving: true }
    }
    if (stage === 'verification') {
      // Déplacement vers La Guérisseuse pour sceller la synthèse collaborative des deux experts
      return { griotPosition: { x: 67, y: 36 }, griotFacingLeft: false, isGriotMoving: true }
    }
    if (stage === 'completed') {
      // Retour triomphal à la place centrale
      return { griotPosition: { x: 42, y: 47 }, griotFacingLeft: true, isGriotMoving: true }
    }
    // Idle : place centrale
    return { griotPosition: { x: 42, y: 47 }, griotFacingLeft: false, isGriotMoving: false }
  }, [stage, activeSpecialist])

  // 2. Positions dynamiques de chaque personnage (flottement + sortie de case des 2 spécialistes en binôme)
  const agentPositions = useMemo(() => {
    const isSquadActiveStage = stage === 'assigning_specialist' || stage === 'specialist_working'
    const isResearcherActive = isInSpecialistSquad('researcher') && isSquadActiveStage
    const isDeveloperActive = isInSpecialistSquad('developer') && isSquadActiveStage
    const isCreativeActive = isInSpecialistSquad('creative') && isSquadActiveStage
    const isNotaryActive = (isInSpecialistSquad('notary') && isSquadActiveStage) || stage === 'verification'
    const isAdvisorActive = isInSpecialistSquad('advisor') && isSquadActiveStage

    // Positions de base (repos sur leur case vs avancée collaborative lors du relais)
    const positions: Record<Exclude<AgentKind, 'griot' | 'spirits'>, { x: number; y: number; facingLeft: boolean; isMoving: boolean; isWorking: boolean }> = {
      king: {
        x: 48,
        y: isConsulting ? 18 : 25, // Le Roi s'élève et avance vers les Masques Sacrés lors de la consultation
        facingLeft: false,
        isMoving: isConsulting,
        isWorking: isConsulting,
      },
      researcher: {
        x: isResearcherActive ? 22 : 13.5,
        y: isResearcherActive ? 35 : 31,
        facingLeft: false,
        isMoving: isResearcherActive,
        isWorking: isInSpecialistSquad('researcher') && stage === 'specialist_working',
      },
      developer: {
        x: isDeveloperActive ? 22 : 13.5,
        y: isDeveloperActive ? 65 : 71,
        facingLeft: false,
        isMoving: isDeveloperActive,
        isWorking: isInSpecialistSquad('developer') && stage === 'specialist_working',
      },
      creative: {
        x: isCreativeActive ? 49 : 52,
        y: isCreativeActive ? 68 : 78,
        facingLeft: true,
        isMoving: isCreativeActive,
        isWorking: isInSpecialistSquad('creative') && stage === 'specialist_working',
      },
      notary: {
        x: isNotaryActive ? 74 : 82,
        y: isNotaryActive ? 35 : 32,
        facingLeft: true,
        isMoving: isNotaryActive,
        isWorking: (isInSpecialistSquad('notary') && stage === 'specialist_working') || stage === 'verification',
      },
      advisor: {
        x: isAdvisorActive ? 74 : 82,
        y: isAdvisorActive ? 65 : 71,
        facingLeft: true,
        isMoving: isAdvisorActive,
        isWorking: isInSpecialistSquad('advisor') && stage === 'specialist_working',
      },
    }
    return positions
  }, [stage, isConsulting, primarySpecialist, secondarySpecialist])

  // 3. Calcul intelligent de la position et de l'orientation de la bulle pour qu'elle ne soit JAMAIS coupée
  const bubbleCoords = useMemo((): {
    x: number
    y: number
    placement: 'above' | 'below'
    align: 'left' | 'center' | 'right'
  } | null => {
    if (!activeSpeaker) return null

    // Les Esprits (Masques Sacrés en haut) : bulle placée EN DESSOUS du sanctuaire pour être 100% lisible
    if (activeSpeaker === 'spirits') {
      return { x: 49, y: 20, placement: 'below', align: 'center' }
    }

    // Le Roi (au Palais en haut) : bulle placée EN DESSOUS du Roi
    if (activeSpeaker === 'king') {
      const kingY = agentPositions.king.y
      return { x: 49, y: kingY + 10, placement: 'below', align: 'center' }
    }

    // Le Griot (messager mobile)
    if (activeSpeaker === 'griot') {
      const gx = griotPosition.x
      const gy = griotPosition.y
      const align: 'left' | 'center' | 'right' = gx < 34 ? 'left' : gx > 64 ? 'right' : 'center'
      const safeX = align === 'left' ? Math.max(6, gx - 4) : align === 'right' ? Math.min(94, gx + 4) : gx
      if (gy <= 52) {
        return { x: safeX, y: gy + 9, placement: 'below', align }
      }
      return { x: safeX, y: gy - 10, placement: 'above', align }
    }

    // Les 5 Spécialistes
    const pos = agentPositions[activeSpeaker as keyof typeof agentPositions]
    if (pos) {
      const align: 'left' | 'center' | 'right' = pos.x < 34 ? 'left' : pos.x > 64 ? 'right' : 'center'
      const safeX = align === 'left' ? Math.max(6, pos.x - 4) : align === 'right' ? Math.min(94, pos.x + 4) : pos.x
      if (pos.y <= 50) {
        return { x: safeX, y: pos.y + 9, placement: 'below', align }
      }
      return { x: safeX, y: pos.y - 10, placement: 'above', align }
    }

    return {
      x: AGENT_HOTSPOTS[activeSpeaker].bubbleX,
      y: AGENT_HOTSPOTS[activeSpeaker].bubbleY,
      placement: 'below',
      align: 'center',
    }
  }, [activeSpeaker, griotPosition, agentPositions])

  // Effet machine à écrire + synthèse vocale quand une bulle change
  useEffect(() => {
    const textToSpeak = activeBubble?.text || (selectedAgent ? AGENT_HOTSPOTS[selectedAgent].defaultSpeech : null)

    if (!textToSpeak) {
      setDisplayedText('')
      return
    }

    // Déclencher la voix naturelle du personnage si activée
    if (isVoiceEnabled && activeSpeaker) {
      villageVoice.speak(textToSpeak, activeSpeaker)
    }

    // Animation de texte façon machine à écrire fluide
    let currentIdx = 0
    setDisplayedText('')
    const interval = setInterval(() => {
      currentIdx++
      setDisplayedText(textToSpeak.slice(0, currentIdx))
      if (currentIdx >= textToSpeak.length) {
        clearInterval(interval)
      }
    }, 24)

    return () => {
      clearInterval(interval)
    }
  }, [activeBubble?.text, selectedAgent, isVoiceEnabled, activeSpeaker])

  const toggleVoice = () => {
    const nextVal = !isVoiceEnabled
    setIsVoiceEnabled(nextVal)
    villageVoice.setEnabled(nextVal)
  }

  const handleSelect = (kind: AgentKind) => {
    setSelectedAgent(kind)
    onAgentClick?.(kind)
    setTimeout(() => {
      setSelectedAgent(curr => (curr === kind ? null : curr))
    }, 6000)
  }

  const statusLabel = useMemo(() => {
    if (!mission || mission.stage === 'idle') return 'Le Griot attend vos instructions au centre du village…'
    switch (mission.stage) {
      case 'received':
        return 'Mission reçue : Le Griot part transmettre la demande.'
      case 'travel_to_king':
        return 'Le Griot traverse le village vers le Palais Royal…'
      case 'consulting_spirits':
        return 'Le Roi se lève et consulte les Esprits Sacrés…'
      case 'assigning_specialist':
        return 'Le Roi mandate le spécialiste approprié.'
      case 'specialist_working':
        return 'Analyse approfondie en cours par l’agent désigné…'
      case 'verification':
        return activeSpecialist === 'advisor'
          ? 'Le Conseiller formule ses orientations de sagesse.'
          : 'La Guérisseuse prépare et scelle le remède officiel.'
      case 'completed':
        return 'Mission terminée ! Les avatars regagnent leur case.'
      case 'cancelled':
        return 'Mission annulée.'
      default:
        return 'Village actif.'
    }
  }, [mission?.stage, activeSpecialist])

  const charactersList: Array<{
    kind: Exclude<AgentKind, 'griot' | 'spirits'>
    sprite: string
    title: string
    delay: string
    widthPercent: number
  }> = [
    { kind: 'king', sprite: '/assets/char-king-clean.png', title: 'Le Roi', delay: '0s', widthPercent: 6.8 },
    { kind: 'researcher', sprite: '/assets/char-researcher-clean.png', title: 'Le Chercheur', delay: '-0.6s', widthPercent: 6.0 },
    { kind: 'developer', sprite: '/assets/char-developer-clean.png', title: 'Le Développeur', delay: '-1.2s', widthPercent: 5.5 },
    { kind: 'creative', sprite: '/assets/char-creative-clean.png', title: 'La Créative', delay: '-1.8s', widthPercent: 5.5 },
    { kind: 'notary', sprite: '/assets/char-notary-clean.png', title: 'La Guérisseuse', delay: '-0.9s', widthPercent: 5.5 },
    { kind: 'advisor', sprite: '/assets/char-advisor-clean.png', title: 'Le Conseiller', delay: '-1.5s', widthPercent: 5.8 },
  ]

  const isThinkingOrWorking = Boolean(
    mission &&
    mission.stage !== 'idle' &&
    mission.stage !== 'completed' &&
    mission.stage !== 'cancelled'
  )

  return (
    <div className="village-canvas-container" aria-label="Village IA — Le village s'anime">
      {/* 1. Carte Authentique Propre (avec repli vectoriel SVG automatique si le serveur a été coupé) */}
      {!mapFailed ? (
        <img
          src="/assets/village-map-clean.png"
          alt="Village IA — Carte interactive sans personnages incrustés"
          className="village-base-artwork"
          onError={() => setMapFailed(true)}
        />
      ) : (
        <VillageLandscape />
      )}

      {/* 2. Écosystème Vivant : Habitants, animaux, rivière, poissons et nature animée */}
      <VillageLivingEcosystem isThinkingOrWorking={isThinkingOrWorking} />

      {/* 3. Sanctuaire des Masques Africains Sacrés (Les Esprits) au-dessus du trône */}
      <SpiritOrbit
        visible={true}
        showBadge={isConsulting || stage === 'assigning_specialist'}
        label={
          mission?.selectedModel?.spiritName
            ? `Sagesse : ${mission.selectedModel.spiritName}`
            : 'Les Masques Sacrés'
        }
      />

      {/* 3. Les 6 Personnages Flottants Indépendants (Le Roi & les 5 spécialistes) */}
      {charactersList.map(char => {
        const pos = agentPositions[char.kind]
        const isSpeaking = activeSpeaker === char.kind
        const spriteFailed = Boolean(failedSprites[char.kind])
        return (
          <div
            key={char.kind}
            className={`village-avatar-floating-layer ${pos.isMoving ? 'is-moving' : 'is-floating'} ${isSpeaking ? 'is-speaking' : ''} ${pos.isWorking ? 'is-working' : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${char.widthPercent}%`,
            }}
            title={`${char.title} (Cliquez pour dialoguer)`}
            onClick={() => handleSelect(char.kind)}
            role="button"
            tabIndex={0}
            aria-label={`${char.title} : ${AGENT_HOTSPOTS[char.kind].title}`}
          >
            {/* Ombre portée au sol qui pulse avec le flottement */}
            <span className="avatar-ground-shadow" />

            {/* Corps du personnage avec animation douce de flottement et retournement directionnel */}
            <div
              className="avatar-floating-body"
              style={{
                animationDelay: char.delay,
                transform: `scaleX(${pos.facingLeft ? -1 : 1})`,
              }}
            >
              {!spriteFailed ? (
                <img
                  src={char.sprite}
                  alt={char.title}
                  className="village-avatar-sprite"
                  onError={() => setFailedSprites(prev => ({ ...prev, [char.kind]: true }))}
                />
              ) : (
                <CharacterArt kind={char.kind} active={isSpeaking} />
              )}
            </div>

            {/* Aura dorée lorsqu'il parle ou travaille */}
            {isSpeaking && <span className="avatar-speaking-halo" />}

            {/* Flamme royale spécifique au Roi lorsqu'il consulte les esprits */}
            {char.kind === 'king' && isConsulting && (
              <div className="royal-spiritual-mandorla-float">
                <span className="royal-flame-orb">✨</span>
              </div>
            )}

            {/* Badge de tâche active au-dessus de la tête du spécialiste */}
            {pos.isWorking && char.kind !== 'king' && (
              <div className="specialist-working-mini-badge">
                <span className="working-pulse-dot" />
                <span className="working-label-text">Actif</span>
              </div>
            )}
          </div>
        )
      })}

      {/* 4. Le Griot Flottant & Animé (Messager du Village) */}
      <div
        className={`village-avatar-floating-layer griot-layer ${isGriotMoving ? 'is-moving is-running' : 'is-floating'} ${activeSpeaker === 'griot' ? 'is-speaking' : ''}`}
        style={{
          left: `${griotPosition.x}%`,
          top: `${griotPosition.y}%`,
          width: '5.8%',
        }}
        title="Le Griot (Cliquez pour dialoguer)"
        onClick={() => handleSelect('griot')}
        role="button"
        tabIndex={0}
        aria-label="Le Griot : Transmet les messages"
      >
        <span className="avatar-ground-shadow" />
        <div
          className="avatar-floating-body"
          style={{
            transform: `scaleX(${griotFacingLeft ? -1 : 1})`,
          }}
        >
          {!failedSprites.griot ? (
            <img
              src="/assets/griot-runner-clean.png"
              alt="Le Griot"
              className="village-avatar-sprite griot-sprite"
              onError={() => setFailedSprites(prev => ({ ...prev, griot: true }))}
            />
          ) : (
            <CharacterArt kind="griot" active={activeSpeaker === 'griot'} />
          )}
        </div>
        {activeSpeaker === 'griot' && <span className="avatar-speaking-halo" />}
      </div>

      {/* 5. Bulle de dialogue interactive dynamique positionnée sur l'agent actif */}
      {activeSpeaker && displayedText && bubbleCoords && (
        <div
          className={`active-comic-bubble-wrapper bubble-${bubbleCoords.placement} align-${bubbleCoords.align}`}
          style={{
            left: `${bubbleCoords.x}%`,
            top: `${bubbleCoords.y}%`,
          }}
          role="status"
          aria-live="polite"
        >
          <div className="active-comic-bubble">
            <div className="bubble-speaker-header">
              <div className="bubble-speaker-identity">
                <img
                  src={activeSpeaker === 'spirits' ? '/assets/mask-spirit-gold.png' : `/assets/avatar-${activeSpeaker}.png`}
                  alt={AGENT_HOTSPOTS[activeSpeaker].name}
                  className="bubble-speaker-avatar"
                  onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="speaker-name">{AGENT_HOTSPOTS[activeSpeaker].name}</span>
              </div>
              <span className="sound-wave-bars" title="Agent en train de parler">
                <i /><i /><i /><i />
              </span>
            </div>
            <p className="bubble-speech-text">{displayedText}</p>
          </div>
        </div>
      )}

      {/* 6. Contrôles Audio : Ambiance Vivante du Village & Voix des Agents */}
      <div className="village-audio-controls-group">
        <button
          onClick={toggleAmbience}
          className={`village-audio-btn ${isAmbienceEnabled ? 'is-active' : ''}`}
          title={isAmbienceEnabled ? 'Ambiance du village activée (cliquez pour couper)' : 'Écouter l’ambiance du village (oiseaux, rivière, pilon, tam-tam)'}
          aria-label="Ambiance sonore du village"
        >
          <Music size={14} />
          <span>{isAmbienceEnabled ? 'Ambiance ON' : 'Ambiance'}</span>
        </button>

        <button
          onClick={toggleVoice}
          className={`village-audio-btn ${isVoiceEnabled ? 'is-active' : ''}`}
          title={isVoiceEnabled ? 'Voix des agents activée (cliquez pour couper)' : 'Voix des agents coupée (cliquez pour activer)'}
          aria-label="Contrôle de la voix des agents"
        >
          {isVoiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{isVoiceEnabled ? 'Voix ON' : 'Muet'}</span>
        </button>
      </div>

      {/* 7. Barre d'état de la mission en bas à gauche */}
      <div className="map-live-status-pill" role="status">
        <span className="status-live-dot" />
        <span className="status-live-text">{statusLabel}</span>
        <span className="status-divider-bar" />
        <strong className="status-progress-bold">{mission ? `${mission.progress}%` : 'Prêt'}</strong>
      </div>

      {/* 8. Badge de perspective en bas à droite */}
      <div className="map-compass-badge" title="Village IA 2D">
        <Globe2 size={13} />
        <span>Vue du village</span>
      </div>
    </div>
  )
}
