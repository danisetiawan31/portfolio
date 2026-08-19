// lib/github/readme.ts

export interface GitHubRepoInfo {
  owner: string
  repo: string
}

/**
 * Extracts the owner and repository name from a GitHub URL.
 */
export function parseGitHubRepoUrl(url?: string | null): GitHubRepoInfo | null {
  if (!url) return null
  const cleaned = url.trim().replace(/\.git\/?$/, '')
  const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) return null

  return {
    owner: match[1],
    repo: match[2],
  }
}

/**
 * Normalizes relative image and link URLs in GitHub markdown to absolute raw GitHub URLs.
 */
export function normalizeGitHubMarkdown(
  markdown: string,
  owner: string,
  repo: string,
  branch = 'main',
): string {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`

  // Replace markdown images: ![alt](relative/path.png)
  let result = markdown.replace(
    /!\[(.*?)\]\(((?!https?:\/\/|\/|#)(.*?))\)/g,
    (_, alt, path) => `![${alt}](${rawBase}${path.replace(/^\.\//, '')})`,
  )

  // Replace HTML img tags: <img src="relative/path.png" ...>
  result = result.replace(
    /<img([^>]+)src=["']((?!https?:\/\/|\/|#)([^"']+))["']([^>]*)>/g,
    (_, before, path, __, after) =>
      `<img${before}src="${rawBase}${path.replace(/^\.\//, '')}"${after}>`,
  )

  return result
}

/**
 * Fetches the raw README.md markdown content from a GitHub repository.
 * Uses Next.js ISR fetch caching (revalidate: 3600s / 1 hour).
 * Tries main and master branches, case-insensitive filenames, and API fallback.
 */
export async function getProjectReadme(
  githubUrl?: string | null,
): Promise<string | null> {
  const info = parseGitHubRepoUrl(githubUrl)
  if (!info) return null

  const { owner, repo } = info

  // Multi-candidate resolution strategy
  const candidateUrls = [
    {
      url: `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      branch: 'main',
    },
    {
      url: `https://raw.githubusercontent.com/${owner}/${repo}/main/readme.md`,
      branch: 'main',
    },
    {
      url: `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`,
      branch: 'master',
    },
    {
      url: `https://raw.githubusercontent.com/${owner}/${repo}/master/readme.md`,
      branch: 'master',
    },
  ]

  for (const item of candidateUrls) {
    try {
      const res = await fetch(item.url, {
        next: { revalidate: 3600 },
      })
      if (res.ok) {
        const text = await res.text()
        if (text && text.trim().length > 0) {
          return normalizeGitHubMarkdown(text, owner, repo, item.branch)
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // GitHub REST API fallback if raw URL branch differs
  try {
    const apiRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'User-Agent': 'Portfolio-App',
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 },
      },
    )

    if (apiRes.ok) {
      const data = await apiRes.json()
      if (data.download_url) {
        const downloadRes = await fetch(data.download_url, {
          next: { revalidate: 3600 },
        })
        if (downloadRes.ok) {
          const text = await downloadRes.text()
          if (text && text.trim().length > 0) {
            return normalizeGitHubMarkdown(text, owner, repo, 'main')
          }
        }
      }
    }
  } catch {
    // API fallback failed
  }

  return null
}
