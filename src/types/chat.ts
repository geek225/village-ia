import type { AgentKind } from './agent'
import type { AttachedFile, MissionArtifact } from './mission'
import type { AIModel } from './ai'

export interface ChatMessageTelemetry {
  executionMs?: number
  modelName?: string
  providerLabel?: string
  spiritName?: string
  tokensEstimate?: number
  isDebated?: boolean
}

export interface ChatMessage {
  id: string
  sender: 'user' | AgentKind
  senderName: string
  text: string
  timestamp: string
  attachments?: AttachedFile[]
  modelInfo?: AIModel
  isSimulated?: boolean
  error?: boolean
  telemetry?: ChatMessageTelemetry
  artifacts?: MissionArtifact[]
}

export interface QuickPrompt {
  id: string
  label: string
  prompt: string
  category: 'analysis' | 'summary' | 'translation' | 'creative' | 'question'
}
