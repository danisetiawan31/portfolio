export type Tag = {
  id: string
  label: string
}

export const TECH_STACK_OPTIONS: Tag[] = [
  // Database seed / legacy data
  { id: 'react', label: 'React' },
  { id: 'laravel', label: 'Laravel' },
  { id: 'mysql', label: 'MySQL' },

  // Added modern stack
  { id: 'nextjs', label: 'Next.js' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'prisma', label: 'Prisma' },
  { id: 'vercel', label: 'Vercel' },
  { id: 'figma', label: 'Figma' },
  { id: 'git', label: 'Git' },
]
