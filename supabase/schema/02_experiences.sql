-- =============================================================================
-- Table: experiences
-- Description: Stores work experience entries for the portfolio timeline.
-- Depends on: set_updated_at() trigger function (defined in 01_projects.sql)
-- =============================================================================

CREATE TABLE experiences (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company       text        NOT NULL,
  role          text        NOT NULL,
  description   text        NOT NULL,
  type          text        NOT NULL,
  tech_stack    text[]      NOT NULL DEFAULT '{}',
  start_date    date        NOT NULL,
  end_date      date,
  is_current    boolean     NOT NULL DEFAULT false,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- Enforce consistency: a current position must not have an end date.
  CONSTRAINT chk_experiences_current_no_end_date
    CHECK (NOT (is_current AND end_date IS NOT NULL))
);

-- =============================================================================
-- Trigger: reuse shared set_updated_at() — do NOT redefine the function here
-- =============================================================================

CREATE TRIGGER experiences_set_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Public read access: anyone (anon or authenticated) can read all rows.
CREATE POLICY "experiences_public_read"
  ON experiences FOR SELECT
  TO anon, authenticated
  USING (true);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX idx_experiences_is_current    ON experiences (is_current);
CREATE INDEX idx_experiences_display_order ON experiences (display_order);
