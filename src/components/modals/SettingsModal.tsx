import { useState } from 'react'
import {
  KeyRound,
  Shield,
  Sparkles,
  X,
  Check,
  CheckCircle2,
  Flame,
  Crown,
  Trash2,
  SlidersHorizontal
} from 'lucide-react'
import { AIRegistry } from '../../services/ai/aiRegistry'
import type { CustomProviderKind, CustomSpiritConfig, ProviderId } from '../../types/ai'

interface SettingsModalProps {
  onClose: () => void
}

const SPIRIT_NAME_SUGGESTIONS = [
  'Masque Poro',
  'Esprit Bagnon',
  'Oracle Sénoufo',
  'Masque Wè',
  'Esprit Dan'
]

const SPIRIT_MASKS: Array<{ image: '/assets/mask-spirit-gold.png' | '/assets/mask-spirit-purple.png' | '/assets/mask-spirit-green.png'; label: string }> = [
  { image: '/assets/mask-spirit-gold.png', label: 'Or Royal' },
  { image: '/assets/mask-spirit-purple.png', label: 'Pourpre Mystique' },
  { image: '/assets/mask-spirit-green.png', label: 'Émeraude Sacrée' }
]

export function SettingsModal({ onClose }: SettingsModalProps) {
  // Clés standards des fournisseurs (la clé .env reste 100% masquée hors du DOM)
  const [apinexKey, setApinexKey] = useState(AIRegistry.getUserApiKey('apinex'))
  const [xkiroKey, setXkiroKey] = useState(AIRegistry.getUserApiKey('xkiro'))
  const [agnesKey, setAgnesKey] = useState(AIRegistry.getUserApiKey('agnes'))
  const [geminiKey, setGeminiKey] = useState(AIRegistry.getUserApiKey('gemini'))
  const [openRouterKey, setOpenRouterKey] = useState(AIRegistry.getUserApiKey('openrouter'))
  const [openAIKey, setOpenAIKey] = useState(AIRegistry.getUserApiKey('openai'))
  const [saved, setSaved] = useState(false)

  // État pour l'invocation d'un Nouvel Esprit (Clé de l'Esprit)
  const [customSpirits, setCustomSpirits] = useState<CustomSpiritConfig[]>(() => AIRegistry.getCustomSpirits())
  const [spiritName, setSpiritName] = useState('')
  const [spiritApiKey, setSpiritApiKey] = useState('')
  const [providerKind, setProviderKind] = useState<CustomProviderKind>('auto')
  const [spiritMask, setSpiritMask] = useState<'/assets/mask-spirit-gold.png' | '/assets/mask-spirit-purple.png' | '/assets/mask-spirit-green.png'>('/assets/mask-spirit-gold.png')
  const [showAdvancedEndpoint, setShowAdvancedEndpoint] = useState(false)
  const [customBaseUrl, setCustomBaseUrl] = useState('')
  const [customModelId, setCustomModelId] = useState('')
  const [invocationFeedback, setInvocationFeedback] = useState<string | null>(null)
  const [invocationError, setInvocationError] = useState<string | null>(null)

  const detectedProvider = AIRegistry.resolveProviderDefaults(spiritApiKey, providerKind)

  const handleInvokeSpirit = () => {
    setInvocationError(null)
    setInvocationFeedback(null)

    if (!spiritName.trim()) {
      setInvocationError('Veuillez donner un nom sacré à votre Esprit (ex: Masque Poro, Oracle Bagnon...).')
      return
    }
    if (spiritApiKey.trim().length < 6) {
      setInvocationError('Veuillez insérer la Clé de l’Esprit (votre clé API) pour l’invoquer.')
      return
    }

    const created = AIRegistry.addCustomSpirit({
      spiritName: spiritName.trim(),
      apiKey: spiritApiKey.trim(),
      providerKind,
      baseUrl: customBaseUrl.trim() || undefined,
      modelId: customModelId.trim() || undefined,
      spiritImage: spiritMask
    })

    setCustomSpirits(AIRegistry.getCustomSpirits())
    setSpiritName('')
    setSpiritApiKey('')
    setCustomBaseUrl('')
    setCustomModelId('')
    setInvocationFeedback(
      `✨ L'Esprit « ${created.spiritName} » (${created.providerLabel}) a été consacré ! Le Roi l'invoquera désormais en priorité.`
    )
  }

  const handleTogglePriority = (id: string) => {
    AIRegistry.toggleCustomSpiritPriority(id)
    setCustomSpirits(AIRegistry.getCustomSpirits())
  }

  const handleRemoveSpirit = (id: string) => {
    AIRegistry.removeCustomSpirit(id)
    setCustomSpirits(AIRegistry.getCustomSpirits())
  }

  const renderProviderBadge = (provider: ProviderId, userValue: string) => {
    if (userValue.trim().length > 5) {
      return (
        <span className="api-status-badge badge-custom">
          <CheckCircle2 size={11} /> Clé personnalisée active
        </span>
      )
    }
    if (AIRegistry.hasEnvApiKey(provider)) {
      return (
        <span className="api-status-badge badge-env-active">
          <span className="badge-live-dot" /> Pré-configuré & Actif
        </span>
      )
    }
    return <span className="api-status-badge badge-optional">Optionnel</span>
  }

  const handleSave = () => {
    // Si l'utilisateur a rempli les champs de l'Esprit sans cliquer sur "Consacrer", on l'invoque automatiquement
    if (spiritName.trim() && spiritApiKey.trim().length >= 6) {
      AIRegistry.addCustomSpirit({
        spiritName: spiritName.trim(),
        apiKey: spiritApiKey.trim(),
        providerKind,
        baseUrl: customBaseUrl.trim() || undefined,
        modelId: customModelId.trim() || undefined,
        spiritImage: spiritMask
      })
    }
    AIRegistry.setApiKey('apinex', apinexKey)
    AIRegistry.setApiKey('xkiro', xkiroKey)
    AIRegistry.setApiKey('agnes', agnesKey)
    AIRegistry.setApiKey('gemini', geminiKey)
    AIRegistry.setApiKey('openrouter', openRouterKey)
    AIRegistry.setApiKey('openai', openAIKey)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="modal-card settings-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge gold-badge">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 id="settings-title">Sanctuaire des Clés & Invocation d’Esprits</h3>
              <p>Invoquez votre propre Esprit IA avec n’importe quelle clé API ou utilisez le sanctuaire pré-configuré.</p>
            </div>
          </div>
          <button className="icon-button modal-close" onClick={onClose} aria-label="Fermer la fenêtre">
            <X size={16} />
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={e => {
            e.preventDefault()
            handleSave()
          }}
        >
          {/* =========================================================================
              RITUEL D'INVOCATION : AJOUTER UNE CLÉ DE L'ESPRIT & NOMMER L'ESPRIT
             ========================================================================= */}
          <div className="spirit-invocation-card">
            <div className="spirit-invocation-header">
              <div className="spirit-invocation-icon">
                <Flame size={18} />
              </div>
              <div>
                <h4>✨ Ajouter une Clé de l’Esprit (Fournisseur connu ou indépendant)</h4>
                <p>
                  Vous possédez déjà une clé API ailleurs (Groq, Mistral, DeepSeek, Claude/OpenRouter, Ollama distant ou autre) ? Donnez un nom sacré à votre Esprit et confiez-lui votre clé.
                </p>
              </div>
            </div>

            <div className="spirit-invocation-grid">
              {/* 1. Nommer l'Esprit */}
              <div className="spirit-field-group">
                <label htmlFor="spirit-custom-name">
                  1. Nommer l’Esprit Sacré
                  <small>Ce nom sera invoqué par Le Roi et affiché sur vos livrables</small>
                </label>
                <input
                  id="spirit-custom-name"
                  name="spiritCustomName"
                  type="text"
                  autoComplete="off"
                  placeholder="Ex : Masque Poro, Esprit Bagnon, Oracle Koutou..."
                  value={spiritName}
                  onChange={e => setSpiritName(e.target.value)}
                />
                <div className="spirit-name-suggestions">
                  <span>Suggestions :</span>
                  {SPIRIT_NAME_SUGGESTIONS.map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      className={`spirit-suggestion-chip ${spiritName === suggestion ? 'active' : ''}`}
                      onClick={() => setSpiritName(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Choisir l'Effigie du Masque */}
              <div className="spirit-field-group">
                <label>
                  2. Choisir l’Effigie du Masque
                  <small>Apparence visuelle de votre Esprit dans le sanctuaire</small>
                </label>
                <div className="mask-effigy-selector">
                  {SPIRIT_MASKS.map(mask => (
                    <button
                      key={mask.image}
                      type="button"
                      className={`mask-effigy-option ${spiritMask === mask.image ? 'selected' : ''}`}
                      onClick={() => setSpiritMask(mask.image)}
                    >
                      <img src={mask.image} alt={mask.label} />
                      <span>{mask.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Insérer la Clé de l'Esprit */}
              <div className="spirit-field-group">
                <label htmlFor="spirit-api-key">
                  <div className="settings-label-header">
                    <span>3. Clé Sacrée de l’Esprit (Votre Clé API)</span>
                    {spiritApiKey.trim().length >= 4 && (
                      <span className="spirit-detected-pill">
                        <Sparkles size={11} /> {detectedProvider.providerLabel}
                      </span>
                    )}
                  </div>
                  <small>Reconnaissance automatique des clés Groq (gsk_...), OpenAI (sk-...), Gemini (AIza...), OpenRouter, xAI ou autre</small>
                </label>
                <input
                  id="spirit-api-key"
                  name="spiritApiKey"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Collez ici la clé secrète de votre Esprit (sk-..., gsk_..., AIza...)"
                  value={spiritApiKey}
                  onChange={e => setSpiritApiKey(e.target.value)}
                />
              </div>

              {/* 4. Origine / Fournisseur (Connu ou Inconnu) */}
              <div className="spirit-field-group">
                <div className="spirit-provider-header-row">
                  <label htmlFor="spirit-provider-kind">
                    4. Origine du Fournisseur IA
                    <small>Choisissez un fournisseur connu ou « Autre fournisseur » pour n’importe quelle API</small>
                  </label>
                  <button
                    type="button"
                    className="spirit-advanced-toggle"
                    onClick={() => setShowAdvancedEndpoint(prev => !prev)}
                  >
                    <SlidersHorizontal size={12} />
                    {showAdvancedEndpoint || providerKind === 'custom_openai'
                      ? 'Masquer URL / Modèle'
                      : 'Personnaliser URL / Modèle'}
                  </button>
                </div>
                <select
                  id="spirit-provider-kind"
                  className="spirit-provider-select"
                  value={providerKind}
                  onChange={e => {
                    const val = e.target.value as CustomProviderKind
                    setProviderKind(val)
                    if (val === 'custom_openai') {
                      setShowAdvancedEndpoint(true)
                    }
                  }}
                >
                  <option value="auto">✨ Auto-détection intelligente selon la clé ({detectedProvider.providerLabel})</option>
                  <option value="xkiro">⚔️ xKiro AI (Qwen 3.8 Max, Qwen Coder Plus, Mistral Large...)</option>
                  <option value="agnes">🔮 Agnes AI (Agnes 2.5 Flash...)</option>
                  <option value="apinex">🏛️ APInex (Gemini 3.8 Flash, DeepSeek V4.1, GLM 5.3...)</option>
                  <option value="groq">⚡ Groq Cloud (Llama 3.3 70B, Mixtral...)</option>
                  <option value="mistral">🌪️ Mistral AI (Mistral Large, Codestral...)</option>
                  <option value="deepseek">🐋 DeepSeek API Officielle (DeepSeek V3 / R1)</option>
                  <option value="openai">🧠 OpenAI (GPT-4o, GPT-4o-mini...)</option>
                  <option value="gemini">💎 Google Gemini (Gemini 2.5 Flash / Pro)</option>
                  <option value="openrouter">🌐 OpenRouter (Claude, Llama, Qwen...)</option>
                  <option value="xai">🔥 xAI (Grok-2)</option>
                  <option value="custom_openai">🛠️ Autre fournisseur connu ou inconnu (URL & Modèle libres)</option>
                </select>
              </div>

              {(showAdvancedEndpoint || providerKind === 'custom_openai') && (
                <div className="spirit-advanced-fields">
                  <div className="spirit-field-group">
                    <label htmlFor="spirit-custom-url">
                      URL du Sanctuaire (Base URL API compatible OpenAI)
                      <small>Par défaut : {detectedProvider.baseUrl}</small>
                    </label>
                    <input
                      id="spirit-custom-url"
                      name="spiritCustomUrl"
                      type="url"
                      autoComplete="off"
                      placeholder={detectedProvider.baseUrl}
                      value={customBaseUrl}
                      onChange={e => setCustomBaseUrl(e.target.value)}
                    />
                  </div>
                  <div className="spirit-field-group">
                    <label htmlFor="spirit-custom-model">
                      Identifiant du Modèle IA
                      <small>Par défaut : {detectedProvider.defaultModel}</small>
                    </label>
                    <input
                      id="spirit-custom-model"
                      name="spiritCustomModel"
                      type="text"
                      autoComplete="off"
                      placeholder={`Ex : ${detectedProvider.defaultModel}`}
                      value={customModelId}
                      onChange={e => setCustomModelId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {invocationError && <div className="spirit-feedback-banner error">{invocationError}</div>}
              {invocationFeedback && <div className="spirit-feedback-banner success">{invocationFeedback}</div>}

              <button type="button" className="invoke-spirit-submit-btn" onClick={handleInvokeSpirit}>
                <Sparkles size={15} />
                <span>Consacrer & Invoquer cet Esprit dans le Village</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              LISTE DES ESPRITS PERSONNELS DÉJÀ INVOQUÉS
             ========================================================================= */}
          {customSpirits.length > 0 && (
            <div className="invoked-spirits-section">
              <div className="invoked-spirits-header">
                <strong>🔥 Vos Esprits Personnels Consacrés ({customSpirits.length})</strong>
                <span>L’Esprit marqué « Prioritaire » répond en premier aux appels du Roi.</span>
              </div>
              <div className="invoked-spirits-list">
                {customSpirits.map(spirit => (
                  <div
                    key={spirit.id}
                    className={`invoked-spirit-item ${spirit.isPrioritized ? 'prioritized' : ''}`}
                  >
                    <img src={spirit.spiritImage} alt={spirit.spiritName} className="invoked-spirit-avatar" />
                    <div className="invoked-spirit-info">
                      <div className="invoked-spirit-title-row">
                        <strong>{spirit.spiritName}</strong>
                        <span className="invoked-spirit-provider-tag">{spirit.providerLabel}</span>
                      </div>
                      <div className="invoked-spirit-meta">
                        <span>Modèle : <code>{spirit.modelId}</code></span>
                        <span>•</span>
                        <span>Clé : <code>{AIRegistry.maskApiKey(spirit.apiKey)}</code></span>
                      </div>
                    </div>
                    <div className="invoked-spirit-actions">
                      <button
                        type="button"
                        className={`spirit-priority-btn ${spirit.isPrioritized ? 'active' : ''}`}
                        onClick={() => handleTogglePriority(spirit.id)}
                        title="Définir comme Esprit prioritaire invoqué par Le Roi"
                      >
                        <Crown size={12} />
                        <span>{spirit.isPrioritized ? 'Esprit Prioritaire' : 'Choisir'}</span>
                      </button>
                      <button
                        type="button"
                        className="spirit-remove-btn"
                        onClick={() => handleRemoveSpirit(spirit.id)}
                        title="Libérer cet Esprit et supprimer sa clé"
                        aria-label={`Libérer ${spirit.spiritName}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              CLÉS SYSTÈME & FOURNISSEURS PRÉ-CONFIGURÉS
             ========================================================================= */}
          <div className="security-notice">
            <Shield size={16} />
            <div>
              <strong>Sanctuaire Pré-configuré & Protection Anti-Fuite (.env)</strong>
              <p>
                Les clés système (<code>.env</code>) sont automatiquement masquées hors du DOM. Vous pouvez aussi renseigner directement les 4 fournisseurs standards ci-dessous.
              </p>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="apinex-key">
              <div className="settings-label-header">
                <span>APInex API Key (Multi-modèles Gratuits)</span>
                {renderProviderBadge('apinex', apinexKey)}
              </div>
              <small>Gemini 3.8 Flash, DeepSeek V4.1, MiniMax, GLM 5.3, GPT-6 Luna</small>
            </label>
            <input
              id="apinex-key"
              name="apinexKey"
              type="password"
              autoComplete="new-password"
              placeholder={
                AIRegistry.hasEnvApiKey('apinex')
                  ? '🔒 Clé système .env active et protégée (laisser vide par défaut)'
                  : 'sk-apx...'
              }
              value={apinexKey}
              onChange={e => setApinexKey(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label htmlFor="xkiro-key">
              <div className="settings-label-header">
                <span>xKiro API Key (Modèles Gratuits & Relais Collaboratif)</span>
                {renderProviderBadge('xkiro', xkiroKey)}
              </div>
              <small>Qwen 3.8 Max, Qwen 3 Coder Plus, Mistral Large 2512, Qwen 3.8 Omni Flash</small>
            </label>
            <input
              id="xkiro-key"
              name="xkiroKey"
              type="password"
              autoComplete="new-password"
              placeholder={
                AIRegistry.hasEnvApiKey('xkiro')
                  ? '🔒 Clé système .env active et protégée (laisser vide par défaut)'
                  : 'sk-xt-...'
              }
              value={xkiroKey}
              onChange={e => setXkiroKey(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label htmlFor="agnes-key">
              <div className="settings-label-header">
                <span>Agnes AI API Key (Oracle Koutou — Relais Multi-Agents)</span>
                {renderProviderBadge('agnes', agnesKey)}
              </div>
              <small>Agnes 2.5 Flash (Synthèse rapide & raisonnement collaboratif)</small>
            </label>
            <input
              id="agnes-key"
              name="agnesKey"
              type="password"
              autoComplete="new-password"
              placeholder={
                AIRegistry.hasEnvApiKey('agnes')
                  ? '🔒 Clé système .env active et protégée (laisser vide par défaut)'
                  : 'sk-...'
              }
              value={agnesKey}
              onChange={e => setAgnesKey(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label htmlFor="gemini-key">
              <div className="settings-label-header">
                <span>Google Gemini API Key</span>
                {renderProviderBadge('gemini', geminiKey)}
              </div>
              <small>Prise en charge native des documents et images</small>
            </label>
            <input
              id="gemini-key"
              name="geminiKey"
              type="password"
              autoComplete="new-password"
              placeholder={
                AIRegistry.hasEnvApiKey('gemini')
                  ? '🔒 Clé système .env active et protégée (laisser vide par défaut)'
                  : 'AIzaSy...'
              }
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label htmlFor="openrouter-key">
              <div className="settings-label-header">
                <span>OpenRouter API Key</span>
                {renderProviderBadge('openrouter', openRouterKey)}
              </div>
              <small>Accès à Llama 3.3 70B, DeepSeek R1, Claude, etc.</small>
            </label>
            <input
              id="openrouter-key"
              name="openRouterKey"
              type="password"
              autoComplete="new-password"
              placeholder={
                AIRegistry.hasEnvApiKey('openrouter')
                  ? '🔒 Clé système .env active et protégée (laisser vide par défaut)'
                  : 'sk-or-v1-...'
              }
              value={openRouterKey}
              onChange={e => setOpenRouterKey(e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label htmlFor="openai-key">
              <div className="settings-label-header">
                <span>OpenAI API Key</span>
                {renderProviderBadge('openai', openAIKey)}
              </div>
              <small>GPT-4o, GPT-4o-mini</small>
            </label>
            <input
              id="openai-key"
              name="openAIKey"
              type="password"
              autoComplete="new-password"
              placeholder={
                AIRegistry.hasEnvApiKey('openai')
                  ? '🔒 Clé système .env active et protégée (laisser vide par défaut)'
                  : 'sk-...'
              }
              value={openAIKey}
              onChange={e => setOpenAIKey(e.target.value)}
            />
          </div>

          <div className="simulation-info-box">
            <Sparkles size={16} />
            <div>
              <strong>Continuité de Service Garantie</strong>
              <p>
                Tant qu’un Esprit Personnel est consacré ou qu’un badge <strong>Pré-configuré & Actif</strong> est affiché, vos missions utilisent directement les modèles IA réels.
              </p>
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="primary-button" onClick={handleSave}>
            {saved ? (
              <>
                <Check size={16} /> Enregistré !
              </>
            ) : (
              'Enregistrer les préférences'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

