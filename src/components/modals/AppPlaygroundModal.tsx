import { useState, useRef, useEffect, useMemo } from 'react'
import {
  X,
  RefreshCw,
  Download,
  Code2,
  Play,
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle,
  Wand2,
  Copy,
  Check,
  Sparkles,
  Gamepad2,
  Calculator,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CircleDot,
} from 'lucide-react'
import type { MissionArtifact } from '../../types/mission'
import { downloadZip } from '../../utils/zipGenerator'

interface AppPlaygroundModalProps {
  isOpen: boolean
  artifact: MissionArtifact | null
  onClose: () => void
  onAutoHeal?: (errorMessage: string, artifact: MissionArtifact) => void
}

type DeviceMode = 'mobile' | 'tablet' | 'desktop'

export function AppPlaygroundModal({
  isOpen,
  artifact,
  onClose,
  onAutoHeal,
}: AppPlaygroundModalProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [showCode, setShowCode] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [showDpad, setShowDpad] = useState(true)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Réinitialiser les états à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setRuntimeError(null)
      setShowCode(false)
      setReloadKey(k => k + 1)
    }
  }, [isOpen, artifact?.id])

  // Écoute des erreurs runtime émises par l'application dans la Sandbox
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Validation stricte de sécurité (source et origine)
      if (iframeRef.current && e.source !== iframeRef.current.contentWindow) {
        return
      }
      if (e.origin !== window.location.origin && e.origin !== 'null' && e.origin !== '') {
        return
      }
      if (e.data && e.data.type === 'VILLAGE_APP_RUNTIME_ERROR') {
        const err = e.data.message || 'Erreur d’exécution détectée dans l’application'
        setRuntimeError(String(err))
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Injection du script de capture d'erreurs, anti-scroll et support D-Pad dans l'iframe
  const injectedHtml = useMemo(() => {
    if (!artifact?.content) return ''
    let html = artifact.content

    const safeOrigin = window.location.origin
    const bridgeScript = `
      <style id="village-runtime-reset">
        *, *::before, *::after {
          box-sizing: border-box !important;
        }
        html {
          width: 100% !important;
          min-height: 100% !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        body {
          margin: 0 !important;
          padding: 16px !important;
          width: 100% !important;
          min-height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: safe center !important;
          justify-content: safe center !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        .calculator, #calculator, #app {
          max-width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }
        canvas {
          max-width: 100% !important;
          height: auto !important;
        }
      </style>
      <script>
        (function() {
          var safeOrigin = '${safeOrigin}';
          window.onerror = function(msg, url, line, col, err) {
            try {
              window.parent.postMessage({
                type: 'VILLAGE_APP_RUNTIME_ERROR',
                message: msg,
                line: line
              }, safeOrigin);
            } catch(e) {}
            return false;
          };
          window.addEventListener('unhandledrejection', function(e) {
            try {
              window.parent.postMessage({
                type: 'VILLAGE_APP_RUNTIME_ERROR',
                message: e.reason ? (e.reason.message || String(e.reason)) : 'Erreur asynchrone non interceptée'
              }, safeOrigin);
            } catch(e) {}
          });

          // Empêcher les flèches du clavier de faire défiler la page web lors des jeux
          window.addEventListener('keydown', function(e) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
              e.preventDefault();
            }
          }, false);

          // Écouter les commandes tactiles envoyées par le D-Pad virtuel du Village IA
          window.addEventListener('message', function(e) {
            if (e.origin !== safeOrigin && e.origin !== 'null' && e.origin !== '') return;
            if (e.data && e.data.type === 'VILLAGE_SIMULATE_KEY') {
              var key = e.data.key;
              var code = e.data.code;
              var keyCode = e.data.keyCode;
              var downEvt = new KeyboardEvent('keydown', { key: key, code: code, keyCode: keyCode, bubbles: true });
              window.dispatchEvent(downEvt);
              document.dispatchEvent(downEvt);
              setTimeout(function() {
                var upEvt = new KeyboardEvent('keyup', { key: key, code: code, keyCode: keyCode, bubbles: true });
                window.dispatchEvent(upEvt);
                document.dispatchEvent(upEvt);
              }, 80);
            }
          });
        })();
      </script>
    `

    if (html.includes('<head>')) {
      return html.replace('<head>', `<head>${bridgeScript}`)
    }
    return `${bridgeScript}${html}`
  }, [artifact?.content])

  if (!isOpen || !artifact) return null

  const handleCopyCode = () => {
    navigator.clipboard.writeText(artifact.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadZipPackage = () => {
    const rawName = artifact.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 30) || 'village_ia_app'
    const files = [
      {
        name: 'index.html',
        content: artifact.content,
      },
      {
        name: 'README.md',
        content: `# ${artifact.title}
Projet interactif généré par **Village IA** — Le Sanctuaire des Agents et Esprits d'Afrique.

## 🚀 Mise en ligne immédiate
1. Vous pouvez ouvrir directement \`index.html\` dans n'importe quel navigateur.
2. Pour déployer gratuitement en ligne, glissez ce dossier sur **Vercel** ou **Netlify**.

Créé le ${new Date().toLocaleDateString('fr-FR')} par Le Conseil du Village.`,
      },
    ]
    downloadZip(`${rawName}.zip`, files)
  }

  // Envoi d'une touche simulée dans l'iframe pour le D-Pad tactile
  const sendKeyToIframe = (key: string, code: string, keyCode: number) => {
    if (iframeRef.current) {
      try {
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
        if (doc) {
          const eventDown = new KeyboardEvent('keydown', { key, code, keyCode, which: keyCode, bubbles: true, cancelable: true })
          doc.dispatchEvent(eventDown)
          window.setTimeout(() => {
            const eventUp = new KeyboardEvent('keyup', { key, code, keyCode, which: keyCode, bubbles: true, cancelable: true })
            doc.dispatchEvent(eventUp)
          }, 80)
          return
        }
      } catch {
        // Fallback postMessage transparent si accès direct bloqué
      }

      if (iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'VILLAGE_SIMULATE_KEY',
            key,
            code,
            keyCode,
          },
          window.location.origin || '/'
        )
      }
    }
  }

  const isGame = artifact.appCategory === 'game' || artifact.title.toLowerCase().includes('jeu') || artifact.content.toLowerCase().includes('canvas')

  return (
    <div className="playground-modal-backdrop" onClick={onClose}>
      <div
        className="playground-modal-window"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Playground d'Application et de Jeux"
      >
        {/* 1. Barre d'outils supérieure */}
        <header className="playground-header">
          <div className="playground-identity">
            <div className="playground-icon-tag">
              {isGame ? <Gamepad2 size={18} /> : artifact.appCategory === 'calculator' ? <Calculator size={18} /> : <Sparkles size={18} />}
            </div>
            <div>
              <h3 className="playground-title">{artifact.title}</h3>
              <span className="playground-subtitle">
                Réalisé en direct par {artifact.agentRole || 'Le Développeur'} • {artifact.modelUsed || 'Esprit du Village'}
              </span>
            </div>
          </div>

          <div className="playground-center-controls">
            {/* Sélecteur de résolution / Mode Appareil */}
            <div className="device-mode-selector">
              <button
                className={`device-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setDeviceMode('mobile')}
                title="Format Mobile (375px)"
              >
                <Smartphone size={14} />
                <span>Mobile</span>
              </button>
              <button
                className={`device-btn ${deviceMode === 'tablet' ? 'active' : ''}`}
                onClick={() => setDeviceMode('tablet')}
                title="Format Tablette (720px)"
              >
                <Tablet size={14} />
                <span>Tablette</span>
              </button>
              <button
                className={`device-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setDeviceMode('desktop')}
                title="Format Plein Écran (Desktop)"
              >
                <Monitor size={14} />
                <span>Plein Écran</span>
              </button>
            </div>
          </div>

          <div className="playground-actions">
            {/* Bascule Démo / Code */}
            <button
              className={`playground-action-btn ${showCode ? 'active' : ''}`}
              onClick={() => setShowCode(!showCode)}
              title={showCode ? 'Revenir à la démo interactive' : 'Inspecter le code source'}
            >
              {showCode ? <Play size={13} /> : <Code2 size={13} />}
              <span>{showCode ? 'Démo' : 'Code'}</span>
            </button>

            {/* Recommencer / Recharger */}
            <button
              className="playground-action-btn"
              onClick={() => {
                setRuntimeError(null)
                setReloadKey(k => k + 1)
              }}
              title="Recharger et redémarrer la partie"
            >
              <RefreshCw size={13} />
              <span>Relancer</span>
            </button>

            {/* Télécharger Projet Complet ZIP */}
            <button
              className="playground-action-btn zip-btn"
              onClick={handleDownloadZipPackage}
              title="Télécharger l'application complète prête pour Vercel / Netlify"
            >
              <Download size={13} />
              <span>Export ZIP</span>
            </button>

            {/* Fermer */}
            <button className="playground-close-btn" onClick={onClose} aria-label="Fermer le Playground">
              <X size={18} />
            </button>
          </div>
        </header>

        {/* 2. Bannière d'auto-guérison si une erreur survient dans le jeu */}
        {runtimeError && (
          <div className="playground-autoheal-banner">
            <div className="autoheal-info">
              <AlertTriangle size={16} className="autoheal-icon" />
              <div>
                <strong>Anomalie détectée par La Guérisseuse :</strong>
                <span> {runtimeError}</span>
              </div>
            </div>
            {onAutoHeal && (
              <button
                className="autoheal-trigger-btn"
                onClick={() => {
                  onAutoHeal(runtimeError, artifact)
                  onClose()
                }}
              >
                <Wand2 size={13} />
                <span>✨ Auto-Guérir avec Le Développeur</span>
              </button>
            )}
          </div>
        )}

        {/* 3. Corps principal : Canvas de Démo ou Éditeur de Code */}
        <div className="playground-viewport">
          {showCode ? (
            <div className="playground-code-view">
              <div className="playground-code-header">
                <span>Code source complet de l'application (HTML5 + CSS + JavaScript)</span>
                <button className="copy-code-btn" onClick={handleCopyCode}>
                  {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                  <span>{copied ? 'Copié !' : 'Copier tout le code'}</span>
                </button>
              </div>
              <pre className="playground-code-content">
                <code>{artifact.content}</code>
              </pre>
            </div>
          ) : (
            <div className={`playground-frame-container mode-${deviceMode}`}>
              <iframe
                key={reloadKey}
                ref={iframeRef}
                title={artifact.title}
                srcDoc={injectedHtml}
                sandbox="allow-scripts allow-modals allow-same-origin"
                className="playground-sandbox-iframe"
              />

              {/* D-Pad Tactile Virtuel superposé pour jouer sur mobile ou sans clavier physique */}
              {isGame && showDpad && (
                <div className="virtual-dpad-container" aria-label="Contrôles tactiles du jeu">
                  <div className="dpad-cross">
                    <button
                      className="dpad-btn up"
                      onPointerDown={() => sendKeyToIframe('ArrowUp', 'ArrowUp', 38)}
                      title="Haut"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <div className="dpad-mid-row">
                      <button
                        className="dpad-btn left"
                        onPointerDown={() => sendKeyToIframe('ArrowLeft', 'ArrowLeft', 37)}
                        title="Gauche"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        className="dpad-btn center-action"
                        onPointerDown={() => sendKeyToIframe(' ', 'Space', 32)}
                        title="Action / Pause"
                      >
                        <CircleDot size={14} />
                      </button>
                      <button
                        className="dpad-btn right"
                        onPointerDown={() => sendKeyToIframe('ArrowRight', 'ArrowRight', 39)}
                        title="Droite"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <button
                      className="dpad-btn down"
                      onPointerDown={() => sendKeyToIframe('ArrowDown', 'ArrowDown', 40)}
                      title="Bas"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <button
                    className="dpad-toggle-hide"
                    onClick={() => setShowDpad(false)}
                    title="Masquer les touches tactiles"
                  >
                    Masquer D-Pad
                  </button>
                </div>
              )}

              {isGame && !showDpad && (
                <button
                  className="dpad-restore-btn"
                  onClick={() => setShowDpad(true)}
                  title="Afficher les contrôles tactiles"
                >
                  <Gamepad2 size={13} />
                  <span>Afficher D-Pad</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

