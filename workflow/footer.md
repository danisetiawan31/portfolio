# Footer

## Konteks & tujuan

Footer belum ada di project (placeholder `// import Footer` sudah nangkring
di beberapa halaman tapi belum diimplementasi). Tujuan: kasih exit point
kedua (nav ulang + link sosial) buat pembaca yang udah scroll sampai bawah,
plus wordmark besar sebagai elemen visual-memorable. Bukan section
promosi/CTA — Contact section di tengah halaman udah cover itu.

## Requirement

1. Buat `components/layout/footer.tsx` (Server Component, gak butuh
   interaktivitas/state apapun).
2. Baris nav: reuse `NAV_ITEMS` dari `components/layout/constants.tsx`
   langsung (bukan array baru) — link ke tiap section (`/#projects`, dst).
3. Baris sosial (GitHub, LinkedIn): refactor dulu — extract dari
   hardcoded URL di `components/sections/contact.tsx` (`InfoCard` GitHub &
   LinkedIn) jadi `SOCIAL_LINKS` baru di `constants.tsx`. `contact.tsx` dan
   `footer.tsx` sama-sama consume dari situ, biar URL gak ke-duplikasi di 2
   file (kalau nanti ganti username, cukup ubah 1 tempat).

```ts
   export const SOCIAL_LINKS = [
     { name: 'GitHub', url: 'https://github.com/danisetiawan31', icon: <IconBrandGithub size={16} /> },
     { name: 'LinkedIn', url: 'https://linkedin.com/in/ahmaddhanisetiawan', icon: <IconBrandLinkedin size={16} /> },
   ]
```

Tiap link sosial: `target="_blank"` + `rel="noopener noreferrer"`. 4. Baris teks kecil, center, muted: "Built with Next.js and Supabase" —
gantiin slot "Privacy Policy" dari referensi (gak relevan buat portfolio
personal). 5. Wordmark besar "dhani" — bleeding ke tepi container (negative margin,
`overflow: hidden` di wrapper), `font-size: clamp(70px, 17vw, 200px)`,
`font-weight: 500`, `letter-spacing: -0.02em`, warna `text-primary`
(reuse token primary yang udah ada, bukan token baru). 6. Efek fade di wordmark pakai `mask-image` (bukan `background-clip` +
gradient warna — itu ganti warna, bukan memudarkan opacity ke background):

```css
.footer-wordmark {
  -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 95%);
  mask-image: linear-gradient(to bottom, black 55%, transparent 95%);
}
```

Titik persentase perlu di-tuning manual pas lihat hasil render asli,
angka di atas cuma starting point. 7. Wordmark wajib `aria-hidden="true"` — murni dekoratif, nama "Dhani" yang
accessible tetap harus ada di tempat lain (Hero/`<title>`), bukan cuma
di sini. 8. Uncomment `import Footer` + `<Footer />` di `app/page.tsx` (landing) dan
`app/certificates/page.tsx` — cek juga apakah ada halaman lain yang
punya placeholder comment serupa yang terlewat.

## Tahapan implementasi

Menyentuh 1 layer (UI) + refactor kecil ke `constants.tsx` (bukan
skema/data layer beneran), jadi urutan baku skema→data-layer di `AGENTS.md`
gak applicable literal. Tetap dibagi bertahap:

- Tahap 1: refactor `SOCIAL_LINKS` ke `constants.tsx`, update `contact.tsx`
  buat consume dari situ (regression check: tampilan Contact section gak
  berubah) — poin 3.
- Tahap 2: bangun `Footer` component (nav + sosial + teks kecil + wordmark
  - fade), belum di-wire ke halaman — poin 1, 2, 4, 5, 6, 7.
- Tahap 3: wiring ke `app/page.tsx` & `app/certificates/page.tsx`, verifikasi
  visual di kedua halaman, cek breakpoint mobile — poin 8.

Lapor & tunggu konfirmasi tiap tahap sebelum lanjut.

## Skema/struktur data

Tidak ada perubahan skema database. Perubahan struktur cuma di
`constants.tsx` (nambah `SOCIAL_LINKS`), bukan tabel Supabase.

## Edge case

- Viewport sangat sempit (mobile kecil) → `clamp()` minimum 70px harus
  tetap muat tanpa horizontal scroll; wrapper wajib `overflow: hidden`
  sebagai safeguard kedua.
- Browser tanpa support `mask-image` (kasus langka) → graceful degradation
  jadi warna primary solid tanpa fade, bukan broken/invisible — bukan bug
  yang wajib di-polyfill, cukup dipastikan gak crash/ke-hide total.
- Footer di halaman `/certificates` vs `/` → pastikan konteks section-anchor
  di `NAV_ITEMS` (`/#projects` dst) tetap kebawa balik ke landing page
  dengan benar walau diakses dari `/certificates` (link relatif ke root,
  bukan anchor lokal ke halaman itu sendiri).
- `contact.tsx` refactor (poin 3) → regression check wajib: label icon,
  urutan, dan styling `InfoCard` GitHub/LinkedIn gak berubah visual sama
  sekali, cuma sumber data-nya yang pindah.

## Testing

- Footer render semua item `NAV_ITEMS` dengan href yang benar.
- Link GitHub/LinkedIn render dengan href benar, `target="_blank"`,
  `rel="noopener noreferrer"`.
- Wordmark element punya `aria-hidden="true"`.
- Footer muncul di `/` dan `/certificates` (regression: import placeholder
  ke-uncomment dengan benar, gak ada duplicate render).
- `contact.tsx` — GitHub/LinkedIn `InfoCard` masih render identik setelah
  refactor ke `SOCIAL_LINKS` (regression, bukan test baru).

## Kriteria selesai

- Semua requirement & test di atas terpenuhi.
- Dicek manual: wordmark fade halus di browser utama (Chrome/Firefox/Safari),
  gak overflow di mobile, nav & social link berfungsi ke tujuan yang benar,
  gak ada duplikasi sumber data (NAV_ITEMS & SOCIAL_LINKS masing-masing
  cuma didefinisikan 1 tempat).
