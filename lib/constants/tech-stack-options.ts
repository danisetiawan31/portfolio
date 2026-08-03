export type Tag = {
  id: string
  label: string
}

export const TECH_STACK_OPTIONS: Tag[] = [
  // Languages
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'php', label: 'PHP' },
  { id: 'java', label: 'Java' },
  { id: 'dart', label: 'Dart' },
  { id: 'golang', label: 'Golang' },
  { id: 'css', label: 'CSS' },

  // Frontend
  { id: 'react', label: 'React' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'vite', label: 'Vite' },
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'bootstrap', label: 'Bootstrap' },
  { id: 'redux', label: 'Redux' },
  { id: 'figma', label: 'Figma' },

  // Backend
  { id: 'nodejs', label: 'Node.js' },
  { id: 'express', label: 'Express.js' },
  { id: 'nestjs', label: 'NestJS' },
  { id: 'laravel', label: 'Laravel' },
  { id: 'codeigniter', label: 'CodeIgniter' },

  // Databases
  { id: 'mysql', label: 'MySQL' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'firebase', label: 'Firebase' },
  { id: 'supabase', label: 'Supabase' },

  // Auth / Utils
  { id: 'jwt', label: 'JWT' },
  { id: 'zod', label: 'Zod' },
  { id: 'zustand', label: 'Zustand' },
  { id: 'prisma', label: 'Prisma' },
  { id: 'framermotion', label: 'Framer Motion' },

  // Tools & Infra
  { id: 'docker', label: 'Docker' },
  { id: 'jenkins', label: 'Jenkins' },
  { id: 'git', label: 'Git' },
  { id: 'github', label: 'GitHub' },
  { id: 'postman', label: 'Postman' },
  { id: 'jira', label: 'Jira' },
  { id: 'vercel', label: 'Vercel' },
]
