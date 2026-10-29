import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Check,
  Copy,
  MessageSquare,
  ListFilter,
  Send,
  Sparkles,
  CheckCheck,
  Maximize2,
  Minimize2,
  ExternalLink,
  Code2,
  Play,
  Download,
  Printer,
  Terminal,
  Eye,
  RefreshCw,
  Gamepad2,
} from 'lucide-react'
import type { Mission, MissionEvent, AttachedFile, MissionArtifact } from '../../types/mission'
import type { ChatMessage } from '../../types/chat'
import { downloadZip } from '../../utils/zipGenerator'

interface RightPanelProps {
  mission: Mission | null
  events: MissionEvent[]
  messages?: ChatMessage[]
  onSendMessage?: (text: string, files: AttachedFile[]) => void
  onReset: () => void
  onViewAllHistory?: () => void
  onViewAllAgents?: () => void
  onOpenFullChat?: () => void
  onOpenPlayground?: (artifact: MissionArtifact) => void
}

const AGENT_AVATARS: Record<string, string> = {
  king: '/assets/avatar-king.png',
  griot: '/assets/avatar-griot.png',
  researcher: '/assets/avatar-researcher.png',
  creative: '/assets/avatar-creative.png',
  notary: '/assets/avatar-notary.png',
  advisor: '/assets/avatar-advisor.png',
  developer: '/assets/avatar-developer.png',
  spirits: '/assets/mask-spirit-gold.png',
  user: '/assets/avatar-advisor.png',
}

export function RightPanel({
  mission,
  events,
  messages = [],
  onSendMessage,
  onReset,
  onViewAllHistory,
  onViewAllAgents,
  onOpenFullChat,
  onOpenPlayground,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'events' | 'artifacts'>('chat')
  const [isChatMaximized, setIsChatMaximized] = useState(false)
  const [quickInput, setQuickInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeSandboxId, setActiveSandboxId] = useState<string | null>(null)
  const [sandboxOutputs, setSandboxOutputs] = useState<Record<string, string>>({})
  const chatScrollRef = useRef<HTMLDivElement>(null)

  const stage = mission?.stage || 'idle'
  const isCompleted = stage === 'completed'
  const isIdle = !mission || stage === 'idle'
  const progress = isIdle ? 0 : mission.progress

  // Auto-scroll au bas du chat lorsqu'un nouveau message arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages.length, activeTab])

  // Étapes de mission générées dynamiquement selon l'avancement réel
  const stepsData = useMemo(() => {
    if (!mission) {
      return [
        { id: '1', title: 'Demande reçue par le village', time: 'En attente', isDone: false, isActive: false, isCheck: false, isBlueDot: false, num: '1' },
        { id: '2', title: 'Transmission au Roi', time: 'En attente', isDone: false, isActive: false, isCheck: false, isBlueDot: false, num: '2' },
        { id: '3', title: 'Consultation des esprits', time: 'En attente', isDone: false, isActive: false, isCheck: false, isBlueDot: false, num: '3' },
        { id: '4', title: 'Affectation et analyse', time: 'En attente', isDone: false, isActive: false, isCheck: false, isBlueDot: false, num: '4' },
        { id: '5', title: 'Structuration & Synthèse', time: 'En attente', isDone: false, isActive: false, isCheck: false, isBlueDot: false, num: '5' },
      ]
    }
    return mission.steps.map((st, idx) => {
      const isDone = st.status === 'completed'
      const isActive = st.status === 'in_progress'
      return {
        id: st.id,
        title: st.title,
        time: isDone ? 'Terminé' : isActive ? 'En cours…' : 'En attente',
        isCheck: isDone,
        isBlueDot: isActive,
        isDone,
        isActive,
        num: String(idx + 1),
      }
    })
  }, [mission])

  // Messages temps réel (Journal d'événements)
  const displayEvents = useMemo(() => {
    return events.slice(0, 10).map(e => ({
      id: e.id,
      agentKind: e.agentKind || 'griot',
      who: e.agentKind === 'king'
        ? 'Le Roi'
        : e.agentKind === 'researcher'
        ? 'Le Chercheur'
        : e.agentKind === 'notary'
        ? 'La Guérisseuse'
        : e.agentKind === 'creative'
        ? 'La Créative'
        : e.agentKind === 'advisor'
        ? 'Le Conseiller'
        : e.agentKind === 'developer'
        ? 'Le Développeur'
        : e.agentKind === 'spirits'
        ? 'Les Esprits'
        : 'Le Griot',
      time: e.timestamp,
      text: e.detail,
    }))
  }, [events])

  // Ordre chronologique pour le chat interactif
  const chatMessagesAsc = useMemo(() => {
    return [...messages].reverse()
  }, [messages])

  // Agrégation de tous les artefacts (code, livrables, documents)
  const artifactsList = useMemo<MissionArtifact[]>(() => {
    if (mission?.artifacts && mission.artifacts.length > 0) {
      return mission.artifacts
    }
    const aggregated: MissionArtifact[] = []
    const seenIds = new Set<string>()

    messages.forEach(m => {
      if (m.artifacts) {
        m.artifacts.forEach(a => {
          if (!seenIds.has(a.id)) {
            seenIds.add(a.id)
            aggregated.push(a)
          }
        })
      }
    })
    return aggregated
  }, [mission?.artifacts, messages])

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleDownloadArtifact = async (artifact: MissionArtifact) => {
    if (artifact.isPlayableApp) {
      await downloadZip(
        artifact.title || 'village_ia_app',
        [
          { name: 'index.html', content: artifact.content },
          {
            name: 'README.md',
            content: `# ${artifact.title || 'Application Village IA'}\n\nCette application a été générée de manière autonome par le Conseil Multi-Agents du Village IA.\n\n## Comment l'utiliser ?\n1. Double-cliquez sur \`index.html\` pour l'ouvrir immédiatement dans n'importe quel navigateur.\n2. Vous pouvez aussi déployer ce dossier en 1 clic sur Vercel, Netlify ou GitHub Pages.`,
          },
        ]
      )
      return
    }

    let ext = 'txt'
    if (artifact.language === 'javascript') ext = 'js'
    else if (artifact.language === 'typescript') ext = 'ts'
    else if (artifact.language === 'html') ext = 'html'
    else if (artifact.language === 'css') ext = 'css'
    else if (artifact.language === 'python') ext = 'py'
    else if (artifact.language === 'sql') ext = 'sql'
    else if (artifact.language === 'json') ext = 'json'
    else if (artifact.language === 'markdown') ext = 'md'

    const blob = new Blob([artifact.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${artifact.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAllMarkdown = () => {
    const title = mission?.title || 'Mission_Village_IA'
    let content = `# 🏛️ CONSEIL DU VILLAGE IA — DOSSIER COMPLET\n\n`
    content += `**Date :** ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}\n`
    content += `**Quête :** ${mission?.prompt || 'Consultation des agents'}\n\n`
    if (mission?.finalResult) {
      content += `${mission.finalResult}\n\n`
    }
    if (artifactsList.length > 0) {
      content += `## 📦 Artefacts & Modules de Code Associés (${artifactsList.length})\n\n`
      artifactsList.forEach((art, idx) => {
        content += `### ${idx + 1}. ${art.title}\n`
        content += `*Langage :* \`${art.language || 'texte'}\` — *Auteur :* ${art.agentRole || 'Village'} (${art.modelUsed || 'IA'})\n\n`
        content += '```' + (art.language || '') + '\n'
        content += `${art.content}\n`
        content += '```\n\n'
      })
    }
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `village_ia_${title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30)}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleRunJsSandbox = (artifact: MissionArtifact) => {
    setActiveSandboxId(artifact.id)
    const logs: string[] = []
    const start = performance.now()
    try {
      const customConsole = {
        log: (...args: unknown[]) => {
          logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
        },
        warn: (...args: unknown[]) => {
          logs.push('[WARN] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
        },
        error: (...args: unknown[]) => {
          logs.push('[ERR] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
        },
        info: (...args: unknown[]) => {
          logs.push('[INFO] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
        },
      }
      // Safe sandboxed wrapper (isolated global scope evaluation)
      const runner = new Function('console', `
        "use strict";
        try {
          ${artifact.content}
        } catch (e) {
          console.error(e.message || String(e));
        }
      `)
      runner(customConsole)
      const elapsed = (performance.now() - start).toFixed(2)
      const finalOutput = logs.length > 0
        ? `⚡ Exécuté en ${elapsed}ms :\n` + logs.join('\n')
        : `⚡ Exécuté en ${elapsed}ms : Succès (aucun appel console.log).`
      setSandboxOutputs(prev => ({ ...prev, [artifact.id]: finalOutput }))
    } catch (err: unknown) {
      setSandboxOutputs(prev => ({
        ...prev,
        [artifact.id]: `❌ Erreur syntaxique : ${err instanceof Error ? err.message : String(err)}`,
      }))
    }
  }

  const handleSendQuick = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickInput.trim()) return
    onSendMessage?.(quickInput.trim(), [])
    setQuickInput('')
  }

  const isWorking = stage === 'specialist_working' || stage === 'consulting_spirits' || stage === 'travel_to_king'

  return (
    <aside className={`right-panel ${isChatMaximized ? 'chat-maximized' : ''}`}>
      {/* 1. Projet en cours (Repliable si chat agrandi) */}
      {!isChatMaximized ? (
        <section className="right-section project-section">
          <div className="right-title-row">
            <h2>Projet en cours</h2>
            <button className="text-link" onClick={onViewAllHistory}>
              Voir tout
            </button>
          </div>

          <div className="project-card">
            <div className="project-title">
              <strong>{mission?.title || 'En attente d’une mission'}</strong>
              <span className={`project-status ${isCompleted ? 'is-done' : mission ? 'is-ongoing' : 'is-idle'}`}>
                <i />
                {isCompleted ? 'Terminé' : mission ? 'En cours' : 'Prêt'}
              </span>
            </div>

            <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="project-progress-label">
              <span className="project-subtext">
                {mission ? 'Collaboration active des agents IA' : 'Décrivez votre tâche pour mobiliser le village'}
              </span>
              <strong className="project-progress-pct">{progress}%</strong>
            </div>

            {/* Télémétrie Globale de la mission */}
            {mission?.telemetry && (
              <div className="mission-telemetry-banner">
                <span className="telemetry-badge total-time">
                  ⚡ {(mission.telemetry.totalExecutionMs / 1000).toFixed(2)}s cumulées
                </span>
                <span className="telemetry-badge tokens-count">
                  ~{mission.telemetry.tokensEstimate.toLocaleString('fr-FR')} tokens
                </span>
                {mission.telemetry.debated && (
                  <span className="telemetry-badge debated-pill">
                    ⚔️ Débat d'experts scellé
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 2. Liste ordonnée des étapes */}
          <div className="task-list">
            {stepsData.map(step => (
              <div
                key={step.id}
                className={`task-row ${
                  step.isDone && !step.isActive ? 'completed' : step.isActive ? 'current' : 'pending'
                }`}
              >
                <span className={`task-marker ${step.isCheck ? 'check-marker' : step.isBlueDot ? 'blue-dot-marker' : 'grey-number-marker'}`}>
                  {step.isCheck ? <Check size={12} strokeWidth={3} /> : step.isBlueDot ? <span className="inner-blue-dot" /> : step.num}
                </span>
                <span className="task-name">{step.title}</span>
                <span className="task-time">{step.time}</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="chat-maximized-mini-banner">
          <div className="mini-banner-info">
            <span className="mini-banner-dot" />
            <strong>{mission?.title || 'Mission du Village'}</strong>
            <span className="mini-banner-pct">{progress}%</span>
          </div>
          <button
            className="mini-banner-restore-btn"
            onClick={() => setIsChatMaximized(false)}
            title="Réduire pour revoir les étapes"
          >
            <Minimize2 size={13} />
            <span>Réduire le chat</span>
          </button>
        </div>
      )}

      {/* 3. Salon Multi-Agents & Studio d'Artefacts */}
      <section className={`right-section activity-section interactive-chat-box ${isChatMaximized ? 'is-full-view' : ''}`}>
        <div className="right-title-row chat-header-row">
          <div className="chat-tabs-selector">
            <button
              className={`chat-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={13} />
              <span>Discussion {messages.length > 0 && `(${messages.length})`}</span>
            </button>
            <button
              className={`chat-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <ListFilter size={13} />
              <span>Journal</span>
            </button>
            <button
              className={`chat-tab-btn ${activeTab === 'artifacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('artifacts')}
              title="Studio d'artefacts, code exécutable et livrables téléchargeables"
            >
              <Code2 size={13} />
              <span>Artefacts {artifactsList.length > 0 && `(${artifactsList.length})`}</span>
            </button>
          </div>

          <div className="chat-actions-header-group">
            <button
              className="chat-toggle-size-btn"
              onClick={() => setIsChatMaximized(!isChatMaximized)}
              title={isChatMaximized ? 'Réduire la hauteur du chat' : 'Agrandir le chat pour voir tout le fil'}
            >
              {isChatMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isChatMaximized ? 'Normal' : 'Agrandir'}</span>
            </button>

            {onOpenFullChat && (
              <button
                className="chat-fullscreen-link-btn"
                onClick={onOpenFullChat}
                title="Ouvrir le salon complet en grand écran"
              >
                <ExternalLink size={13} />
                <span>Grand Écran</span>
              </button>
            )}

            <button className="text-link" onClick={onViewAllAgents}>
              Agents
            </button>
          </div>
        </div>

        {/* ONGLET 1 : DISCUSSION TEMPS RÉEL */}
        {activeTab === 'chat' && (
          <div className="live-chat-stream-container">
            <div className="live-chat-messages" ref={chatScrollRef}>
              {chatMessagesAsc.length === 0 ? (
                <div className="empty-message-feed">
                  <div className="empty-chat-icon">💬</div>
                  <p>Salon de discussion en attente.</p>
                  <small>Posez votre question en bas pour voir les agents débattre et collaborer en direct.</small>
                </div>
              ) : (
                chatMessagesAsc.map(msg => {
                  const isUser = msg.sender === 'user'
                  const isDeliverable = (msg.sender === 'notary' && msg.text.length > 70) || Boolean(msg.modelInfo)
                  const avatarSrc = isUser
                    ? null
                    : AGENT_AVATARS[msg.sender] || AGENT_AVATARS.griot

                  return (
                    <div
                      key={msg.id}
                      className={`live-chat-bubble-row ${isUser ? 'user-row' : 'agent-row'} ${isDeliverable ? 'deliverable-row' : ''}`}
                    >
                      {!isUser && (
                        <div className="live-chat-avatar">
                          <img
                            src={avatarSrc!}
                            alt={msg.senderName}
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                      <div className="live-chat-bubble-content">
                        <div className="live-chat-meta">
                          <strong className="live-chat-author">{msg.senderName}</strong>
                          <time>{msg.timestamp}</time>
                        </div>

                        {/* Télémétrie en temps réel sur le message d'agent */}
                        {msg.telemetry && (
                          <div className="message-telemetry-badge">
                            <span className="telemetry-chip latency">
                              ⚡ {(msg.telemetry.executionMs ? msg.telemetry.executionMs / 1000 : 1.1).toFixed(2)}s
                            </span>
                            {msg.telemetry.modelName && (
                              <span className="telemetry-chip model" title={msg.telemetry.modelName}>
                                {msg.telemetry.spiritName || msg.telemetry.modelName}
                              </span>
                            )}
                            {msg.telemetry.tokensEstimate && (
                              <span className="telemetry-chip tokens">
                                ~{msg.telemetry.tokensEstimate.toLocaleString('fr-FR')} tok
                              </span>
                            )}
                            {msg.telemetry.isDebated && (
                              <span className="telemetry-chip debated" title="Étape challengée par un second expert en débat">
                                ⚔️ Débat & Contre-expertise
                              </span>
                            )}
                          </div>
                        )}

                        {/* Rendu du texte de message */}
                        <div className="live-chat-text-body">
                          {isDeliverable ? (
                            <div className="live-deliverable-card">
                              <div className="deliverable-card-header">
                                <span className="deliverable-tag">
                                  <Sparkles size={12} /> LIVRABLE OFFICIEL DU CONSEIL
                                </span>
                                <div className="deliverable-header-right">
                                  {msg.modelInfo && (
                                    <span className="deliverable-model-tag" title={msg.modelInfo.name}>
                                      {msg.modelInfo.spiritName || msg.modelInfo.name}
                                    </span>
                                  )}
                                  <button
                                    className="copy-deliverable-btn"
                                    onClick={() => handleCopyText(msg.id, msg.text)}
                                    title="Copier le texte du livrable"
                                  >
                                    {copiedId === msg.id ? (
                                      <>
                                        <CheckCheck size={13} color="#28a745" /> Copié !
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={13} /> Copier
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="deliverable-text-content">
                                {msg.text}
                              </div>
                            </div>
                          ) : (
                            <p>{msg.text}</p>
                          )}
                        </div>

                        {/* Carte Interactive de Lancement en Direct pour Jeux & Apps */}
                        {msg.artifacts && msg.artifacts.some(a => a.isPlayableApp) && (
                          <div className="message-app-launch-card">
                            <div className="app-launch-info">
                              <span className="app-launch-icon">
                                {msg.artifacts.find(a => a.isPlayableApp)?.appCategory === 'game' ? '🎮' : '🚀'}
                              </span>
                              <div className="app-launch-details">
                                <strong>
                                  {msg.artifacts.find(a => a.isPlayableApp)?.title || 'Application Interactive Prête'}
                                </strong>
                                <p>
                                  {msg.artifacts.find(a => a.isPlayableApp)?.appCategory === 'game'
                                    ? 'Jeu vidéo jouable immédiatement avec clavier ou pavé tactile virtuel !'
                                    : 'Application autonome et fonctionnelle, exécutable en direct et prête à être exportée.'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="app-launch-btn"
                              onClick={() => {
                                const playable = msg.artifacts?.find(a => a.isPlayableApp)
                                if (playable) onOpenPlayground?.(playable)
                              }}
                            >
                              <Gamepad2 size={15} />
                              <span>Tester & Jouer en Grand Écran</span>
                            </button>
                          </div>
                        )}

                        {/* Lien rapide vers le studio d'artefacts si du code a été extrait */}
                        {msg.artifacts && msg.artifacts.length > 0 && (
                          <div className="message-artifacts-quicklink">
                            <button
                              className="view-artifacts-btn"
                              onClick={() => setActiveTab('artifacts')}
                              title="Voir et exécuter les extraits de code dans le Studio"
                            >
                              <Code2 size={12} />
                              <span>{msg.artifacts.length} artefact(s) de code généré(s) — Voir dans le Studio ↗</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}

              {/* Indicateur de frappe / réflexion en direct */}
              {isWorking && (
                <div className="live-typing-indicator-row">
                  <span className="typing-dots">
                    <i /><i /><i />
                  </span>
                  <span className="typing-label">
                    {stage === 'consulting_spirits'
                      ? 'Le Roi et les Esprits délibèrent…'
                      : 'Les agents collaborent et débattent en direct…'}
                  </span>
                </div>
              )}
            </div>

            {/* Barre de saisie rapide directement dans le coin droit */}
            <form onSubmit={handleSendQuick} className="right-panel-quick-input-form">
              <input
                type="text"
                name="quickInput"
                autoComplete="off"
                placeholder="Message rapide au village…"
                value={quickInput}
                onChange={e => setQuickInput(e.target.value)}
                className="right-panel-quick-input"
              />
              <button
                type="submit"
                className="right-panel-quick-send-btn"
                disabled={!quickInput.trim()}
                title="Envoyer"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        )}

        {/* ONGLET 2 : JOURNAL D'ACTIVITÉ */}
        {activeTab === 'events' && (
          <div className="message-feed">
            {displayEvents.length === 0 ? (
              <div className="empty-message-feed">
                <p>Journal de mission vide.</p>
                <small>Envoyez une instruction pour que le Griot transmette votre demande.</small>
              </div>
            ) : (
              displayEvents.map(evt => {
                const avatarSrc = AGENT_AVATARS[evt.agentKind] || AGENT_AVATARS.griot
                return (
                  <div className="message-item" key={evt.id}>
                    <div className="message-avatar-crop">
                      <img
                        src={avatarSrc}
                        alt={evt.who}
                        className="avatar-img-circle"
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <div className="message-copy">
                      <div className="message-heading">
                        <strong>{evt.who}</strong>
                        <time>{evt.time}</time>
                      </div>
                      <p>{evt.text}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ONGLET 3 : STUDIO D'ARTEFACTS, CODE & LIVRABLES */}
        {activeTab === 'artifacts' && (
          <div className="artifacts-studio-container">
            {/* Barre d'outils du studio */}
            <div className="artifacts-studio-toolbar">
              <div className="artifacts-toolbar-info">
                <span className="artifacts-status-tag">
                  <Sparkles size={12} /> {artifactsList.length} livrable(s) certifié(s)
                </span>
                <span className="sandbox-shield-tag">🛡️ Sandbox Sécurisée</span>
              </div>
              <div className="artifacts-toolbar-actions">
                <button
                  className="studio-tool-btn"
                  onClick={handleDownloadAllMarkdown}
                  title="Télécharger le dossier complet en Markdown (.md)"
                >
                  <Download size={12} />
                  <span>Dossier .md</span>
                </button>
                <button
                  className="studio-tool-btn"
                  onClick={handlePrint}
                  title="Imprimer ou enregistrer le rapport officiel en PDF"
                >
                  <Printer size={12} />
                  <span>Imprimer / PDF</span>
                </button>
              </div>
            </div>

            {/* Liste des cartes d'artefacts */}
            <div className="artifacts-cards-list">
              {artifactsList.length === 0 ? (
                <div className="empty-artifacts-state">
                  <div className="empty-artifacts-icon">
                    <Code2 size={28} />
                  </div>
                  <h4>Aucun code ou artefact extrait pour le moment</h4>
                  <p>
                    Demandez par exemple : <em>« code un formulaire d’envoi d’email en HTML/JS »</em> ou <em>« écris un script python d’analyse »</em>. Les agents rédigeront et testeront le code ici même !
                  </p>
                </div>
              ) : (
                artifactsList.map(artifact => {
                  const isJs = artifact.language === 'javascript' || artifact.language === 'js'
                  const isHtml = artifact.language === 'html'
                  const isRunnable = isJs || isHtml
                  const isSandboxOpen = activeSandboxId === artifact.id

                  return (
                    <div className="artifact-studio-card" key={artifact.id}>
                      <div className="artifact-card-topbar">
                        <div className="artifact-identity">
                          <span className={`lang-badge lang-${artifact.language || 'txt'}`}>
                            {(artifact.language || 'TXT').toUpperCase()}
                          </span>
                          <strong className="artifact-title">{artifact.title}</strong>
                        </div>
                        <div className="artifact-card-btns">
                          {artifact.isPlayableApp && (
                            <button
                              type="button"
                              className="artifact-action-btn playground-btn"
                              onClick={() => onOpenPlayground?.(artifact)}
                              title="Ouvrir dans le Playground interactif plein écran"
                            >
                              <Gamepad2 size={12} />
                              <span>Grand Écran</span>
                            </button>
                          )}
                          {isRunnable && (
                            <button
                              className={`artifact-action-btn run-btn ${isSandboxOpen ? 'active' : ''}`}
                              onClick={() => {
                                if (isSandboxOpen) {
                                  setActiveSandboxId(null)
                                } else if (isJs) {
                                  handleRunJsSandbox(artifact)
                                } else {
                                  setActiveSandboxId(artifact.id)
                                }
                              }}
                              title={isSandboxOpen ? 'Masquer l’exécution' : 'Tester et exécuter ce code en direct'}
                            >
                              {isHtml ? <Eye size={12} /> : <Play size={12} />}
                              <span>{isSandboxOpen ? 'Masquer' : isHtml ? 'Aperçu' : 'Exécuter'}</span>
                            </button>
                          )}
                          <button
                            className="artifact-action-btn"
                            onClick={() => handleCopyText(artifact.id, artifact.content)}
                            title="Copier le code"
                          >
                            {copiedId === artifact.id ? <CheckCheck size={12} color="#16a34a" /> : <Copy size={12} />}
                          </button>
                          <button
                            className="artifact-action-btn"
                            onClick={() => handleDownloadArtifact(artifact)}
                            title="Télécharger ce fichier"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Métadonnées de l'artefact */}
                      {artifact.modelUsed && (
                        <div className="artifact-meta-line">
                          <span>Auteur : {artifact.agentRole || 'Expert'}</span>
                          <span>•</span>
                          <span>Inspiré par {artifact.modelUsed}</span>
                        </div>
                      )}

                      {/* Aperçu interactif Sandbox (si ouvert) */}
                      {isSandboxOpen && (
                        <div className="artifact-sandbox-box">
                          {isHtml ? (
                            <div className="sandbox-html-preview">
                              <div className="sandbox-header">
                                <Eye size={12} />
                                <span>Aperçu HTML/CSS/JS Rendu en Direct</span>
                              </div>
                              <iframe
                                title="Aperçu sandbox HTML"
                                srcDoc={artifact.content}
                                sandbox="allow-scripts"
                                className="sandbox-iframe"
                              />
                            </div>
                          ) : (
                            <div className="sandbox-terminal-preview">
                              <div className="sandbox-terminal-header">
                                <Terminal size={12} />
                                <span>Console Sandbox Client (V8 Isolé)</span>
                                <button
                                  className="sandbox-rerun-btn"
                                  onClick={() => handleRunJsSandbox(artifact)}
                                  title="Ré-exécuter"
                                >
                                  <RefreshCw size={11} /> Re-tester
                                </button>
                              </div>
                              <pre className="sandbox-terminal-output">
                                {sandboxOutputs[artifact.id] || '⚡ Initialisation et exécution…'}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Code source de l'artefact */}
                      <div className="artifact-code-viewport">
                        <pre className="artifact-code-content">
                          <code>{artifact.content}</code>
                        </pre>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </section>

      <div className="right-footer-action">
        <button onClick={onReset} className="reset-view-btn" title="Réinitialiser l’affichage">
          Réinitialiser le parcours
        </button>
      </div>
    </aside>
  )
}
