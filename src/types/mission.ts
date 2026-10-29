import type { AgentKind } from './agent'
import type { AIModel } from './ai'

export type EventType =
  | 'MISSION_CREATED'
  | 'MESSAGE_RECEIVED'
  | 'COORDINATION_STARTED'
  | 'MODEL_SELECTION_STARTED'
  | 'MODEL_SELECTED'
  | 'AGENT_ASSIGNED'
  | 'AGENT_MOVEMENT_STARTED'
  | 'AGENT_ARRIVED'
  | 'AGENT_WORK_STARTED'
  | 'AGENT_WORK_COMPLETED'
  | 'MODEL_CALL_FAILED'
  | 'MISSION_FAILED'
  | 'MISSION_CANCELLED'
  | 'MISSION_COMPLETED'

export type MissionStage =
  | 'idle'
  | 'received'
  | 'travel_to_king'
  | 'consulting_spirits'
  | 'assigning_specialist'
  | 'specialist_working'
  | 'verification'
  | 'completed'
  | 'cancelled'
  | 'error'

export interface MissionEvent {
  id: string
  type: EventType
  missionId: string
  timestamp: string
  title: string
  detail: string
  agentKind?: AgentKind
  state: 'done' | 'active' | 'waiting' | 'failed'
  data?: Record<string, unknown>
}

export interface MissionTaskStep {
  id: string
  title: string
  agentRole: AgentKind
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

export interface MissionArtifact {
  id: string
  title: string
  language?: string
  content: string
  type: 'code' | 'markdown' | 'analysis' | 'json' | 'app'
  agentRole?: AgentKind
  modelUsed?: string
  createdAt: number
  isPlayableApp?: boolean
  appCategory?: 'game' | 'calculator' | 'tool' | 'widget' | 'document'
}

export interface MissionTelemetry {
  totalExecutionMs: number
  primaryLatencyMs?: number
  companionLatencyMs?: number
  modelsInvoked: string[]
  tokensEstimate: number
  debated?: boolean
}

export interface AttachedFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  dataUrl?: string
  textContent?: string
}

export interface Mission {
  id: string
  title: string
  prompt: string
  files: AttachedFile[]
  stage: MissionStage
  progress: number // 0 to 100
  selectedModel?: AIModel
  assignedAgents: AgentKind[]
  steps: MissionTaskStep[]
  createdAt: number
  updatedAt: number
  finalResult?: string
  isSimulated: boolean
  errorMessage?: string
  artifacts?: MissionArtifact[]
  telemetry?: MissionTelemetry
}
