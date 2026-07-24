# Certificate Section

## Konteks & tujuan

Menambahkan bukti kredibilitas tambahan (sertifikasi) ke portfolio. Mengikuti pola `projects` yang sudah terbukti: section featured di homepage + halaman katalog penuh (`/certificates`). Berbeda dari `projects`, certificate **tidak** punya halaman detail per item — datanya terlalu tipis untuk itu, cukup lightbox untuk lihat gambar penuh.

## Requirement

- Tabel `certificates` baru (lihat skema di bawah), RLS public read, ikut pola `projects`/`experiences`/`skills`.
- Admin CRUD di `/admin/certificates`, ikut pola persis admin yang sudah ada (`actions.ts`, `constants.ts`, `_components/`, `page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`). Setiap Server Action write wajib panggil `requireAuth()` sebelum `createServiceRoleClient()`.
- Field: `title`, `issuer`, `issue_date` (wajib), `image_url` (opsional), `credential_url` (opsional), `is_featured`, `display_order`.
- Section homepage: render certificate dengan `is_featured = true` saja. Kalau tidak ada satupun yang featured, section (termasuk heading-nya) tidak dirender sama sekali — bukan ditampilkan kosong.
- Halaman `/certificates`: grid semua certificate, tanpa filter `is_featured`, tanpa pagination (asumsi jumlah data masih kecil untuk portfolio mahasiswa).
- Tambah link ke `/certificates` di navbar/nav constants (`components/layout/constants.tsx`) — tanpa ini halaman tidak reachable dari UI manapun.
- Card: klik pada gambar (bukan tombol terpisah) → buka `ImageLightbox` (reuse component `components/common/image-lightbox.tsx`). Satu trigger zone saja, tidak ada ikon/tombol zoom tambahan.
- Kalau `image_url` kosong → tampilkan fallback icon di area gambar, area itu tidak clickable/tidak trigger lightbox.
- Kalau `credential_url` terisi → tampilkan link "Verifikasi" (external, `target="_blank" rel="noopener"`) terpisah dari area gambar. Kalau kosong, link tidak dirender.
- Upload gambar reuse bucket storage `thumbnails` yang sudah ada (public, 10MB, jpeg/png/webp) — tidak bikin bucket baru.

## Skema/struktur data

```sql
-- =============================================================================
-- Table: certificates
-- Description: Stores certification/credential entries for the portfolio.
-- Depends on: set_updated_at() trigger function (defined in 01_projects.sql)
-- =============================================================================

CREATE TABLE certificates (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  issuer          text        NOT NULL,
  issue_date      date        NOT NULL,
  image_url       text,
  credential_url  text,
  is_featured     boolean     NOT NULL DEFAULT false,
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER certificates_set_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_public_read"
  ON certificates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX idx_certificates_is_featured   ON certificates (is_featured);
CREATE INDEX idx_certificates_display_order ON certificates (display_order);
```

File: `supabase/schema/04_certificates.sql` (ikut penomoran setelah `03_skills.sql`).

Update juga `docs/schema.md`: tambahkan entity `certificates` ke ERD mermaid dengan field di atas, dan catatan storage-nya reuse bucket `thumbnails` (tidak perlu bucket baru).

## Edge case yang perlu dihandle

- `image_url` null → fallback icon, area gambar tidak trigger lightbox, tidak crash.
- `credential_url` null → tombol/link verifikasi tidak dirender.
- Tidak ada certificate dengan `is_featured = true` → section homepage disembunyikan total (bukan heading kosong).
- Data `certificates` kosong total → halaman `/certificates` tampilkan empty state, bukan grid kosong tanpa keterangan.
- Delete certificate yang punya `image_url` → file di storage bucket `thumbnails` ikut terhapus (reuse logic delete storage yang sudah ada di CRUD projects).
- Edit certificate ganti gambar → file lama di storage dihapus, tidak menumpuk file orphan.

## Testing

- Admin bisa create certificate dengan dan tanpa `image_url`.
- Admin bisa update dan delete certificate; delete menghapus file storage terkait kalau ada.
- Server Action write gagal/ditolak kalau dipanggil tanpa sesi admin valid (`requireAuth()` bekerja).
- Homepage section hanya me-render certificate `is_featured = true`; section tidak muncul sama sekali kalau tidak ada yang featured.
- `/certificates` me-render seluruh certificate tanpa filter.
- Card tanpa `image_url` menampilkan fallback dan tidak memicu lightbox saat diklik.
- Card dengan `image_url` membuka lightbox saat gambar diklik.
- Link "Verifikasi" hanya muncul kalau `credential_url` terisi, dan membuka tab baru.

## Kriteria selesai

- Migration `04_certificates.sql` sudah diapply ke Supabase (RLS aktif, terverifikasi lewat `list_tables`/dashboard).
- Admin CRUD certificates berfungsi penuh dengan pola auth-guard yang sama seperti modul admin lain.
- Section featured tampil di homepage, halaman `/certificates` menampilkan semua data, nav link berfungsi.
- Semua skenario test di atas lolos (maks retry 2x sesuai kebijakan `AGENTS.md`).
- `docs/schema.md` sudah diupdate manual dengan entity baru.
- Lolos tes manual oleh kamu (di luar scope ini).
