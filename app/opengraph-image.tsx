import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Ahmad Dhani Setiawan — Fullstack Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          'radial-gradient(circle at 15% 20%, rgba(139, 92, 246, 0.25), transparent 45%), radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.2), transparent 45%)',
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
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: '8px 18px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '9999px',
              backgroundColor: '#10b981',
            }}
          />
          <span
            style={{
              color: '#e4e4e7',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            Available for opportunities
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
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
            Fullstack Developer
          </span>
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
            fontSize: '64px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Ahmad Dhani Setiawan
        </h1>
        <p
          style={{
            fontSize: '32px',
            fontWeight: 500,
            color: '#a1a1aa',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          Building high-performance web apps with Next.js, TypeScript &
          PostgreSQL.
        </p>
      </div>

      {/* Bottom Tech Pills & Domain */}
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
            gap: '12px',
          }}
        >
          {['Next.js 16', 'TypeScript', 'Supabase', 'PostgreSQL', 'Docker'].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  color: '#d4d4d8',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {tech}
              </div>
            ),
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#8b5cf6',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          portfolio-dhani.vercel.app
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
