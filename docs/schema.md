# docs/schema.md

Semua tabel independen, tidak ada relasi/foreign key antar tabel saat ini.

​`mermaid
erDiagram
    projects {
        uuid id PK
        string slug
        string title
        string description
        string_array tech_stack
        string github_url
        string live_url
        string thumbnail_url
        boolean is_featured
        int display_order
        timestamp created_at
        timestamp updated_at
    }
    experiences {
        uuid id PK
        string company
        string role
        string type
        string description
        string_array tech_stack
        date start_date
        date end_date
        boolean is_current
        int display_order
        timestamp created_at
        timestamp updated_at
    }
    skills {
        uuid id PK
        string name
        string category
        string context
        string icon
        int display_order
        timestamp created_at
        timestamp updated_at
    }
​`

**Storage:** bucket `thumbnails`, public, max 10MB, MIME jpeg/png/webp. Upload via `createServiceRoleClient()`.
