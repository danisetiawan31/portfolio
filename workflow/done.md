# workflow/done.md

- [1] Admin Auth (login, logout, protected routes /admin/\*) — selesai, tidak ada spec file
  Catatan: middleware sempat tidak aktif (proxy.ts salah nama file & fungsi, tidak terdeteksi Next.js) — diperbaiki, rename ke middleware.ts. Ditambah lapisan requireAuth() di tiap Server Action admin (defense-in-depth). Next.js 16 deprecate konvensi middleware.ts, diganti proxy.ts — file di-rename ulang (middleware.ts -> proxy.ts, fungsi middleware() -> proxy()), logic dan matcher tidak berubah.
- [2] CRUD Projects (create, read, update, delete, thumbnail upload) — selesai, tidak ada spec file
- [3] CRUD Experiences (create, read, update, delete) — selesai, tidak ada spec file
- [4] CRUD Skills (create, read, update, delete) — selesai, tidak ada spec file
- [5] Multi-select tech stack input — selesai, spec: workflow/tech-stack-tagselector.md
  Catatan: sumber opsi pakai konstanta statis (lib/constants/tech-stack-options.ts),
  bukan tabel skills — supaya tidak depend ke data skills yang masih minim.
- [6] Project detail page (klik project → tampil full info) — selesai, spec: workflow/project-detail-page.md
  Catatan: Live/GitHub URL null ditampilkan sebagai disabled state, bukan unrendered. Tombol Live/GitHub URL pakai <a> styled manual, bukan reuse komponen Button — konsisten visual dengan referensi desain. Tambahan di luar spec: ImageLightbox (klik thumbnail project → tampil fullscreen).
- [7] Certificate Section & UI Redesign (public + admin) — selesai, spec: workflow/certificate-section.md & workflow/certificate-ui.md
  Catatan (Keputusan Final):
  - Data Layer: Server Action wajib menggunakan `revalidatePath` agar cache ter-update pasca mutasi data.
  - Public UI: Efek hover blur-siblings menggunakan murni CSS `:has()`, badge Verified memakai token custom `--success`, interaksi gambar via `ImageLightbox`, dan layout `/certificates` disamakan dengan pola halaman `/projects`.
  - Admin UI: Root wrapper form admin menggunakan `<div>` (menghindari isu semantik `<main>` bersarang), tabel certificates ditambah preview image lightbox, dan tabel skills menggunakan komponen visual `TechBadge`.
- [8] Footer Section — selesai, spec: workflow/footer.md
  Catatan:
  - Data: Mengekstrak hardcoded social links dari `contact.tsx` menjadi `SOCIAL_LINKS` di `constants.tsx` (single source of truth).
  - UI: Menggabungkan `NAV_ITEMS` dan `SOCIAL_LINKS` dalam satu baris, menambahkan efek wordmark besar "dhani" dengan CSS `mask-image` linear gradient agar memudar ke bawah.
  - Responsive: Ditambahkan styling kondisional pada wordmark (margin negatif dan line-height bertahap: `leading-[0.85]` di mobile dan `leading-[0.75]` di desktop) agar potongan (crop) terbawah teks tetap proporsional tanpa terpotong terlalu agresif di layar kecil.
  - Wiring: Komponen hanya di-render di halaman utama Landing page (`app/page.tsx`).
- [9] Refactor Skills Schema & Admin Bug Fixes — selesai, tidak ada spec file (diskusi langsung)
  Catatan:
  - Database: Membuang kolom `icon` dan `context` dari tabel `skills` untuk efisiensi, menambahkan `is_visible` (toggle tampil/sembunyi), dan membatasi `category` menjadi 4 pilar (`languages`, `frontend`, `backend_infra`, `database`) menggunakan `CHECK CONSTRAINT`.
  - Admin UI: `skills-form.tsx` menggunakan komponen `Checkbox` karena `Switch` belum ter-install. Form input `icon` & `context` dihapus. `skills/page.tsx` menampilkan status visibility alih-alih `icon`.
  - Bugfix: Menyelesaikan isu _Hydration Mismatch_ pada `AdminSidebar` dengan menunda render ikon `Sun`/`Moon` hingga status komponen `mounted` aktif di _client_. Mengkoreksi inkonsistensi impor `framer-motion` menjadi `motion/react` mengikuti standar arsitektur proyek.
- [10] UI Polish & Admin Enhancements — selesai, tidak ada spec file (diskusi langsung)
  Catatan:
  - Global UI: Menambahkan efek _Click Spark_ secara global pada `app/layout.tsx`.
  - Bugfix: Memperbaiki _bug_ kemunculan `Navbar` di halaman `/certificates` (karena _anchor links_ tidak berfungsi di luar halaman utama).
  - Admin UI: Mengganti komponen _upload_ gambar standar pada `project-form.tsx` dan `certificate-form.tsx` dengan komponen `ImageUploadInput` (gaya Aceternity UI).
- [11] Bugfix: revalidatePath setelah mutasi project — selesai, tidak ada spec file (diskusi langsung)
  Catatan:
  - Root cause: `createProject`, `updateProject`, `deleteProject` di `app/admin/projects/actions.ts` memanggil `redirect()` tanpa `revalidatePath()` sebelumnya, sehingga Next.js Data Cache tidak di-invalidate dan project baru/update/delete tidak muncul di UI.
  - Fix: tambah `revalidatePath()` SEBELUM setiap `redirect()` pada ketiga action.
  - Path yang di-revalidate per action:
    - `createProject`: `/admin/projects`, `/projects`, `/`
    - `updateProject`: `/admin/projects`, `/projects`, `/`, `/projects/[slug]` (slug spesifik dari form)
    - `deleteProject`: `/admin/projects`, `/projects`, `/`
  - Sesuai konvensi baru AGENTS.md §Data mutation.
- [12] Bugfix: revalidatePath di experiences, skills, certificates actions — selesai, tidak ada spec file
  Catatan:
  - Bug sama persis dengan [11]: semua action mutation di experiences dan skills tidak punya `revalidatePath()` sama sekali; certificates punya tapi incomplete.
  - `experiences/actions.ts`: tambah `revalidatePath('/admin/experiences')` + `revalidatePath('/')` di `createExperience`, `updateExperience`, `deleteExperience` — sebelum `redirect()`.
  - `skills/actions.ts`: tambah `revalidatePath('/admin/skills')` + `revalidatePath('/')` di `createSkill`, `updateSkill`, `deleteSkill` — sebelum `redirect()`.
  - `certificates/actions.ts`: tambah `revalidatePath('/certificates')` ke `createCertificate` dan `updateCertificate` (sudah ada 2 path lain); lengkapi `deleteCertificate` yang kosong dengan ketiga path: `/admin/certificates`, `/`, `/certificates` — sebelum `redirect()`.
  - Tidak ada field URL-based (slug) di ketiga modul ini — tidak perlu guard slug-lama.
- [13] Experience bullet points — selesai, spec: workflow/experience-bullets.md
  Catatan: sesuai spec.
- [14] Testing Suite (Vitest & Playwright) — selesai, spec: workflow/testing-suite.md
  Catatan: Vitest terpasang untuk Unit Test (`lib/utils/parse-tech-stack.test.ts`, `lib/utils.test.ts`) dengan 7 passing tests. Playwright terpasang untuk E2E Test (`tests/e2e/home.spec.ts`, `tests/e2e/admin-auth.spec.ts`) dengan 5 passing tests.
- [15] Dynamic CV Management — selesai, spec: workflow/dynamic-cv.md
  Catatan: Sesuai spec. Single-row profile_settings di Supabase + Storage bucket documents (MIME PDF only, max 10MB). Admin CV management form di /admin/cv dengan auto-replace file lama saat file baru diunggah. Tombol Download CV di Hero Landing page mengambil URL aktif secara dinamis dengan fallback ke static /file/cv.pdf. Backend tested via Vitest (6 tests) & E2E tested via Playwright.
- [16] Admin & UI Performance Optimization & Cleanup — selesai, tidak ada spec file (diskusi review)
  Catatan:
  - Form Upload: Menghapus loop GridPattern (451 elemen DOM <div>) pada ImageUploadInput dan menggantinya dengan 1 baris CSS dot pattern murni.
  - Dependensi Ikon: Mengganti seluruh penggunaan @tabler/icons-react dengan lucide-react + SVG inline brand icons, lalu meng-uninstall package @tabler/icons-react.
  - Sidebar Theme Toggle: Menghapus useState(mounted) dan useEffect di AdminSidebar, beralih ke pure CSS Tailwind toggle (hidden dark:block / block dark:hidden) untuk mencegah 2-pass client re-rendering.
  - Delete Dialog: Menggunakan DeleteConfirmButton berbasis shadcn/ui AlertDialog (Radix UI) langsung dengan bound server actions pada semua tabel admin, dan menghapus 4 file wrapper boilerplate yang redundan.
- [17] Admin Mobile-Friendly Layout & Drawer Z-Index Bugfix — selesai, tidak ada spec file
  Catatan:
  - Layout & Padding: Mengubah padding admin dari fixed p-8 ke responsif p-4 sm:p-6 md:p-8 agar ruang kerja di HP lebih luas.
  - Responsive List View: Mengimplementasikan Card List View khusus mobile (< md) di seluruh tabel admin (Projects, Certificates, Experiences, Skills) dengan touch target tombol aksi yang ergonomis.
  - Live Dashboard Metrics: Menambahkan counter badge live (Projects, Experiences, Skills, Certificates, CV Status) di halaman /admin.
  - Fix Bug Z-Index: Menaikkan layer mobile drawer dan backdrop AdminSidebar ke z-50 dan menurunkan z-index internal ImageUploadInput ke z-10 / z-0 agar card upload tidak menembus drawer mobile.
- [18] AI Assistant (Tahap 1: Skema DB, Parser PDF CV, & Admin AI Settings) — selesai, spec: implementation_plan.md
  Catatan:
  - Package: Memasang `ai`, `@ai-sdk/openai`, `@upstash/ratelimit`, `@upstash/redis`, `unpdf`.
  - Database: Migrasi `supabase/schema/07_ai_settings.sql` menambahkan kolom `openrouter_api_key`, `ai_model`, `cv_text_content`, `custom_instructions` pada tabel `profile_settings`.
  - Parser PDF: Membuat `lib/ai/pdf-parser.ts` menggunakan `unpdf` dan mengintegrasikannya ke `uploadCVAction` agar mengekstrak teks CV secara otomatis setiap kali PDF diunggah.
  - Admin CMS: Halaman `/admin/ai` dan form `AISettingsForm` untuk mengelola API key dinamis, memilih model OpenRouter (default `nvidia/nemotron-3.5-lightning:free`), mengedit teks CV, dan kustomisasi instruksi persona AI.
  - Test Suite: Menambahkan unit test `app/admin/ai/actions.test.ts` (16/16 tests passing).
- [19] AI Assistant (Tahap 2: Backend Route Handler /api/ai, Context Builder, & Rate Limiter) — selesai, spec: implementation_plan.md
  Catatan:
  - OpenRouter Client: Membuat `lib/ai/openrouter.ts` dengan resolusi API key dinamis (Database -> .env.local fallback) dan model `nvidia/nemotron-3.5-lightning:free`.
  - Context Builder: Membuat `lib/ai/context.ts` untuk mengagregasikan data Projects, Experiences, Skills, Certificates, CV text, dan persona instructions ke dalam System Prompt.
  - Rate Limiting: Membuat `lib/ai/ratelimit.ts` menggunakan `@upstash/ratelimit` (10 request/10 menit per IP) dengan sliding window in-memory fallback.
  - Route Handler: Membuat `app/api/ai/route.ts` dengan Vercel AI SDK `streamText` & `toTextStreamResponse`.
  - Testing: Unit test lengkap di `lib/ai/ratelimit.test.ts`, `lib/ai/context.test.ts`, dan `app/api/ai/route.test.ts` (23/23 tests passing) serta live test HTTP POST berhasil.
- [20] AI Assistant (Tahap 3: Frontend Chatbot Floating Widget & Full E2E Test Suite) — selesai, spec: implementation_plan.md
  Catatan:
  - Custom Streaming Hook: Membuat `components/ai/use-ai-chat.ts` dengan controller abort dan error handling terisolasi.
  - Floating Launcher & Modal Dialog: Membuat `components/ai/chat-widget.tsx` dengan animasi spring Framer Motion, status pulse online, tombol clear chat, dan auto-scroll message body.
  - Quick Prompts: Membuat `components/ai/quick-prompts.tsx` dengan 4 saran pertanyaan instan seputar tech stack, project unggulan, pengalaman kerja, dan kontak.
  - Message Bubbles & Markdown: Membuat `components/ai/chat-message-item.tsx` dengan rendering bold/list/code, streaming indicator, dan tombol salin respons.
  - Integrasi: Memasang `ChatWidget` pada `app/page.tsx`.
  - Test Suite: Menambahkan E2E test `tests/e2e/ai-chat.spec.ts` dan `tests/e2e/admin-ai.spec.ts` (seluruh 9/9 Playwright E2E tests & 23/23 Vitest tests lulus 100%).
- [21] AI Assistant Minimalist UI & Mobile Device Mode Optimization — selesai, tidak ada spec file (feedback visual)
  Catatan:
  - Minimalist Trigger: Menghapus label teks "Tanya AI" pada tombol melayang, menggantinya dengan lingkaran minimalis (`size-12 sm:size-13 rounded-full`) berikon Bot dengan indikator dot online berkedip.
  - Stacking Context & Layer Fix: Menaikkan z-index widget ke `z-[6000]` dengan `pointer-events-auto` dan menambahkan hook `useMounted()` untuk memastikan tombol selalu muncul di atas semua layer dan stabil saat berganti mode device mobile di Chrome DevTools.
  - Penempatan Global: Memindahkan `ChatWidget` ke `app/layout.tsx` (aktif di seluruh halaman publik, otomatis di-exclude di `/admin/*`).
  - Test Suite: Menambahkan pengujian Playwright E2E khusus mobile viewport 375x667 dan desktop (10/10 tests passing).
- [22] Web Rendering & GPU Performance Optimization — selesai, tidak ada spec file (audit performa)
  Catatan:
  - ClickSpark On-Demand Animation: Mengubah infinite loop requestAnimationFrame 60-120 FPS pada `components/ui/click-spark.tsx` menjadi on-demand loop yang hanya aktif 400ms saat user klik, menurunkan penggunaan CPU saat idle menjadi 0%.
  - Background Ambient Optimization: Mengganti filter CSS `blur-[140px]` fixed pada `app/layout.tsx` dengan CSS `radial-gradient` murni untuk mengeliminasi beban rasterization GPU saat scroll.
  - Hero Image Preloading: Menambahkan atribut `priority={idx === 0}` pada kartu thumbnail proyek teratas di `components/sections/hero-client.tsx` untuk mempercepat LCP.
- [23] Admin Mobile Ergonomics & Theme-Adaptive Sidebar Optimization — selesai, tidak ada spec file (audit UX/UI)
  Catatan:
  - Sidebar & Mobile Header: Mengubah warna background hardcoded `bg-slate-900` menjadi CSS variables adaptif tema (`bg-card text-card-foreground border-border`) dengan aksen ungu `bg-primary/10 text-primary` pada menu aktif.
  - Image Upload Dropzone: Memperkecil padding dropzone `p-4 sm:p-6 md:p-8` dan tinggi kotak di mobile agar lebih kompak dan ergonomis.
  - Form Layout & Actions: Mengganti padding kaku `p-8` menjadi `p-4 sm:p-6 md:p-8` pada seluruh halaman form `new` & `edit` serta membuat tombol aksi responsif (`flex-col-reverse sm:flex-row`).
  - Ponytail Cleanup: Merampingkan logika `isActive` dan menghapus varian motion yang tidak terpakai.
- [24] Admin Sidebar-07 Template Integration (Flat Menu Structure) — selesai, tidak ada spec file (permintaan template shadcn/ui)
  Catatan:
  - Integrasi Komponen: Memasang komponen dasar shadcn/ui (`sidebar`, `sheet`, `tooltip`, `separator`, `breadcrumb`, `dropdown-menu`, `avatar`, `skeleton`) dan hook `use-mobile` berbasis `useSyncExternalStore`.
  - Flat Single-Tier Menu: Menerapkan tata letak `sidebar-07` dengan menghapus sub-menu expandable accordion, menghasilkan 7 menu flat yang rapi dengan tooltip otomatis pada mode collapsed.
  - User Profile & Theme Dropdown: Membuat `components/admin/nav-user.tsx` pada footer sidebar dengan avatar inisial, info akun, opsi ganti tema, dan tombol keluar.
  - Sticky Top Bar & Breadcrumbs: Membuat `components/admin/admin-shell.tsx` dengan `SidebarTrigger` (shortcut `Ctrl+B`), dynamic route breadcrumbs, dan tombol cepat "Lihat Website".
  - Global TooltipProvider: Menambahkan `TooltipProvider` pada `components/providers.tsx` untuk mendukung rendering tooltip saat sidebar diciutkan.
- [25] Comprehensive SEO Engine, Dynamic OpenGraph Generator & Documentation Sync — selesai, tidak ada spec file (optimasi SEO)
  Catatan:
  - Dynamic OpenGraph Banners: Membuat `app/opengraph-image.tsx` untuk halaman utama dan `app/projects/[slug]/opengraph-image.tsx` per proyek menggunakan `next/og` `ImageResponse` (resolusi 1200x630, dark modern violet, tech pills).
  - Dynamic Sitemap & Robots: Membuat `app/sitemap.ts` (mengambil seluruh slug proyek publik otomatis dengan lastModified) dan `app/robots.ts` (mengizinkan publik, memblokir `/admin` dan `/api`).
  - Metadata Global & Structured Data: Memperbarui `app/layout.tsx` dengan `metadataBase`, template judul, OpenGraph & Twitter tags lengkap, serta skema JSON-LD `Person` di `app/page.tsx` dan `SoftwareApplication` di `app/projects/[slug]/page.tsx`.
  - README.md Sync: Memperbarui dokumentasi lengkap mencakup arsitektur AI Assistant, Upstash Redis rate limiter, shadcn/ui sidebar-07, migrasi skema `06_profile_settings.sql` dan `07_ai_settings.sql`, testing suite, dan variabel lingkungan.
- [26] Projects Section Duplicate Handling & Dynamic Slicing Logic — selesai, tidak ada spec file (refactor logic)
  Catatan:
  - Dynamic Project Slicing: Menyesuaikan logika di `components/sections/projects.tsx` sehingga jika proyek > 3, grid bawah hanya merender proyek lanjutan (`projects.slice(3)`) dengan judul "More Selected Projects", menghindari pengulangan ganda dengan 3D Hero stack (`projects.slice(0, 3)`).
  - Unused Type Cleanup: Menghapus import unused `type Project` dari `components/sections/projects.tsx`.
- [27] Ponytail Review Cleanups & Dead Code Deletion — selesai, tidak ada spec file (/ponytail-review)
  Catatan:
  - Dead File Deletion: Menghapus `components/ui/resizable-navbar.tsx` (288 baris dead code dari Aceternity tanpa caller yang menyebabkan 2 ESLint warning) dan `components/common/button.tsx` (37 baris wrapper unused).
  - Component Pruning & Import Unification: Menghapus dead animation variants dan unused decorative box di `components/admin/image-upload-input.tsx` serta menyelaraskan import ke `framer-motion`.
  - ESLint Clean: Total ESLint warning kini turun menjadi 0 error dan 0 warning.
- [28] Recruiter Quick-Packet (1-Click Summary Dossier) — selesai, tidak ada spec file (fitur standout)
  Catatan:
  - Dynamic Generator: Membuat `lib/utils/recruiter-summary.ts` yang otomatis merangkai format kandidat (Nama, Role, Tech Stack dinamis dari Supabase `skills`, 3 proyek teratas dari Supabase `projects`, dan link CV terbaru dari `profile_settings`).
  - Interactive UI: Membuat `components/common/recruiter-summary-button.tsx` di Hero CTA dengan integrasi `framer-motion`, `sonner` rich toast notification, dan copy feedback "Tersalin!".
  - Layout & Notification: Menambahkan `<Toaster position="top-right" richColors />` di `app/layout.tsx`.
  - Automated Tests: Menambahkan 2 Vitest unit tests di `lib/utils/recruiter-summary.test.ts` dan 1 E2E Playwright test di `tests/e2e/recruiter-summary.spec.ts` (seluruh 25 unit test dan 11 E2E test lulus 100%).
- [29] Custom Geometric DS Monogram Vector SVG Favicon — selesai, tidak ada spec file (branding visual /impeccable)
  Catatan:
  - Lightweight Pure SVG: Membuat `app/icon.svg` dan `public/icon.svg` (< 1 KB) dengan desain monogram "DS" geometris elegan dalam squircle berbingkai neon ungu-indigo, menghasilkan zero build overhead dan ketajaman vektor tanpa batas di semua resolusi.
  - Metadata Icons: Mendaftarkan `icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/icon.svg' }` di `app/layout.tsx`.
  - Admin Sidebar Brand Icon: Memperbarui header brand pada `components/admin/admin-sidebar.tsx` dengan ikon monogram SVG custom "DS" senada.
  - Verifikasi: Lulus Impeccable Design Detector (0 defects) dan 25/25 Vitest tests.
- [30] Dynamic GitHub README Auto-Sync, Interactive Mermaid Diagrams & Floating Navigation — selesai, spec: implementation_plan.md
  Catatan:
  - GitHub Fetching Engine: Membuat `lib/github/readme.ts` dengan multi-branch resolution (main/master, case-insensitive filename), Next.js ISR caching (1 jam), dan normalisasi link/gambar relatif GitHub secara otomatis.
  - Case Study Component: Membuat `components/sections/project-case-study.tsx` dengan `react-markdown`, `remark-gfm`, dan `rehype-raw` untuk me-render markdown, tabel, code block, shields badges, dan detail collapsible bebas hydration error.
  - Interactive Mermaid Diagram: Membuat `components/common/mermaid-viewer.tsx` yang me-render diagram arsitektur grafis SVG dinamis dengan palet _electric violet/indigo_ adaptif dark/light mode.
  - Floating Edge Navigation: Membuat `components/sections/floating-project-nav.tsx` untuk navigasi melayang (_Previous & Next Project_) di sisi kiri dan kanan layar dengan hover tooltip.
  - Layout & Hierarchy: Menjaga struktur header asli dengan paragraf deskripsi ringkas, tombol aksi, gambar showcase, tech stack & source code tepat di bawah gambar, serta indikator _Auto-synced with GitHub README_.
- [31] Dynamic Tech Stack Icon Smart Resolver (Devicon CDN + Local Overrides) — selesai, tidak ada spec file (DX & scalability improvement)
  Catatan:
  - Hybrid Icon Engine: Mengembangkan `resolveTechIcon` di `components/common/tech-badge.tsx` yang memprioritaskan aset lokal di `/public/icons/` dan secara otomatis me-resolve lebih dari 100+ teknologi industri (seperti Angular, Redis, Playwright, Vitest, Go/Gin, Prisma, FastAPI, WebSocket, dll.) via Devicon CDN SVG resmi.
  - Performance & Config: Menambahkan domain `cdn.jsdelivr.net` ke `images.remotePatterns` di `next.config.ts` dan mengaktifkan `unoptimized` rendering pada vektor SVG agar rendering instan dengan zero build overhead.
  - Automated Tests: Menambahkan 3 unit tests di `components/common/tech-badge.test.ts` (total 43 automated tests: 31 Vitest unit tests & 12 Playwright E2E tests passing 100%).
- [32] Admin Skills Auto-Sync, Quick Presets & Live Visual Icons — selesai, tidak ada spec file (code-simplification & DX improvement)
  Catatan:
  - 1-Click Sync Engine: Membuat Server Action `syncSkillsFromProjects()` di `app/admin/skills/actions.ts` dan tombol `SyncSkillsButton` di `app/admin/skills/page.tsx` yang secara otomatis meng-import seluruh tech stack dari proyek yang belum ada di skills, lengkap dengan deduplikasi dan inferensi kategori otomatis (`inferSkillCategory`).
  - Quick-Pick Chips & Live Preview: Menambahkan preset 1-klik di `app/admin/skills/_components/skill-form.tsx` untuk mengisi nama skill dan kategori secara instan, serta preview langsung logo SVG resmi `<TechBadge />` saat mengetik/memilih.
  - Visual Table Preview: Menampilkan logo SVG `<TechBadge label={skill.name} size="sm" />` di setiap baris tabel dan kartu skill pada admin dashboard.
  - Automated Tests: Menambahkan 5 unit tests di `app/admin/skills/actions.test.ts` (total 48 automated tests: 36 Vitest unit tests & 12 Playwright E2E tests passing 100%).
- [33] 5-Tier Industry Standard Skill Taxonomy & Bento Visual Cards — selesai, tidak ada spec file (information architecture & UX refinement)
  Catatan:
  - 5-Category Taxonomy: Merestrukturisasi pengelompokan skill menjadi 5 pilar standar industri: (1) `frontend_mobile` — Frontend & Mobile, (2) `backend` — Backend & APIs, (3) `database_caching` — Database & Caching, (4) `testing` — Testing & QA, (5) `tools_devops` — DevOps & Tools.
  - Public Skills Grid: Memperbarui `components/sections/skills-grid.tsx` dengan layout 5 kartu Bento modern, nomor urut (`01` s/d `05`), ubin icon 44px, dan floating Radix UI Tooltip saat hover.
  - Backward Compatibility: Menambahkan normalisasi kategori warisan (_legacy_) sehingga data lama tetap terpetakan dengan aman tanpa error.
- [34] Curated 25 High-Signal Skills, CI/CD Pipeline & High-Contrast Git Icon — selesai, tidak ada spec file (UX & curation refinement)
  Catatan:
  - Skill Curation (Less is More): Mengeliminasi item redundan (Node.js, React Native, Vite, JS, Figma, Vercel) dan memadatkan dari 35 skill menjadi 25 skill berbobot tinggi yang paling relevan untuk Fullstack Engineer.
  - CI/CD Integration: Menambahkan `CI/CD` di bawah `DevOps & Tools` dengan custom SVG infinity pipeline icon (`/icons/cicd.svg`).
  - Git / GitHub Contrast Fix: Mengganti icon Git dari monochrome putih yang samar menjadi logo resmi oranye-merah Devicon CDN yang memiliki kontras tajam di light/dark mode.
  - Automated Tests: 37 Vitest unit tests & 12 Playwright E2E tests lulus 100%.
