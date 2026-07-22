# AGENTS.md — Web Portfolio Profesional Dhani

## Overview

Portfolio pribadi untuk melamar kerja sebagai Fullstack Developer. Target pembaca: HR dan tech lead. Setiap keputusan teknis difilter lewat satu pertanyaan: apakah ini kasih nilai nyata ke orang yang buka portfolio ini dalam waktu singkat?

## Tech stack

1. Core — Next.js (App Router), TypeScript (Strict Mode)
2. UI — shadcn/ui, Tailwind CSS
3. Theme — next-themes (Light/Dark Mode)
4. Database & Backend — Supabase (PostgreSQL, Authentication, Storage)
5. Data Fetching — React Server Components, fetch langsung dari Server Components, tanpa API layer tambahan untuk operasi read
6. AI Assistant — Vercel AI SDK (useChat), OpenRouter
7. Rate Limiting (AI Endpoint) — Upstash Redis
8. Testing — Playwright (E2E), Vitest (Unit)
9. Email (Contact Form) — Resend
10. Animation — Framer Motion
11. Deployment — Vercel

**Dieliminasi dari scope:** GitHub Activity section — setup rumit, benefit rendah.

> Status pengerjaan tiap item (sudah aktif / belum dimulai) dilacak di `workflow/backlog.md` dan `workflow/done.md`, bukan di sini — supaya tidak ada dua tempat yang harus disinkronkan manual tiap kali progres berubah.

## Konvensi

### Struktur folder

Flat, tidak pakai route group Next.js. `app/admin/...` langsung, homepage di `app/page.tsx` langsung.

### Supabase

- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — server + admin client
  - `createServiceRoleClient()` — bypass RLS, dipakai untuk SEMUA operasi admin (DB + storage)
  - `createAdminClient()` — khusus auth
- Types di `types/database.ts` — generated via Supabase CLI, jangan diedit manual
- Schema SQL di `supabase/schema/`, satu file per tabel
- RLS aktif semua tabel, public read only

### Auth

- Supabase Auth, single admin user (tidak ada role/tier lain).
- Proteksi route `/admin/*` dilakukan di `middleware.ts` (root project) — cek session via `supabase.auth.getUser()`, redirect ke `/admin/login` kalau tidak ada user, dan redirect user yang sudah login menjauh dari `/admin/login`.
- Tidak ada pengecekan auth tambahan di level komponen/layout (`app/admin/layout.tsx` cs.) — middleware adalah satu-satunya garis pertahanan untuk route ini. Kalau ada penambahan admin API route baru di luar pola `/admin/*` (misal Route Handler admin-only), wajib cek eksplisit apakah tercakup matcher middleware atau perlu proteksi manual sendiri.
- Setiap Server Action admin yang melakukan operasi tulis (insert/update/delete)
  wajib memanggil requireAuth() (lib/supabase/auth-guard.ts) di awal fungsi,
  SEBELUM createServiceRoleClient() dipanggil — middleware bukan satu-satunya
  lapisan proteksi lagi.

### Kode

- `'use server'` files tidak boleh export constants — pisah ke `constants.ts` per module
- Komponen reusable admin: `components/admin/`
- `ThemeProvider` dibungkus di `components/providers.tsx`, dipakai di `app/layout.tsx`

## Kebebasan implementasi

- Ikuti spec/prompt sebagai baseline. Boleh improve detail teknis selama tidak ubah scope inti.
- Penyimpangan dari spec wajib dicatat di entry `done.md`.

## Kebijakan test & retry

- Fitur dengan spec file: tulis test Playwright/Vitest sesuai section "Testing" di spec, lalu jalankan.
- Fitur cuma dapat prompt langsung: tidak wajib test otomatis kecuali diminta eksplisit.
- Test gagal → retry maks 2x. Masih gagal → STOP, laporkan test gagal + dugaan penyebab, jangan update `done.md`.

## Update done.md

\```

- [x] <nama fitur> — selesai, spec: workflow/<nama>.md
      Catatan: <penyimpangan dari spec, atau "sesuai spec">
      \```
