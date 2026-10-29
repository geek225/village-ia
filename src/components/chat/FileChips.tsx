import { FileText, Image as ImageIcon, X } from 'lucide-react'
import type { AttachedFile } from '../../types/mission'

export function FileChips({
  files,
  onRemove,
}: {
  files: AttachedFile[]
  onRemove: (id: string) => void
}) {
  if (files.length === 0) return null

  return (
    <div className="attached-files" aria-label="Fichiers joints">
      {files.map(file => {
        const isImage = file.type.startsWith('image/')
        const sizeKb = Math.round(file.size / 1024)
        return (
          <span className="file-chip" key={file.id}>
            {isImage && file.dataUrl ? (
              <img src={file.dataUrl} alt={file.name} style={{ width: 18, height: 18, borderRadius: 3, objectFit: 'cover' }} />
            ) : isImage ? (
              <ImageIcon size={14} />
            ) : (
              <FileText size={14} />
            )}
            <span className="file-chip-name" title={file.name}>
              {file.name} <small>({sizeKb} Ko)</small>
            </span>
            <button
              type="button"
              onClick={() => onRemove(file.id)}
              aria-label={`Retirer le fichier ${file.name}`}
            >
              <X size={13} />
            </button>
          </span>
        )
      })}
    </div>
  )
}
