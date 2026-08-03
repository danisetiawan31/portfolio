-- =============================================================================
-- Migration: alter experiences.description TEXT → TEXT[]
-- Converts existing string data by splitting on newline characters.
-- Empty lines and whitespace-only segments are discarded during conversion.
-- =============================================================================

-- Temp helper function — subquery tidak diizinkan di USING clause ALTER COLUMN,
-- jadi logic split+trim+filter dipindah ke function call (yang diizinkan).
CREATE OR REPLACE FUNCTION _tmp_text_to_bullets(input text)
RETURNS text[]
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result text[] := '{}';
  elem text;
BEGIN
  IF input IS NULL THEN
    RETURN result;
  END IF;

  FOREACH elem IN ARRAY string_to_array(input, E'\n')
  LOOP
    elem := trim(elem);
    IF elem <> '' THEN
      result := array_append(result, elem);
    END IF;
  END LOOP;

  RETURN result;
END;
$$;

ALTER TABLE experiences
  ALTER COLUMN description TYPE text[]
  USING _tmp_text_to_bullets(description);

ALTER TABLE experiences
  ALTER COLUMN description SET NOT NULL;

-- Function ini cuma dipakai sekali untuk migrasi, buang setelah selesai
-- supaya tidak menumpuk function temporary di schema.
DROP FUNCTION _tmp_text_to_bullets(text);