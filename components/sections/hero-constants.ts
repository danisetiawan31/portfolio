// components/sections/hero-constants.ts

export type TokenType =
  | 'comment'
  | 'keyword'
  | 'function'
  | 'string'
  | 'default'
  | 'highlight'

export type CodeToken = {
  text: string
  type: TokenType
}

export type CodeLine = {
  parts: CodeToken[]
  highlighted?: boolean
}

export type StatItem = {
  value: string
  label: string
}

export const HERO_CONTENT = {
  badge: 'Available for work',

  heading: {
    line1: 'Fullstack',
    line2: 'Developer',
  },

  description:
    'Building fast, scalable web apps with Next.js, TypeScript, and Supabase. Focused on clean architecture and great user experience.',

  links: {
    cv: '#',
    github: '#',
    linkedin: '#',
    email: '#',
  },

  stats: [
    { value: '8+', label: 'Projects' },
    { value: '2y', label: 'Experience' },
    { value: '10+', label: 'Tech Stack' },
  ] satisfies StatItem[],

  codeSnippet: [
    {
      parts: [{ text: '// GET /api/projects', type: 'comment' as TokenType }],
    },
    {
      parts: [
        { text: 'export async function ', type: 'keyword' as TokenType },
        { text: 'GET', type: 'function' as TokenType },
        { text: '() {', type: 'default' as TokenType },
      ],
    },
    {
      highlighted: true,
      parts: [
        { text: '  const supabase = ', type: 'default' as TokenType },
        { text: 'createClient', type: 'function' as TokenType },
        { text: '()', type: 'default' as TokenType },
      ],
    },
    {
      parts: [
        { text: '  const { data } = ', type: 'default' as TokenType },
        { text: 'await', type: 'keyword' as TokenType },
        { text: ' supabase', type: 'default' as TokenType },
      ],
    },
    {
      parts: [
        { text: '    .from(', type: 'default' as TokenType },
        { text: "'projects'", type: 'string' as TokenType },
        { text: ')', type: 'default' as TokenType },
      ],
    },
    {
      parts: [{ text: "    .select('*')", type: 'default' as TokenType }],
    },
    {
      parts: [
        { text: '    .order(', type: 'default' as TokenType },
        { text: "'display_order'", type: 'string' as TokenType },
        { text: ')', type: 'default' as TokenType },
      ],
    },
    {
      parts: [
        { text: '  return ', type: 'keyword' as TokenType },
        { text: 'NextResponse', type: 'function' as TokenType },
        { text: '.json(data)', type: 'default' as TokenType },
      ],
    },
    {
      parts: [{ text: '}', type: 'default' as TokenType }],
    },
  ] satisfies CodeLine[],
} as const
