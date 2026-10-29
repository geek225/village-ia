import {
  Bot,
  CheckCircle2,
  CircleHelp,
  Download,
  Flame,
  Folder,
  History,
  Home,
  MessageCircle,
  Settings,
  Sun,
  Moon,
  X,
} from 'lucide-react'

interface SidebarProps {
  activeNav: string
  onSelectNav: (nav: string) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
  onOpenSettings: () => void
  onOpenPwaModal: () => void
  isPwaInstalled?: boolean
}

const navItems = [
  { label: 'Village', icon: Home },
  { label: 'Chat', icon: MessageCircle },
  { label: 'Projets', icon: Folder },
  { label: 'Agents IA', icon: Bot },
  { label: 'Les Esprits', icon: Flame },
  { label: 'Historique', icon: History },
]

export function Sidebar({
  activeNav,
  onSelectNav,
  isMobileOpen,
  onCloseMobile,
  darkMode,
  onToggleDarkMode,
  onOpenSettings,
  onOpenPwaModal,
  isPwaInstalled = false,
}: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-logo-img-wrapper" title="Village IA">
            <img
              src="/assets/logo-crown.png"
              alt="Couronne Royale"
              className="brand-crown-img"
              onError={e => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="brand-text-block">
            <div className="brand-name">Village IA</div>
            <div className="brand-tagline">Des idées qui avancent</div>
          </div>
          <button
            className="mobile-close icon-button"
            onClick={onCloseMobile}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="side-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? 'active' : ''}`}
              onClick={() => {
                onSelectNav(label)
                onCloseMobile()
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}

          {/* Bouton d'installation PWA placé juste sous Historique (emplacement de l'encadré rouge) */}
          <button
            type="button"
            className={`pwa-nav-install-btn ${isPwaInstalled ? 'installed' : ''}`}
            onClick={() => {
              onOpenPwaModal()
              onCloseMobile()
            }}
            title="Installer Village IA sur iOS, Android ou Ordinateur"
          >
            {isPwaInstalled ? <CheckCircle2 size={17} /> : <Download size={17} />}
            <span>{isPwaInstalled ? 'App installée (PWA)' : 'Installer l’App'}</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => {
              onOpenSettings()
              onCloseMobile()
            }}
          >
            <Settings size={18} />
            <span>Paramètres</span>
          </button>
          <button
            className="nav-item"
            onClick={() => {
              onSelectNav('Aide')
              onCloseMobile()
            }}
          >
            <CircleHelp size={18} />
            <span>Aide</span>
          </button>

          {/* Pill theme toggle with Sun and Moon icons */}
          <div className="theme-pill-selector">
            <button
              className={`theme-pill-btn ${!darkMode ? 'active-pill' : ''}`}
              onClick={() => darkMode && onToggleDarkMode()}
              aria-label="Mode jour"
              title="Mode clair"
            >
              <Sun size={15} />
            </button>
            <button
              className={`theme-pill-btn ${darkMode ? 'active-pill' : ''}`}
              onClick={() => !darkMode && onToggleDarkMode()}
              aria-label="Mode nuit"
              title="Mode sombre"
            >
              <Moon size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

