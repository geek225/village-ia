import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface SpiritOrbitProps {
  visible?: boolean
  label?: string
  showBadge?: boolean
}

export function SpiritOrbit({ visible = false, label = 'Les Esprits de Sagesse', showBadge = true }: SpiritOrbitProps) {
  const [failedMasks, setFailedMasks] = useState<Record<string, boolean>>({})

  if (!visible) return null

  return (
    <div className="sacred-spirits-sanctuary" aria-label="Les Esprits Ancestraux du Village">
      {/* 1. Écusson du Sanctuaire placé TOUT EN HAUT dans le ciel (au-dessus des masques, jamais sur le Roi !) */}
      {showBadge && (
        <div className="sacred-spirits-label-badge">
          <Sparkles size={12} className="sparkle-spin-icon" />
          <span>{label}</span>
        </div>
      )}

      {/* 2. Lueur d'énergie sacrée d'arrière-plan */}
      <div className="spirits-ethereal-glow" />

      {/* 3. Le Trio de Masques Africains Sacrés Flottants */}
      <div className="sacred-masks-row">
        {/* Masque Violet : Esprit de la Créativité & des Arts */}
        <div className="sacred-mask-wrapper mask-purple" title="Esprit de l'Inspiration & des Arts">
          {!failedMasks.purple ? (
            <img
              src="/assets/mask-spirit-purple.png"
              alt="Masque Africain Sacré — Esprit Créatif"
              className="sacred-mask-sprite"
              onError={() => setFailedMasks(prev => ({ ...prev, purple: true }))}
            />
          ) : (
            <span className="sacred-mask-fallback" aria-hidden="true">🎭</span>
          )}
          <span className="mask-aura-halo purple-halo" />
        </div>

        {/* Masque Doré Central : Le Grand Esprit Ancestral Royal */}
        <div className="sacred-mask-wrapper mask-gold" title="Le Grand Esprit de Décision Ancestrale">
          {!failedMasks.gold ? (
            <img
              src="/assets/mask-spirit-gold.png"
              alt="Masque Africain Sacré — Grand Esprit"
              className="sacred-mask-sprite center-tall"
              onError={() => setFailedMasks(prev => ({ ...prev, gold: true }))}
            />
          ) : (
            <span className="sacred-mask-fallback center-tall" aria-hidden="true">👑</span>
          )}
          <span className="mask-aura-halo gold-halo" />
        </div>

        {/* Masque Vert : Esprit de la Connaissance & de la Logique */}
        <div className="sacred-mask-wrapper mask-green" title="Esprit du Savoir & de la Logique">
          {!failedMasks.green ? (
            <img
              src="/assets/mask-spirit-green.png"
              alt="Masque Africain Sacré — Esprit du Savoir"
              className="sacred-mask-sprite"
              onError={() => setFailedMasks(prev => ({ ...prev, green: true }))}
            />
          ) : (
            <span className="sacred-mask-fallback" aria-hidden="true">🌿</span>
          )}
          <span className="mask-aura-halo green-halo" />
        </div>
      </div>

      {/* 4. Particules d'énergie flottantes */}
      <div className="spirit-energy-particles">
        <span className="particle p1">✧</span>
        <span className="particle p2">✦</span>
        <span className="particle p3">✧</span>
        <span className="particle p4">✦</span>
      </div>
    </div>
  )
}
