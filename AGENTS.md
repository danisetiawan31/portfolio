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

**Dieliminasi dari scope:**

- GitHub Activity section — setup rumit, benefit rendah.
- About section — redundan dengan konten yang sudah ada di Hero, CV, dan
  section lain; tidak menambah informasi baru bagi pembaca.

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
- Proteksi route `/admin/*` dilakukan di `proxy.ts` (root project — Next.js 16+ menggantikan konvensi lama `middleware.ts` yang di-deprecate) — cek session via `supabase.auth.getUser()`, redirect ke `/admin/login` kalau tidak ada user, dan redirect user yang sudah login menjauh dari `/admin/login`.
- Tidak ada pengecekan auth tambahan di level komponen/layout (`app/admin/layout.tsx` cs.) — proxy adalah satu-satunya garis pertahanan untuk route ini. Kalau ada penambahan admin API route baru di luar pola `/admin/*` (misal Route Handler admin-only), wajib cek eksplisit apakah tercakup matcher proxy atau perlu proteksi manual sendiri.
- Setiap Server Action admin yang melakukan operasi tulis (insert/update/delete)
  wajib memanggil requireAuth() (lib/supabase/auth-guard.ts) di awal fungsi,
  SEBELUM createServiceRoleClient() dipanggil — proxy bukan satu-satunya
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

## Kebijakan implementasi bertahap

- Untuk fitur dengan spec file (workflow/<fitur>.md) yang menyentuh lebih
  dari 1 layer (skema data, data layer, UI): implementasi WAJIB bertahap,
  bukan sekaligus dalam 1 sesi. Urutan baku: (1) skema data & RLS,
  (2) data layer (query/Server Action), (3) UI (form/komponen),
  (4) test/verifikasi.
- Setelah 1 tahap selesai, laporkan hasilnya dan TUNGGU konfirmasi user
  sebelum lanjut ke tahap berikutnya — jangan lanjut otomatis meski
  prompt/spec menyebutkan seluruh scope fitur.
- Fitur yang cuma dapat prompt langsung (tier ringkas) dikecualikan dari
  kebijakan ini.
- "State sukses/positif pakai token --success, mengikuti pola pasangan --destructive.

## Data mutation

- Setiap Server Action yang create/update/delete data WAJIB memanggil
  revalidatePath() (atau revalidateTag()) untuk SEMUA path yang menampilkan
  data tersebut, SEBELUM redirect() atau return response sukses.
- Kalau ada field yang dipakai sebagai bagian URL (misal slug), dan field
  itu bisa diubah saat update: ambil nilai LAMA-nya sebelum mutation
  dijalankan, lalu revalidate path lama DAN path baru kalau nilainya berubah.

## Update done.md

\```

- [x] <nama fitur> — selesai, spec: workflow/<nama>.md
      Catatan: <penyimpangan dari spec, atau "sesuai spec">
      \```

<!-- gitnexus:start -->

# GitNexus — Code Intelligence

This project is indexed by GitNexus as **portfolio** (747 symbols, 1704 relationships, 51 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource                                   | Use for                                  |
| ------------------------------------------ | ---------------------------------------- |
| `gitnexus://repo/portfolio/context`        | Codebase overview, check index freshness |
| `gitnexus://repo/portfolio/clusters`       | All functional areas                     |
| `gitnexus://repo/portfolio/processes`      | All execution flows                      |
| `gitnexus://repo/portfolio/process/{name}` | Step-by-step execution trace             |

## CLI

| Task                                         | Read this skill file                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md`       |
| Blast radius / "What breaks if I change X?"  | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?"             | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md`       |
| Rename / extract / split / refactor          | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md`     |
| Tools, resources, schema reference           | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md`           |
| Index, status, clean, wiki CLI commands      | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md`             |

<!-- gitnexus:end -->
