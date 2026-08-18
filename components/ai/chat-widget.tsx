// components/ai/chat-widget.tsx

'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  X,
  Send,
  Square,
  Sparkles,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMounted } from '@/lib/hooks/use-mounted'
import { useAIChat } from './use-ai-chat'
import { ChatMessageItem } from './chat-message-item'
import { QuickPrompts } from './quick-prompts'

export function ChatWidget() {
  const mounted = useMounted()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  } = useAIChat()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [isOpen])

  // Do not render before mount or on admin pages
  if (!mounted || pathname?.startsWith('/admin')) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage()
  }

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <>
      {/* ── 1. Minimalist Floating Trigger Button (Bottom Right) ── */}
      <div className="pointer-events-auto fixed right-5 bottom-5 z-[6000] flex items-center sm:right-6 sm:bottom-6">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(true)}
              className="group border-primary/30 bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/95 focus-visible:ring-ring relative flex size-12 cursor-pointer items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:size-13"
              aria-label="Tanya AI Assistant"
              title="Tanya AI Assistant"
            >
              {/* Online Pulse Indicator */}
              <span className="absolute top-0 right-0 flex size-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="border-background relative inline-flex size-3.5 rounded-full border-2 bg-emerald-400" />
              </span>

              <Bot className="size-5 transition-transform duration-200 group-hover:scale-110 sm:size-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── 2. Chat Window Dialog Modal (Mobile-Friendly) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="border-border/80 bg-card/95 pointer-events-auto fixed inset-x-3 bottom-3 z-[6000] flex h-[520px] max-h-[82vh] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
          >
            {/* ── Header ── */}
            <div className="border-border/70 bg-muted/40 flex items-center justify-between border-b px-3.5 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2.5">
                <div className="border-primary/20 bg-primary/10 text-primary flex size-8 items-center justify-center rounded-xl border shadow-2xs">
                  <Bot className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-foreground text-xs font-bold sm:text-sm">
                      Dhani AI Assistant
                    </h3>
                    <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Online
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Jawaban instan seputar profil & CV
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    className="text-muted-foreground hover:text-foreground size-8 rounded-lg"
                    title="Hapus percakapan"
                  >
                    <RotateCcw className="size-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground size-8 rounded-lg"
                  aria-label="Tutup chat"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {/* ── Message Scroll Body ── */}
            <div className="flex-1 space-y-3.5 overflow-y-auto p-3.5 sm:p-4">
              {messages.length === 0 ? (
                <div className="space-y-3.5 pt-1">
                  {/* Welcome banner */}
                  <div className="border-border/60 bg-muted/30 flex flex-col items-center justify-center rounded-xl border p-3.5 text-center sm:p-4">
                    <div className="border-primary/20 bg-primary/10 text-primary mb-2 flex size-9 items-center justify-center rounded-xl border">
                      <Sparkles className="size-4.5" />
                    </div>
                    <h4 className="text-foreground text-xs font-semibold sm:text-sm">
                      Ada yang bisa saya bantu?
                    </h4>
                    <p className="text-muted-foreground mt-1 max-w-[280px] text-[11px] leading-relaxed sm:text-xs">
                      Tanyakan apa saja seputar keahlian teknis, detail proyek,
                      pengalaman kerja, atau ringkasan CV Dhani.
                    </p>
                  </div>

                  {/* Quick Prompts */}
                  <QuickPrompts
                    onSelectPrompt={handleSelectPrompt}
                    disabled={isLoading}
                  />
                </div>
              ) : (
                messages.map((message, idx) => (
                  <ChatMessageItem
                    key={message.id}
                    message={message}
                    isStreaming={
                      isLoading &&
                      idx === messages.length - 1 &&
                      message.role === 'assistant'
                    }
                  />
                ))
              )}

              {/* Error banner */}
              {error && (
                <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2.5 rounded-xl border p-3 text-xs">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Terjadi kendala</p>
                    <p className="mt-0.5 opacity-90">{error}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Bar ── */}
            <div className="border-border/80 bg-card border-t p-2.5 sm:p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan untuk AI..."
                  disabled={isLoading}
                  className="border-border/80 bg-muted/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-9.5 flex-1 rounded-xl border px-3.5 text-xs transition-all outline-none focus-visible:ring-2 disabled:opacity-50 sm:h-10"
                />

                {isLoading ? (
                  <Button
                    type="button"
                    onClick={stopGeneration}
                    size="sm"
                    variant="destructive"
                    className="h-9.5 gap-1 rounded-xl px-3 text-xs sm:h-10"
                    title="Hentikan respons"
                  >
                    <Square className="size-3.5 fill-current" />
                    <span className="hidden sm:inline">Stop</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim()}
                    className="size-9.5 shrink-0 rounded-xl p-0 sm:size-10"
                    title="Kirim pesan"
                  >
                    <Send className="size-4" />
                  </Button>
                )}
              </form>

              <p className="text-muted-foreground mt-1.5 text-center text-[10px]">
                Didukung OpenRouter AI • Terhubung langsung dengan portfolio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
