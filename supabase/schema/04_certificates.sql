-- =============================================================================
-- Table: certificates
-- Description: Stores certification/credential entries for the portfolio.
-- Depends on: set_updated_at() trigger function (defined in 01_projects.sql)
-- =============================================================================

CREATE TABLE certificates (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  issuer          text        NOT NULL,
  issue_date      date        NOT NULL,
  image_url       text,
  credential_url  text,
  is_featured     boolean     NOT NULL DEFAULT false,
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER certificates_set_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_public_read"
  ON certificates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX idx_certificates_is_featured   ON certificates (is_featured);
CREATE INDEX idx_certificates_display_order ON certificates (display_order);
