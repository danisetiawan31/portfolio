import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/supabase/queries/projects'

export const alt = 'Project Showcase — Ahmad Dhani Setiawan'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  const title = project?.title || 'Featured Project'
  const description =
    project?.description ||
    'A selected fullstack project built with modern web technologies.'
  const techStack = project?.tech_stack?.slice(0, 5) || [
    'Next.js',
    'TypeScript',
    'PostgreSQL',
  ]

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#09090b',
        padding: '60px 70px',
        fontFamily: 'sans-serif',
        backgroundImage:
          'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3), transparent 50%), radial-gradient(circle at 10% 90%, rgba(59, 130, 246, 0.2), transparent 45%)',
      }}
    >
      {/* Top Header Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '9999px',
            padding: '8px 18px',
          }}
        >
          <span
            style={{
              color: '#c4b5fd',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Project Case Study
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#a1a1aa',
            fontSize: '18px',
            fontWeight: 500,
          }}
        >
          Ahmad Dhani Setiawan Portfolio
        </div>
      </div>

      {/* Main Center Headline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontSize: '60px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '24px',
            fontWeight: 400,
            color: '#a1a1aa',
            lineHeight: 1.4,
            margin: 0,
            maxWidth: '950px',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </p>
      </div>

      {/* Bottom Tech Pills & Branding */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {techStack.map((tech) => (
            <div
              key={tech}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '6px 14px',
                color: '#e4e4e7',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#8b5cf6',
            fontSize: '22px',
            fontWeight: 700,
          }}
        >
          dhanisetiawan.dev
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
