# Multi-select Tech Stack Input

## Konteks & tujuan

Input tech_stack di form Project/Experience saat ini single text field
comma-separated, rawan typo. Diganti dengan tag-selector UI (referensi
desain dari 21st.dev, dimodifikasi) memakai daftar tag tetap. Sumber
daftar BUKAN dari tabel skills (baru 1 data, akan bikin dependency
terlalu ketat) — melainkan konstanta statis yang di-maintain manual.

## Requirement

1. Buat lib/constants/tech-stack-options.ts, export array Tag[]
   ({id, label}). Isi awal: query dulu
   SELECT DISTINCT unnest(tech_stack) FROM projects
   UNION SELECT DISTINCT unnest(tech_stack) FROM experiences
   untuk dapat semua tech yang sudah pernah dipakai, jadikan seed list,
   tambah beberapa entri umum lain yang relevan ke stack Next.js/Supabase.

2. Modifikasi (BUKAN pakai apa adanya) component TagsSelector yang
   di-paste di bawah:
   a. Tambah prop "name: string" dan "defaultValue?: string[]".
   b. Tambah <input type="hidden" name={name} readOnly
   value={selectedTags.map(t => t.label).join(', ')} /> disinkron
   lewat useEffect tiap selectedTags berubah — supaya Server Action
   tetap baca lewat formData.get('tech_stack') TANPA PERUBAHAN.
   c. PENTING — edge case data lama: kalau ada value di defaultValue
   yang TIDAK ada di predefined tags (data lama diketik bebas sebelum
   fitur ini ada), tetap render sebagai selected tag (jangan hilang
   diam-diam), walau tidak akan muncul lagi di pool kalau dihapus.
   d. Ganti semua warna hardcode (bg-white, text-gray-700,
   bg-gray-100/60, dst) ke token Tailwind/shadcn yang sudah dipakai
   di codebase (bg-background, text-foreground, bg-muted,
   border-border) supaya ikut dark mode.
   e. Ganti import "framer-motion" jadi "motion/react" — konsisten
   dengan floating-navbar.tsx, satu-satunya file lain yang pakai
   animasi serupa di codebase ini.

3. Pasang di project-form.tsx dan experience-form.tsx, ganti <Input>
   teks tech_stack. defaultValue diisi dari project?.tech_stack /
   experience?.tech_stack (array yang sudah ada).

4. parseTechStack() dan Server Action TIDAK diubah sama sekali.

## Edge case

- Data lama tidak baku tetap tampil di edit form (lihat 2c).
- Belum pilih tag apa pun → tetap valid submit, tersimpan array kosong
  seperti sekarang.

## Testing

Tidak wajib otomatis. Verifikasi manual: create & edit di kedua form,
cek data tersimpan benar, cek tampilan dark/light mode, cek data lama
(project yang sudah ada) tetap tampil lengkap saat dibuka untuk edit.

## Kriteria selesai

Kedua form pakai TagsSelector baru, data lama tidak hilang saat edit,
dark mode konsisten, tidak ada perubahan di actions.ts.
