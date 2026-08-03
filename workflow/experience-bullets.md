# Experience Bullet Points

## Konteks & tujuan

Field "Tanggung Jawab" (description) di tiap experience entry saat ini
disimpan sebagai single TEXT dan ditampilkan sebagai satu paragraf.
Format ini tidak scannable untuk reviewer/HR yang membaca portfolio secara
cepat. Tujuannya: ubah ke format bullet point (array of string), konsisten
dengan pattern tech_stack yang sudah lebih dulu berbentuk array di tabel
yang sama.

## Requirement

1. Ubah kolom `experiences.description` dari `TEXT` menjadi `TEXT[]`.
2. Migrasi data existing (kalau ada) dari string tunggal menjadi array,
   di-split berdasarkan newline — baris kosong dibuang.
3. Ganti input description di form admin
   (`app/admin/experiences/_components/experience-form.tsx`) dari
   `<Textarea>` polos menjadi komponen dynamic bullet-list input baru.
4. Update Server Action (`createExperience`, `updateExperience` di
   `app/admin/experiences/actions.ts`) untuk menerima & menyimpan
   description sebagai array, bukan string tunggal.
5. Update validasi form — minimal 1 bullet non-kosong wajib diisi
   (pengganti validasi `description required` yang sekarang).
6. Update tampilan public (`ExperienceClient` — komponen yang me-render
   "Tanggung Jawab") dari `<p>{description}</p>` menjadi `<ul><li>` per
   bullet, styling mengikuti pattern visual yang sudah ada (warna, ukuran
   font tetap sama, cuma bentuk list yang berubah).

## Tahapan implementasi

- Tahap 1 (Skema): migration ALTER COLUMN description TEXT → TEXT[],
  termasuk konversi data existing.
- Tahap 2 (Data layer): update Server Action create/update untuk handle
  array, update validasi.
- Tahap 3 (UI): komponen bullet-list input baru di form admin + update
  tampilan public jadi `<ul><li>`.
- Tahap 4 (Test): sesuai section Testing di bawah.

Ingat kebijakan implementasi bertahap di AGENTS.md — tiap tahap berhenti
dan lapor dulu sebelum lanjut ke tahap berikutnya, jangan sekaligus.

## Skema/struktur data

```sql
-- Migration baru, cari nomor file yang sesuai urutan file migration
-- experiences yang sudah ada di supabase/schema/ (jangan asumsikan nomor,
-- Antigravity cek urutan file existing dulu).

ALTER TABLE experiences
  ALTER COLUMN description TYPE text[]
  USING string_to_array(NULLIF(trim(description), ''), E'\n');

ALTER TABLE experiences
  ALTER COLUMN description SET NOT NULL;
```

Asumsi migrasi: kalau ada data existing dengan description multi-baris
(dipisah newline), tiap baris otomatis jadi 1 bullet. Kalau single-line,
jadi 1 bullet saja. Ini best-effort, boleh dirapikan manual lewat admin
form setelah migrasi kalau hasilnya kurang pas — bukan blocker.

## Komponen baru: Bullet List Input

`TagsSelector` yang dipakai untuk tech_stack **tidak bisa direuse** —
itu chip selector dari daftar tertutup (`TECH_STACK_OPTIONS`), sedangkan
bullet ini teks bebas yang diketik user. Perlu komponen baru:

- Input teks kosong + tombol tambah (submit on Enter juga boleh).
- Tiap bullet yang sudah ditambah tampil sebagai baris terpisah dengan
  tombol hapus.
- Tidak perlu drag-to-reorder — cukup urutan sesuai input, ini portfolio
  pribadi bukan tool multi-user, jangan over-engineering.
- Submit ke FormData: gunakan multiple hidden input dengan `name`
  yang sama (misal `name="description"`) satu per bullet, supaya di
  Server Action bisa dibaca lewat `formData.getAll('description')` —
  konsisten dengan cara native FormData handle multiple values, tanpa
  perlu JSON.stringify/parse.
- Sebelum bikin dari nol, Antigravity cek dulu bagaimana persis
  `TagsSelector` submit value-nya ke FormData (getAll juga, atau beda?)
  — kalau pattern-nya sama, ikuti konvensi yang sama biar konsisten.

## Edge case yang perlu dihandle

- Semua bullet dihapus sampai kosong → validasi error, sama seperti
  description required sekarang, jangan izinkan submit kosong.
- Bullet dengan whitespace doang → trim, treat sebagai kosong, dibuang
  sebelum submit (baik di client maupun di-filter ulang di Server Action
  sebagai defense).
- Data existing yang berhasil dimigrasi jadi array dengan 1 bullet
  panjang (karena tidak ada newline sebelumnya) → bukan bug, expected,
  user rapikan manual via form kalau perlu.

## Testing

- Migration: description lama dengan newline ter-split jadi multiple
  array elements; description lama tanpa newline jadi array 1 elemen;
  tidak ada data hilang.
- Server Action: submit dengan 3 bullet valid → tersimpan sebagai array
  3 elemen. Submit tanpa bullet sama sekali → validation error, tidak
  insert ke DB.
- Bullet dengan whitespace-only → tidak masuk ke array yang tersimpan.

## Kriteria selesai

- Kolom description di DB sudah TEXT[], data lama (kalau ada) tidak
  hilang.
- Form admin bisa tambah/hapus bullet, minimal 1 bullet wajib sebelum
  submit.
- Halaman public menampilkan bullet sebagai `<ul><li>`, bukan paragraf.
- Test di atas lolos.
- Dicek ulang manual oleh user: coba create/edit experience baru dengan
  beberapa bullet, pastikan tampil benar di public page.
