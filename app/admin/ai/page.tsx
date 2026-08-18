// app/admin/ai/page.tsx

import { getAISettings } from '@/lib/supabase/queries/ai'
import { AISettingsForm } from './_components/ai-settings-form'

export default async function AdminAIPage() {
  const aiSettings = await getAISettings()

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          AI Assistant Settings
        </h1>
        <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
          Configure OpenRouter API key, model selection, CV knowledge, and
          persona instructions for your portfolio chatbot.
        </p>
      </div>

      <AISettingsForm initialSettings={aiSettings} />
    </div>
  )
}
