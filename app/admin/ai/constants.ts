// app/admin/ai/constants.ts

export const DEFAULT_AI_MODEL = 'nvidia/nemotron-3.5-lightning:free'

export const OPENROUTER_MODELS = [
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    name: 'NVIDIA Nemotron 3.5 Lightning (Free - Fast & High Quality)',
    tier: 'Free',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Meta Llama 3.3 70B Instruct (Free)',
    tier: 'Free',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Google Gemini 2.0 Flash Exp (Free)',
    tier: 'Free',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct (Free)',
    tier: 'Free',
  },
  {
    id: 'deepseek/deepseek-chat:free',
    name: 'DeepSeek Chat (Free)',
    tier: 'Free',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini (Paid)',
    tier: 'Paid',
  },
]
