-- =============================================================================
-- Migration: 08_projects_star_case_study.sql
-- Description: Adds star_case_study text column to projects table for deep engineering
--              case studies, STAR stories, and architectural trade-offs.
-- =============================================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS star_case_study text;
