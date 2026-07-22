import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MoveUpRight } from 'lucide-react'
import { getProjectBySlug } from '@/lib/supabase/queries/projects'
import { SectionContainer } from '@/components/common/section-container'
import { FadeUpOnScroll } from '@/components/common/fade-up-on-scroll'
import { TechBadge } from '@/components/common/tech-badge'
import { ImageLightbox } from '@/components/common/image-lightbox'
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
  return {
    title: `${project.title} - Dani Setiawan`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  // Split title into first word and the rest
  const titleWords = project.title.trim().split(' ')
  const firstWord = titleWords[0]
  const restWords = titleWords.slice(1).join(' ')

  return (
    <SectionContainer className="py-10 md:py-16 lg:py-10">
      <div className="space-y-4 lg:space-y-8">
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
          <header className="border-border border-b pb-4 md:pb-8">
            <h1 className="flex flex-wrap gap-x-2 gap-y-1 text-2xl font-light tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-foreground">{firstWord}</span>
              {restWords && (
                <span className="text-muted-foreground">{restWords}</span>
              )}
            </h1>
          </header>
        </FadeUpOnScroll>

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

        <FadeUpOnScroll delay={0.25}>
          <div className="flex flex-col items-end justify-end py-2 md:py-6">
            <div className="flex w-full flex-col gap-6 lg:w-1/2 lg:gap-8">
              {/* Tech Stack */}
              {project.tech_stack?.length > 0 && (
                <div className="border-border flex flex-col border-b pb-4 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
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
              <div className="border-border flex flex-col border-b pb-4 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
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
      </div>
    </SectionContainer>
  )
}
