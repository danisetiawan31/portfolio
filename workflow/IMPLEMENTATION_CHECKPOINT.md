IMPLEMENTATION CHECKPOINT
Web Portfolio Profesional Dhani

SYSTEM CAPABILITIES

Admin : login, logout, protected routes (/admin/\*)
CRUD Projects (create, read, update, delete + thumbnail upload, delete fix)

DOMAIN STATUS

Projects : backend done (actions.ts, createServiceRoleClient) || frontend done (list, new, edit)
Experiences : backend not started || frontend not started
Experiences : backend done (actions.ts, constants.ts) || frontend done (list, new, edit)
Skills : backend done (actions.ts, constants.ts) || frontend done (list, new, edit)

DATABASE

projects Stores portfolio projects. RLS enabled, public read only.
experiences Stores work experience. RLS enabled, public read only.
skills Stores skills with category and context. RLS enabled, public read only.

STORAGE

thumbnails Public bucket. Max 10MB. MIME: jpeg, png, webp. Upload via createStorageAdminClient (service role).

CONVENTIONS

Supabase lib/supabase/client.ts (browser), lib/supabase/server.ts (server + admin)
createServiceRoleClient() — pure @supabase/supabase-js, bypasses RLS, use for ALL admin DB + storage ops
createAdminClient() — @supabase/ssr, use for auth only
Types types/database.ts — generated via Supabase CLI, do not edit manually
Schema SQL supabase/schema/ — 01_projects.sql, 02_experiences.sql, 03_skills.sql
Auth Supabase Auth, single admin. Route protection via proxy.ts
Env NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY

Admin UI DeleteConfirmButton reusable → components/admin/delete-confirm-button.tsx

Providers (ThemeProvider wrapper) → components/providers.tsx, used in app/layout.tsx

'use server' files must not export constants — use separate constants.ts per module

Public layout will need Providers added in Phase 4

AdminSidebar location: components/admin/admin-sidebar.tsx

shadcn/ui components: Button, Input, Label, Textarea, Checkbox

Icons public/icons/ filenames inconsistent casing (ts.svg, Bootstrap.svg, mangodb.svg)
Normalize naming before Phase 4 public Skills section renders them

DESIGN SYSTEM
Font Inter (--font-sans) for headings via font-heading utility
Geist Mono (--font-mono) for code
Theme Light: bg #FFFFFF, surface #F5F3FF, primary #7C5CE4
Dark: bg #1C1C1C, surface #2C303D, primary #A089E6
Animation Medium — page transitions, section reveals, hover states
Providers components/providers.tsx — wraps Providers in app/layout.tsx
