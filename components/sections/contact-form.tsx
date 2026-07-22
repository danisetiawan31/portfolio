'use client'

// components/sections/contact-form.tsx

import { useState, FormEvent } from 'react'
import { IconLoader2, IconCheck } from '@tabler/icons-react'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const INITIAL: FormState = { name: '', email: '', subject: '', message: '' }

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Something went wrong.')
      }

      setStatus('success')
      setForm(INITIAL)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border-border bg-card flex min-h-[340px] flex-col items-center justify-center gap-3 rounded-2xl border p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <IconCheck size={22} className="text-primary" />
        </div>
        <h3 className="font-heading text-foreground text-lg font-bold">
          Message sent!
        </h3>
        <p className="text-muted-foreground max-w-xs text-sm">
          Thanks for reaching out. I&apos;ll get back to you as soon as
          possible.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary hover:text-primary/80 mt-2 text-sm font-medium underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  const isLoading = status === 'loading'

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50'
  const labelClass = 'text-foreground mb-1.5 block text-sm font-medium'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Name + Email row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClass}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          placeholder="What's this about?"
          value={form.subject}
          onChange={handleChange}
          disabled={isLoading}
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="Your message..."
          value={form.message}
          onChange={handleChange}
          disabled={isLoading}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Error */}
      {status === 'error' && errorMsg && (
        <p className="text-destructive text-sm" role="alert">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
      >
        {isLoading && <IconLoader2 size={16} className="animate-spin" />}
        {isLoading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
