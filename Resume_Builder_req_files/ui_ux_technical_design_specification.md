# UI/UX & Technical Design Specification (`Design.md`)

## 1. Visual Analysis of the Reference Template

The reference resume (*Habil Baihaki Ramadhan*) follows the classic single-column technical layout. Our design system codifies its exact typographic structure:

1. **Header Block:**

   * **Name:** Centered, Uppercase, Bold, `18pt–20pt`, tight tracking.

   * **Contact Line 1 & 2:** Centered, `9.5pt–10pt`, items separated by vertical pipes (`|`) with balanced horizontal padding (`0.4em`). Hyperlinks rendered without intrusive blue coloring (black text, clickable link metadata).

2. **Section Headings:**

   * Uppercase, Bold, `11pt`, letter-spacing `0.04em`.

   * Full-width bottom rule (`border-bottom: 1px solid #000000`), `2px` padding below text, `6px` margin before first entry.

3. **Two-Column Entry Header Pattern (Used in Education, Projects, Leadership, Work):**

   * Uses a flex/grid split (`justify-content: space-between; align-items: baseline`).

   * **Row 1:** Left side has **Primary Title** (Bold) + optional *Inline Subtitle/Tech Stack* (Regular or Italic, separated by space or comma, e.g., `VeriVision Python, YOLOv8, PyTorch, MobileSAM`). Right side has **Location** or **Date Range** (right-aligned, `white-space: nowrap`).

   * **Row 2 (Optional, e.g., Education/Leadership):** Left side has *Degree/Role* (Regular or Italic). Right side has *Date Range*.

4. **Bullet Lists:**

   * Compact vertical rhythm (`margin-top: 2px`, `line-height: 1.22`).

   * Standard round bullet (`•`), hanging indent (`padding-left: 1.1em`), left-aligned or justified text option.

5. **Compact Single-Line Entries (Used in Certifications):**

   * Left side: **Certification Name**, Issuer, and optional highlighted metric (`Score: 90/100` or `| Score: 600`).

   * Right side: Date (`June 2025`, `Feb 2025`).

6. **Skills & Languages Matrix:**

   * Single-line or wrapped paragraph per category: **Category Label:** (Bold) followed by comma-separated items (`Python, C++, JavaScript...`) with optional parenthetical proficiency (`Indonesian (Native), English (Professional Working Proficiency)`).

## 2. Application UI/UX Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Top Bar: [Logo] [Resume Title: "AI Engineer Resume"] [Undo/Redo] [ATS Check] [PDF]│
├──────────┬───────────────────────────────────┬───────────────────────────────────┤
│ Section  │ Active Section Editor Pane        │ Live Paginated Preview Canvas     │
│ Rail     │ (Scrollable Form Controls)        │ (Zoomable A4 / US Letter Sheet)   │
│          │                                   │                                   │
│ [Header] │ ▼ SKILLS & LANGUAGES              │  ┌─────────────────────────────┐  │
│ [Summ.]  │ ┌───────────────────────────────┐ │  │   HABIL BAIHAKI RAMADHAN    │  │
│ [Educ.]  │ │ :: Category: AI & Data    [🗑]│ │  │ Bekasi | +62... | email@... │  │
│ [Proj.]  │ │ Skills: [PyTorch x] [OpenCV x]│ │  │ SUMMARY                     │  │
│ [Lead.]  │ │         [YOLOv8 x] [+ Add]    │ │  │ ─────────────────────────── │  │
│ [Cert.]  │ │ Display: (•) Inline ( ) Grid  │ │  │ Information Technology...   │  │
│ [Skills] │ └───────────────────────────────┘ │  │                             │  │
│          │ [+ Add Skill Category]            │  │ EDUCATION                   │  │
│ [+ Sect] │                                   │  │ ─────────────────────────── │  │
│ ──────── │ ▼ ADD EXTENDED SECTION            │  │ President Univ.  Aug 2024.. │  │
│ [Style]  │ [Work Exp] [Publications] [Award] │  │                             │  │
│ [JSON]   │ [Volunteering] [Custom Section]   │  └─────────────────────────────┘  │
└──────────┴───────────────────────────────────┴───────────────────────────────────┘

```

### 2.1 Core User Flows

1. **Onboarding / Initialization:**

   * User selects **"Start with Technical ATS Template (Pre-filled Sample)"**, **"Start Blank"**, or **"Import Resume JSON"**.

2. Section **Customization & Expansion:**

   * Clicking `[+ Sect]` opens the **Section Library Drawer** where users can add:

     * *Work Experience*

     * *Project Experiences*

     * *Education*

     * *Leadership & Extracurriculars*

     * *Skills & Languages*

     * *Certifications & Licenses*

     * *Publications & Papers*

     * *Honors & Awards*

     * *Volunteering*

     * *Custom Section* (User picks layout archetype: **Detailed Entry with Bullets**, **Compact Left/Right Row**, or **Categorized Key-Value**).

3. **Expanded Skills Editing Experience:**

   * Users can create unlimited categories (e.g., adding *Cloud & Infrastructure*, *MLOps*, *Hardware & Embedded*).

   * Within each category, skills are entered as interactive chips/tags.

   * Clicking a skill chip opens a micro-popover allowing the user to:

     * Toggle **Bold Emphasis** (e.g., bolding `Python` and `PyTorch` for a specific job description).

     * Attach a **Proficiency / Detail Suffix** (e.g., `(Native)`, `(5 yrs)`, `(Certified)`).

     * Toggle visibility without deleting the skill (useful when tailoring a master resume for different roles: e.g., hiding PHP/Arduino skills when applying for a pure LLM role).

## 3. Design System

### 3.1 Workspace UI Tokens (Editor Chrome)

* **Color Palette:**

  * Background Primary: `#09090B` (Dark Mode) / `#F8FAFC` (Light Mode)

  * Surface / Card: `#18181B` (Dark) / `#FFFFFF` (Light)

  * Primary Accent: `#2563EB` (Royal Blue)

  * Border Subtle: `#27272A` (Dark) / `#E2E8F0` (Light)

  * Warning (Page Overflow): `#F59E0B` (Amber)

* **Editor Font:** `Inter` or `Geist Sans` for UI controls; `JetBrains Mono` for JSON/metrics.

### 3.2 Resume Document Typography & Spacing Tokens

The `<ResumeDocument />` uses CSS Custom Properties scoped to `.resume-canvas` so users can customize the look without breaking alignment:

| CSS Variable | Default Value (Reference Match) | Configurable Range | Description | 
| ----- | ----- | ----- | ----- | 
| `--resume-font-family` | `'Times New Roman', Times, serif` | `Times`, `Charter`, `Calibri`, `Arial`, `Inter`, `CMU Serif` | Primary document font. | 
| `--resume-page-width` | `210mm` (A4) or `8.5in` (Letter) | `A4` / `Letter` | Exact physical paper width. | 
| `--resume-page-height` | `297mm` (A4) or `11in` (Letter) | `A4` / `Letter` | Exact physical paper height. | 
| `--resume-margin-x` | `0.5in` (`12.7mm`) | `0.35in` – `1.0in` | Left and right page margins. | 
| `--resume-margin-y` | `0.45in` (`11.4mm`) | `0.35in` – `1.0in` | Top and bottom page margins. | 
| `--resume-font-size-base` | `10pt` | `8.5pt` – `11.5pt` | Body text, bullets, and skills list. | 
| `--resume-font-size-name` | `18pt` | `15pt` – `24pt` | Header full name size. | 
| `--resume-font-size-section` | `11pt` | `10pt` – `13pt` | Uppercase section header size. | 
| `--resume-line-height` | `1.2` | `1.05` – `1.45` | Line height for dense vs. airy reading. | 
| `--resume-section-gap` | `8pt` | `4pt` – `16pt` | Vertical spacing between sections. | 
| `--resume-item-gap` | `5pt` | `2pt` – `10pt` | Vertical spacing between entries. | 

## 4. Component Architecture & Technical Design Decisions

### 4.1 Polymorphic Section Renderer (`<SectionRenderer />`)

Rather than hardcoding only the 6 sections in the PDF, the preview engine maps over `resume.sections` (sorted by `sortOrder`) and dispatches to 4 core layout primitives:

1. **`<ParagraphSection />`:** Renders `Summary` or `Objective`.

2. **`<StandardEntrySection />`:** Renders `Education`, `Project Experiences`, `Work Experience`, `Leadership Activities`, `Volunteering`, and `Publications`. Supports:

   * Top-left primary title + inline tech stack/tags (`font-weight: normal` or `italic`).

   * Top-right location or primary date.

   * Sub-left role/subtitle + Sub-right secondary date.

   * Optional metadata line (`GPA: 3.80/4.00 | Relevant Coursework: ...`).

   * Bullet list (`<ul><li>`).

3. **`<CompactRowSection />`:** Renders `Certifications` and `Honors & Awards`. Single-line flexbox row with left title/issuer/score and right date.

4. **`<SkillsSection />`:** Renders the expanded `Skills & Languages` section in one of three user-selectable modes:

   * **Mode A: Classic Inline (Default from PDF):** `Programming Languages: Python, C++, JavaScript, PHP, SQL, HTML/CSS`

   * **Mode B: Aligned Two-Column Table (ATS-safe CSS Grid):** Left column fixed width (`150px`) for Category Name; Right column for wrapped skill list so all skill lists align vertically.

   * **Mode C: Multi-Column Category Grid:** 2 or 3 categories per row for resumes with many