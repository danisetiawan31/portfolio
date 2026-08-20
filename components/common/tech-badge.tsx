// components/ui/tech-badge.tsx
// Reusable tech icon badge — maps tech name to local SVG icon in /public/icons
// Falls back to default.svg if no match found.

import Image from 'next/image'
import { cn } from '@/lib/utils'

// ── Icon map: normalised tech name → local or remote SVG path ─────────────────
// 1. Local overrides in /public/icons
// 2. Devicon CDN for 100+ technologies (Angular, Redis, Playwright, Vitest, Go, Prisma, etc.)
const LOCAL_ICON_MAP: Record<string, string> = {
  // Languages
  javascript: '/icons/js.svg',
  js: '/icons/js.svg',
  typescript: '/icons/ts.svg',
  ts: '/icons/ts.svg',
  python: '/icons/python.svg',
  php: '/icons/php.svg',
  java: '/icons/java.svg',
  dart: '/icons/dart.svg',
  golang: '/icons/golang.svg',
  go: '/icons/golang.svg',
  css: '/icons/css.svg',

  // Frontend
  react: '/icons/react.svg',
  'react.js': '/icons/react.svg',
  reactjs: '/icons/react.svg',
  redux: '/icons/Redux.svg',
  nextjs:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
  'next.js':
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
  next: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
  flutter: '/icons/Flutter.svg',
  vite: '/icons/vite.svg',
  tailwind: '/icons/tail.svg',
  tailwindcss: '/icons/tail.svg',
  bootstrap: '/icons/bootstrap.svg',
  figma: '/icons/figma.svg',

  // Backend
  nodejs: '/icons/nodejs.svg',
  'node.js': '/icons/nodejs.svg',
  node: '/icons/nodejs.svg',
  express: '/icons/express.svg',
  'express.js': '/icons/express.svg',
  expressjs: '/icons/express.svg',
  nestjs: '/icons/nestjs.svg',
  'nest.js': '/icons/nestjs.svg',
  nest: '/icons/nestjs.svg',
  laravel: '/icons/laravel.svg',
  codeigniter: '/icons/codeigniter.svg',
  codeigniter4: '/icons/codeigniter.svg',
  ci4: '/icons/codeigniter.svg',
  jenkins: '/icons/jenkins.svg',

  // Databases
  mysql: '/icons/mysql.svg',
  postgresql: '/icons/postgresql.svg',
  postgres: '/icons/postgresql.svg',
  mongodb: '/icons/mongodb.svg',
  firebase: '/icons/firebase.svg',
  supabase: '/icons/supabase.svg',
  sqlc: '/icons/sqlc.svg',
  redis:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',

  // Auth / Utils
  jwt: '/icons/jwt.svg',
  zod: '/icons/zod.svg',
  zustand: '/icons/zustand.svg',
  framermotion: '/icons/fm.svg',
  framer: '/icons/fm.svg',

  // Tools
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  github:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  'ci/cd': '/icons/cicd.svg',
  cicd: '/icons/cicd.svg',
  postman: '/icons/postman.svg',
  jira: '/icons/Jira.svg',
  vercel:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
  docker: '/icons/docker.svg',
}

// Devicon CDN mapping for technologies without local SVG
const DEVICON_MAP: Record<string, string> = {
  // Frontend Frameworks
  angular:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
  angularjs:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg',
  vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
  vuejs:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
  'vue.js':
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
  svelte:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
  astro:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original.svg',
  solidjs:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidjs/solidjs-original.svg',
  nuxt: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg',
  nuxtjs:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg',

  // Mobile / Cross-Platform
  reactnative:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'react native':
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  expo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/expo/expo-original.svg',
  ionic:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ionic/ionic-original.svg',

  // Backend & APIs
  fastapi:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
  gin: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gin/gin-original.svg',
  django:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg',
  flask:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg',
  spring:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',
  springboot:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',
  graphql:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
  grpc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/grpc/grpc-original.svg',
  rest: '/icons/rest-api.svg',
  'rest api': '/icons/rest-api.svg',
  restapi: '/icons/rest-api.svg',
  websocket:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg',
  websockets:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg',
  socketio:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg',
  trpc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/trpc/trpc-original.svg',

  // Testing Frameworks
  playwright:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg',
  vitest:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitest/vitest-original.svg',
  jest: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg',
  cypress:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg',
  pest: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',

  // Cloud & DevOps
  githubactions:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg',
  'github actions':
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg',

  // Database & Caching & ORM
  redis:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
  prisma:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
  sqlite:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg',
  mariadb:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mariadb/mariadb-original.svg',
  cassandra:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cassandra/cassandra-original.svg',
  elasticsearch:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg',
  sqlc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',

  // DevOps, Infrastructure & Cloud
  kubernetes:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
  k8s: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg',
  nginx:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg',
  apache:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apache/apache-original.svg',
  aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  gcp: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  azure:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
  terraform:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg',
  cloudflare:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg',
  linux:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
  ubuntu:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-original.svg',

  // Other Languages
  csharp:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
  'c#': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg',
  cplusplus:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  'c++':
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
  c: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
  rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
  kotlin:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
  swift:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg',
  ruby: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
  rails:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rails/rails-plain.svg',
  html: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  html5:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  sass: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
  electron:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg',
  tauri:
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tauri/tauri-original.svg',
}

function normalise(name: string): string {
  return name.toLowerCase().replace(/[\s\-_.]+/g, '')
}

export function resolveTechIcon(tech: string): string {
  const norm = normalise(tech)
  const lower = tech.toLowerCase().trim()

  // 1. Check local icons
  if (LOCAL_ICON_MAP[norm]) return LOCAL_ICON_MAP[norm]
  if (LOCAL_ICON_MAP[lower]) return LOCAL_ICON_MAP[lower]

  // 2. Check curated Devicon registry
  if (DEVICON_MAP[norm]) return DEVICON_MAP[norm]
  if (DEVICON_MAP[lower]) return DEVICON_MAP[lower]

  // 3. Dynamic Devicon fallback pattern: try devicons standard naming
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${norm}/${norm}-original.svg`
}

// ── Component ─────────────────────────────────────────────────────────────────

const SIZE = {
  sm: { img: 16, wrapper: 'h-6 w-6', padding: 'p-1' },
  md: { img: 22, wrapper: 'h-8 w-8', padding: 'p-1.5' },
  lg: { img: 26, wrapper: 'h-10 w-10', padding: 'p-2' },
  xl: { img: 32, wrapper: 'h-12 w-12', padding: 'p-2.5' },
}

interface TechBadgeProps {
  label: string
  /** Show label text alongside icon. Defaults to false (icon-only). */
  showLabel?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function TechBadge({
  label,
  showLabel = false,
  className,
  size = 'md',
}: TechBadgeProps) {
  const iconPath = resolveTechIcon(label)
  const s = SIZE[size]

  if (showLabel) {
    return (
      <span
        title={label}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3 py-1 text-[12px] font-medium text-zinc-600 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-zinc-300',
          className,
        )}
      >
        <Image
          src={iconPath}
          alt={label}
          width={s.img}
          height={s.img}
          unoptimized
          className="flex-shrink-0 object-contain"
        />
        {label}
      </span>
    )
  }

  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        s.wrapper,
        s.padding,
        'inline-flex items-center justify-center rounded-lg border border-zinc-200/80 bg-white shadow-sm transition-transform hover:scale-110 dark:border-zinc-700/60 dark:bg-zinc-900',
        className,
      )}
    >
      <Image
        src={iconPath}
        alt={label}
        width={s.img}
        height={s.img}
        unoptimized
        className="flex-shrink-0 object-contain"
      />
    </span>
  )
}
