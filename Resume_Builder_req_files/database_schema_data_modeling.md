# Database Schema & Data Modeling (`Schema.md`)

## 1. Architecture Overview: Hybrid Relational + Typed JSONB
A resume builder requires both **relational structure** (for users, multi-resume management, version history, and sharing permissions) and **polymorphic flexibility** (for reordering diverse section types, toggling individual skill tags, and adding custom sections).

We use **PostgreSQL 16** with a hybrid relational and strictly validated `JSONB` architecture:
* Core entities (`users`, `resumes`, `resume_versions`) are normalized relational tables.
* Modular sections (`resume_sections`) are stored relationally to allow indexed querying and clean ordering, while their section-specific item structures utilize PostgreSQL `JSONB` enforced at the application boundary via **Zod** and at the database boundary via `CHECK` constraints.

---

## 2. Entity-Relationship Diagram (ERD)

```text
┌──────────────────────────┐       1:N       ┌──────────────────────────┐
│          users           │────────────────►│         resumes          │
├──────────────────────────┤                 ├──────────────────────────┤
│ id (UUID, PK)            │                 │ id (UUID, PK)            │
│ email (VARCHAR, UNIQUE)  │                 │ user_id (UUID, FK)       │
│ full_name (VARCHAR)      │                 │ title (VARCHAR)          │
│ avatar_url (TEXT)        │                 │ slug (VARCHAR, UNIQUE)   │
│ created_at (TIMESTAMPTZ) │                 │ is_public (BOOLEAN)      │
│ updated_at (TIMESTAMPTZ) │                 │ header_data (JSONB)      │
└──────────────────────────┘                 │ style_config (JSONB)     │
                                             │ created_at (TIMESTAMPTZ) │
                                             │ updated_at (TIMESTAMPTZ) │
                                             └────────────┬─────────────┘
                                                          │
                         ┌────────────────────────────────┼────────────────────────────────┐
                         │ 1:N                            │ 1:N                            │ 1:N
                         ▼                                ▼                                ▼
         ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────────────┐
         │       resume_sections        │ │      skill_categories        │ │       resume_versions        │
         ├──────────────────────────────┤ ├──────────────────────────────┤ ├──────────────────────────────┤
         │ id (UUID, PK)                │ │ id (UUID, PK)                │ │ id (UUID, PK)                │
         │ resume_id (UUID, FK)         │ │ resume_id (UUID, FK)         │ │ resume_id (UUID, FK)         │
         │ section_type (ENUM)          │ │ name (VARCHAR)               │ │ version_label (VARCHAR)      │
         │ title (VARCHAR)              │ │ display_mode (ENUM)          │ │ snapshot_data (JSONB)        │
         │ sort_order (INTEGER)         │ │ sort_order (INTEGER)         │ │ created_at (TIMESTAMPTZ)     │
         │ is_visible (BOOLEAN)         │ │ is_visible (BOOLEAN)         │ └──────────────────────────────┘
         │ layout_variant (VARCHAR)     │ └──────────────┬───────────────┘
         │ content (JSONB)              │                │ 1:N
         └──────────────────────────────┘                ▼
                                          ┌──────────────────────────────┐
                                          │         skill_items          │
                                          ├──────────────────────────────┤
                                          │ id (UUID, PK)                │
                                          │ category_id (UUID, FK)       │
                                          │ name (VARCHAR)               │
                                          │ proficiency (VARCHAR)        │
                                          │ years_experience (NUMERIC)   │
                                          │ is_highlighted (BOOLEAN)     │
                                          │ is_visible (BOOLEAN)         │
                                          │ sort_order (INTEGER)         │
                                          └──────────────────────────────┘
```

---

## 3. PostgreSQL Table Definitions (DDL)

### 3.1 Enumerations
```sql
CREATE TYPE section_type_enum AS ENUM (
  'SUMMARY',
  'EDUCATION',
  'WORK_EXPERIENCE',
  'PROJECT_EXPERIENCE',
  'LEADERSHIP_ACTIVITY',
  'CERTIFICATIONS',
  'SKILLS_LANGUAGES',
  'PUBLICATIONS',
  'HONORS_AWARDS',
  'VOLUNTEERING',
  'CUSTOM'
);

CREATE TYPE skill_display_mode_enum AS ENUM (
  'INLINE_COMMA',       -- e.g., "Programming Languages: Python, C++, SQL"
  'ALIGNED_TABLE',      -- Left column category, right column skills
  'MULTI_COLUMN_GRID',  -- 2-column or 3-column category grid
  'PROFICIENCY_GROUPED' -- e.g., "Indonesian (Native), English (Professional)"
);
```

### 3.2 `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(150),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.3 `resumes` Table
Stores the document metadata, contact header, and typography/layout configuration.
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL DEFAULT 'Untitled Resume',
  slug VARCHAR(100) UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Contact Header (Name, Location, Phone, Email, Links[])
  header_data JSONB NOT NULL DEFAULT '{
    "fullName": "",
    "location": "",
    "phone": "",
    "email": "",
    "links": []
  }'::jsonb,

  -- Typography, Paper Size, and Spacing Tokens
  style_config JSONB NOT NULL DEFAULT '{
    "paperSize": "A4",
    "fontFamily": "Times New Roman",
    "baseFontSizePt": 10,
    "nameFontSizePt": 18,
    "sectionFontSizePt": 11,
    "lineHeight": 1.2,
    "marginXIn": 0.5,
    "marginYIn": 0.45,
    "sectionGapPt": 8,
    "itemGapPt": 5,
    "justifyText": false
  }'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
```

### 3.4 `resume_sections` Table
Stores the ordered sections of a resume. The `SKILLS_LANGUAGES` section uses the dedicated relational `skill_categories` and `skill_items` tables below for advanced filtering and reuse across resumes, while other sections store their structured entry arrays in `content`.
```sql
CREATE TABLE resume_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  section_type section_type_enum NOT NULL,
  title VARCHAR(100) NOT NULL, -- e.g., "PROJECT EXPERIENCES", "LEADERSHIP ACTIVITIES"
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  layout_variant VARCHAR(50) NOT NULL DEFAULT 'STANDARD', -- 'STANDARD', 'COMPACT_ROW', 'PARAGRAPH'
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_resume_section_order UNIQUE (resume_id, sort_order) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_resume_sections_resume_id ON resume_sections(resume_id);
```

### 3.5 `skill_categories` & `skill_items` Tables (Expanded Skills Architecture)
To support going beyond static skill lines, skills are modeled as first-class relational entities. This allows users to maintain a "Master Skill Bank", reorder categories, toggle specific skills on/off per job application, bold high-priority keywords, and attach proficiency levels or years of experience.

```sql
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g., "Programming Languages", "AI & Data", "Spoken Languages"
  display_mode skill_display_mode_enum NOT NULL DEFAULT 'INLINE_COMMA',
  show_proficiency BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE skill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,           -- e.g., "Python", "PyTorch", "Indonesian"
  proficiency VARCHAR(60),              -- e.g., "Native", "Professional Working Proficiency", "Advanced"
  years_experience NUMERIC(3, 1),       -- Optional, e.g., 3.5
  is_highlighted BOOLEAN NOT NULL DEFAULT FALSE, -- Renders skill in bold if true
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,      -- Allows hiding without deleting
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  CONSTRAINT chk_years_positive CHECK (years_experience IS NULL OR years_experience >= 0)
);

CREATE INDEX idx_skill_categories_resume ON skill_categories(resume_id, sort_order);
CREATE INDEX idx_skill_items_category ON skill_items(category_id, sort_order);
```

### 3.6 `resume_versions` Table
Allows users to save point-in-time snapshots (e.g., "AI Engineer Internship v1", "Web Dev Role v2").
```sql
CREATE TABLE resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  version_label VARCHAR(120) NOT NULL,
  snapshot_data JSONB NOT NULL, -- Full serialized export of resume + sections + skills
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 4. JSONB Payload Specifications (Zod & TypeScript Schemas)

All `JSONB` columns (`header_data` and `resume_sections.content`) are strictly validated against these structures:

### 4.1 Header Data (`resumes.header_data`)
```typescript
interface HeaderData {
  fullName: string;       // "HABIL BAIHAKI RAMADHAN"
  location: string;       // "Bekasi, West Java, Indonesia"
  phone: string;          // "+6283899254467"
  email: string;          // "habilramadhan1005@gmail.com"
  links: Array<{
    id: string;
    label: string;        // "linkedin.com/in/habilbaihakiramadhan"
    url: string;          // "https://linkedin.com/in/habilbaihakiramadhan"
    isVisible: boolean;
  }>;
}
```

### 4.2 Section Content (`resume_sections.content`)

#### A. Education Item
```typescript
interface EducationItem {
  id: string;
  institution: string;        // "President University"
  location: string;           // "Bekasi, West Java"
  degree: string;             // "Bachelor's Student in Information Technology"
  dateRange: string;          // "Aug. 2024 – Present" (or "Expected July 2026")
  gpa?: string;               // "3.80/4.00"
  relevantCoursework?: string;// "Artificial Intelligence, Machine Learning, Web Development"
  bullets: Array<{ id: string; text: string; isVisible: boolean }>;
  isVisible: boolean;
}
```

#### B. Project / Work / Leadership Item
```typescript
interface ExperienceItem {
  id: string;
  title: string;              // "VeriVision" or "Mahasiswa Penggerak - Education Department"
  subtitleOrRole?: string;    // "Vice Project Manager (VPM)" or "AI Engineer Intern"
  organizationOrLocation?: string; // "President University" or "Jakarta, Indonesia"
  techStack?: string[];       // ["Python", "YOLOv8", "PyTorch", "MobileSAM"]
  url?: string;               // Optional live demo or GitHub repository URL
  dateRange: string;          // "July 2026" or "October 2024 – July 2025"
  bullets: Array<{
    id: string;
    htmlText: string;         // Sanitised inline HTML: "Identified <b>DistilBART</b> as best..."
    isVisible: boolean;
  }>;
  isVisible: boolean;
}
```

#### C. Certification / Award Item
```typescript
interface CompactRowItem {
  id: string;
  title: string;              // "Data Analysis Camp Batch 1"
  issuer?: string;            // "Ousean Indonesia & Data Analyst Camp"
  metricOrScore?: string;     // "Score: 90/100" or "Score: 600"
  credentialUrl?: string;
  date: string;               // "Feb 2025"
  isVisible: boolean;
}
```

#### D. Publication Item (Extended Section)
```typescript
interface PublicationItem {
  id: string;
  title: string;
  authors: string;            // Supports bolding user's own name
  venue: string;              // "IEEE ICCV 2026"
  date: string;
  doiOrUrl?: string;
  summary?: string;
  isVisible: boolean;
}
```