// components/sections/hero-clients.tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from 'framer-motion'
import { Download } from 'lucide-react'
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from '@/components/kibo-ui/marquee'
import { type Project } from '@/lib/supabase/queries/projects'
import { type Skill } from '@/lib/supabase/queries/skills'
import { RecruiterSummaryButton } from '@/components/common/recruiter-summary-button'

// ── Data ────────────────────────────────────────────────────────────────────
const techStackLogos = [
  { src: '/icons/php.svg', alt: 'PHP' },
  { src: '/icons/react.svg', alt: 'React' },
  { src: '/icons/ts.svg', alt: 'TypeScript' },
  { src: '/icons/tail.svg', alt: 'Tailwind CSS' },
  { src: '/icons/mysql.svg', alt: 'MySQL' },
  { src: '/icons/postgresql.svg', alt: 'PostgreSQL' },
  { src: '/icons/docker.svg', alt: 'Docker' },
  { src: '/icons/nodejs.svg', alt: 'Node.js' },
  { src: '/icons/python.svg', alt: 'Python' },
  { src: '/icons/postman.svg', alt: 'Postman' },
]

// ── Entrance animation variants ───────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 80, damping: 18 },
  },
}

// ── Moving border button wrapper ──────────────────────────────────────────────
// Renders a conic-gradient that spins around the border.
function MovingBorderButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`moving-border-wrapper relative rounded-full p-[2px] ${className ?? ''}`}
    >
      {/* spinning gradient ring */}
      <span
        aria-hidden
        className="moving-border-ring pointer-events-none absolute inset-0 rounded-full"
      />
      {/* inner content */}
      <div className="relative z-10 rounded-full">{children}</div>
    </div>
  )
}

export default function HeroClient({
  projects,
  skills,
  cvUrl,
  cvFileName,
}: {
  projects: Project[]
  skills?: Skill[]
  cvUrl?: string | null
  cvFileName?: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // ── Smooth spring on scroll ────────────────────────────────────────────────
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
  })

  // ── Hero card transforms ───────────────────────────────────────────────────
  const y1 = useTransform(smoothProgress, [0, 1], [0, 700]) // Bottom card
  const y2 = useTransform(smoothProgress, [0, 1], [0, 500]) // Middle card
  const y3 = useTransform(smoothProgress, [0, 1], [0, 320]) // Top card
  const yTransforms = [y3, y2, y1] // Index 0 (Project A) gets y3

  const opacity = useTransform(smoothProgress, [0.45, 0.85], [1, 0])
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.88])

  const heroCardStyles = [
    { rotate: -2, x: 0, zIndex: 30 }, // Index 0 (Project A) -> Top
    { rotate: 4, x: 40, zIndex: 20 }, // Index 1 (Project B) -> Middle
    { rotate: -6, x: -60, zIndex: 10 }, // Index 2 (Project C) -> Bottom
  ]

  const displayProjects = projects.slice(0, 3)

  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <div
        ref={containerRef}
        className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-between gap-12 px-6 pt-20 lg:flex-row lg:items-start lg:pt-16"
      >
        {/* ── LEFT COLUMN ───────────────────────────────────────────────────── */}
        <motion.div
          className="flex w-full flex-col items-start gap-4 lg:w-1/2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Availability Badge */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2.5 rounded-full border border-black/[0.07] bg-white/80 py-1.5 pr-4 pl-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
              <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[13px] font-medium tracking-tight text-zinc-700 dark:text-zinc-300">
                Available for work
              </span>
            </div>
          </motion.div>

          {/* Heading — line 1 static muted, line 2 animated gradient with float */}
          <motion.h1
            variants={itemVariants}
            className="text-[3.5rem] leading-[1.08] font-semibold tracking-tighter sm:text-[4.5rem] lg:text-[5rem]"
          >
            <span className="text-zinc-400/80 dark:text-zinc-500">
              Full-stack developer
            </span>
            <br />
            {/* Animated gradient text */}
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="hero-gradient-text inline-block"
            >
              who ships real products.
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="max-w-[42ch] text-base leading-relaxed text-zinc-500 dark:text-zinc-400"
          >
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              I design, build, and deliver reliable web applications with
            </span>{' '}
            a focus on scalability, usability, and long-term maintainability.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6 py-2"
          >
            <div className="flex flex-col">
              <span className="text-foreground text-2xl font-bold">1+</span>
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Years Exp.
              </span>
            </div>
            <div className="bg-border h-10 w-px"></div>
            <div className="flex flex-col">
              <span className="text-foreground text-2xl font-bold">8+</span>
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Projects Built
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Download CV — moving border wrapper */}
            <MovingBorderButton>
              <motion.a
                href={cvUrl || '/file/cv.pdf'}
                download={cvFileName || 'CV_Ahmad_Dhani_Setiawan.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:bg-zinc-950"
              >
                {/* shine sweep */}
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-zinc-100/60 transition-transform duration-700 group-hover:translate-x-[200%] dark:bg-white/5"
                />
                <Download className="relative h-[18px] w-[18px] text-zinc-900 dark:text-zinc-100" />
                <span className="relative text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Download CV
                </span>
              </motion.a>
            </MovingBorderButton>

            {/* Recruiter Quick-Packet Button — moving border wrapper */}
            <MovingBorderButton>
              <RecruiterSummaryButton
                projects={projects}
                skills={skills}
                cvUrl={cvUrl}
              />
            </MovingBorderButton>

            {/* GitHub — moving border */}
            <MovingBorderButton>
              <motion.a
                href="https://github.com/danisetiawan31"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white backdrop-blur-sm dark:bg-zinc-950"
              >
                <Image
                  src="/icons/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="h-5 w-5 invert dark:invert-0"
                />
              </motion.a>
            </MovingBorderButton>
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN — project card stack ─────────────────────────────── */}
        {displayProjects.length > 0 && (
          <div className="relative flex h-[480px] w-full flex-col lg:h-[640px] lg:w-1/2">
            {/* Tech Stack Marquee */}
            <div className="mt-4 mb-2 w-full lg:mt-12 lg:mb-2">
              <Marquee className="[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                <MarqueeContent>
                  {techStackLogos.map((logo) => (
                    <MarqueeItem key={logo.alt}>
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={32}
                        height={32}
                        style={{ width: 'auto', height: '2rem' }}
                        className="mx-6 h-8 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 dark:opacity-50 dark:invert"
                      />
                    </MarqueeItem>
                  ))}
                </MarqueeContent>
              </Marquee>
            </div>

            {/* Project Stack */}
            <div className="relative w-full flex-1">
              <div className="absolute inset-0 flex items-center justify-center">
                {displayProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    style={{
                      y: yTransforms[idx % 3],
                      opacity,
                      scale,
                      rotate: heroCardStyles[idx % 3].rotate,
                      x: heroCardStyles[idx % 3].x,
                      zIndex: heroCardStyles[idx % 3].zIndex,
                    }}
                    className="absolute aspect-video w-[88%] overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:w-[80%] dark:border-zinc-800/60 dark:bg-zinc-950"
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="relative block h-full w-full"
                    >
                      {project.thumbnail_url ? (
                        <Image
                          src={project.thumbnail_url}
                          alt={project.title}
                          fill
                          priority={idx === 0}
                          sizes="(max-width: 768px) 90vw, 40vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-50 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                            {project.title}
                          </span>
                          <span className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">
                            Preview
                          </span>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
