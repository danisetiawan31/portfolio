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
