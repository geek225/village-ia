import { useState } from 'react'
import { Award, Briefcase, Code, Compass, Flame, Sparkles, Terminal, X } from 'lucide-react'

interface CreatorModalProps {
  onClose: () => void
}

export function CreatorModal({ onClose }: CreatorModalProps) {
  const [photoError, setPhotoError] = useState(false)

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="creator-title">
      <div className="modal-card modal-creator-card" onClick={e => e.stopPropagation()}>
        {/* En-tête décoratif doré */}
        <div className="creator-modal-banner">
          <div className="creator-banner-glow" />
          <div className="creator-banner-pattern" />
          <button className="icon-button modal-close creator-close-btn" onClick={onClose} aria-label="Fermer la fenêtre">
            <X size={16} />
          </button>
        </div>

        <div className="creator-modal-body">
          {/* Avatar Photo & Identité bien dégagée sous la bannière */}
          <div className="creator-identity-header">
            <div className="creator-avatar-large">
              {!photoError ? (
                <img
                  src="/assets/creator-ksa.jpg"
                  alt="Kevin Stéphane Assamoi — Architecte & Vibe Coder"
                  className="creator-avatar-photo"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <span className="creator-avatar-initials">KSA</span>
              )}
              <div className="creator-avatar-badge" title="AI Product Builder Certifié">
                <Sparkles size={14} />
              </div>
            </div>

            <div className="creator-titles">
              <div className="vibe-coder-pill">
                <Code size={12} />
                <span>Architecte & Vibe Coder</span>
              </div>
              <h2 id="creator-title" className="creator-full-name">
                Kevin Stéphane Assamoi
              </h2>
              <h3 className="creator-sub-role">
                Référent Digital & AI Product Builder
              </h3>
            </div>
          </div>

          {/* Vision & Démarche de Vibe Coding */}
          <div className="creator-highlight-card">
            <div className="highlight-tag">
              <Flame size={14} />
              <span>La Vision du Village IA</span>
            </div>
            <p className="creator-quote">
              « Concevoir une interface vivante où l’excellence de l’intelligence artificielle moderne (LLM multi-agents, vision multimodale) s’enracine dans la sagesse ancestrale et les masques sacrés de Côte d’Ivoire. »
            </p>
          </div>

          {/* Piliers d'expertise */}
          <div className="creator-skills-grid">
            <div className="creator-skill-box">
              <div className="skill-icon-wrap gold">
                <Terminal size={16} />
              </div>
              <div>
                <strong>Vibe Coding & Prototypage Rapide</strong>
                <p>Développement agentique agile, itérations instantanées et interfaces immersives ultra-réactives.</p>
              </div>
            </div>

            <div className="creator-skill-box">
              <div className="skill-icon-wrap blue">
                <Briefcase size={16} />
              </div>
              <div>
                <strong>AI Product Building</strong>
                <p>Orchestration de modèles LLM de pointe (Gemini, DeepSeek, GPT, GLM, MiniMax), prompts et pipelines multi-agents.</p>
              </div>
            </div>

            <div className="creator-skill-box">
              <div className="skill-icon-wrap purple">
                <Compass size={16} />
              </div>
              <div>
                <strong>Référent Digital & Stratégie</strong>
                <p>Accompagnement de la transformation numérique, valorisation des identités culturelles et design de solutions à fort impact.</p>
              </div>
            </div>

            <div className="creator-skill-box">
              <div className="skill-icon-wrap green">
                <Award size={16} />
              </div>
              <div>
                <strong>Héritage Culturel & Innovation</strong>
                <p>Intégration poétique et rigoureuse des masques Zaouli, Goli, Glaé, Déanglé et Kplé Kplé au cœur des architectures d’IA.</p>
              </div>
            </div>
          </div>

          {/* Note sur l'application */}
          <div className="creator-app-story">
            <strong>À propos de cette œuvre :</strong>
            <p>
              Ce village interactif a été entièrement pensé et sculpté par <strong>Kevin Stéphane Assamoi</strong>. Chaque déplacement d’agent, chaque interaction avec Le Roi ou Le Griot et chaque attribution d’Esprit ancestral illustre la puissance du <em>Vibe Coding</em> au service de la culture et de la productivité.
            </p>
          </div>
        </div>

        <div className="modal-footer creator-footer">
          <div className="creator-contact-hint">
            <span>Disponible pour projets innovants & architectures IA</span>
          </div>
          <button type="button" className="primary-button gold-primary" onClick={onClose}>
            Retourner au Village
          </button>
        </div>
      </div>
    </div>
  )
}
