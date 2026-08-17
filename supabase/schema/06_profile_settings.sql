-- =============================================================================
-- Table: profile_settings
-- Description: Stores single-row global profile settings (e.g. dynamic CV document).
-- Depends on: set_updated_at() trigger function (defined in 01_projects.sql)
-- =============================================================================

CREATE TABLE IF NOT EXISTS profile_settings (
  id           text        PRIMARY KEY DEFAULT 'singleton',
  cv_url       text,
  cv_file_name text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row_check CHECK (id = 'singleton')
);

DROP TRIGGER IF EXISTS profile_settings_set_updated_at ON profile_settings;

CREATE TRIGGER profile_settings_set_updated_at
  BEFORE UPDATE ON profile_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile_settings_public_read" ON profile_settings;

CREATE POLICY "profile_settings_public_read"
  ON profile_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- =============================================================================
-- Storage Bucket: documents
-- Description: Public bucket for CV documents and downloads.
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];
