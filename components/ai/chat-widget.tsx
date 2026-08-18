// components/ai/chat-widget.tsx

'use client'

import { useState, useRef, useEffect } from 'react'
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
import { useAIChat } from './use-ai-chat'
import { ChatMessageItem } from './chat-message-item'
import { QuickPrompts } from './quick-prompts'

export function ChatWidget() {
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
      {/* ── 1. Floating Trigger Button (Bottom Right) ── */}
      <div className="fixed right-5 bottom-5 z-50 flex items-center gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="group border-primary/30 bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/95 focus-visible:ring-ring relative flex items-center gap-2.5 rounded-full border px-4 py-3 shadow-lg backdrop-blur-md transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="Buka Chat AI Assistant"
            >
              {/* Online Pulse Indicator */}
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>

              <Bot className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
              <span className="text-xs font-semibold tracking-wide sm:text-sm">
                Tanya AI
              </span>
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── 2. Chat Window Dialog Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="border-border/80 bg-card/95 fixed right-4 bottom-4 z-50 flex h-[540px] max-h-[85vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl sm:right-6 sm:bottom-6 sm:w-[420px]"
          >
            {/* ── Header ── */}
            <div className="border-border/70 bg-muted/40 flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-xl border shadow-2xs">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-foreground text-xs font-bold sm:text-sm">
                      Dhani AI Assistant
                    </h3>
                    <span className="py-0.2 rounded-full bg-emerald-500/10 px-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Online
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Jawaban instan seputar pengalaman & CV
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
                    title="Hapus percakapan"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
                  aria-label="Tutup chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* ── Message Scroll Body ── */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="space-y-4 pt-2">
                  {/* Welcome banner */}
                  <div className="border-border/60 bg-muted/30 flex flex-col items-center justify-center rounded-xl border p-4 text-center">
                    <div className="bg-primary/10 text-primary border-primary/20 mb-2 flex size-10 items-center justify-center rounded-2xl border">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="text-foreground text-sm font-semibold">
                      Ada yang bisa saya bantu?
                    </h4>
                    <p className="text-muted-foreground mt-1 max-w-[280px] text-xs leading-relaxed">
                      Saya dapat menjawab informasi mengenai keahlian teknis,
                      detail proyek, riwayat kerja, dan isi lengkap CV Dhani.
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
                <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-2.5 rounded-xl border p-3 text-xs">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Terjadi kendala</p>
                    <p className="mt-0.5 opacity-90">{error}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Bar ── */}
            <div className="border-border/80 bg-card border-t p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan untuk AI..."
                  disabled={isLoading}
                  className="bg-muted/50 border-border/80 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-10 flex-1 rounded-xl border px-3.5 text-xs transition-all outline-none focus-visible:ring-2 disabled:opacity-50"
                />

                {isLoading ? (
                  <Button
                    type="button"
                    onClick={stopGeneration}
                    size="sm"
                    variant="destructive"
                    className="h-10 gap-1 rounded-xl px-3 text-xs"
                    title="Hentikan respons"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                    <span className="hidden sm:inline">Stop</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim()}
                    className="h-10 w-10 shrink-0 rounded-xl p-0"
                    title="Kirim pesan"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </form>

              <p className="text-muted-foreground mt-2 text-center text-[10px]">
                Didukung OpenRouter AI • Data sinkron langsung dengan portfolio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
