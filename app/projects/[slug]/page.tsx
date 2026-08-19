import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MoveUpRight, Layers } from 'lucide-react'
import {
  getProjectBySlug,
  getAdjacentProjects,
} from '@/lib/supabase/queries/projects'
import { getProjectReadme } from '@/lib/github/readme'
import { SectionContainer } from '@/components/common/section-container'
import { FadeUpOnScroll } from '@/components/common/fade-up-on-scroll'
import { TechBadge } from '@/components/common/tech-badge'
import { ImageLightbox } from '@/components/common/image-lightbox'
import { ProjectCaseStudy } from '@/components/sections/project-case-study'
import { FloatingProjectNav } from '@/components/sections/floating-project-nav'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    return { title: 'Project Not Found' }
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-dhani.vercel.app'

  return {
    title: project.title,
    description: project.description,
    keywords: [
      project.title,
      ...project.tech_stack,
      'Ahmad Dhani Setiawan',
      'Fullstack Project',
      'Engineering Case Study',
    ],
    openGraph: {
      type: 'article',
      title: `${project.title} — Ahmad Dhani Setiawan`,
      description: project.description,
      url: `${siteUrl}/projects/${project.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Ahmad Dhani Setiawan`,
      description: project.description,
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const [readmeContent, { prev, next }] = await Promise.all([
    getProjectReadme(project.github_url),
    getAdjacentProjects(slug),
  ])

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-dhani.vercel.app'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: 'Ahmad Dhani Setiawan',
      url: siteUrl,
    },
    url: `${siteUrl}/projects/${project.slug}`,
    ...(project.live_url ? { downloadUrl: project.live_url } : {}),
    keywords: project.tech_stack.join(', '),
  }

  // Split title into first word and the rest
  const titleWords = project.title.trim().split(' ')
  const firstWord = titleWords[0]
  const restWords = titleWords.slice(1).join(' ')

  return (
    <SectionContainer className="relative py-10 md:py-16 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Floating Center Left & Right Navigation */}
      <FloatingProjectNav prev={prev} next={next} />

      <div className="space-y-4 lg:space-y-8">
        {/* Back Link */}
        <FadeUpOnScroll>
          <div className="mb-5 lg:mb-8">
            <Link
              href="/#projects"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-light transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </div>

          {/* Original Elegant Header */}
          <header className="border-border border-b pb-4 md:pb-8">
            <h1 className="flex flex-wrap gap-x-2 gap-y-1 text-2xl font-light tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-foreground">{firstWord}</span>
              {restWords && (
                <span className="text-muted-foreground">{restWords}</span>
              )}
            </h1>
          </header>
        </FadeUpOnScroll>

        {/* Subtitle & Visit Website Row */}
        <FadeUpOnScroll delay={0.1}>
          <div className="flex flex-col gap-4 font-medium md:flex-row md:items-start md:justify-between">
            <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed whitespace-pre-wrap sm:text-base">
              {project.description}
            </p>
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary mt-2 inline-flex shrink-0 items-center gap-1 text-sm transition-colors hover:underline sm:text-base md:mt-0"
              >
                Visit the website <MoveUpRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="text-muted-foreground/50 mt-2 inline-flex shrink-0 cursor-not-allowed items-center gap-1 text-sm select-none sm:text-base md:mt-0">
                Visit the website <MoveUpRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </FadeUpOnScroll>

        {/* Image Showcase / Lightbox */}
        <FadeUpOnScroll delay={0.15}>
          <div className="border-border mt-2 overflow-hidden rounded-2xl border bg-zinc-100 dark:bg-zinc-900">
            {project.thumbnail_url ? (
              <ImageLightbox
                src={project.thumbnail_url}
                alt={project.title}
                width={1200}
                height={675}
                className="aspect-[16/9] w-full lg:aspect-[16/7]"
                priority
              />
            ) : (
              <div className="flex aspect-[16/9] w-full items-center justify-center lg:aspect-[16/7]">
                <span className="text-muted-foreground text-sm">
                  No preview
                </span>
              </div>
            )}
          </div>
        </FadeUpOnScroll>

        {/* Tech Stack & GitHub Source Code Section */}
        <FadeUpOnScroll delay={0.2}>
          <div className="flex flex-col items-end justify-end py-2 md:py-4">
            <div className="flex w-full flex-col gap-5 lg:w-1/2 lg:gap-6">
              {/* Tech Stack */}
              {project.tech_stack?.length > 0 && (
                <div className="border-border flex flex-col border-b pb-4 sm:flex-row sm:items-center sm:justify-between lg:pb-5">
                  <span className="text-muted-foreground mb-3 shrink-0 text-xs font-medium tracking-wide uppercase sm:mb-0 md:text-sm">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {project.tech_stack.map((tech) => (
                      <TechBadge key={tech} label={tech} showLabel={false} />
                    ))}
                  </div>
                </div>
              )}

              {/* GitHub Link */}
              <div className="border-border flex flex-col border-b pb-4 sm:flex-row sm:items-center sm:justify-between lg:pb-5">
                <span className="text-muted-foreground mb-3 shrink-0 text-xs font-medium tracking-wide uppercase sm:mb-0 md:text-sm">
                  Source Code
                </span>
                {project.github_url ? (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary inline-flex items-center gap-1 text-left text-sm font-light transition-colors sm:text-right sm:text-base sm:font-medium"
                  >
                    {project.title} <MoveUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-muted-foreground/50 inline-flex cursor-not-allowed items-center gap-1 text-left text-sm font-light select-none sm:text-right sm:text-base sm:font-medium">
                    {project.title} <MoveUpRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </FadeUpOnScroll>

        {/* Auto-Fetched GitHub README / Engineering Case Study */}
        {readmeContent && (
          <FadeUpOnScroll delay={0.25}>
            <div className="pt-2">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase sm:text-sm">
                  <Layers className="size-4 text-violet-400" />
                  <span>Engineering Case Study & Documentation</span>
                </div>
                <span className="text-muted-foreground text-[11px] font-medium sm:text-xs">
                  Auto-synced with GitHub README
                </span>
              </div>
              <ProjectCaseStudy content={readmeContent} />
            </div>
          </FadeUpOnScroll>
        )}

        {/* Mobile Adjacent Navigation (Fallback for Mobile/Tablet) */}
        <FadeUpOnScroll delay={0.3}>
          <div className="border-border mt-6 border-t pt-6 lg:hidden">
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link
                  href={`/projects/${prev.slug}`}
                  className="border-border/70 bg-card/40 hover:bg-card flex flex-col gap-0.5 rounded-xl border p-3 transition-colors"
                >
                  <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    ← Previous
                  </span>
                  <span className="text-foreground truncate text-xs font-semibold">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/projects/${next.slug}`}
                  className="border-border/70 bg-card/40 hover:bg-card col-start-2 flex flex-col gap-0.5 rounded-xl border p-3 text-right transition-colors"
                >
                  <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    Next →
                  </span>
                  <span className="text-foreground truncate text-xs font-semibold">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </FadeUpOnScroll>
      </div>
    </SectionContainer>
  )
}
