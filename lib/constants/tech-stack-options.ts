export type Tag = {
  id: string
  label: string
}

export const TECH_STACK_OPTIONS: Tag[] = [
  // Languages
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'go', label: 'Go' },
  { id: 'python', label: 'Python' },
  { id: 'php', label: 'PHP' },

  // Frontend
  { id: 'nextjs', label: 'Next.js' },
  { id: 'react', label: 'React' },
  { id: 'angular', label: 'Angular' },
  { id: 'vuejs', label: 'Vue.js' },
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'spartanui', label: 'Spartan UI' },
  { id: 'vite', label: 'Vite' },

  // Backend
  { id: 'nestjs', label: 'NestJS' },
  { id: 'laravel', label: 'Laravel' },
  { id: 'fastapi', label: 'FastAPI' },
  { id: 'codeigniter4', label: 'CodeIgniter 4' },
  { id: 'websocket', label: 'WebSocket' },

  // Databases & ORM
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mysql', label: 'MySQL' },
  { id: 'redis', label: 'Redis' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'prisma', label: 'Prisma' },
  { id: 'sqlc', label: 'sqlc' },

  // Testing & QA
  { id: 'playwright', label: 'Playwright' },
  { id: 'vitest', label: 'Vitest' },
  { id: 'jest', label: 'Jest' },
  { id: 'pest', label: 'Pest' },

  // Tools & Infrastructure
  { id: 'docker', label: 'Docker' },
  { id: 'cicd', label: 'CI/CD' },
  { id: 'git', label: 'Git' },
  { id: 'postman', label: 'Postman' },
  { id: 'linux', label: 'Linux' },
]
