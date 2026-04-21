IMPLEMENTATION CHECKPOINT
Web Portfolio Profesional Dhani

SYSTEM CAPABILITIES

Admin : login, logout, protected routes (/admin/\*)
CRUD Projects (create, read, update, delete + thumbnail upload)

DOMAIN STATUS

Projects : backend done (actions.ts, createServiceRoleClient) || frontend done (list, new, edit)
Experiences : backend not started || frontend not started
Skills : backend not started || frontend not started

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
Admin UI app/(admin)/layout.tsx — ThemeProvider + AdminSidebar (slate-900 sidebar, responsive)
shadcn/ui components: Button, Input, Label, Textarea, Checkbox
