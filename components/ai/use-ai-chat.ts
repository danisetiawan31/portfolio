// components/ai/use-ai-chat.ts

'use client'

import { useState, useRef, useCallback } from 'react'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    stopGeneration()
    setMessages([])
    setError(null)
  }, [stopGeneration])

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const messageContent = (textToSend ?? input).trim()
      if (!messageContent || isLoading) return

      setError(null)
      setInput('')

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageContent,
        createdAt: new Date(),
      }

      const assistantMessageId = `assistant-${Date.now()}`
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      setIsLoading(true)

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const apiMessages = newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: apiMessages }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(
            errData.error || `Server responded with status ${response.status}`,
          )
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported in response.')
        }

        // Initialize empty assistant message placeholder
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            createdAt: new Date(),
          },
        ])

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedText += chunk

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulatedText }
                : msg,
            ),
          )
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // User aborted generation — silent
          return
        }
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Gagal terhubung dengan asisten AI. Silakan coba lagi.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [input, isLoading, messages],
  )

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  }
}
