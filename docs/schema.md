# docs/schema.md

Semua tabel independen, tidak ada relasi/foreign key antar tabel saat ini.

```mermaid
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
        string_array description
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
        boolean is_visible
        int display_order
        timestamp created_at
        timestamp updated_at
    }
    certificates {
        uuid id PK
        string title
        string issuer
        date issue_date
        string image_url
        string credential_url
        boolean is_featured
        int display_order
        timestamp created_at
        timestamp updated_at
    }
    profile_settings {
        string id PK
        string cv_url
        string cv_file_name
        timestamp created_at
        timestamp updated_at
    }
```

**Storage:**

- Bucket `thumbnails`: public, max 10MB, MIME jpeg/png/webp. Digunakan untuk projects dan certificates.
- Bucket `documents`: public, max 10MB, MIME application/pdf. Digunakan untuk CV / resume dinamis.
