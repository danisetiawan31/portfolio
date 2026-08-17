import Link from 'next/link'
import { createServiceRoleClient } from '@/lib/supabase/server'
import {
  FolderKanban,
  Briefcase,
  Wrench,
  Award,
  FileText,
  ArrowRight,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = createServiceRoleClient()

  const [
    { count: projectsCount },
    { count: experiencesCount },
    { count: skillsCount },
    { count: certificatesCount },
    { data: profileSettings },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase
      .from('profile_settings')
      .select('cv_url, updated_at')
      .eq('id', 'singleton')
      .maybeSingle(),
  ])

  const sections = [
    {
      title: 'Projects',
      count: `${projectsCount ?? 0} items`,
      description: 'Manage portfolio projects, thumbnails, and links.',
      href: '/admin/projects',
      icon: FolderKanban,
    },
    {
      title: 'Experiences',
      count: `${experiencesCount ?? 0} roles`,
      description: 'Manage work history and timeline entries.',
      href: '/admin/experiences',
      icon: Briefcase,
    },
    {
      title: 'Skills',
      count: `${skillsCount ?? 0} skills`,
      description: 'Manage technical skills grouped by category.',
      href: '/admin/skills',
      icon: Wrench,
    },
    {
      title: 'Certificates',
      count: `${certificatesCount ?? 0} creds`,
      description: 'Manage certifications and credentials.',
      href: '/admin/certificates',
      icon: Award,
    },
    {
      title: 'CV / Resume',
      count: profileSettings?.cv_url ? 'Active CV' : 'Default',
      description: 'Upload and manage dynamic CV document for portfolio.',
      href: '/admin/cv',
      icon: FileText,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
          Overview and content control for your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ title, count, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group border-border bg-card text-card-foreground hover:border-primary/50 hover:bg-muted/30 flex flex-col justify-between rounded-xl border p-4 shadow-2xs transition-all sm:p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">{title}</p>
                </div>
                <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
                  {count}
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-xs leading-relaxed sm:text-sm">
                {description}
              </p>
            </div>

            <div className="text-primary mt-4 flex items-center gap-1 text-xs font-medium">
              Manage {title.toLowerCase()}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
