<div align="center">

# ⚡ Portfolio CMS — Ahmad Dhani Setiawan

**A high-performance, modern Fullstack Portfolio & Custom Admin CMS built with Next.js 16 (App Router), TypeScript, Supabase, Tailwind CSS v4, and Framer Motion.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-portfolio--dhani.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-dhani.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-Server_Components-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📐 System Architecture

The project leverages Next.js React Server Components (RSC) for zero-JS-bundle read operations, paired with Server Actions for authenticated admin mutations. Supabase handles database storage, row-level security (RLS), and file management.

```mermaid
graph TD
    subgraph Client ["Client Layer"]
        PublicUser["🌐 Public Visitor"]
        AdminUser["🔐 Admin User"]
    end

    subgraph NextServer ["Next.js 16 App Router Server"]
        RSC["⚡ React Server Components - Public Pages"]
        ProxyGuard["🛡️ Middleware Proxy Guard - proxy.ts"]
        ServerActions["⚡ Server Actions - Mutations"]
        DataCache["📦 Next.js Data Cache"]
    end

    subgraph Backend ["Database & Storage Services"]
        SupaAuth["🔑 Supabase Auth"]
        SupaDB[("🐘 Supabase PostgreSQL - RLS Enabled")]
        SupaStore["📁 Supabase Storage - Thumbnails & Certificates"]
        ResendMail["✉️ Resend Email Service"]
    end

    %% Flow connections
    PublicUser -->|1. Direct Page Request| RSC
    RSC -->|2. Direct RSC Query| SupaDB
    RSC -->|3. Serve Cached Output| DataCache

    AdminUser -->|Protected Route Access| ProxyGuard
    ProxyGuard -->|Validate Session| SupaAuth
    AdminUser -->|Submit Mutation Form| ServerActions

    ServerActions -->|Auth Guard Check| SupaAuth
    ServerActions -->|Write Data - Bypass RLS| SupaDB
    ServerActions -->|Upload Assets| SupaStore
    ServerActions -->|Bust Stale Cache| DataCache

    PublicUser -->|Submit Contact Form| ResendMail
```

---

## 🔄 Cache Invalidation & Data Mutation Lifecycle

To guarantee instant UI updates without stale Data Cache, every Admin Server Action implements strict `revalidatePath()` triggers before completion.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin User
    participant Form as Admin Form Component
    participant Action as Server Action
    participant Guard as requireAuth()
    participant DB as Supabase PostgreSQL
    participant Cache as Next.js Data Cache
    participant Router as Next.js Router

    Admin->>Form: Submit Create / Edit / Delete
    Form->>Action: Invoke Server Action(formData)
    Action->>Guard: Verify Active Admin Session
    Guard-->>Action: Authorized
    Action->>DB: Execute Mutation Query (Service Role Client)
    DB-->>Action: Query Success
    Action->>Cache: revalidatePath('/admin/...'), revalidatePath('/'), revalidatePath('/projects/[slug]')
    Note over Action,Cache: Purges stale Data Cache keys across Public & Admin routes
    Action->>Router: redirect('/admin/...') or return { success: true }
    Router-->>Admin: Render Fresh UI State
```

---

## ✨ Key Features & Engineering Highlights

### 🌐 Public Portfolio

- **Parallax Scroll Hero**: Card stack transform animations with interactive smooth scroll (`framer-motion` + `motion/react`).
- **Dynamic Project Details**: Dynamic routes `/projects/[slug]` with interactive `ImageLightbox` previews and live/repository links.
- **Structured Experience Timeline**: Timeline entries formatted with bullet-point descriptions (`TEXT[]`) and tech stack badges.
- **Verified Credentials**: Public `/certificates` directory and homepage showcase with certificate verification links.
- **Global Interactions**: Click spark effects and micro-interactions calibrated to modern design standards.

### 🔐 Content Management System (Admin Panel)

- **Defense-in-Depth Authentication**: Route protection via `proxy.ts` middleware + explicit `requireAuth()` server-side execution guards.
- **Aceternity-Style Image Upload**: File uploader (`ImageUploadInput`) with drag-and-drop, image preview, Change/Remove state management, and 10MB client validation.
- **Dynamic Bullet List Input**: Custom list component for `experiences.description` with inline addition, removal, and Enter-key shortcuts.
- **Tech Stack Tag Selector**: Multi-select chip input powered by curated tech stack options (`TECH_STACK_OPTIONS`).
- **Skills Visibility Control**: Dedicated toggle controls to show/hide skills on public views without deleting database entries.

---

## 🗺️ Application Map

| Route                 | View Type        | Description                                                                       |
| :-------------------- | :--------------- | :-------------------------------------------------------------------------------- |
| `/`                   | Public RSC       | Hero, Featured Projects, Timeline Experiences, Skills, Certificates, Contact Form |
| `/projects/[slug]`    | Public RSC       | Detailed breakdown of specific projects with full descriptions & stack tags       |
| `/certificates`       | Public RSC       | Comprehensive directory of all credentials and professional certifications        |
| `/admin/login`        | Client Component | Admin authentication page with Supabase Auth session creation                     |
| `/admin/projects`     | Protected Admin  | Projects CRUD table with live status, display order, and media upload             |
| `/admin/experiences`  | Protected Admin  | Work history CRUD form featuring dynamic bullet-point input                       |
| `/admin/skills`       | Protected Admin  | Skill matrix CRUD with category grouping & visibility toggles                     |
| `/admin/certificates` | Protected Admin  | Credentials CRUD table with credential verification link management               |

---

## 🛠️ Tech Stack & Architecture Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND & CORE FRAMEWORK                        │
├─────────────────┬───────────────────────────────────────────────────────────┤
│ Core            │ Next.js 16.2 (App Router), React 19, TypeScript (Strict) │
│ Styling         │ Tailwind CSS v4, shadcn/ui, Radix UI Primitives           │
│ Animation       │ Framer Motion, Tabler Icons, Lucide React                 │
│ Notifications   │ Sonner Toast System                                       │
└─────────────────┴───────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND & INFRASTRUCTURE                         │
├─────────────────┬───────────────────────────────────────────────────────────┤
│ Database        │ Supabase PostgreSQL (with RLS Policies)                   │
│ Authentication  │ Supabase Auth (Single Admin User)                         │
│ Storage         │ Supabase Storage Buckets (Public Read / Admin Write)      │
│ Email API       │ Resend API Integration                                    │
│ Hosting         │ Vercel Edge Platform                                      │
└─────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema & Migration Files

All database tables are versioned under `supabase/schema/`:

```
supabase/schema/
├── 01_projects.sql                         # Projects table, triggers, & RLS policies
├── 02_experiences.sql                      # Experiences table schema & display ordering
├── 03_skills.sql                           # Skills category check constraints & visibility
├── 04_certificates.sql                     # Credentials table & featured flag settings
└── 05_experiences_description_array.sql   # Migration altering description TEXT -> TEXT[]
```

---

## 🚀 Local Development Setup

### 1. Prerequisites

- Node.js `>=20.0.0`
- npm or pnpm
- A Supabase Project instance

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email Service
RESEND_API_KEY=re_your_resend_api_key
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Run SQL Migrations in Supabase Dashboard (or CLI)
# Execute SQL files in order from supabase/schema/*.sql

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application locally.

---

<div align="center">

Designed & Developed by **Dhani Setiawan** • Deployed on **Vercel**

</div>
