// lib/utils/parse-tech-stack.ts

export function parseTechStack(input: string): string[] {
  return [
    ...new Set(
      input
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ),
  ]
}
