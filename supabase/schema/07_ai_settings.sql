-- =============================================================================
-- Migration: 07_ai_settings.sql
-- Description: Adds AI configuration columns and extracted CV text to profile_settings.
-- =============================================================================

ALTER TABLE profile_settings
  ADD COLUMN IF NOT EXISTS openrouter_api_key text,
  ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'nvidia/nemotron-3.5-lightning:free',
  ADD COLUMN IF NOT EXISTS cv_text_content text,
  ADD COLUMN IF NOT EXISTS custom_instructions text;

-- Ensure default singleton row exists with the selected default model
INSERT INTO profile_settings (id, ai_model)
VALUES ('singleton', 'nvidia/nemotron-3.5-lightning:free')
ON CONFLICT (id) DO UPDATE SET
  ai_model = COALESCE(profile_settings.ai_model, 'nvidia/nemotron-3.5-lightning:free');
