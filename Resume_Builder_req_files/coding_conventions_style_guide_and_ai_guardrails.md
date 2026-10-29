# Coding Conventions, Style Guide, and AI/Contributor Guardrails (`Rules.md`)

This document serves as the single source of truth for human developers and AI coding assistants (Cursor, GitHub Copilot, Claude, Gemini) contributing to the Resume Builder repository. **All generated code must adhere strictly to these rules.**

---

## 1. Core Architectural Guardrails (CRITICAL)

### 1.1 ATS & PDF Rendering Integrity (NON-NEGOTIABLE)
1. **NEVER use `html2canvas`, `jspdf` image rasterization, or `<canvas>` to render the resume PDF.**
   * *Why:* Image-based PDFs destroy text selectability and result in an automatic $0\%$ score on Applicant Tracking Systems (ATS).
   * *Rule:* All PDF exports must use native HTML-to-PDF vector printing via the Headless Chromium print service or native `@media print` CSS.
2. **NEVER use CSS properties inside `<ResumeDocument />` that corrupt DOM reading order.**
   * *Prohibited inside `.resume-canvas`:* `position: absolute` for text positioning, CSS `order` manipulation, `float: right` for dates, or `flex-direction: row-reverse`.
   * *Required:* Source order in the DOM must strictly follow logical reading order: `Heading` $\rightarrow$ `Title/Subtitle` $\rightarrow$ `Date/Location` $\rightarrow$ `Bullet List`.
3. **Strict Style Isolation between App Chrome and Resume Canvas:**
   * Editor UI components (`src/components/editor/**`) use standard Tailwind utility classes and support Dark/Light themes.
   * Resume Preview components (`src/components/preview/**`) **must never** inherit dark mode styles, external Tailwind font resets, or responsive breakpoints (`sm:`, `md:`, `lg:`). A resume sheet must look identical on a $375\text{ px}$ mobile viewport (scaled via CSS `transform: scale()`) and a $2560\text{ px}$ desktop monitor.

---

## 2. TypeScript & Code Style Conventions

### 2.1 Type Safety & Validation
* **Zero `any` Policy:** Usage of `any` or `@ts-ignore` is strictly forbidden. Use `unknown` combined with Zod type guards if dynamic data is encountered (such as JSON file imports).
* **Zod-First Schema Design:** Never write standalone TypeScript interfaces for data models. Define the Zod schema in `src/schemas/resume.schema.ts` first, and infer the TypeScript type using `z.infer<typeof SchemaName>`.
* **Strict Null Checks:** Always handle `undefined` or empty strings gracefully in preview components. If an optional field (e.g., `gpa`, `relevantCoursework`, `proficiency`, or `metricOrScore`) is empty, the separator character (`|`, `,`, or `:`) preceding it **must not render**.
  * *Bad:* `GPA: {item.gpa} | Relevant Coursework: {item.coursework}` (renders dangling `GPA:  |` when empty).
  * *Good:* Render conditional array joined by separators: `[item.gpa && \`GPA: \${item.gpa}\`, item.coursework && \`Relevant Coursework: \${item.coursework}\`].filter(Boolean).join(' ')`.

### 2.2 Naming Conventions
* **Files & Directories:**
  * React Components: `PascalCase.tsx` (e.g., `SkillsMatrixForm.tsx`, `StandardEntrySection.tsx`).
  * Hooks & Stores: `camelCase.ts` prefixed with `use` (e.g., `useResumeStore.ts`, `usePageOverflow.ts`).
  * Utilities & Schemas: `kebab-case.ts` (e.g., `ats-validator.ts`, `resume.schema.ts`).
* **Database Identifiers:** `snake_case` in PostgreSQL columns; automatically mapped to `camelCase` in Drizzle ORM.

---

## 3. State Management & Performance Rules

### 3.1 Granular Zustand Selectors
* **NEVER subscribe to the root Zustand store object inside form inputs or preview sections.**
  * *Prohibited:* `const { resume, updateSection } = useResumeStore();`
  * *Required:* Use atomic selectors so typing in the "Summary" field only re-renders `<SummarySection />`:
    ```typescript
    const summarySection = useResumeStore(
      useCallback((state) => state.sections.find((s) => s.id === sectionId), [sectionId])
    );
    ```

### 3.2 Stable IDs for Drag-and-Drop (`@dnd-kit`)
* **NEVER use array indices (`index`) as React `key` props or `@dnd-kit` sortable IDs.**
* Every section, experience entry, bullet point, skill category, and skill item must be assigned a stable `UUID` (`crypto.randomUUID()`) upon creation.

---

## 4. Security & Sanitization Rules

### 4.1 Rich Text Sanitization
* Bullet points and summaries allow inline formatting (`<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<a href="...">`).
* **Rule:** Every string rendered via `dangerouslySetInnerHTML` in `<ResumeDocument />` **must** pass through `DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'a'], ALLOWED_ATTR: ['href', 'target', 'rel'] })`.

### 4.2 URL Normalization
* In the reference resume, links are displayed concisely without protocol prefixes (e.g., `linkedin.com/in/habilbaihakiramadhan`, `github.com/HabilBoyyyyyy`, `habilboy.vercel.app`), while their underlying `href` must be a valid absolute URI (`https://...`).
* **Rule:** Always store both `label` (display text) and `url` (normalized with `https://` protocol) in link objects.

---

## 5. Limitations & Directives for AI Contributors

When an AI assistant is asked to add a feature, fix a bug, or add a new resume section type, it must follow this checklist:

1. **Do Not Hardcode Section Titles:**
   * Even for standard sections like `PROJECT EXPERIENCES` or `SKILLS & LANGUAGES`, always render `section.title` from state so the user can rename `PROJECT EXPERIENCES` to `SELECTED PROJECTS` or localize the resume into Indonesian/other languages.
2. **Preserve Backwards Compatibility on JSON Imports:**
   * Whenever adding a new field to `resume.schema.ts`, always provide a `.default(...)` in the Zod schema so older exported `.json` resume files still import without validation errors.
3. **Pagination & Print Break Rules:**
   * Always apply `break-inside: avoid;` (CSS `page-break-inside: avoid;`) to individual experience items (`.resume-entry-item`) so a project header is never orphaned at the bottom of Page 1 with its bullet points on Page 2.
   * Never apply `break-inside: avoid;` to an entire `.resume-section` container, as a section with 5 projects must be allowed to split cleanly between items across pages.
4. **No External Network Calls During Print Rendering:**
   * All resume fonts (`Times New Roman`, `Charter`, `Latin Modern`, `Inter`) must be loaded locally from `/public/fonts` via `@font-face` with `font-display: block` so the PDF generator never produces a fallback font due to a slow Google Fonts CDN request.