import { useEffect, useState, useRef } from 'react'
import type { AgentKind } from './types/agent'
import type { AttachedFile, Mission, MissionEvent, MissionArtifact } from './types/mission'
import type { ChatMessage } from './types/chat'
import { missionEngine } from './services/mission/missionEngine'
import { AIRegistry } from './services/ai/aiRegistry'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar, type VillageNotification } from './components/layout/Topbar'
import { RightPanel } from './components/layout/RightPanel'
import { VillageMap } from './components/village/VillageMap'
import { ChatComposer } from './components/chat/ChatComposer'
import { ChatView } from './components/chat/ChatView'
import { SettingsModal } from './components/modals/SettingsModal'
import { ModelsModal } from './components/modals/ModelsModal'
import { AgentsModal } from './components/modals/AgentsModal'
import { CreatorModal } from './components/modals/CreatorModal'
import { PwaInstallModal } from './components/modals/PwaInstallModal'
import { AppPlaygroundModal } from './components/modals/AppPlaygroundModal'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function App() {
  const [activeNav, setActiveNav] = useState('Village')
  const [mission, setMission] = useState<Mission | null>(null)
  const [events, setEvents] = useState<MissionEvent[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [notifications, setNotifications] = useState<VillageNotification[]>([])
  const [activeBubble, setActiveBubble] = useState<{ target: AgentKind; text: string } | null>(null)
  const bubbleTimerRef = useRef<number | null>(null)

  // Modals
  const [showSettings, setShowSettings] = useState(false)
  const [showModels, setShowModels] = useState(false)
  const [showAgents, setShowAgents] = useState(false)
  const [showCreatorModal, setShowCreatorModal] = useState(false)
  const [showPwaModal, setShowPwaModal] = useState(false)
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isPwaInstalled, setIsPwaInstalled] = useState(false)
  const [selectedAgentDetail, setSelectedAgentDetail] = useState<AgentKind | undefined>()
  const [playgroundArtifact, setPlaygroundArtifact] = useState<MissionArtifact | null>(null)

  // UI state
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (isStandalone) {
      setIsPwaInstalled(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPwaPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsPwaInstalled(true)
      setDeferredPwaPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleTriggerDirectPwaInstall = async () => {
    if (!deferredPwaPrompt) return
    await deferredPwaPrompt.prompt()
    const choice = await deferredPwaPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setIsPwaInstalled(true)
      setShowPwaModal(false)
    }
    setDeferredPwaPrompt(null)
  }

  const showTemporaryBubble = (target: AgentKind, text: string, durationMs?: number) => {
    if (bubbleTimerRef.current) {
      window.clearTimeout(bubbleTimerRef.current)
    }
    setActiveBubble({ target, text })
    const wordCount = text.split(/\s+/).length
    const computedDuration = Math.max(wordCount * 420 + 1500, durationMs || 5200)
    bubbleTimerRef.current = window.setTimeout(() => {
      setActiveBubble(null)
      bubbleTimerRef.current = null
    }, computedDuration)
  }

  // Écouteur réactif du moteur de mission
  useEffect(() => {
    const unsubscribe = missionEngine.onEvent((event, currentMission) => {
      setMission({ ...currentMission })
      setEvents(prev => [event, ...prev])

      switch (event.type) {
        case 'MESSAGE_RECEIVED':
          showTemporaryBubble('griot', event.detail, 5000)
          setMessages(prev => [
            {
              id: event.id,
              sender: 'griot',
              senderName: 'Le Griot',
              text: 'Mission reçue ! Je la transmets immédiatement au Roi.',
              timestamp: event.timestamp,
            },
            ...prev,
          ])
          break

        case 'AGENT_MOVEMENT_STARTED':
          // Pas de nouvelle prise de parole pendant la course du Griot afin de ne jamais couper sa phrase en cours
          break

        case 'AGENT_ARRIVED':
          showTemporaryBubble('griot', event.detail, 3500)
          setMessages(prev => [
            {
              id: event.id,
              sender: 'griot',
              senderName: 'Le Griot',
              text: event.detail,
              timestamp: event.timestamp,
            },
            ...prev,
          ])
          break

        case 'COORDINATION_STARTED':
          showTemporaryBubble('king', event.detail, 4000)
          setMessages(prev => [
            {
              id: event.id,
              sender: 'king',
              senderName: 'Le Roi',
              text: event.detail,
              timestamp: event.timestamp,
            },
            ...prev,
          ])
          break

        case 'MODEL_SELECTION_STARTED':
          showTemporaryBubble('spirits', event.detail, 3500)
          setMessages(prev => [
            {
              id: event.id,
              sender: 'spirits',
              senderName: 'Les Esprits Ancestraux',
              text: event.detail,
              timestamp: event.timestamp,
            },
            ...prev,
          ])
          break

        case 'MODEL_SELECTED':
          showTemporaryBubble('spirits', event.detail, 4000)
          setMessages(prev => [
            {
              id: event.id,
              sender: 'spirits',
              senderName: 'Les Esprits Ancestraux',
              text: event.detail,
              timestamp: event.timestamp,
            },
            ...prev,
          ])
          break

        case 'AGENT_ASSIGNED':
          showTemporaryBubble('king', event.detail, 3500)
          setMessages(prev => [
            {
              id: event.id,
              sender: 'king',
              senderName: 'Le Roi',
              text: event.detail,
              timestamp: event.timestamp,
            },
            ...prev,
          ])
          break

        case 'AGENT_WORK_STARTED':
        case 'AGENT_WORK_COMPLETED':
          if (event.agentKind) {
            const roleName = event.agentKind === 'griot'
              ? 'Le Griot'
              : event.agentKind === 'king'
              ? 'Le Roi'
              : event.agentKind === 'creative'
              ? 'La Créative'
              : event.agentKind === 'developer'
              ? 'Le Développeur'
              : event.agentKind === 'advisor'
              ? 'Le Conseiller'
              : event.agentKind === 'notary'
              ? 'La Guérisseuse'
              : 'Le Chercheur'
            const chatContent = (event.data?.chatText as string) || event.detail
            const telemetry = event.data?.telemetry as ChatMessage['telemetry']
            const artifacts = event.data?.artifacts as ChatMessage['artifacts']
            showTemporaryBubble(event.agentKind, event.detail, 4500)
            setMessages(prev => [
              {
                id: event.id,
                sender: event.agentKind!,
                senderName: roleName,
                text: chatContent,
                timestamp: event.timestamp,
                telemetry,
                artifacts,
              },
              ...prev,
            ])
          }
          break

        case 'MISSION_COMPLETED':
          showTemporaryBubble('king', 'Le livrable est prêt et disponible pour le visiteur.', 4500)
          setNotifications(prev => [
            {
              id: `notif-${event.id}`,
              title: '📜 Livrable officiel scellé',
              message: `Mission terminée avec ${currentMission.selectedModel?.spiritName || currentMission.selectedModel?.name || 'les Esprits du Village'}.`,
              timestamp: event.timestamp,
              read: false,
            },
            ...prev,
          ])
          if (event.data?.result) {
            const finalTelemetry = event.data?.telemetry as ChatMessage['telemetry']
            const finalArtifacts = event.data?.artifacts as ChatMessage['artifacts']
            setMessages(prev => [
              {
                id: event.id,
                sender: 'notary',
                senderName: 'La Guérisseuse',
                text: event.data!.result as string,
                timestamp: event.timestamp,
                modelInfo: currentMission.selectedModel,
                isSimulated: currentMission.isSimulated,
                telemetry: finalTelemetry,
                artifacts: finalArtifacts,
              },
              ...prev,
            ])

            // Si un jeu ou une application exécutable a été créé, ouvrons immédiatement le Grand Écran / Playground !
            if (finalArtifacts && finalArtifacts.length > 0) {
              const playableApp = finalArtifacts.find(a => a.isPlayableApp) || (finalArtifacts[0].language === 'html' ? finalArtifacts[0] : null)
              if (playableApp) {
                setTimeout(() => {
                  setPlaygroundArtifact(playableApp)
                }, 800)
              }
            }
          }
          break

        case 'MISSION_CANCELLED':
          showTemporaryBubble('king', 'La mission a été interrompue.', 3000)
          break
      }
    })

    return () => {
      unsubscribe()
      if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current)
    }
  }, [])

  const handleSendMessage = async (text: string, files: AttachedFile[]) => {
    const trimmed = text.trim()
    const nowTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date())

    // Détection automatique si l'utilisateur envoie directement sa clé API
    if (trimmed.startsWith('sk-apx') || trimmed.startsWith('AIza') || trimmed.startsWith('sk-or-') || trimmed.startsWith('sk-')) {
      const { provider } = AIRegistry.setAnyApiKey(trimmed)
      const providerLabel = provider === 'apinex' ? 'APInex (Modèles Gratuits)' : provider === 'gemini' ? 'Google Gemini' : provider === 'openrouter' ? 'OpenRouter' : 'OpenAI'
      showTemporaryBubble('griot', `Clé ${providerLabel} activée ! Le Roi consulte désormais ces modèles en direct.`, 5000)
      setMessages(prev => [
        {
          id: `sys-${Date.now()}`,
          sender: 'griot',
          senderName: 'Le Griot',
          text: `🔑 Votre clé API ${providerLabel} a été activée avec succès ! Les agents appelleront désormais directement ce fournisseur d’IA. Posez votre question ou confiez une tâche au village.`,
          timestamp: nowTime,
        },
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          senderName: 'Kevino Geek',
          text: '•••••••••••••••••••• (Clé API transmise)',
          timestamp: nowTime,
        },
        ...prev,
      ])
      return
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'Kevino Geek',
      text,
      attachments: files,
      timestamp: nowTime,
    }
    setMessages(prev => [userMsg, ...prev])
    await missionEngine.startMission(text, files)
  }

  const handleCancelMission = () => {
    missionEngine.cancelCurrentMission()
  }

  const handleReset = () => {
    missionEngine.cancelCurrentMission()
    setMission(null)
    setEvents([])
    setActiveBubble(null)
  }

  const isMissionRunning = Boolean(
    mission &&
    mission.stage !== 'completed' &&
    mission.stage !== 'cancelled' &&
    mission.stage !== 'error' &&
    mission.stage !== 'idle'
  )

  const handleOpenAgentDetail = (agentKind: AgentKind) => {
    setSelectedAgentDetail(agentKind)
    // La fenêtre modale ne s'ouvre plus au clic sur la carte, l'avatar s'exprime directement dans sa bulle
  }

  const handleAutoHealPlayground = (errorText: string, artifact: MissionArtifact) => {
    setPlaygroundArtifact(null)
    handleSendMessage(
      `Corrige immédiatement ce bug détecté lors de l'exécution de l'application "${artifact.title}" : ${errorText}. Fournis le code HTML/CSS/JS complet et sans erreur pour que l'utilisateur puisse jouer directement.`,
      []
    )
  }

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : ''}`}>
      {/* 1. Barre Latérale Gauche */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={nav => {
          setActiveNav(nav)
          if (nav === 'Modèles IA' || nav === 'Les Esprits') setShowModels(true)
          if (nav === 'Agents IA') setShowAgents(true)
        }}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenPwaModal={() => setShowPwaModal(true)}
        isPwaInstalled={isPwaInstalled}
      />

      {/* 2. Barre Supérieure */}
      <Topbar
        onOpenMobileMenu={() => setIsMobileNavOpen(true)}
        onOpenCreditsModal={() => setShowModels(true)}
        notifications={notifications}
        onMarkNotificationsRead={() =>
          setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        }
        onClearNotifications={() => setNotifications([])}
        onOpenCreatorModal={() => setShowCreatorModal(true)}
        onSubmitPrompt={promptText => handleSendMessage(promptText, [])}
      />

      {/* 3. Espace Central : Le Village & Chatbot */}
      <main className={`main-workspace-mockup ${activeNav === 'Village' ? 'is-village-active' : ''}`}>
        {activeNav === 'Village' && (
          <section className="village-container-card">
            {/* Scène du Village fidèle au pixel près */}
            <VillageMap
              mission={mission}
              activeBubble={activeBubble}
              onAgentClick={handleOpenAgentDetail}
            />

            {/* Saisie chatbot et boutons d'actions */}
            <ChatComposer
              onSendMessage={handleSendMessage}
              onCancelMission={handleCancelMission}
              isMissionRunning={isMissionRunning}
              onOpenSettings={() => setShowSettings(true)}
            />
          </section>
        )}

        {/* Salon de discussion complet */}
        {activeNav === 'Chat' && (
          <ChatView
            messages={messages}
            onReturnToVillage={() => setActiveNav('Village')}
          />
        )}

        {activeNav === 'Projets' && (
          <div className="full-chat-view" style={{ padding: 24 }}>
            <h2>Espace Projets</h2>
            <p>Retrouvez vos dossiers thématiques et l’historique des analyses.</p>
          </div>
        )}

        {activeNav === 'Historique' && (
          <div className="full-chat-view" style={{ padding: 24 }}>
            <h2>Historique des Événements</h2>
            <p>Toutes les traces d’activités des agents et des modèles.</p>
          </div>
        )}

        {activeNav === 'Aide' && (
          <div className="full-chat-view" style={{ padding: 24 }}>
            <h2>Guide du Village IA</h2>
            <p>Le Roi coordonne, le Griot transmet, les esprits conseillent et les spécialistes exécutent.</p>
          </div>
        )}
      </main>

      {/* 4. Panneau Latéral Droit de Suivi de Mission */}
      <RightPanel
        mission={mission}
        events={events}
        messages={messages}
        onSendMessage={handleSendMessage}
        onReset={handleReset}
        onViewAllHistory={() => setActiveNav('Historique')}
        onViewAllAgents={() => setShowAgents(true)}
        onOpenFullChat={() => setActiveNav('Chat')}
        onOpenPlayground={setPlaygroundArtifact}
      />

      {/* Fenêtres modales */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showModels && (
        <ModelsModal
          onClose={() => setShowModels(false)}
          currentSelectedId={mission?.selectedModel?.id}
        />
      )}
      {showAgents && (
        <AgentsModal
          onClose={() => {
            setShowAgents(false)
            setSelectedAgentDetail(undefined)
          }}
          activeRole={selectedAgentDetail}
        />
      )}
      {showCreatorModal && (
        <CreatorModal onClose={() => setShowCreatorModal(false)} />
      )}
      {showPwaModal && (
        <PwaInstallModal
          onClose={() => setShowPwaModal(false)}
          canDirectInstall={Boolean(deferredPwaPrompt)}
          isInstalled={isPwaInstalled}
          onTriggerDirectInstall={handleTriggerDirectPwaInstall}
        />
      )}

      {/* 5. Playground d'exécution interactive d'applications & jeux (Plein Écran) */}
      <AppPlaygroundModal
        isOpen={Boolean(playgroundArtifact)}
        artifact={playgroundArtifact}
        onClose={() => setPlaygroundArtifact(null)}
        onAutoHeal={handleAutoHealPlayground}
      />
    </div>
  )
}

export default App
