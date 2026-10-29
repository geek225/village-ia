import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, Cpu, Menu, Search, Sparkles, Trash2, X } from 'lucide-react'
import { AIRegistry } from '../../services/ai/aiRegistry'

export interface VillageNotification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface TopbarProps {
  onOpenMobileMenu: () => void
  onOpenCreditsModal?: () => void
  notifications?: VillageNotification[]
  onMarkNotificationsRead?: () => void
  onClearNotifications?: () => void
  onOpenCreatorModal?: () => void
  onSearch?: (query: string) => void
  onSubmitPrompt?: (prompt: string) => void
}

export function Topbar({
  onOpenMobileMenu,
  onOpenCreditsModal,
  notifications = [],
  onMarkNotificationsRead,
  onClearNotifications,
  onOpenCreatorModal,
  onSearch,
  onSubmitPrompt,
}: TopbarProps) {
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifPopover, setShowNotifPopover] = useState(false)
  const notifWrapperRef = useRef<HTMLDivElement | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (notifWrapperRef.current && !notifWrapperRef.current.contains(e.target as Node)) {
        setShowNotifPopover(false)
      }
    }
    if (showNotifPopover) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside, { passive: true })
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [showNotifPopover])

  const handleToggleNotifications = () => {
    const nextState = !showNotifPopover
    setShowNotifPopover(nextState)
    if (nextState && unreadCount > 0) {
      onMarkNotificationsRead?.()
    }
  }

  const handleQueryChange = (val: string) => {
    setQuery(val)
    onSearch?.(val)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault()
      onSubmitPrompt?.(query.trim())
      setQuery('')
    }
  }

  const formattedTokens = AIRegistry.getFormattedTotalTokens()

  return (
    <header className="topbar">
      <button
        className="mobile-menu icon-button"
        aria-label="Ouvrir le menu de navigation"
        onClick={onOpenMobileMenu}
      >
        <Menu size={20} />
      </button>

      <div className={`global-search ${showSearch ? 'search-open' : ''}`}>
        <Search size={18} className="search-icon-left" />
        <input
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pose une question, décris ta tâche ou discute avec les agents..."
          onFocus={() => setShowSearch(true)}
          onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          aria-label="Recherche globale"
          name="searchQuery"
          autoComplete="off"
        />
        <kbd className="search-kbd">⌘ K</kbd>
        {query && (
          <button
            className="search-clear"
            onMouseDown={e => e.preventDefault()}
            onClick={() => handleQueryChange('')}
            aria-label="Effacer la recherche"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="top-actions">
        {/* Totalité réelle cumulée de tous les tokens des IA */}
        <div
          className="credits-pill tokens-total-pill"
          onClick={onOpenCreditsModal}
          title="Totalité des tokens de contexte cumulés sur l'ensemble des Esprits IA connectés"
          style={{ cursor: 'pointer' }}
        >
          <Cpu size={16} className="tokens-cpu-icon" />
          <span className="tokens-pill-text">
            Tokens IA : <strong>{formattedTokens}</strong>
          </span>
          <span className="tokens-status-dot" title="Pool multi-esprits actif" />
        </div>

        <div className="notification-wrapper" ref={notifWrapperRef}>
          <button
            type="button"
            className={`notification-button icon-button ${showNotifPopover ? 'active' : ''}`}
            aria-label={
              unreadCount > 0
                ? `Notifications (${unreadCount} non lue${unreadCount > 1 ? 's' : ''})`
                : 'Aucune nouvelle notification'
            }
            onClick={handleToggleNotifications}
          >
            <Bell size={18} />
            {unreadCount > 0 && <i>{unreadCount > 9 ? '9+' : unreadCount}</i>}
          </button>

          {showNotifPopover && (
            <>
              <div
                className="notifications-backdrop"
                onClick={() => setShowNotifPopover(false)}
                aria-hidden="true"
              />
              <div className="notifications-popover" role="region" aria-label="Centre de notifications">
                <div className="notifications-popover-header">
                  <div className="notifications-popover-title">
                    <Bell size={14} />
                    <strong>Notifications du Village</strong>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      className="notifications-clear-btn"
                      onClick={() => {
                        onClearNotifications?.()
                        setShowNotifPopover(false)
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Tout effacer</span>
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="notifications-empty-state">
                    <CheckCheck size={22} className="notifications-empty-icon" />
                    <strong>Aucune notification pour le moment</strong>
                    <p>
                      Vous êtes à jour ! Le Griot vous notifiera ici dès qu’une mission ou un livrable officiel sera terminé.
                    </p>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notifications.map(notif => (
                      <div
                        key={notif.id}
                        className="notification-item"
                        onClick={() => setShowNotifPopover(false)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setShowNotifPopover(false)
                          }
                        }}
                      >
                        <div className="notification-item-top">
                          <strong>{notif.title}</strong>
                          <time>{notif.timestamp}</time>
                        </div>
                        <p>{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bouton incitatif Vibe Coder vers le profil de Kevin Stéphane Assamoi */}
        <button
          className="vibe-coder-cta-button"
          onClick={onOpenCreatorModal}
          title="Découvrir l'architecte et Vibe Coder de ce Village IA"
          aria-label="Qui a Vibe codé ce village ?"
        >
          <span className="vibe-sparkle-pill">
            <Sparkles size={13} />
            <span>Vibe Coder</span>
          </span>
          <span className="vibe-cta-text">
            Qui a codé ce village ?
          </span>
          <span className="vibe-badge-click">Cliquez ici ✨</span>
        </button>
      </div>
    </header>
  )
}
