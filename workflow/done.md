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
- [7] Certificate section (public + admin CRUD) — selesai, spec: workflow/certificate-section.md
  Catatan: Server Action awal tidak pakai revalidatePath, menyebabkan cache
  basi setelah create/update di admin — ditambahkan setelahnya. Bug
  runtime crash (state?.errors.\_form tanpa optional chaining kedua) di
  form Certificate juga ditemukan & diperbaiki saat testing manual.
  Perubahan tidak diminta di luar scope Certificate (retrofit ke 3
  modul CRUD lama) sempat menyebabkan bug caching baru — sudah di-revert.
