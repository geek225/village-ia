import { Activity, Bot, Crown, FileSearch, FileText, Image as ImageIcon, Sparkles, User } from 'lucide-react'
import type { ChatMessage } from '../../types/chat'

interface ChatViewProps {
  messages: ChatMessage[]
  onReturnToVillage?: () => void
}

export function ChatView({ messages, onReturnToVillage }: ChatViewProps) {
  return (
    <div className="full-chat-view">
      <div className="chat-view-header">
        <div>
          <h2>Salon de discussion du Conseil</h2>
          <p>Retrouvez l’historique des échanges, des analyses et des livrables des agents.</p>
        </div>
        {onReturnToVillage && (
          <button className="village-return-btn" onClick={onReturnToVillage}>
            Retourner au Village
          </button>
        )}
      </div>

      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat-state">
            <Bot size={40} strokeWidth={1.5} />
            <h3>Aucune mission n'a encore été confiée au village</h3>
            <p>Posez une question, soumettez un document ou demandez une analyse pour voir les agents se mobiliser.</p>
          </div>
        ) : (
          messages.map(msg => {
            const isUser = msg.sender === 'user'
            return (
              <div
                key={msg.id}
                className={`chat-bubble-row ${isUser ? 'user-row' : 'agent-row-chat'}`}
              >
                <div className={`chat-avatar-icon ${msg.sender}-avatar-bg`}>
                  {msg.sender === 'user' ? (
                    <User size={16} />
                  ) : msg.sender === 'king' ? (
                    <Crown size={16} />
                  ) : msg.sender === 'griot' ? (
                    <Activity size={16} />
                  ) : msg.sender === 'researcher' ? (
                    <FileSearch size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                </div>

                <div className="chat-bubble-content">
                  <div className="chat-bubble-meta">
                    <strong>{msg.senderName}</strong>
                    <time>{msg.timestamp}</time>
                    {msg.isSimulated && (
                      <span className="simulated-pill" title="Réponse fournie via le moteur de simulation local">
                        <Sparkles size={10} /> Simulation locale
                      </span>
                    )}
                    {msg.modelInfo && (
                      <span className="model-pill" title={msg.modelInfo.name}>
                        {msg.modelInfo.spiritName || msg.modelInfo.name}
                      </span>
                    )}
                  </div>

                  {/* Fichiers attachés au message */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="chat-attachments">
                      {msg.attachments.map(att => (
                        <div key={att.id} className="attachment-card">
                          {att.dataUrl ? (
                            <img src={att.dataUrl} alt={att.name} className="attachment-thumb" />
                          ) : att.type.startsWith('image/') ? (
                            <ImageIcon size={20} />
                          ) : (
                            <FileText size={20} />
                          )}
                          <div className="attachment-meta">
                            <span className="attachment-name">{att.name}</span>
                            <small>{Math.round(att.size / 1024)} Ko</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="chat-bubble-text">
                    {msg.text.split('\n\n').map((paragraph, i) => {
                      if (paragraph.startsWith('### ')) {
                        return <h3 key={i}>{paragraph.replace('### ', '')}</h3>
                      }
                      if (paragraph.startsWith('#### ')) {
                        return <h4 key={i}>{paragraph.replace('#### ', '')}</h4>
                      }
                      if (paragraph.startsWith('> ')) {
                        return (
                          <blockquote key={i}>
                            {paragraph.replace('> ', '')}
                          </blockquote>
                        )
                      }
                      return <p key={i}>{paragraph}</p>
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
