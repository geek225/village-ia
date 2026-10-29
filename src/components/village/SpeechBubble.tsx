import type { AgentKind } from '../../types/agent'

export function SpeechBubble({ text, target, className = '' }: { text: string; target?: AgentKind; className?: string }) {
  if (!text) return null
  const targetClass = target ? `bubble-${target}` : ''
  return (
    <div className={`speech-bubble ${targetClass} ${className}`} role="status" aria-live="polite">
      {text}
    </div>
  )
}
