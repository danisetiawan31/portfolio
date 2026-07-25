-- =============================================================================
-- Table: skills
-- Description: Stores skill entries grouped by category for the portfolio.
-- Depends on: set_updated_at() trigger function (defined in 01_projects.sql)
-- =============================================================================

CREATE TABLE skills (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  category      text        NOT NULL CHECK (category IN ('languages', 'frontend', 'backend_infra', 'database')),
  is_visible    boolean     NOT NULL DEFAULT true,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- Prevent duplicate skill names entirely.
  CONSTRAINT uq_skills_name UNIQUE (name)
);

-- Trigger: reuse shared set_updated_at() — do NOT redefine the function here
-- =============================================================================

CREATE TRIGGER skills_set_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Row Level Security
-- =============================================================================

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public read access: anyone (anon or authenticated) can read all rows.
CREATE POLICY "skills_public_read"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes
-- Note: UNIQUE (name, category) implicitly creates an index on that pair.
-- =============================================================================

CREATE INDEX idx_skills_category      ON skills (category);
CREATE INDEX idx_skills_display_order ON skills (display_order);
