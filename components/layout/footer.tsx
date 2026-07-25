// components/layout/footer.tsx

import Link from 'next/link'
import { NAV_ITEMS, SOCIAL_LINKS } from '@/components/layout/constants'

export default function Footer() {
  return (
    <footer className="border-border/60 relative mt-20 flex flex-col items-center overflow-hidden border-t pt-16">
      {/* Container for links and text */}
      <div className="relative z-10 container mx-auto flex flex-col items-center gap-8 px-4 md:px-6">
        {/* Navigation & Social row */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              {social.name}
              <span
                className="opacity-70 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              >
                {social.icon}
              </span>
            </a>
          ))}
        </nav>

        {/* Small muted text */}
        <p className="text-muted-foreground text-xs font-medium">
          Built with Next.js and Supabase
        </p>
      </div>

      {/* Wordmark */}
      <div
        className="text-primary mt-16 -mb-4 w-full text-center leading-[0.85] select-none sm:-mb-6 md:-mb-8 md:leading-[0.75]"
        style={{
          fontSize: 'clamp(120px, 26vw, 400px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 30%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        dhani
      </div>
    </footer>
  )
}
