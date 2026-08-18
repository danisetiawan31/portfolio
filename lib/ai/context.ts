// lib/ai/context.ts

import { getPublicProjects } from '@/lib/supabase/queries/projects'
import { getPublicExperiences } from '@/lib/supabase/queries/experiences'
import { getPublicSkills } from '@/lib/supabase/queries/skills'
import { getPublicCertificates } from '@/lib/supabase/queries/certificates'
import { getAISettings } from '@/lib/supabase/queries/ai'

/**
 * Compiles a rich, token-efficient system prompt containing all portfolio context,
 * work history, projects, skills, certificates, and extracted CV content.
 */
export async function buildSystemPrompt(): Promise<string> {
  const [projects, experiences, skills, certificates, aiSettings] =
    await Promise.all([
      getPublicProjects().catch(() => []),
      getPublicExperiences().catch(() => []),
      getPublicSkills().catch(() => []),
      getPublicCertificates().catch(() => []),
      getAISettings().catch(() => null),
    ])

  // 1. Format Projects
  const projectsText = projects.length
    ? projects
        .map(
          (p) =>
            `- **${p.title}** (${p.slug}): ${p.description}\n  - Tech: ${p.tech_stack.join(', ')}\n  - Live: ${p.live_url || 'N/A'} | GitHub: ${p.github_url || 'N/A'}`,
        )
        .join('\n')
    : 'No projects listed.'

  // 2. Format Experiences
  const experiencesText = experiences.length
    ? experiences
        .map((e) => {
          const bullets = e.description?.length
            ? e.description.map((b) => `    * ${b}`).join('\n')
            : ''
          return `- **${e.role}** at **${e.company}** (${e.type}, ${e.start_date} ~ ${e.is_current ? 'Present' : e.end_date || 'N/A'})\n  - Tech: ${e.tech_stack.join(', ')}${bullets ? `\n${bullets}` : ''}`
        })
        .join('\n')
    : 'No work experience listed.'

  // 3. Format Skills
  const skillsByCategory = skills.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = []
      if (s.is_visible) acc[s.category].push(s.name)
      return acc
    },
    {} as Record<string, string[]>,
  )

  const skillsText = Object.keys(skillsByCategory).length
    ? Object.entries(skillsByCategory)
        .map(([cat, list]) => `- **${cat.toUpperCase()}**: ${list.join(', ')}`)
        .join('\n')
    : 'No skills listed.'

  // 4. Format Certificates
  const certsText = certificates.length
    ? certificates
        .map(
          (c) =>
            `- **${c.title}** issued by **${c.issuer}** (${c.issue_date})${c.credential_url ? ` - [Credential](${c.credential_url})` : ''}`,
        )
        .join('\n')
    : 'No certificates listed.'

  // 5. CV Content & Custom Instructions
  const cvText = aiSettings?.cv_text_content?.trim() || ''
  const customInstructions = aiSettings?.custom_instructions?.trim() || ''

  return `You are the official AI Assistant on the personal portfolio of **Ahmad Dhani Setiawan** (Fullstack Developer).
Your goal is to represent Dhani professionally, accurately answer questions from HR, recruiters, and tech leads, and highlight his skills and achievements.

## PERSONA & COMMUNICATION GUIDELINES:
- **Tone**: Professional, friendly, enthusiastic, concise, and confident.
- **Language**: Respond in the same language as the user's inquiry (Indonesian or English).
- **Format**: Use clear Markdown formatting with bullet points or bold text where appropriate. Keep responses concise (2 to 4 short paragraphs or bulleted points).
- **Grounding & Guardrails**:
  - ONLY state facts provided in the knowledge base below. Do not fabricate or hallucinate details.
  - If asked about topics completely unrelated to Dhani or web development (e.g. general coding homework, politics, unrelated math), politely decline and steer the conversation back to Dhani's experience and portfolio.
  - If asked about contact info, mention that they can reach out via the Contact form or email on this portfolio.

${customInstructions ? `## SPECIAL INSTRUCTIONS FROM DHANI:\n${customInstructions}\n` : ''}

## DHANI'S PORTFOLIO KNOWLEDGE BASE:

### 💼 Work Experiences:
${experiencesText}

### 🚀 Projects:
${projectsText}

### 🛠️ Technical Skills & Toolkit:
${skillsText}

### 📜 Certifications & Credentials:
${certsText}

${
  cvText
    ? `### 📄 Complete Resume / CV Details:
${cvText}`
    : ''
}
`
}
