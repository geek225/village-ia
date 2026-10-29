import { useRef, useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import {
  FileSearch,
  FileText,
  Image as ImageIcon,
  Languages,
  MessageCircle,
  Paperclip,
  Send,
  SlidersHorizontal,
  Square,
} from 'lucide-react'
import type { AttachedFile } from '../../types/mission'
import { extractDocxText, extractPdfText, processImageForVision } from '../../utils/fileExtractor'
import { FileChips } from './FileChips'

interface ChatComposerProps {
  onSendMessage: (text: string, files: AttachedFile[]) => void
  onCancelMission?: () => void
  isMissionRunning: boolean
  onOpenSettings?: () => void
}

interface QuickActionItem {
  id: 'document' | 'image' | 'summary' | 'translate' | 'question'
  label: string
  icon: typeof FileSearch
  prompt: string
  placeholder: string
}

const quickActions: QuickActionItem[] = [
  {
    id: 'document',
    label: 'Analyser un document',
    icon: FileSearch,
    prompt: 'Analyse ce document en détail et extrais les informations importantes, les chiffres clés et un plan d’action.',
    placeholder: 'Joins un PDF/Docx/Txt ou colle le contenu du document à analyser...',
  },
  {
    id: 'image',
    label: 'Analyser une image',
    icon: ImageIcon,
    prompt: 'Analyse cette image en détail : décris les éléments visuels, le texte éventuel, le style et le message clé.',
    placeholder: 'Sélectionne une image à analyser et précise ta question si besoin...',
  },
  {
    id: 'summary',
    label: 'Résumer un texte',
    icon: FileText,
    prompt: 'Résume ce texte en points essentiels : ',
    placeholder: 'Colle ou écris ici le texte à résumer puis appuie sur Entrée...',
  },
  {
    id: 'translate',
    label: 'Traduire un texte',
    icon: Languages,
    prompt: 'Traduis ce texte en français clair et élégant : ',
    placeholder: 'Colle ici le texte à traduire (dans n’importe quelle langue)...',
  },
  {
    id: 'question',
    label: 'Poser une question',
    icon: MessageCircle,
    prompt: '',
    placeholder: 'Pose ta question au Conseil du Village IA (code, stratégie, rédaction, calcul)...',
  },
]

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 Mo
const ALL_ACCEPT = 'application/pdf,image/*,text/*,.pdf,.docx,.doc,.txt,.md,.json,.csv,.xml,.html,.js,.ts,.tsx,.py'
const DOC_ACCEPT = 'application/pdf,text/*,.pdf,.docx,.doc,.txt,.md,.json,.csv,.xml,.html,.js,.ts,.tsx,.py'
const IMG_ACCEPT = 'image/*,.png,.jpg,.jpeg,.webp,.gif,.svg'

export function ChatComposer({
  onSendMessage,
  onCancelMission,
  isMissionRunning,
  onOpenSettings,
}: ChatComposerProps) {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [fileError, setFileError] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [activeActionId, setActiveActionId] = useState<QuickActionItem['id'] | null>(null)
  const [placeholderText, setPlaceholderText] = useState(
    'Écris ta question, demande une analyse, un résumé, une explication...'
  )
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  const isTextLikeFile = (file: File): boolean => {
    const lower = file.name.toLowerCase()
    return (
      file.type.startsWith('text/') ||
      lower.endsWith('.md') ||
      lower.endsWith('.json') ||
      lower.endsWith('.csv') ||
      lower.endsWith('.txt') ||
      lower.endsWith('.xml') ||
      lower.endsWith('.html') ||
      lower.endsWith('.js') ||
      lower.endsWith('.ts') ||
      lower.endsWith('.tsx') ||
      lower.endsWith('.py')
    )
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || [])
    setFileError('')

    if (rawFiles.length === 0) return

    setIsExtracting(true)
    const accepted: AttachedFile[] = []

    try {
      for (const file of rawFiles) {
        if (file.size > MAX_FILE_SIZE) {
          setFileError(`Le fichier ${file.name} dépasse la taille maximale autorisée (15 Mo).`)
          continue
        }

        const lower = file.name.toLowerCase()
        const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf')
        const isDocx =
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          lower.endsWith('.docx')
        const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(lower)
        const isText = isTextLikeFile(file)

        if (!isPdf && !isDocx && !isImage && !isText) {
          setFileError(`Format non pris en charge pour ${file.name} (PDF, DOCX, images, CSV, JSON ou texte acceptés).`)
          continue
        }

        const fileObj: AttachedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          type: isImage ? file.type || 'image/jpeg' : isPdf ? 'application/pdf' : file.type || 'text/plain',
        }

        if (isImage) {
          const visionProfile = await processImageForVision(file)
          fileObj.dataUrl = visionProfile.dataUrl
          fileObj.textContent = visionProfile.summaryText
        } else if (isPdf) {
          fileObj.textContent = await extractPdfText(file)
        } else if (isDocx) {
          fileObj.textContent = await extractDocxText(file)
        } else if (isText) {
          fileObj.textContent = await readFileAsText(file)
        }

        accepted.push(fileObj)
      }

      if (accepted.length > 0) {
        setFiles(curr => [...curr, ...accepted].slice(-4))
        // Si l'entrée était vide, pré-remplir avec une instruction adaptée au type de fichier joint
        if (!input.trim()) {
          const hasImg = accepted.some(f => f.type.startsWith('image/'))
          setInput(
            hasImg
              ? 'Analyse cette image en détail : décris les éléments visuels, le texte éventuel, le style et le message clé.'
              : 'Analyse ce document en détail et extrais les informations importantes, les chiffres clés et un plan d’action.'
          )
        }
        textInputRef.current?.focus()
      }
    } finally {
      setIsExtracting(false)
      if (uploadInputRef.current) {
        uploadInputRef.current.accept = ALL_ACCEPT
        uploadInputRef.current.value = ''
      }
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const handleRemoveFile = (id: string) => {
    setFiles(curr => curr.filter(f => f.id !== id))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && files.length === 0) || isExtracting) return
    const finalPrompt =
      input.trim() ||
      (files.some(f => f.type.startsWith('image/'))
        ? 'Analyse cette image en détail.'
        : 'Analyse ce document et extrais les points clés.')
    onSendMessage(finalPrompt, files)
    setInput('')
    setFiles([])
    setActiveActionId(null)
  }

  const handleQuickPrompt = (action: QuickActionItem) => {
    setActiveActionId(action.id)
    setPlaceholderText(action.placeholder)
    setInput(action.prompt)

    if (action.id === 'document' && uploadInputRef.current) {
      uploadInputRef.current.accept = DOC_ACCEPT
      uploadInputRef.current.click()
    } else if (action.id === 'image' && uploadInputRef.current) {
      uploadInputRef.current.accept = IMG_ACCEPT
      uploadInputRef.current.click()
    }

    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus()
        const len = action.prompt.length
        textInputRef.current.setSelectionRange(len, len)
      }
    }, 30)
  }

  return (
    <div className="chat-composer-area-mockup">
      <FileChips files={files} onRemove={handleRemoveFile} />
      {isExtracting && (
        <div className="file-extracting-banner" role="status">
          ⏳ Lecture et extraction du fichier en cours…
        </div>
      )}
      {fileError && <div className="file-error" role="alert">{fileError}</div>}

      <form className="composer-row-mockup" onSubmit={handleSubmit}>
        <button
          type="button"
          className="composer-icon-btn"
          title="Joindre un fichier PDF, DOCX, image, CSV ou texte"
          onClick={() => {
            if (uploadInputRef.current) {
              uploadInputRef.current.accept = ALL_ACCEPT
              uploadInputRef.current.click()
            }
          }}
          aria-label="Joindre un fichier"
        >
          <Paperclip size={18} />
        </button>

        <input
          ref={textInputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholderText}
          aria-label="Écris ta demande pour le Village IA"
          name="taskPrompt"
          autoComplete="off"
        />

        <button
          type="button"
          className="composer-icon-btn"
          title="Préférences et réglages"
          onClick={onOpenSettings}
          aria-label="Options"
        >
          <SlidersHorizontal size={18} />
        </button>

        {isMissionRunning && onCancelMission ? (
          <button
            type="button"
            className="composer-send-circle"
            onClick={onCancelMission}
            title="Interrompre la mission en cours"
            aria-label="Interrompre la mission"
          >
            <Square size={14} />
          </button>
        ) : (
          <button
            type="submit"
            className="composer-send-circle"
            disabled={(!input.trim() && files.length === 0) || isExtracting}
            aria-label="Envoyer"
          >
            <Send size={16} />
          </button>
        )}
      </form>

      <input
        ref={uploadInputRef}
        type="file"
        accept={ALL_ACCEPT}
        multiple
        hidden
        onChange={handleFileChange}
      />

      <div className="quick-actions-row" aria-label="Raccourcis de requêtes">
        {quickActions.map(action => {
          const Icon = action.icon
          const isActive = activeActionId === action.id
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleQuickPrompt(action)}
              className={`quick-action-pill ${isActive ? 'active-quick-pill' : ''}`}
            >
              <Icon size={14} />
              <span>{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
