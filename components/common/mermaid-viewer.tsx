// components/common/mermaid-viewer.tsx
'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import mermaid from 'mermaid'
import { cn } from '@/lib/utils'

interface MermaidViewerProps {
  chart: string
  className?: string
}

export function MermaidViewer({ chart, className }: MermaidViewerProps) {
  const { resolvedTheme } = useTheme()
  const [svgHtml, setSvgHtml] = React.useState<string | null>(null)
  const [hasError, setHasError] = React.useState(false)
  const uniqueId = React.useId().replace(/:/g, '')

  React.useEffect(() => {
    let isMounted = true

    async function renderChart() {
      if (!chart || chart.trim().length === 0) return

      try {
        const isDark = resolvedTheme === 'dark'

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          themeVariables: isDark
            ? {
                darkMode: true,
                background: '#09090b',
                // Primary Nodes (Indigo / Electric Violet Glow)
                primaryColor: '#1e1b4b',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#818cf8',
                // Connectors & Arrows (Neon Violet)
                lineColor: '#a78bfa',
                arrowheadColor: '#a78bfa',
                // Secondary Nodes (Emerald / Cyan Glow)
                secondaryColor: '#042f2e',
                secondaryTextColor: '#f0fdf4',
                secondaryBorderColor: '#2dd4bf',
                // Tertiary Nodes (Sky Blue Glow)
                tertiaryColor: '#082f49',
                tertiaryTextColor: '#f0f9ff',
                tertiaryBorderColor: '#38bdf8',
                // Subgraph / Cluster Groups (Tinted Translucent Cards)
                clusterBkg: 'rgba(30, 27, 75, 0.45)',
                clusterBorder: '#6366f1',
                titleColor: '#e0e7ff',
                // Edge labels & Annotations
                edgeLabelBackground: '#09090b',
                nodeTextColor: '#f8fafc',
                mainBkg: '#18181b',
                nodeBorder: '#818cf8',
                fontSize: '13px',
              }
            : {
                darkMode: false,
                background: '#ffffff',
                // Primary Nodes (Soft Violet & Deep Slate)
                primaryColor: '#ede9fe',
                primaryTextColor: '#1e1b4b',
                primaryBorderColor: '#8b5cf6',
                // Connectors & Arrows (Indigo)
                lineColor: '#6366f1',
                arrowheadColor: '#6366f1',
                // Secondary Nodes (Soft Mint / Teal)
                secondaryColor: '#ccfbf1',
                secondaryTextColor: '#042f2e',
                secondaryBorderColor: '#14b8a6',
                // Tertiary Nodes (Soft Sky Blue)
                tertiaryColor: '#e0f2fe',
                tertiaryTextColor: '#082f49',
                tertiaryBorderColor: '#0ea5e9',
                // Subgraph / Cluster Groups
                clusterBkg: 'rgba(238, 242, 255, 0.7)',
                clusterBorder: '#818cf8',
                titleColor: '#312e81',
                // Edge labels & Annotations
                edgeLabelBackground: '#ffffff',
                nodeTextColor: '#18181b',
                mainBkg: '#f4f4f5',
                nodeBorder: '#8b5cf6',
                fontSize: '13px',
              },
        })

        const id = `mermaid-${uniqueId}`
        const { svg } = await mermaid.render(id, chart.trim())
        if (isMounted) {
          setSvgHtml(svg)
          setHasError(false)
        }
      } catch (err) {
        console.warn('[MermaidViewer] Failed to render diagram:', err)
        if (isMounted) {
          setHasError(true)
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
    }
  }, [chart, resolvedTheme, uniqueId])

  if (hasError || !svgHtml) {
    if (!svgHtml && !hasError) {
      return (
        <div className="bg-muted/20 my-6 flex h-36 w-full animate-pulse items-center justify-center rounded-2xl border border-violet-500/20">
          <span className="text-muted-foreground text-xs font-medium">
            Rendering interactive architecture diagram...
          </span>
        </div>
      )
    }

    return (
      <pre className="border-border/80 my-4 overflow-x-auto rounded-xl border bg-zinc-950 p-4 font-mono text-xs text-zinc-100 dark:bg-zinc-900">
        <code>{chart}</code>
      </pre>
    )
  }

  return (
    <div
      className={cn(
        'mermaid-diagram-container from-card/90 via-card/70 to-card/50 [&_.node_rect]:rx-[8px] my-8 flex w-full justify-center overflow-x-auto rounded-2xl border border-violet-500/25 bg-gradient-to-b p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-violet-500/30 dark:bg-zinc-950/60 [&_.node_polygon]:stroke-2 [&_svg]:h-auto [&_svg]:max-w-full',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  )
}
