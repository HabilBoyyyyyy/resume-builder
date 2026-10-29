# System Architecture (`Architecture.md`)

## 1. High-Level Tech Stack

| Layer | Technology | Version / Spec | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | 15.x (React 19) | SSR/CSR hybrid, routing, API routes, and Server Actions. |
| **Language** | TypeScript | 5.x (Strict Mode) | End-to-end type safety across database, API, and UI. |
| **Styling** | Tailwind CSS + CSS Print | 4.x | Application UI styling and strict `@media print` rules for resume canvas. |
| **UI Primitives** | Radix UI / shadcn/ui | Latest | Accessible accordions, dialogs, popovers, sliders, and tooltips. |
| **State Management** | Zustand + Immer | 5.x | High-frequency, fine-grained reactive store with Undo/Redo middleware (`zundo`). |
| **Forms & Validation** | React Hook Form + Zod | Latest | Schema validation for resume fields and JSON import/export verification. |
| **Drag & Drop** | `@dnd-kit/core` & `sortable` | Latest | Accessible reordering for sections, experience entries, bullet points, and skills. |
| **Rich Text Editor** | Tiptap (Headless) | 2.x | Lightweight inline rich-text editing (Bold, Italic, Links, Bullet lists) without bloated HTML. |
| **Database & ORM** | PostgreSQL + Drizzle ORM | PG 16 | Relational integrity combined with typed `JSONB` for flexible section payloads. |
| **Authentication** | Auth.js (NextAuth v5) | 5.x | OAuth (Google, GitHub) and passwordless magic links. |
| **PDF Engine** | Playwright / Puppeteer (Server) + Native CSS `@page` | Latest | Headless Chromium rendering the exact React DOM print view to vector PDF. |

---

## 2. Folder Structure

```text
resume-builder/
├── public/
│   └── fonts/                         # Self-hosted WOFF2/TTF fonts (Charter, Latin Modern, Times, Inter)
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Login, register, OAuth callback routes
│   │   ├── (dashboard)/               # User's saved resumes, templates, JSON import
│   │   ├── editor/[resumeId]/         # Main split-screen resume builder workspace
│   │   ├── print/[resumeId]/          # Isolated, chrome-free route used by Headless Chromium for PDF
│   │   └── api/
│   │       ├── pdf/route.ts           # PDF compilation endpoint
│   │       └── resumes/[id]/route.ts  # Auto-save and CRUD endpoints
│   ├── components/
│   │   ├── ui/                        # Reusable shadcn/ui primitives (Button, Input, Slider, Switch)
│   │   ├── editor/
│   │   │   ├── SidebarNav.tsx         # Quick-jump section navigation & reordering
│   │   │   ├── SectionAccordion.tsx   # Wrapper for each editable section
│   │   │   ├── forms/                 # Form components per section type
│   │   │   │   ├── HeaderForm.tsx
│   │   │   │   ├── SummaryForm.tsx
│   │   │   │   ├── EducationForm.tsx
│   │   │   │   ├── ExperienceForm.tsx # Shared by Work, Projects, and Leadership
│   │   │   │   ├── CertificationsForm.tsx
│   │   │   │   ├── SkillsMatrixForm.tsx # Advanced skill category & tag editor
│   │   │   │   └── CustomSectionForm.tsx
│   │   │   ├── RichTextInput.tsx      # Restricted Tiptap instance for bullet points
│   │   │   └── StyleControlPanel.tsx  # Font, margin, spacing, and paper size controls
│   │   └── preview/
│   │       ├── ResumePreviewViewport.tsx # Zoom, pan, page-break overlay, A4/Letter scaler
│   │       ├── ResumeDocument.tsx     # Pure deterministic representation of the resume
│   │       └── sections/              # Print-ready template renderers
│   │           ├── HeaderSection.tsx
│   │           ├── SummarySection.tsx
│   │           ├── StandardEntrySection.tsx
│   │           ├── CompactListSection.tsx
│   │           └── SkillsSection.tsx
│   ├── db/
│   │   ├── index.ts                   # Database connection pool
│   │   ├── schema.ts                  # Drizzle ORM PostgreSQL schema definitions
│   │   └── migrations/                # SQL migration history
│   ├── lib/
│   │   ├── pdf-generator.ts           # Headless browser pool & PDF buffer streaming
│   │   ├── ats-validator.ts           # Heuristics checking link validity, length, and readability
│   │   └── utils.ts                   # Date formatters (e.g., "Aug. 2024 – Present")
│   ├── schemas/
│   │   └── resume.schema.ts           # Master Zod schemas (shared by Frontend, API, and DB JSONB)
│   └── store/
│       └── useResumeStore.ts          # Zustand store with temporal (undo/redo) and persistence middleware
├── drizzle.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 3. Data Flow Between Services

### 3.1 Real-Time Editing & Auto-Save Flow
```text
[User Types in Editor Form]
       │
       ▼ (Synchronous < 5ms)
[Zustand Store (Immer Mutator)] ──────► [React Preview Component Re-renders]
       │                                (Only affected section re-renders via selector)
       ├──► (Immediate) ──► [IndexedDB / LocalStorage Backup]
       │
       └──► (Debounced 1500ms) ──► [PATCH /api/resumes/:id]
                                          │
                                          ▼
                                   [Zod Validation]
                                          │
                                          ▼
                                 [PostgreSQL Database]
```

### 3.2 High-Precision PDF Generation Flow
```text
[User Clicks "Export PDF"]
       │
       ▼
[POST /api/pdf] (Sends current Resume JSON payload + Style Config)
       │
       ▼
[Server Validates Payload via Zod]
       │
       ▼
[Headless Chromium Instance (Playwright)]
  ├── Loads internal route `/print/render` with injected state
  ├── Waits for `document.fonts.ready`
  ├── Applies `@page { size: A4/Letter; margin: ... }`
  └── Executes `page.pdf({ printBackground: true, preferCSSPageSize: true })`
       │
       ▼
[Returns `application/pdf` Binary Stream to Client]
```

---

## 4. Key Technical Decisions & Rationale

### 4.1 Why Headless Chromium + Shared React DOM over `@react-pdf/renderer` or LaTeX?
* **The Problem with `@react-pdf/renderer`:** It requires maintaining a completely separate component tree using custom primitives (`<View>`, `<Text>`) that do not support standard HTML/CSS features and often exhibit subtle line-wrapping discrepancies compared to the web preview.
* **The Problem with TeX/LaTeX on the Server:** Running a full TeX Live distribution inside serverless containers is slow ($3\text{–}8\text{ seconds}$ per compile), heavy ($> 1\text{ GB}$ image size), and vulnerable to LaTeX injection if user input contains unescaped characters like `%`, `_`, or `\`.
* **Our Solution (Shared DOM + Chromium Print):** By using a single `<ResumeDocument />` React component styled with strict CSS print rules and rendering it via a warm Headless Chromium worker (or browser native `window.print()` fallback), the **Web Preview and the exported PDF are $100\%$ identical down to the sub-pixel**, compile in $< 1.2\text{ seconds}$, and produce native, ATS-readable text nodes.

### 4.2 Why Zustand + Immer over React Context?
* A resume contains deeply nested arrays (Sections $\rightarrow$ Items $\rightarrow$ Bullet Points, or Skills $\rightarrow$ Categories $\rightarrow$ Skill Items).
* Updating a single character in a bullet point using standard React Context causes the entire form tree and preview canvas to re-render, creating input lag.
* **Zustand** allows components to subscribe to granular slices of state (e.g., `useResumeStore(state => state.sections[id])`), while **Immer** allows clean mutable-style syntax for reordering nested lists and `zundo` provides effortless `Ctrl+Z` / `Ctrl+Y` history.

### 4.3 Why Restricted Tiptap over Markdown for Bullet Points?
* In the reference resume, specific words inside summaries, coursework, or bullets may require inline styling or hyperlinks without breaking layout.
* A restricted headless Tiptap instance configured with only `Document`, `Paragraph`, `Text`, `Bold`, `Italic`, `Underline`, and `Link` extensions prevents users from pasting broken tables or H1 headers while giving them familiar keyboard shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+K`).