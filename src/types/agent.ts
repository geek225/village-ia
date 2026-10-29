export type AgentKind =
  | 'king'
  | 'griot'
  | 'researcher'
  | 'notary'
  | 'developer'
  | 'creative'
  | 'advisor'
  | 'spirits'

export type AgentAnimationState =
  | 'idle'
  | 'walking'
  | 'working'
  | 'talking'
  | 'thinking'
  | 'celebrating'
  | 'error'

export interface Coordinates {
  x: number // percentage 0-100
  y: number // percentage 0-100
}

export interface AgentProfile {
  kind: AgentKind
  name: string
  title: string
  specialty: string
  homeLocation: Coordinates
  currentLocation: Coordinates
  facing: 'left' | 'right'
  state: AgentAnimationState
  currentBubble: string | null
  active: boolean
}
