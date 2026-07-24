// app/page.tsx
import { Navbar } from '@/components/layout/navbar'
import HeroSection from '@/components/sections/hero'
import ProjectsSection from '@/components/sections/projects'
import ExperiencesSection from '@/components/sections/experiences'
import SkillsSection from '@/components/sections/skills'
import CertificatesSection from '@/components/sections/certificates'
import ContactSection from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <ExperiencesSection />
        <SkillsSection />
        <CertificatesSection />
        <ContactSection />
      </main>
    </>
  )
}
