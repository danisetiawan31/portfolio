// app/admin/skills/_components/sync-skills-button.tsx
'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { syncSkillsFromProjects } from '../actions'

export function SyncSkillsButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSync() {
    setIsLoading(true)
    try {
      const res = await syncSkillsFromProjects()
      if (res.success) {
        if (res.count > 0) {
          toast.success(
            `Berhasil menambahkan ${res.count} skill dari proyek: ${res.added.join(', ')}`,
          )
        } else {
          toast.info(
            'Seluruh tech stack proyek sudah sinkron dengan daftar skills.',
          )
        }
      } else {
        toast.error(res.error || 'Gagal menyinkronkan skill.')
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyinkronkan skill.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isLoading}
      className="border-primary/40 hover:border-primary hover:bg-primary/5 gap-1.5 border-dashed text-xs font-medium transition-all"
      title="Otomatis import semua tech stack dari proyek yang belum ada di skills"
    >
      {isLoading ? (
        <Loader2 className="text-primary size-3.5 animate-spin" />
      ) : (
        <Sparkles className="text-primary size-3.5" />
      )}
      <span>{isLoading ? 'Menyinkronkan...' : 'Sync from Projects'}</span>
    </Button>
  )
}
