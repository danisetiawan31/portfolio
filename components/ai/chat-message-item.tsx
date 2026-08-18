// components/ai/chat-message-item.tsx

'use client'

import { useState } from 'react'
import { Bot, User, Copy, Check } from 'lucide-react'
import { type ChatMessage } from './use-ai-chat'

interface ChatMessageItemProps {
  message: ChatMessage
  isStreaming?: boolean
}

/** Simple, fast parser for formatting basic markdown in AI responses without extra heavy dependencies */
function formatMessageContent(content: string) {
  if (!content) return null

  // Split by line breaks
  const lines = content.split('\n')

  return lines.map((line, idx) => {
    // Empty lines
    if (!line.trim()) {
      return <div key={idx} className="h-2" />
    }

    // Header (e.g. ### Header or **Header**)
    if (line.startsWith('### ')) {
      return (
        <h4
          key={idx}
          className="text-foreground mt-2 mb-1 text-xs font-semibold"
        >
          {line.replace('### ', '')}
        </h4>
      )
    }

    // Bullet points
    const isBullet =
      line.trim().startsWith('- ') || line.trim().startsWith('* ')
    const trimmedLine = isBullet ? line.trim().substring(2) : line

    // Parse inline bold **text** and `code`
    const formattedParts = trimmedLine
      .split(/(\*\*.*?\*\*|`.*?`)/g)
      .map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="text-foreground font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={pIdx}
              className="bg-muted text-primary rounded px-1 py-0.5 font-mono text-[11px]"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return part
      })

    if (isBullet) {
      return (
        <li
          key={idx}
          className="text-foreground/90 ml-4 list-disc pl-1 text-xs leading-relaxed"
        >
          {formattedParts}
        </li>
      )
    }

    return (
      <p
        key={idx}
        className="text-foreground/90 my-0.5 text-xs leading-relaxed"
      >
        {formattedParts}
      </p>
    )
  })
}

export function ChatMessageItem({
  message,
  isStreaming,
}: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback silent
    }
  }

  return (
    <div
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} group items-start`}
    >
      {/* Avatar */}
      <div
        className={`flex size-7 shrink-0 items-center justify-center rounded-lg shadow-2xs ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary/10 text-primary border-primary/20 border'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-xs'
            : 'bg-muted/60 dark:bg-muted/40 border-border/70 text-foreground rounded-tl-xs border'
        }`}
      >
        {isUser ? (
          <p className="text-xs leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="space-y-0.5">
            {message.content ? (
              formatMessageContent(message.content)
            ) : isStreaming ? (
              <div className="flex items-center gap-1.5 py-1">
                <span className="bg-primary size-1.5 animate-pulse rounded-full" />
                <span className="bg-primary size-1.5 animate-pulse rounded-full [animation-delay:200ms]" />
                <span className="bg-primary size-1.5 animate-pulse rounded-full [animation-delay:400ms]" />
              </div>
            ) : null}
          </div>
        )}

        {/* Action button (Copy) on Assistant message */}
        {!isUser && message.content && (
          <div className="border-border/40 mt-1.5 flex items-center justify-end gap-1 border-t pt-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[10px] transition-colors"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
