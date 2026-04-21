// app/admin/experiences/constants.ts

export const VALID_TYPES = [
  'full-time',
  'part-time',
  'internship',
  'freelance',
] as const
export type ExperienceType = (typeof VALID_TYPES)[number]
