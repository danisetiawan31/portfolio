// components/sections/contact.tsx

import {
  IconMail,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMapPin,
} from '@tabler/icons-react'
import { SectionContainer } from '@/components/common/section-container'
import { SectionHeader } from '@/components/common/section-header'
import { ContactForm } from '@/components/sections/contact-form'

// ─── Contact info card ────────────────────────────────────────────────────────

type InfoCardProps = {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

function InfoCard({ icon, label, children }: InfoCardProps) {
  return (
    <div className="border-border bg-card flex items-start gap-4 rounded-xl border p-4">
      <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
        <span className="text-primary">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase">
          {label}
        </p>
        {children}
      </div>
    </div>
  )
}

// ─── ContactInfo (server component) ──────────────────────────────────────────

function ContactInfo() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-heading text-foreground mb-2 text-xl font-bold">
          Let&apos;s work together
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Have a project in mind or just want to say hi? Fill in the form or
          reach out directly — I&apos;ll get back to you as soon as I can.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {/* Email */}
        <InfoCard icon={<IconMail size={18} />} label="Email">
          <a
            href="mailto:dnistwn31@gmail.com"
            className="text-foreground hover:text-primary truncate text-sm font-medium transition-colors"
          >
            dnistwn31@gmail.com
          </a>
        </InfoCard>

        {/* GitHub */}
        <InfoCard icon={<IconBrandGithub size={18} />} label="GitHub">
          <a
            href="https://github.com/danisetiawan31"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary truncate text-sm font-medium transition-colors"
          >
            github.com/danisetiawan31
          </a>
        </InfoCard>

        {/* LinkedIn */}
        <InfoCard icon={<IconBrandLinkedin size={18} />} label="LinkedIn">
          <a
            href="https://linkedin.com/in/ahmaddhanisetiawan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary truncate text-sm font-medium transition-colors"
          >
            linkedin.com/in/ahmaddhanisetiawan
          </a>
        </InfoCard>

        {/* Location */}
        <InfoCard icon={<IconMapPin size={18} />} label="Location">
          <p className="text-foreground text-sm font-medium">
            Jambi, Indonesia
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            {/* Hardcoded available indicator */}
            <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
            <span className="text-muted-foreground text-xs">
              UTC+7 · Open to remote
            </span>
          </div>
        </InfoCard>
      </div>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function ContactSection() {
  return (
    <SectionContainer id="contact">
      <SectionHeader
        title="Contact"
        subtitle="Open to freelance, full-time, and collaboration opportunities."
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr]">
        <ContactInfo />
        <ContactForm />
      </div>
    </SectionContainer>
  )
}
