import { BookOpen, Check, FileText, Image as ImageIcon, Sparkles, X, Zap } from 'lucide-react'
import { REGISTERED_MODELS } from '../../services/ai/aiRegistry'

interface ModelsModalProps {
  onClose: () => void
  onSelectModel?: (modelId: string) => void
  currentSelectedId?: string
}

export function ModelsModal({ onClose, onSelectModel, currentSelectedId }: ModelsModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="models-title">
      <div className="modal-card modal-wide spirits-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge gold-badge">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 id="models-title">Les Esprits Sacrés & Leurs Intelligences Artificielles</h3>
              <p>Chaque masque traditionnel de Côte d'Ivoire prête son esprit, son histoire et sa force à un modèle d'IA adapté.</p>
            </div>
          </div>
          <button className="icon-button modal-close" onClick={onClose} aria-label="Fermer la fenêtre">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body spirits-grid">
          {REGISTERED_MODELS.map(model => {
            const isSelected = currentSelectedId === model.id
            const maskImage = model.spiritImage || '/assets/mask-spirit-gold.png'
            return (
              <div
                key={model.id}
                className={`spirit-mask-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectModel?.(model.id)}
              >
                {/* En-tête : Visuel et Origine */}
                <div className="spirit-card-header">
                  <div className="spirit-mask-avatar-wrapper">
                    <img src={maskImage} alt={model.spiritName || model.name} className="spirit-mask-avatar-img" />
                  </div>
                  <div className="spirit-identity-col">
                    <span className="spirit-origin-tag">{model.spiritOrigin || 'Afrique de l’Ouest'}</span>
                    <h4 className="spirit-mask-title">{model.spiritName || model.name}</h4>
                    <span className="spirit-incarnation-badge">
                      {model.spiritMeaning ? `✨ ${model.spiritMeaning}` : 'Esprit de sagesse'}
                    </span>
                  </div>
                  <span className="model-tag-badge">{model.tag}</span>
                </div>

                {/* Vraie Histoire Traditionnelle */}
                <div className="spirit-history-block">
                  <div className="spirit-history-header">
                    <BookOpen size={13} className="spirit-history-icon" />
                    <strong>La Vraie Histoire Traditionnelle</strong>
                  </div>
                  <p className="spirit-history-text">
                    {model.spiritHistory || model.description}
                  </p>
                </div>

                {/* IA Attribuée en bas et Pourquoi */}
                <div className="spirit-ai-attribution-box">
                  <div className="ai-assigned-header">
                    <span className="ai-assigned-label">Intelligence Artificielle Attribuée :</span>
                    <strong className="ai-assigned-name">{model.name}</strong>
                  </div>

                  <div className="ai-reason-content">
                    <strong className="ai-reason-title">Pourquoi cette IA lui est attribuée ?</strong>
                    <p className="ai-reason-text">
                      {model.assignedAiReason || `Cette intelligence artificielle a été choisie par Le Roi pour répondre avec précision aux exigences de ${model.spiritName || 'ce masque'}.`}
                    </p>
                  </div>

                  <div className="model-specs-row">
                    <div className="spec-pill">
                      <Zap size={12} />
                      <span>{model.capabilities.speed === 'fast' ? 'Ultra-Rapide' : model.capabilities.speed === 'deep' ? 'Raisonnement Approfondi' : 'Équilibré'}</span>
                    </div>
                    <div className="spec-pill">
                      <FileText size={12} />
                      <span>{(model.capabilities.contextWindow / 1000).toFixed(0)}k tokens</span>
                    </div>
                    {model.capabilities.supportsImages && (
                      <div className="spec-pill">
                        <ImageIcon size={12} />
                        <span>Vision Active</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="model-card-footer">
                  <span className={`status-indicator ${model.status}`}>
                    <i /> {model.status === 'simulated' ? 'Moteur local' : 'Prêt à l’emploi'}
                  </span>
                  {isSelected && (
                    <span className="current-selection-badge">
                      <Check size={14} /> Esprit actif
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-button" onClick={onClose}>
            Fermer le sanctuaire des Esprits
          </button>
        </div>
      </div>
    </div>
  )
}
