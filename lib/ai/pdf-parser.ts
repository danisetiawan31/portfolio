// lib/ai/pdf-parser.ts

import { extractText } from 'unpdf'

/**
 * Extracts clean plaintext content from a PDF buffer.
 */
export async function extractTextFromPDF(
  buffer: ArrayBuffer | Uint8Array,
): Promise<string> {
  try {
    const { text } = await extractText(buffer)
    return Array.isArray(text)
      ? text.join('\n\n').trim()
      : String(text || '').trim()
  } catch (error) {
    console.error('[extractTextFromPDF] Error parsing PDF:', error)
    return ''
  }
}
