# Product Requirements Document (PRD): ATS-First Technical Resume & CV Builder

## 1. Executive Summary & Project Vision
The objective of this project is to build a modern, web-based Resume and CV Builder specifically engineered to produce high-density, single-column, ATS-compliant (Applicant Tracking System) documents modeled after the industry-standard technical/academic layout (as exemplified by the reference resume). 

While preserving the clean typographic hierarchy of the reference template—centered contact header, full-width underlined section headers, right-aligned metadata (dates/locations), inline project tech stacks, and compact bullet points—the platform expands upon the static PDF by introducing a flexible **Skills Engine** and **Modular Section Architecture** capable of supporting comprehensive CVs and diverse industry roles.

---

## 2. Project Scope

### 2.1 In-Scope (Core Platform)
* **Template Replication & Customization:** Pixel-accurate reproduction of the single-column technical resume format with user-controlled typography (font family, size, line spacing, margins, and paper size: A4 vs. US Letter).
* **Core Resume Sections (from Reference):**
  * **Header / Personal Info:** Full Name, Location, Phone, Email, LinkedIn, GitHub, Portfolio/Website, and dynamic custom links.
  * **Summary / Objective:** Rich-text paragraph with character/line count guidance.
  * **Education:** Institution, Location, Degree/Major, Date Range, GPA, Honours, and Relevant Coursework.
  * **Project Experiences:** Project Name, Inline Tech Stack/Keywords, Project URL/Repo Link, Date Range, and Achievement Bullet Points.
  * **Leadership & Extracurricular Activities:** Organization, Department, Role, Institution/Location, Date Range, and Bullet Points.
  * **Certifications:** Certification Name, Issuing Authority, Credential URL/ID, Score/Grade (e.g., `Score: 90/100`, `Score: 600`), and Date.
  * **Skills & Languages (Expanded):** Multi-dimensional skill categorization going beyond simple comma-separated strings.
* **Extended CV/Resume Sections:**
  * **Work / Professional Experience:** Company, Role, Location, Employment Type, Date Range, and Bullet Points.
  * **Publications & Research:** Title, Authors (with self-highlight), Venue/Journal, DOI/URL, Date, and Abstract/Notes.
  * **Honors & Awards:** Award Title, Issuer, Date, and Description.
  * **Volunteering & Community Service:** Organization, Role, Date Range, and Impact Bullets.
  * **Patents / Licenses / Custom Sections:** User-defined section titles with configurable layout primitives (Detailed Entry, Compact List, or Key-Value Matrix).
* **Expanded Skills Section Capabilities:**
  * Custom category creation and reordering (e.g., *Programming Languages*, *AI & Data*, *Cloud & DevOps*, *Frameworks*, *Soft Skills*, *Spoken Languages*, *Certifications/Clearances*).
  * Optional skill metadata: Proficiency levels (*Native*, *Fluent*, *Advanced*, *Intermediate*, *Basic*), years of experience, and priority highlighting (bolding key skills for recruiter skimming).
  * Multiple ATS-safe rendering modes: **Classic Inline** (`Category: Skill 1, Skill 2, Skill 3`), **Two-Column Grid**, or **Grouped Pill/Tag Text**.

### 2.2 Out-of-Scope (Phase 1)
* Multi-column graphic-heavy templates that break standard ATS optical character recognition (OCR).
* Built-in job board scraping or automated 1-click job applications.
* Collaborative multi-user editing on the same resume document simultaneously.

---

## 3. Goals & Objectives

1. **Zero ATS Parsing Errors:** Ensure $100\%$ of generated PDFs contain native selectable text in strict top-to-bottom, left-to-right DOM reading order.
2. **High Information Density:** Allow users to fit 4–6 detailed experiences/projects, education, certifications, and 6+ skill categories cleanly onto a single page (or seamlessly paginate for multi-page CVs) via granular spacing controls.
3. **Frictionless Editing Velocity:** Enable users to go from blank state (or JSON/PDF import) to a finished, downloadable resume in under $15\text{ minutes}$.

---

## 4. Minimum Viable Product (MVP) Feature Matrix

| Feature Category | MVP Requirement | Priority |
| :--- | :--- | :--- |
| **Workspace** | Split-screen editor: Left pane for structured form inputs; Right pane for real-time paginated preview. | P0 |
| **Section Manager** | Add, rename, hide/show, duplicate, and drag-and-drop reorder any section. | P0 |
| **Item Manager** | Drag-and-drop reorder entries within sections (e.g., reorder Projects or Bullet Points). | P0 |
| **Advanced Skills** | Create unlimited categories, drag-and-drop skills between categories, toggle proficiency suffixes, bold individual skills. | P0 |
| **Rich Text Formatting** | Support bold, italic, underline, and hyperlinks within bullet points and descriptions (crucial for highlighting metrics like `ROUGE-1 F1 of 0.3742` or `97.7% accuracy`). | P0 |
| **Layout Controls** | Adjust document margins ($0.3\text{ in}$ to $1.0\text{ in}$), base font size ($9\text{ pt}$ to $12\text{ pt}$), line height ($1.0$ to $1.5$), and section gap. | P0 |
| **PDF Export Engine** | Export native vector PDF with embedded fonts, selectable text, and clickable hyperlinks. | P0 |
| **Data Portability** | Export/Import resume state as a structured `.json` file; LocalStorage auto-save for guest users; Cloud persistence for authenticated users. | P1 |
| **One-Page Fitter** | Auto-adjust spacing and font scale by $\pm 5\%$ to prevent a single orphan line from spilling onto Page 2. | P1 |

---

## 5. Technical Requirements

### 5.1 Performance & Latency
* **Live Preview Latency:** State updates from form inputs to the preview canvas must render in $< 50\text{ ms}$ ($60\text{ fps}$ feel).
* **PDF Generation Time:** Server-side or client-side print compilation must complete in $\le 2.5\text{ seconds}$ for a 2-page document.
* **Auto-Save Debounce:** Cloud synchronization must debounce at $1500\text{ ms}$ of inactivity while LocalStorage updates immediately ($< 100\text{ ms}$).

### 5.2 Print & ATS Compliance Requirements
* **No Rasterization:** PDF generation **must never** convert HTML to an image (`html2canvas` is strictly prohibited). Text must remain selectable UTF-8 text nodes.
* **Semantic Hierarchy:** Section titles, company/project headings, dates, and bullet lists must serialize linearly when copied to plain text (`Ctrl+A` $\rightarrow$ `Ctrl+C`).
* **Hyperlink Preservation:** Header links (`linkedin.com/...`, `github.com/...`, portfolio URLs) and project links must remain clickable PDF annotations (`<a href="...">`).

### 5.3 Security & Privacy
* Row-Level Security (RLS) ensuring users can only read/write their own resume documents unless explicitly marked as a public share link.
* Input sanitization on all rich-text fields to prevent Cross-Site Scripting (XSS) during preview and PDF rendering.

---

## 6. Success Metrics & KPIs

* **ATS Parse Accuracy Rate:** $\ge 99\%$ field extraction accuracy when tested against standard parsers (Workday, Greenhouse, Lever).
* **Time-to-First-Export (TTFE):** Median time from initial editor load to first PDF download $\le 12\text{ minutes}$.
* **PDF Export Success Rate:** $\ge 99.9\%$ of export requests succeed without layout shift between the web preview and downloaded PDF.
* **Single-Page Optimization Rate:** $> 85\%$ of users targeting a 1-page resume successfully fit their content using the built-in density and spacing sliders.