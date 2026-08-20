// app/admin/skills/constants.ts

export const VALID_CATEGORIES = [
  'frontend_mobile',
  'backend',
  'database_caching',
  'testing',
  'tools_devops',
] as const

export type CategoryType = (typeof VALID_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  frontend_mobile: 'Frontend & Mobile',
  backend: 'Backend & APIs',
  database_caching: 'Database & Caching',
  testing: 'Testing & QA',
  tools_devops: 'DevOps & Tools',
}

const CATEGORY_MAP: Record<CategoryType, string[]> = {
  frontend_mobile: [
    'react',
    'react.js',
    'reactjs',
    'angular',
    'angularjs',
    'vue',
    'vue.js',
    'vuejs',
    'next.js',
    'nextjs',
    'next',
    'svelte',
    'solidjs',
    'nuxt',
    'nuxtjs',
    'astro',
    'react native',
    'reactnative',
    'expo',
    'flutter',
    'ionic',
    'vite',
    'tailwind',
    'tailwind css',
    'tailwindcss',
    'bootstrap',
    'shadcn',
    'shadcn/ui',
    'figma',
    'framer motion',
    'framermotion',
    'framer',
    'redux',
    'zustand',
    'html',
    'css',
    'sass',
    'javascript',
    'typescript',
    'dart',
  ],
  backend: [
    'nestjs',
    'nest.js',
    'nest',
    'laravel',
    'go',
    'golang',
    'gin',
    'nodejs',
    'node.js',
    'node',
    'express',
    'express.js',
    'expressjs',
    'fastapi',
    'codeigniter',
    'codeigniter 4',
    'codeigniter4',
    'ci4',
    'python',
    'php',
    'java',
    'csharp',
    'c#',
    'cplusplus',
    'c++',
    'c',
    'rust',
    'kotlin',
    'swift',
    'ruby',
    'rails',
    'django',
    'flask',
    'spring',
    'springboot',
    'graphql',
    'grpc',
    'rest api',
    'restapi',
    'rest',
    'websocket',
    'websockets',
    'socketio',
    'jwt',
    'zod',
    'trpc',
  ],
  database_caching: [
    'postgresql',
    'postgres',
    'mysql',
    'redis',
    'supabase',
    'prisma',
    'sqlc',
    'mongodb',
    'firebase',
    'sqlite',
    'mariadb',
    'cassandra',
    'elasticsearch',
    'drizzle',
    'dynamodb',
  ],
  testing: [
    'playwright',
    'vitest',
    'jest',
    'pest',
    'cypress',
    'selenium',
    'supertest',
    'testing library',
  ],
  tools_devops: [
    'docker',
    'ci/cd',
    'cicd',
    'kubernetes',
    'k8s',
    'git',
    'github',
    'github actions',
    'gitlab',
    'bitbucket',
    'nginx',
    'apache',
    'aws',
    'gcp',
    'azure',
    'cloudflare',
    'vercel',
    'jenkins',
    'linux',
    'ubuntu',
    'resend',
    'upstash',
    'jira',
    'trello',
    'postman',
  ],
}

export function inferSkillCategory(tech: string): CategoryType {
  const norm = tech.toLowerCase().replace(/[\s\-_.]+/g, '')
  const clean = tech.toLowerCase().trim()

  for (const [category, keywords] of Object.entries(CATEGORY_MAP) as [
    CategoryType,
    string[],
  ][]) {
    if (
      keywords.some(
        (k) =>
          k.toLowerCase().replace(/[\s\-_.]+/g, '') === norm ||
          k.toLowerCase() === clean,
      )
    ) {
      return category
    }
  }

  // Default fallback if unknown
  return 'tools_devops'
}
