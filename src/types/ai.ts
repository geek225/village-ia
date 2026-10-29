export type ProviderId =
  | 'openrouter'
  | 'openai'
  | 'gemini'
  | 'apinex'
  | 'xkiro'
  | 'agnes'
  | 'custom_spirit'
  | 'local_simulated'

export type CustomProviderKind =
  | 'auto'
  | 'apinex'
  | 'xkiro'
  | 'agnes'
  | 'gemini'
  | 'openai'
  | 'openrouter'
  | 'groq'
  | 'mistral'
  | 'deepseek'
  | 'xai'
  | 'custom_openai'

export interface CustomSpiritConfig {
  id: string
  spiritName: string
  spiritMeaning?: string
  spiritImage: string
  providerKind: CustomProviderKind
  providerLabel: string
  apiKey: string
  baseUrl: string
  modelId: string
  isPrioritized: boolean
  createdAt: number
}

export interface ModelCapabilities {
  supportsText: boolean
  supportsImages: boolean
  supportsDocuments: boolean
  contextWindow: number
  isFreeOrLowCost: boolean
  speed: 'fast' | 'balanced' | 'deep'
}

export interface AIModel {
  id: string
  name: string
  provider: ProviderId
  providerLabel: string
  description: string
  capabilities: ModelCapabilities
  status: 'available' | 'simulated' | 'quota_exceeded' | 'unavailable'
  tag: string
  spiritName?: string
  spiritOrigin?: string
  spiritHistory?: string
  spiritMeaning?: string
  assignedAiReason?: string
  spiritImage?: string
  isCustomSpirit?: boolean
  customSpiritId?: string
}

export interface AIRequest {
  prompt: string
  files?: {
    name: string
    type: string
    size: number
    dataUrl?: string
    textContent?: string
  }[]
  selectedModelId?: string
  taskType: 'analysis' | 'summary' | 'translation' | 'creative' | 'general'
}

export interface AIResponse {
  text: string
  modelUsed: AIModel
  isSimulated: boolean
  executionTimeMs: number
  metadata?: Record<string, unknown>
}

export interface AIProvider {
  id: ProviderId
  name: string
  isAvailable(): boolean
  getAvailableModels(): Promise<AIModel[]>
  generateResponse(request: AIRequest, model: AIModel): Promise<AIResponse>
}
