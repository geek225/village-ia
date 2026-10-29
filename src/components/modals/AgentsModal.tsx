import { X } from 'lucide-react'
import type { AgentKind } from '../../types/agent'
import { CharacterArt } from '../village/CharacterArt'

interface AgentsModalProps {
  onClose: () => void
  activeRole?: AgentKind
}

interface AgentDetail {
  kind: AgentKind
  name: string
  role: string
  description: string
  responsibilities: string[]
}

const AGENT_DETAILS: AgentDetail[] = [
  {
    kind: 'king',
    name: 'Le Roi',
    role: 'Coordonnateur Suprême & Arbitre',
    description: 'Le souverain du village veille à la bonne conduite de chaque mission, consulte les esprits de sagesse et organise la synergie entre les spécialistes.',
    responsibilities: [
      'Analyser la nature de la mission',
      'Consulter les esprits (modèles IA) et arbitrer le choix optimal',
      'Déléguer les tâches aux spécialistes adéquats',
      'Valider la qualité du résultat final avant transmission',
    ],
  },
  {
    kind: 'griot',
    name: 'Le Griot',
    role: 'Messager, Porteur de Voix & Mémoire',
    description: 'Gardien de la parole vivante, il accueille les missions de l’utilisateur, les achemine jusqu’au trône royal et annonce le progrès des travaux aux habitants.',
    responsibilities: [
      'Accueillir les demandes de l’utilisateur',
      'Traverser le village pour porter la mission au Roi',
      'Transmettre les directives du Roi aux spécialistes',
      'Notifier l’utilisateur à chaque étape majeure',
    ],
  },
  {
    kind: 'researcher',
    name: 'Le Chercheur',
    role: 'Analyste Documentaire & Fouilleur de Savoir',
    description: 'Érudit du village, il plonge au cœur des documents, des PDF volumineux et des textes denses pour en extraire la substantifique moelle.',
    responsibilities: [
      'Analyser les pièces jointes (PDF, textes, rapports)',
      'Extraire les données et citations pertinentes',
      'Structurer les informations clés pour la synthèse',
    ],
  },
  {
    kind: 'notary',
    name: 'La Guérisseuse',
    role: 'Maîtresse des Remèdes & Rédactrice Bienveillante',
    description: 'Elle examine avec minutie, soigne et purifie les écrits, apporte clarté aux idées et scelle les remèdes de sagesse et livrables officiels du village.',
    responsibilities: [
      'Soigner et structurer les textes et documents complexes',
      'Purifier les informations pour ne garder que l’essentiel',
      'Sceller le remède et le livrable final remis au voyageur',
    ],
  },
  {
    kind: 'developer',
    name: 'Le Développeur',
    role: 'Architecte Technique & Logiciel',
    description: 'Spécialiste des systèmes et des codes, il démystifie les architectures logicielles, analyse les fichiers de configuration et explique les concepts complexes.',
    responsibilities: [
      'Expliquer les architectures techniques',
      'Vérifier la faisabilité algorithmique',
      'Guider les développements futurs du village',
    ],
  },
  {
    kind: 'creative',
    name: 'La Créative',
    role: 'Visionnaire Multimodale & Direction Artistique',
    description: 'Dotée d’un regard aiguisé, elle interprète les images, les palettes visuelles et infuse l’originalité et la chaleur dans chaque recommandation.',
    responsibilities: [
      'Inspecter et interpréter le contenu des images',
      'Proposer des idées de conception et de design',
      'Enrichir les réponses avec des angles créatifs',
    ],
  },
  {
    kind: 'advisor',
    name: 'Le Conseiller',
    role: 'Sage & Contrôleur de Cohérence',
    description: 'Homme d’expérience et de modération, il relit les synthèses, émet des recommandations stratégiques et s’assure que la mission répond exactement à l’attente.',
    responsibilities: [
      'Contrôler la pertinence des réponses générées',
      'Émettre des recommandations actionnables',
      'Assurer l’alignement avec les objectifs de l’utilisateur',
    ],
  },
]

export function AgentsModal({ onClose, activeRole }: AgentsModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="agents-title">
      <div className="modal-card modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div>
              <h3 id="agents-title">L’Équipe des Agents du Village</h3>
              <p>Chaque personnage incarne une responsabilité logique dans l’orchestration de vos projets.</p>
            </div>
          </div>
          <button className="icon-button modal-close" onClick={onClose} aria-label="Fermer la fenêtre">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body agents-grid">
          {AGENT_DETAILS.map(agent => {
            const isActive = activeRole === agent.kind
            return (
              <div key={agent.kind} className={`agent-detail-card ${isActive ? 'agent-active-card' : ''}`}>
                <div className="agent-detail-top">
                  <div className={`agent-modal-portrait portrait-${agent.kind}`}>
                    <CharacterArt kind={agent.kind} active={isActive} />
                  </div>
                  <div>
                    <span className="agent-modal-role">{agent.role}</span>
                    <h4>{agent.name}</h4>
                  </div>
                </div>

                <p className="agent-modal-desc">{agent.description}</p>

                <div className="agent-responsibilities">
                  <strong>Responsabilités clés :</strong>
                  <ul>
                    {agent.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-button" onClick={onClose}>
            Fermer le registre
          </button>
        </div>
      </div>
    </div>
  )
}
