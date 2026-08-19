import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { MermaidViewer } from '@/components/common/mermaid-viewer'
import { cn } from '@/lib/utils'

interface ProjectCaseStudyProps {
  content: string
  className?: string
}

export function ProjectCaseStudy({
  content,
  className,
}: ProjectCaseStudyProps) {
  return (
    <div
      className={cn(
        'project-case-study border-border/80 bg-card/60 rounded-2xl border p-6 shadow-xs backdrop-blur-xs sm:p-8 md:p-10',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-heading text-foreground border-border/80 mt-8 mb-4 border-b pb-3 text-2xl font-bold tracking-tight first:mt-0 sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading text-foreground border-border/40 mt-8 mb-4 border-b pb-2 text-xl font-semibold tracking-tight sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-foreground mt-6 mb-3 text-lg font-semibold sm:text-xl">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-heading text-foreground mt-4 mb-2 text-base font-semibold">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed sm:text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="text-muted-foreground mb-5 ml-6 list-outside list-disc space-y-2 text-sm sm:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-muted-foreground mb-5 ml-6 list-outside list-decimal space-y-2 text-sm sm:text-base">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-primary/60 bg-muted/30 text-muted-foreground my-5 rounded-r-lg border-l-4 py-2 pl-4 italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isMermaid = className?.includes('language-mermaid')
            if (isMermaid) {
              return <MermaidViewer chart={String(children)} />
            }

            const isBlock = className?.includes('language-')
            if (isBlock) {
              return (
                <code
                  className={cn(
                    'border-border/60 my-4 block overflow-x-auto rounded-lg border bg-zinc-950 p-4 font-mono text-xs text-zinc-100 sm:text-sm dark:bg-zinc-900',
                    className,
                  )}
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className="bg-muted text-foreground border-border/50 rounded-md border px-1.5 py-0.5 font-mono text-xs font-semibold"
                {...props}
              >
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div className="border-border/80 my-6 w-full overflow-x-auto rounded-xl border">
              <table className="text-muted-foreground w-full text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-border/80 bg-muted/50 text-foreground border-b text-xs font-semibold uppercase">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-border/40 border-b px-4 py-3 align-top last:border-b-0">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary decoration-primary/40 hover:decoration-primary font-medium underline underline-offset-4 transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || 'Case study illustration'}
              className="my-1 inline-block h-auto max-w-full rounded-md align-middle"
              loading="lazy"
              {...props}
            />
          ),
          details: ({ children }) => (
            <details className="border-border/70 bg-muted/20 open:bg-muted/30 my-4 rounded-xl border p-4 transition-all">
              {children}
            </details>
          ),
          summary: ({ children }) => (
            <summary className="text-foreground hover:text-primary cursor-pointer py-1 font-semibold transition-colors select-none">
              {children}
            </summary>
          ),
          hr: () => <hr className="border-border/60 my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
