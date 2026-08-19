// lib/utils/recruiter-summary.ts

import { type Project } from '@/lib/supabase/queries/projects'
import { type Skill } from '@/lib/supabase/queries/skills'

export interface RecruiterSummaryParams {
  projects?: Project[]
  skills?: Skill[] | string[]
  cvUrl?: string | null
  siteUrl?: string
  candidateName?: string
  role?: string
}

export function generateRecruiterSummary({
  projects = [],
  skills = [],
  cvUrl = '/file/cv.pdf',
  siteUrl = 'https://portfolio-dhani.vercel.app',
  candidateName = 'Ahmad Dhani Setiawan',
  role = 'Fullstack Developer (Next.js, TypeScript, PostgreSQL, Supabase)',
}: RecruiterSummaryParams): string {
  // Extract skill names cleanly
  const skillNames = skills
    .map((s) => (typeof s === 'string' ? s : s.name))
    .slice(0, 10)

  const formattedSkills =
    skillNames.length > 0
      ? skillNames.join(', ')
      : 'Next.js, React, TypeScript, Node.js, PostgreSQL, Supabase, Tailwind CSS, Docker'

  // Extract top 3 projects
  const topProjects = projects.slice(0, 3)
  const formattedProjects =
    topProjects.length > 0
      ? topProjects
          .map(
            (p, idx) => `${idx + 1}. ${p.title}: ${siteUrl}/projects/${p.slug}`,
          )
          .join('\n')
      : `1. Attendance & Workforce Management: ${siteUrl}/projects/attendance-workforce-management-system\n2. Fishing Pond Information System: ${siteUrl}/projects/fishing-pond-information-system\n3. Vehicle Booking & Fleet System: ${siteUrl}/projects/vehicle-booking-system`

  const resolvedCvUrl = cvUrl?.startsWith('http')
    ? cvUrl
    : `${siteUrl}${cvUrl || '/file/cv.pdf'}`

  return `📋 CANDIDATE DOSSIER — ${candidateName.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Role: ${role}
• Experience: 1+ Years (Production Web Apps, SaaS, Workforce Systems)
• Status: Available for Opportunities (Full-time / Remote / Hybrid / On-site)

🛠️ Core Tech Stack:
${formattedSkills}

🏆 Featured Projects:
${formattedProjects}

📄 Resume & Links:
• Portfolio: ${siteUrl}
• Resume (CV): ${resolvedCvUrl}
• GitHub: https://github.com/danisetiawan31
• LinkedIn: https://linkedin.com/in/danisetiawan31
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(Disalin dari ${siteUrl.replace(/^https?:\/\//, '')})`
}
