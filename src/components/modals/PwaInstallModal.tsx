import {
  CheckCircle2,
  Download,
  MoreVertical,
  PlusSquare,
  Share,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react'

interface PwaInstallModalProps {
  onClose: () => void
  canDirectInstall: boolean
  isInstalled: boolean
  onTriggerDirectInstall: () => Promise<void>
}

export function PwaInstallModal({
  onClose,
  canDirectInstall,
  isInstalled,
  onTriggerDirectInstall,
}: PwaInstallModalProps) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-modal-title"
    >
      <div className="modal-card pwa-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge gold-badge">
              <Smartphone size={18} />
            </div>
            <div>
              <h3 id="pwa-modal-title">Installer l’application Village IA</h3>
              <p>
                Ajoutez le Village IA sur votre écran d’accueil iOS ou Android pour y accéder en plein écran comme une application native.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="icon-button modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body pwa-modal-body">
          {/* Bandeau d'installation directe en 1 clic si supporté par le navigateur (Android / Chrome / Edge) */}
          {isInstalled ? (
            <div className="pwa-direct-banner installed">
              <CheckCircle2 size={18} />
              <div>
                <strong>Village IA est déjà installée sur cet appareil !</strong>
                <span>Vous pouvez l’ouvrir directement depuis votre écran d’accueil ou vos applications.</span>
              </div>
            </div>
          ) : canDirectInstall ? (
            <div className="pwa-direct-banner">
              <div className="pwa-direct-info">
                <Sparkles size={18} />
                <div>
                  <strong>Installation rapide détectée</strong>
                  <span>Votre navigateur permet d’installer Village IA immédiatement en un seul clic.</span>
                </div>
              </div>
              <button
                type="button"
                className="pwa-direct-install-cta"
                onClick={onTriggerDirectInstall}
              >
                <Download size={15} />
                <span>Installer maintenant</span>
              </button>
            </div>
          ) : null}

          {/* Grille explicative iOS & Android */}
          <div className="pwa-platforms-grid">
            {/* CARTE iOS (iPhone / iPad) */}
            <div className="pwa-platform-card ios-card">
              <div className="pwa-platform-header">
                <div className="pwa-platform-badge ios-badge">🍎 iOS</div>
                <div>
                  <h4>Sur iPhone & iPad</h4>
                  <span>Navigateur Safari recommandé</span>
                </div>
              </div>

              <ol className="pwa-steps-list">
                <li>
                  <span className="pwa-step-num">1</span>
                  <div>
                    Ouvrez <strong>Village IA</strong> dans le navigateur <strong>Safari</strong> de votre iPhone ou iPad.
                  </div>
                </li>
                <li>
                  <span className="pwa-step-num">2</span>
                  <div>
                    Appuyez sur l’icône <strong>Partager</strong>{' '}
                    <span className="pwa-inline-chip">
                      <Share size={11} /> Partager
                    </span>{' '}
                    située dans la barre en bas de l’écran.
                  </div>
                </li>
                <li>
                  <span className="pwa-step-num">3</span>
                  <div>
                    Faites défiler le menu vers le bas et appuyez sur{' '}
                    <span className="pwa-inline-chip">
                      <PlusSquare size={11} /> Sur l’écran d’accueil
                    </span>
                    .
                  </div>
                </li>
                <li>
                  <span className="pwa-step-num">4</span>
                  <div>
                    Appuyez sur <strong>« Ajouter »</strong> en haut à droite : l’application <strong>Village IA</strong> apparaît sur votre écran d’accueil !
                  </div>
                </li>
              </ol>
            </div>

            {/* CARTE ANDROID (Samsung, Xiaomi, Pixel, etc.) */}
            <div className="pwa-platform-card android-card">
              <div className="pwa-platform-header">
                <div className="pwa-platform-badge android-badge">🤖 Android</div>
                <div>
                  <h4>Sur Smartphone Android</h4>
                  <span>Google Chrome / Samsung Internet</span>
                </div>
              </div>

              <ol className="pwa-steps-list">
                <li>
                  <span className="pwa-step-num">1</span>
                  <div>
                    Ouvrez <strong>Village IA</strong> dans le navigateur <strong>Google Chrome</strong> sur votre téléphone.
                  </div>
                </li>
                <li>
                  <span className="pwa-step-num">2</span>
                  <div>
                    Appuyez sur le menu{' '}
                    <span className="pwa-inline-chip">
                      <MoreVertical size={11} /> 3 points
                    </span>{' '}
                    situé tout en haut à droite du navigateur.
                  </div>
                </li>
                <li>
                  <span className="pwa-step-num">3</span>
                  <div>
                    Sélectionnez{' '}
                    <span className="pwa-inline-chip">
                      <Download size={11} /> Installer l’application
                    </span>{' '}
                    (ou <em>« Ajouter à l’écran d’accueil »</em>).
                  </div>
                </li>
                <li>
                  <span className="pwa-step-num">4</span>
                  <div>
                    Confirmez en appuyant sur <strong>« Installer »</strong> : le Village IA s’ouvre en plein écran sans barre d’adresse !
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="pwa-desktop-tip">
            <Sparkles size={15} />
            <p>
              <strong>Astuce sur Ordinateur (Mac / Windows) :</strong> Dans Chrome ou Edge, cliquez sur la petite icône d’écran avec une flèche située tout à droite de la barre d’adresse URL pour installer <strong>Village IA</strong> sur votre bureau.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-button" onClick={onClose}>
            J’ai compris
          </button>
        </div>
      </div>
    </div>
  )
}

