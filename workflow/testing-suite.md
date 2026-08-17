# Testing Suite (Vitest & Playwright)

## Konteks & Tujuan

Sesuai dengan spesifikasi teknologi di `AGENTS.md` (bagian Tech stack #8: Testing — Playwright E2E, Vitest Unit), portfolio ini membutuhkan automated testing suite untuk memastikan integritas logika utilitas dan flow end-to-end berjalan tanpa regresi.

Tujuan:

1. Setup **Vitest** untuk Unit & Integration Testing (ringan, cepat, native TypeScript & ESM support).
2. Setup **Playwright** untuk End-to-End (E2E) Testing (menguji render halaman publik, navigasi, route protection admin proxy, dan form submit).
3. Menulis unit test untuk utilitas (`parse-tech-stack`, `cn`, validasi slug/form).
4. Menulis E2E test untuk smoke test halaman utama, navigasi project detail, dan proteksi login admin.

## Requirement

1. **Vitest (Unit Testing)**:
   - Package: `vitest`, `vite-tsconfig-paths`.
   - Config: `vitest.config.ts` (alias `@/*` resolver).
   - Scripts: `npm run test` (`vitest run`), `npm run test:watch` (`vitest`).
   - Test files: `lib/utils/parse-tech-stack.test.ts`, `lib/utils.test.ts`.
2. **Playwright (E2E Testing)**:
   - Package: `@playwright/test`.
   - Config: `playwright.config.ts` (webServer pointing to `npm run dev` or `npm run start`, baseURL: `http://localhost:3000`).
   - Scripts: `npm run test:e2e` (`playwright test`).
   - Test files di `tests/e2e/`:
     - `home.spec.ts`: Memastikan homepage render dengan benar (Hero, Projects, Experiences, Skills, Certificates, Contact, Footer).
     - `admin-auth.spec.ts`: Memastikan route `/admin/*` memicu redirect ke `/admin/login` jika unauthenticated (verifikasi `proxy.ts`).

## Tahapan Implementasi

- **Tahap 1**: Instalasi dependencies testing (`vitest`, `vite-tsconfig-paths`, `@playwright/test`) dan konfigurasi `vitest.config.ts` serta `playwright.config.ts`.
- **Tahap 2**: Penulisan & eksekusi Unit Test (Vitest) untuk utility functions.
- **Tahap 3**: Penulisan & eksekusi E2E Test (Playwright) untuk alur public & admin auth.
- **Tahap 4**: Verifikasi menyeluruh & update `workflow/done.md` dan `workflow/backlog.md`.
