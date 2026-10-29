import { useState, useEffect } from 'react'
import { villageSoundscape } from '../../utils/villageSoundscape'

interface VillageLivingEcosystemProps {
  isThinkingOrWorking?: boolean
}

export function VillageLivingEcosystem({ isThinkingOrWorking = false }: VillageLivingEcosystemProps) {
  // Déclencheur régulier pour faire bondir un poisson hors de l'eau
  const [fishJumping, setFishJumping] = useState(false)
  const [chickenActive, setChickenActive] = useState(false)
  const [goatActive, setGoatActive] = useState(false)
  const [wellActive, setWellActive] = useState(false)
  const [dogActive, setDogActive] = useState(false)

  // Boucle de saut de poisson périodique dans la rivière (toutes les 8-12 secondes)
  useEffect(() => {
    const triggerFish = () => {
      setFishJumping(true)
      villageSoundscape.playWaterSplash()
      setTimeout(() => setFishJumping(false), 1400)
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerFish()
      }
    }, 9500)

    return () => clearInterval(interval)
  }, [])

  // Informer le soundscape du rythme des tam-tams lorsque l'IA réfléchit
  useEffect(() => {
    villageSoundscape.setDrummingState(isThinkingOrWorking)
  }, [isThinkingOrWorking])

  // Clic sur la poule
  const handleChickenClick = () => {
    setChickenActive(true)
    villageSoundscape.playChickenCluck()
    setTimeout(() => setChickenActive(false), 2000)
  }

  // Clic sur la chèvre
  const handleGoatClick = () => {
    setGoatActive(true)
    villageSoundscape.playGoatBleat()
    setTimeout(() => setGoatActive(false), 1800)
  }

  // Clic sur le puits
  const handleWellClick = () => {
    setWellActive(true)
    villageSoundscape.playWellSplash()
    setTimeout(() => setWellActive(false), 1600)
  }

  // Clic sur le chien
  const handleDogClick = () => {
    setDogActive(true)
    villageSoundscape.playGoatBleat()
    setTimeout(() => setDogActive(false), 1500)
  }

  return (
    <div className="village-living-ecosystem" aria-hidden="false">
      {/* 1. Nuages en dérive douce dans le ciel */}
      <div className="living-cloud cloud-1" aria-hidden="true">
        <svg viewBox="0 0 100 40" width="110" height="44">
          <path
            d="M20 30 Q10 30 10 22 Q10 14 20 14 Q24 6 36 6 Q48 6 52 14 Q62 12 70 18 Q80 18 80 26 Q80 30 70 30 Z"
            fill="rgba(255, 255, 255, 0.72)"
          />
        </svg>
      </div>
      <div className="living-cloud cloud-2" aria-hidden="true">
        <svg viewBox="0 0 100 40" width="140" height="52">
          <path
            d="M18 28 Q8 28 8 20 Q8 12 18 12 Q22 4 34 4 Q46 4 50 12 Q60 10 68 16 Q78 16 78 24 Q78 28 68 28 Z"
            fill="rgba(255, 255, 255, 0.65)"
          />
        </svg>
      </div>

      {/* 2. Poussières de soleil et particules dorées */}
      <div className="sun-motes-container" aria-hidden="true">
        <span className="sun-mote mote-1" />
        <span className="sun-mote mote-2" />
        <span className="sun-mote mote-3" />
        <span className="sun-mote mote-4" />
        <span className="sun-mote mote-5" />
      </div>

      {/* 3. Poisson sautant hors de l'eau (Rivière en haut à droite) */}
      <div
        className={`river-jumping-fish ${fishJumping ? 'is-jumping' : ''}`}
        style={{ left: '88%', top: '16%' }}
        onClick={() => {
          setFishJumping(true)
          villageSoundscape.playWaterSplash()
          setTimeout(() => setFishJumping(false), 1400)
        }}
        title="Poisson de la rivière (Cliquez pour faire sauter !)"
      >
        <span className="water-splash-ring" />
        <span className="water-splash-droplets" />
        <svg className="fish-sprite" viewBox="0 0 32 32" width="26" height="26">
          <path
            d="M4 16 C10 10, 22 10, 28 16 C22 22, 10 22, 4 16 Z M26 16 L31 11 L31 21 Z"
            fill="#38bdf8"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="14" r="1.5" fill="#ffffff" />
          <circle cx="9.5" cy="14" r="0.8" fill="#0f172a" />
        </svg>
      </div>

      {/* 4. Le Pêcheur sur la berge de la rivière (Haut Droite) */}
      <div
        className="village-fisherman"
        style={{ left: '76.5%', top: '14%' }}
        title="Le Pêcheur au bord de la rivière"
      >
        <svg viewBox="0 0 40 48" width="34" height="40">
          {/* Ombre */}
          <ellipse cx="20" cy="44" rx="14" ry="4" fill="rgba(15, 23, 42, 0.3)" />
          {/* Corps assis */}
          <circle cx="20" cy="16" r="6" fill="#78350f" />
          {/* Chapeau de paille */}
          <ellipse cx="20" cy="13" rx="11" ry="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          {/* Tunique */}
          <path d="M14 22 L26 22 L24 38 L16 38 Z" fill="#0284c7" />
          {/* Canne à pêche en bambou */}
          <line x1="24" y1="26" x2="42" y2="12" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          {/* Fil de pêche qui oscille */}
          <path
            className="fishing-line-anim"
            d="M42 12 Q45 28 44 42"
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 5. Femme qui pile le manioc (Près de la case de droite) */}
      <div
        className="manioc-pounding-woman"
        style={{ left: '75%', top: '38%' }}
        title="Femme du village pilant le manioc au mortier"
      >
        <svg viewBox="0 0 46 64" width="40" height="56">
          {/* Ombre au sol */}
          <ellipse cx="24" cy="60" rx="16" ry="4" fill="rgba(15, 23, 42, 0.35)" />
          {/* Mortier en bois traditionnel */}
          <path
            d="M26 44 L38 44 L36 58 L28 58 Z"
            fill="#78350f"
            stroke="#451a03"
            strokeWidth="1.5"
          />
          {/* Corps de la femme (tissu pagne traditionnel africain) */}
          <circle cx="16" cy="18" r="6" fill="#854d0e" />
          {/* Foulard de tête noué */}
          <ellipse cx="16" cy="15" rx="7.5" ry="4.5" fill="#ea580c" />
          {/* Robe en pagne coloré */}
          <path d="M11 24 L21 24 L24 54 L9 54 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
          {/* Pilon de bois vertical qui monte et descend (animation CSS) */}
          <g className="pilon-pestle-group">
            <rect x="30" y="8" width="4" height="42" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
            {/* Bras qui tiennent le pilon */}
            <line x1="18" y1="27" x2="31" y2="24" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* 6. Les Enfants qui jouent à courir (Autour du puits) */}
      <div className="village-playing-children" style={{ left: '38%', top: '56%' }}>
        {/* Enfant 1 en tunique jaune */}
        <div className="running-child child-1" title="Enfant qui court en s'amusant">
          <svg viewBox="0 0 28 36" width="22" height="28">
            <ellipse cx="14" cy="34" rx="8" ry="2.5" fill="rgba(15, 23, 42, 0.3)" />
            <circle cx="14" cy="10" r="5" fill="#78350f" />
            <path d="M10 15 L18 15 L16 30 L11 30 Z" fill="#eab308" />
            {/* Bras levés joyeux */}
            <line x1="10" y1="18" x2="4" y2="12" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="18" x2="23" y2="13" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Enfant 2 en tunique verte qui le poursuit */}
        <div className="running-child child-2" title="Enfant qui joue à la course">
          <svg viewBox="0 0 28 36" width="20" height="26">
            <ellipse cx="14" cy="34" rx="7" ry="2" fill="rgba(15, 23, 42, 0.3)" />
            <circle cx="14" cy="10" r="4.5" fill="#854d0e" />
            <path d="M10 14 L18 14 L16 28 L11 28 Z" fill="#10b981" />
            <line x1="10" y1="17" x2="5" y2="14" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="17" x2="24" y2="12" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 7. La Famille Poule, Coq et Poussins (Près des barrières en bas) */}
      <div
        className={`chicken-family-group ${chickenActive ? 'is-startled' : ''}`}
        style={{ left: '26%', top: '74%' }}
        onClick={handleChickenClick}
        title="La Poule et ses poussins (Cliquez pour faire caqueter !)"
        role="button"
        tabIndex={0}
      >
        {/* Poule adulte */}
        <div className="chicken-mother">
          <svg viewBox="0 0 32 28" width="26" height="22">
            <ellipse cx="16" cy="26" rx="9" ry="2.5" fill="rgba(15, 23, 42, 0.3)" />
            {/* Corps de poule marron/blanc */}
            <ellipse cx="14" cy="16" rx="9" ry="7" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            {/* Aile */}
            <path d="M11 15 Q15 13 18 18 Q14 20 11 15 Z" fill="#cbd5e1" />
            {/* Tête */}
            <circle cx="22" cy="11" r="4.5" fill="#ffffff" />
            <path d="M25 11 L29 12 L25 14 Z" fill="#f59e0b" />
            {/* Crête rouge */}
            <path d="M20 7 Q22 4 24 7" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Yeux */}
            <circle cx="23" cy="10" r="1" fill="#0f172a" />
          </svg>
        </div>

        {/* 3 petits poussins jaunes qui trottinent */}
        <div className="chick chick-1">
          <svg viewBox="0 0 16 16" width="13" height="13">
            <circle cx="8" cy="9" r="4.5" fill="#fde047" stroke="#eab308" strokeWidth="0.8" />
            <circle cx="11" cy="7" r="3" fill="#fde047" />
            <path d="M13 7 L15 8 L13 9 Z" fill="#ea580c" />
            <circle cx="12" cy="6.5" r="0.7" fill="#0f172a" />
          </svg>
        </div>
        <div className="chick chick-2">
          <svg viewBox="0 0 16 16" width="12" height="12">
            <circle cx="8" cy="9" r="4.5" fill="#fde047" stroke="#eab308" strokeWidth="0.8" />
            <circle cx="11" cy="7" r="3" fill="#fde047" />
            <path d="M13 7 L15 8 L13 9 Z" fill="#ea580c" />
            <circle cx="12" cy="6.5" r="0.7" fill="#0f172a" />
          </svg>
        </div>
        <div className="chick chick-3">
          <svg viewBox="0 0 16 16" width="11" height="11">
            <circle cx="8" cy="9" r="4" fill="#fde047" stroke="#eab308" strokeWidth="0.8" />
            <circle cx="11" cy="7" r="2.8" fill="#fde047" />
            <path d="M13 7 L15 8 L13 9 Z" fill="#ea580c" />
            <circle cx="12" cy="6.5" r="0.6" fill="#0f172a" />
          </svg>
        </div>
      </div>

      {/* 8. La Chèvre et le Mouton qui broutent (Près de l'enclos) */}
      <div
        className={`goat-animal-group ${goatActive ? 'is-bleating' : ''}`}
        style={{ left: '60%', top: '69%' }}
        onClick={handleGoatClick}
        title="La Chèvre du village (Cliquez pour faire « Bêêê » !)"
        role="button"
        tabIndex={0}
      >
        <svg viewBox="0 0 44 38" width="36" height="30">
          <ellipse cx="22" cy="35" rx="14" ry="3" fill="rgba(15, 23, 42, 0.3)" />
          {/* Corps chèvre blanc/tacheté */}
          <ellipse cx="20" cy="20" rx="12" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <ellipse cx="16" cy="18" rx="4" ry="3" fill="#64748b" />
          {/* 4 Pattes */}
          <line x1="12" y1="26" x2="11" y2="34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="26" x2="16" y2="34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="26" x2="25" y2="34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="26" x2="29" y2="34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tête */}
          <g className="goat-head-anim">
            <ellipse cx="32" cy="14" rx="5.5" ry="4.5" fill="#f8fafc" />
            {/* Cornes recourbées */}
            <path d="M30 10 Q28 4 33 6" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            {/* Barbiche */}
            <path d="M36 17 L37 21" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
            <circle cx="34" cy="13" r="1" fill="#0f172a" />
          </g>
          {/* Queue qui remue */}
          <path className="goat-tail-anim" d="M8 18 Q5 14 6 12" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* 9. Le Chien de garde sous l'auvent (Bas Centre-Droit) */}
      <div
        className={`village-dog ${dogActive ? 'is-wagging' : ''}`}
        style={{ left: '68%', top: '78%' }}
        onClick={handleDogClick}
        title="Le Chien du village qui remue la queue"
      >
        <svg viewBox="0 0 34 26" width="28" height="22">
          <ellipse cx="16" cy="24" rx="10" ry="2.5" fill="rgba(15, 23, 42, 0.28)" />
          {/* Corps couché marron doré */}
          <ellipse cx="16" cy="16" rx="9" ry="6" fill="#b45309" />
          {/* Tête */}
          <circle cx="24" cy="12" r="5" fill="#b45309" />
          <circle cx="26" cy="11" r="1" fill="#0f172a" />
          {/* Museau noir */}
          <circle cx="28" cy="13" r="1.5" fill="#0f172a" />
          {/* Oreilles tombantes */}
          <path d="M21 9 Q19 14 22 15" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Queue qui remue avec animation CSS */}
          <path className="dog-tail-anim" d="M7 16 Q3 11 5 8" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* 10. Le Puits central d'eau pure (Interactif) */}
      <div
        className={`central-well-hotspot ${wellActive ? 'is-splashing' : ''}`}
        style={{ left: '38%', top: '48.5%' }}
        onClick={handleWellClick}
        title="Le Puits d'eau du village (Cliquez pour faire jaillir l'eau !)"
      >
        {wellActive && <span className="well-water-ripple" />}
      </div>

      {/* 11. Volutes de fumée sur les toits de chaume */}
      <div className="smoke-plume smoke-roof-left" style={{ left: '16%', top: '22%' }} />
      <div className="smoke-plume smoke-roof-right" style={{ left: '78%', top: '22%' }} />
      <div className="smoke-plume smoke-royal-fire" style={{ left: '49%', top: '21%' }} />
    </div>
  )
}

