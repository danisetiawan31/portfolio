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
