// app/page.tsx
import { Navbar } from '@/components/layout/navbar'
import HeroSection from '@/components/sections/hero'
import ProjectsSection from '@/components/sections/projects'
import ExperiencesSection from '@/components/sections/experiences'
import SkillsSection from '@/components/sections/skills'
import CertificatesSection from '@/components/sections/certificates'
import ContactSection from '@/components/sections/contact'
import Footer from '@/components/layout/footer'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-dhani.vercel.app'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ahmad Dhani Setiawan',
  alternateName: 'Dhani Setiawan',
  url: siteUrl,
  jobTitle: 'Fullstack Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance & Open Source',
  },
  sameAs: [
    'https://github.com/danisetiawan31',
    'https://linkedin.com/in/danisetiawan31',
  ],
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'JavaScript',
    'PostgreSQL',
    'Supabase',
    'Tailwind CSS',
    'Node.js',
    'Fullstack Web Development',
  ],
  description:
    'Fullstack Developer specializing in building scalable web applications with Next.js, TypeScript, PostgreSQL, and Supabase.',
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <ExperiencesSection />
        <SkillsSection />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
