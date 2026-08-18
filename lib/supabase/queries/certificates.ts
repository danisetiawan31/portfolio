// lib/supabase/queries/certificates.ts

import { createClient } from '@/lib/supabase/server'
import { type Tables } from '@/types/database'

export type Certificate = Tables<'certificates'>

export async function getPublicCertificates(): Promise<Certificate[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[getPublicCertificates]', error.message)
    return []
  }

  return data ?? []
}
