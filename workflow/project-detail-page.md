# Project Detail Page

## Konteks & tujuan

Saat ini klik project (baik di hero stack maupun grid ProjectsSection)
tidak melakukan apa-apa. Perlu halaman detail per project, reuse skema
data yang sudah ada di tabel `projects` (tidak ada field baru).

## Requirement

1. **Query baru** — `getProjectBySlug(slug: string): Promise<Project | null>`
   di `lib/supabase/queries/projects.ts`. Pola sama dengan
   `getPublicProjects()` yang sudah ada: pakai `createClient()` (Server
   Client biasa, BUKAN service role), select by slug, `.single()`.

2. **Route baru** — `app/projects/[slug]/page.tsx` (Server Component):
   - Fetch via `getProjectBySlug(slug)`.
   - Kalau tidak ketemu, panggil `notFound()` dari `next/navigation`.
   - `generateMetadata` — title tag = `${project.title} - Dani Setiawan`,
     description = `project.description`.

3. **Layout halaman detail:**
   - Reuse `SectionContainer` untuk wrapper.
   - Reuse `FadeUpOnScroll` (components/common/fade-up-on-scroll.tsx)
     untuk animasi reveal tiap blok konten saat scroll.
   - Tombol "Kembali" ke `/#projects` — supaya balik ke
     section yang relevan, bukan cuma landing page. Ikon
     `<ArrowLeft className="mr-2 h-4 w-4" />`, konsisten dengan panel
     admin.
   - Judul: `project.title`.
   - Thumbnail besar dari `thumbnail_url`, dibungkus `ImageLightbox`
     (components/common/image-lightbox.tsx) — klik thumbnail membuka
     preview fullscreen. Kalau `thumbnail_url` null, tampilkan
     placeholder "No preview" (tidak masuk lightbox).
   - `description` — tampilkan full text.
   - `tech_stack` — reuse `TechBadge` dengan `showLabel={false}`
     (icon-only, keputusan desain untuk hemat ruang — konsisten dengan
     card kecil di listing). Kalau array kosong, container badge tidak
     dirender.
   - Live URL & GitHub URL — styled `<a>` manual (bukan komponen
     `Button`), label github berupa `project.title`. Kalau field null,
     tampilkan **disabled state** (teks abu-abu, `cursor-not-allowed`,
     tidak `<a>`) — bukan disembunyikan total. Ini keputusan UX sengaja:
     user tetap tahu field itu ada tapi belum tersedia, bukan seolah
     halaman kurang lengkap.

4. **Modifikasi `project-card.tsx` (Opsi A):** kedua elemen link yang
   sebelumnya mengarah ke `live_url` (thumbnail wrapper & tombol
   "View Project") diarahkan ke `/projects/{project.slug}`. Arrow icon
   (`ArrowUpRight`) tetap dipertahankan.

5. **Modifikasi `hero-client.tsx`:** tiap card di `displayProjects.map(...)`
   dibungkus `Link` ke `/projects/{project.slug}`.

## Skema/struktur data

Tidak ada migrasi. Reuse field existing tabel `projects`: `slug`,
`title`, `description`, `tech_stack`, `thumbnail_url`, `live_url`,
`github_url`.

## Edge case yang perlu dihandle

- Slug tidak match project manapun → `notFound()` (404 bawaan Next.js).
- `live_url` / `github_url` null → tombol terkait tampil disabled state
  (bukan tidak dirender sama sekali).
- `thumbnail_url` null → placeholder "No preview", tidak masuk
  `ImageLightbox`.
- `tech_stack` array kosong → container badge tidak dirender.

## Testing

- Klik card project di grid `ProjectsSection` (homepage) mengarah ke
  `/projects/{slug}` yang sesuai dengan project yang diklik.
- Klik card project di hero stack (3 project pertama) mengarah ke
  `/projects/{slug}` yang sesuai.
- Halaman detail menampilkan title, description, dan tech stack sesuai
  data project yang diakses.
- Akses `/projects/slug-tidak-ada` menghasilkan halaman 404.
