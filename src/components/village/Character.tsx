import type { CSSProperties } from 'react'
import type { AgentKind, AgentAnimationState } from '../../types/agent'
import { CharacterArt } from './CharacterArt'
import { SpeechBubble } from './SpeechBubble'

interface CharacterProps {
  kind: AgentKind
  x: number
  y: number
  facing?: 'left' | 'right'
  state?: AgentAnimationState
  active?: boolean
  bubbleText?: string | null
  className?: string
  onClick?: () => void
}

export function Character({
  kind,
  x,
  y,
  facing = 'right',
  state = 'idle',
  active = false,
  bubbleText,
  className = '',
  onClick,
}: CharacterProps) {
  // Calcul dynamique de la profondeur z-index en fonction de la coordonnée Y (perspective 2D)
  const zIndex = Math.round(y * 10) + (active ? 50 : 0)

  const style: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    zIndex,
    transform: `translate(-50%, -50%) scaleX(${facing === 'left' ? -1 : 1})`,
  }

  const stateClass =
    state === 'walking'
      ? 'walking'
      : state === 'working'
      ? 'working'
      : state === 'thinking'
      ? 'thinking'
      : state === 'celebrating'
      ? 'celebrating'
      : state === 'error'
      ? 'error'
      : ''

  return (
    <div
      className={`avatar avatar-${kind} ${stateClass} ${className}`}
      style={style}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Agent ${kind}, état ${state}`}
    >
      <CharacterArt kind={kind} active={active} />
      {bubbleText && (
        <div style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'none' }}>
          <SpeechBubble text={bubbleText} target={kind} />
        </div>
      )}
    </div>
  )
}
