import type { MetadataRoute } from 'next'
import { getPublicProjects } from '@/lib/supabase/queries/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://dhanisetiawan.dev'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  try {
    const projects = await getPublicProjects()
    const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(
        project.updated_at || project.created_at || new Date(),
      ),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    return [...staticRoutes, ...projectUrls]
  } catch {
    return staticRoutes
  }
}
