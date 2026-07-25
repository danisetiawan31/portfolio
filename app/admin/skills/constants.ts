// app/admin/skills/constants.ts

export const VALID_CATEGORIES = [
  'languages',
  'frontend',
  'backend_infra',
  'database',
] as const
export type CategoryType = (typeof VALID_CATEGORIES)[number]
