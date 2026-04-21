// app/admin/page.tsx

import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Projects',
    description: 'Manage portfolio projects, thumbnails, and links.',
    href: '/admin/projects',
  },
  {
    title: 'Experiences',
    description: 'Manage work history and timeline entries.',
    href: '/admin/experiences',
  },
  {
    title: 'Skills',
    description: 'Manage skills grouped by category.',
    href: '/admin/skills',
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Select a section to manage content.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {SECTIONS.map(({ title, description, href }) => (
          <Link
            key={href}
            href={href}
            className="group border-border bg-card text-card-foreground hover:border-primary/50 hover:bg-muted/40 rounded-xl border p-5 transition-all"
          >
            <div className="flex items-start justify-between">
              <p className="font-semibold">{title}</p>
              <span className="text-muted-foreground group-hover:text-primary text-sm transition-colors">
                →
              </span>
            </div>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
