# Dynamic CV Management

## Konteks & Tujuan

Link "Download CV" di Hero saat ini mengarah ke file statis lokal (`public/file/cv.pdf`). Untuk memperbarui CV, saat ini pengembang harus mengganti file di repositori dan melakukan _deploy_ ulang.

Tujuan fitur ini adalah membuat pengelolaan CV menjadi dinamis:

1. Admin dapat mengunggah file CV (format PDF) langsung melalui Admin CMS.
2. Setiap kali ada upload CV baru, file lama di Supabase Storage otomatis dihapus/di-replace (hanya ada 1 file CV aktif di sistem).
3. Nama file saat upload fleksibel (bebas nama apa saja dari laptop), dan sistem otomatis menyimpan nama file asli serta URL publiknya.
4. Tombol "Download CV" di halaman depan (Hero section) otomatis mengambil URL CV terbaru secara dinamis dari database/storage.

## Requirement

1. **Storage & Schema**:
   - Bucket Supabase Storage `documents` (public read, authenticated upload/delete, MIME `application/pdf`, max 10 MB).
   - Tabel `profile_settings` (singleton table untuk menyimpan konfigurasi profile/CV: `cv_url`, `cv_file_name`, `updated_at`).
   - RLS aktif: Public read (anon/authenticated SELECT), Admin write (via Service Role Client).
2. **Data Layer**:
   - Server Action `uploadCV(formData: FormData)`:
     - Proteksi `requireAuth()`.
     - Validasi MIME type: wajib `application/pdf`.
     - Validasi ukuran: maksimal 10 MB.
     - Auto-replace: Cek file CV lama di storage, hapus jika ada, upload file baru, lalu update/upsert ke tabel `profile_settings`.
     - Panggil `revalidatePath('/admin')` dan `revalidatePath('/')` sebelum return.
   - Query function `getProfileSettings()` / `getCVDocument()`:
     - Mengambil data CV aktif untuk ditampilkan di Hero dan Admin.
3. **Admin UI**:
   - Menu/Card manajemen CV di Dashboard Admin (`/admin` atau `/admin/profile` / `/admin/cv`).
   - Menampilkan status CV saat ini (nama file aktif, tanggal update, tombol preview/download, tombol upload baru).
4. **Public UI**:
   - Tombol CTA "Download CV" di Hero (`hero-client.tsx`) menerima prop `cvUrl` dari server component `hero.tsx`.
   - Jika `cvUrl` tersedia, tombol mengarah ke URL tersebut dengan atribut download rapi (`CV_Ahmad_Dhani_Setiawan.pdf`). Jika belum ada di DB, fallback ke file default `/file/cv.pdf`.

## Tahapan Implementasi

- **Tahap 1 (Skema & Storage)**:
  - Buat bucket `documents` di Supabase Storage.
  - Buat tabel `profile_settings` beserta RLS dan trigger `set_updated_at()`.
  - File SQL: `supabase/schema/06_profile_settings.sql`.
- **Tahap 2 (Data Layer)**:
  - Buat query function `lib/supabase/queries/profile.ts`.
  - Buat server action `app/admin/actions/profile.ts` atau `app/admin/cv/actions.ts`.
- **Tahap 3 (UI Layer)**:
  - Komponen admin upload CV di dashboard `/admin`.
  - Integrasi URL CV dinamis ke `components/sections/hero.tsx` & `hero-client.tsx`.
- **Tahap 4 (Test & Verifikasi)**:
  - Uji coba upload file PDF baru dari Admin $\rightarrow$ cek replace file lama $\rightarrow$ cek tombol download di halaman utama.

## Skema/Struktur Data

```sql
-- Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- Table: profile_settings
CREATE TABLE IF NOT EXISTS profile_settings (
  id           text PRIMARY KEY DEFAULT 'singleton',
  cv_url       text,
  cv_file_name text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row_check CHECK (id = 'singleton')
);

CREATE TRIGGER profile_settings_set_updated_at
  BEFORE UPDATE ON profile_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_settings_public_read"
  ON profile_settings FOR SELECT
  TO anon, authenticated
  USING (true);
```
