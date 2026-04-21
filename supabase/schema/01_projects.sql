-- =============================================================================
-- Table: projects
-- Description: Stores portfolio project entries with metadata for display.
-- =============================================================================

CREATE TABLE projects (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text        UNIQUE NOT NULL,
  title         text        NOT NULL,
  description   text        NOT NULL,
  tech_stack    text[]      NOT NULL DEFAULT '{}',
  thumbnail_url text,
  live_url      text,
  github_url    text,
  is_featured   boolean     NOT NULL DEFAULT false,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- Trigger: keep updated_at current on every row update
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access: anyone (anon or authenticated) can read all rows.
-- USING (true) is a constant expression — Postgres evaluates it once, not per row.
CREATE POLICY "projects_public_read"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- =============================================================================
-- Indexes
-- Note: slug already has a unique index created implicitly by UNIQUE NOT NULL.
-- =============================================================================

CREATE INDEX idx_projects_is_featured   ON projects (is_featured);
CREATE INDEX idx_projects_display_order ON projects (display_order);
