# Redesign UI Certificate Card

## Konteks & tujuan

Redesign UI komponen certificate (dipakai di landing section featured & halaman
/certificates) untuk konsistensi dengan shadcn/ui, polish visual, dan
micro-interaction (hover blur antar-card, zoom pada gambar, badge verifikasi).
Backend & data layer sudah selesai — scope ini murni UI, tidak ada perubahan skema.

## Requirement

1. Refactor `CertificateCard` pakai shadcn `Card` primitive (tambah
   `components/ui/card.tsx` via `npx shadcn add card` — belum ada di project).
2. Area gambar: `aspect-video`, inset margin kecil dari tepi card (bukan
   full-bleed seperti implementasi lama), rounded independen dari card.
3. Badge "Verified" (icon check) overlay pojok kanan-atas area gambar — tampil
   HANYA kalau `credential_url` terisi. Non-interactive (`pointer-events: none`),
   tidak boleh mengganggu klik ke gambar.
4. Tombol "Verifikasi" (shadcn `Button` variant="outline" size="sm", icon
   external-link) di bawah card — tampil HANYA kalau `credential_url` terisi,
   `target="_blank"` + `rel="noopener noreferrer"` (pertahankan dari kode lama).
5. Title (line-clamp-2 + native `title` attribute untuk full text on hover),
   issuer, formatted `issue_date` — tetap plain text, tidak dijadikan pill/badge.
6. Icon placeholder (`Award`, dipakai saat `image_url` kosong) diberi
   `aria-hidden="true"`.
7. Hover level grid: saat salah satu card di-hover, card LAIN di grid yang sama
   jadi blur + dim; card yang di-hover tetap normal. Pure CSS (group-hover
   trick), TIDAK mengubah `CertificatesSection`/`app/certificates/page.tsx`
   jadi Client Component.
8. Hover level gambar: HANYA `<img>` di dalam card yang scale (~1.05–1.08),
   card di sekitarnya (border, teks, ukuran container) tidak ikut membesar.
   Wrapper gambar `overflow: hidden` untuk clipping.
9. Klik gambar tetap membuka `ImageLightbox` (komponen existing) — verifikasi
   nesting wrapper baru (overflow-hidden + transform) tidak mengganggu
   click-handler `ImageLightbox`.
10. Entrance animation: bungkus tiap card dengan `FadeUpOnScroll` (existing di
    `components/common/`), stagger `delay={index * 0.05}` per card saat mapping.
11. Hormati `prefers-reduced-motion`: transisi blur/scale/opacity dibuat instant
    atau dinonaktifkan untuk user yang minta reduced motion.
12. `CertificatesSection` tetap tidak dirender sama sekali kalau tidak ada
    certificate featured (regression check — jangan berubah dari behavior lama).

## Tahapan implementasi

Fitur ini UI-only (tidak menyentuh skema/data layer), jadi urutan baku
skema→data-layer di AGENTS.md tidak applicable secara harfiah. Tetap dibagi
bertahap by scope agar gampang direview per sesi:

- Tahap 1 (Base component): install shadcn `Card`, refactor struktur & styling
  dasar `CertificateCard` (poin 1, 2, 5, 6)
- Tahap 2 (Elemen kondisional): badge Verified + tombol Verifikasi kondisional,
  verifikasi kompatibilitas `ImageLightbox` (poin 3, 4, 9)
- Tahap 3 (Micro-interaction): hover blur-siblings + image zoom + reduced-motion
  (poin 7, 8, 11)
- Tahap 4 (Animasi & regression): `FadeUpOnScroll` stagger + cek regression
  landing section + test (poin 10, 12)

Tetap lapor & tunggu konfirmasi tiap tahap sebelum lanjut (sesuai "Kebijakan
implementasi bertahap" di AGENTS.md), terutama tahap 3 karena micro-interaction
ini paling rawan miss-render kalau nested transform/overflow salah susun.

## Skema/struktur data

Tidak ada perubahan skema. Field yang dipakai dari `certificates` (sudah ada):
`title`, `issuer`, `issue_date`, `image_url`, `credential_url`, `is_featured`,
`display_order`.

## Edge case yang perlu dihandle

- `image_url` kosong → placeholder icon `Award` tampil; badge Verified tetap
  ditaruh di pojok placeholder container itu (bukan dihilangkan) kalau
  `credential_url` ada, supaya konsisten posisinya dengan kondisi ada gambar.
- `credential_url` kosong → badge & tombol verifikasi disembunyikan total,
  bukan ditampilkan dalam keadaan disabled.
- Title sangat panjang → line-clamp-2 + native `title` attribute sebagai fallback.
- Grid cuma berisi 1 card → hover-blur-siblings otomatis tidak actionable
  (tidak ada sibling), tidak perlu handling khusus.
- `prefers-reduced-motion` aktif → semua transisi hover instant/dinonaktifkan.
- Touch device (tanpa hover persisten) → efek hover tidak pernah trigger; ini
  acceptable karena sifatnya dekoratif, semua info & aksi tetap bisa diakses
  lewat tap normal tanpa efek hover.
- Nesting `ImageLightbox` dengan wrapper zoom baru → pastikan klik masih
  membuka lightbox (transform tidak mengubah event bubbling, tapi wajib
  diverifikasi manual, bukan diasumsikan aman).

## Testing

- `CertificateCard` dengan `credential_url` terisi → badge Verified & tombol
  Verifikasi muncul.
- `CertificateCard` tanpa `credential_url` → badge & tombol tidak dirender.
- `CertificateCard` tanpa `image_url` → placeholder icon muncul dengan
  `aria-hidden`.
- Hover salah satu card (Playwright) → computed style sibling card punya
  `filter: blur(...)`, card yang di-hover tidak.
- Klik gambar → `ImageLightbox` terbuka (regression check).
- `CertificatesSection` tanpa certificate featured → tidak dirender (regression).

## Kriteria selesai

- Semua requirement di atas terimplementasi dan lolos test di atas.
- Dicek ulang manual oleh user: hover blur-siblings mulus, image zoom terasa
  natural (bukan seluruh card ikut membesar), badge Verified tampil sesuai
  kondisi data, klik gambar masih buka lightbox, tampilan landing section dan
  `/certificates` konsisten, animasi masuk stagger tidak berlebihan.
