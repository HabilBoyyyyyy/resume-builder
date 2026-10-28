import {z} from "zod";

/**
 * 1. ENUMERATIONS (Matching Schema.md Section 3.1)
 */
export const SectionTypeEnum = z.enum([
  "SUMMARY",
  "EDUCATION",
  "WORK_EXPERIENCE",
  "PROJECT_EXPERIENCE",
  "LEADERSHIP_ACTIVITY",
  "CERTIFICATIONS",
  "SKILLS_LANGUAGES",
  "PUBLICATIONS",
  "HONORS_AWARDS",
  "VOLUNTEERING",
  "CUSTOM",
]);
export type SectionType = z.infer<typeof SectionTypeEnum>;

export const SkillDisplayModeEnum = z.enum([
  "INLINE_COMMA", // e.g., "Programming Languages: Python, C++, SQL"
  "ALIGNED_TABLE", // Left column category, right column skills
  "MULTI_COLUMN_GRID", // 2-column or 3-column category grid
  "PROFICIENCY_GROUPED", // e.g., "Indonesian (Native), English (Professional)"
]);
export type SkillDisplayMode = z.infer<typeof SkillDisplayModeEnum>;

export const LayoutVariantEnum = z.enum([
  "STANDARD",
  "COMPACT_ROW",
  "PARAGRAPH",
]);
export type LayoutVariant = z.infer<typeof LayoutVariantEnum>;

/**
 * 2. HEADER & CONTACT LINKS SCHEMA (Matching Schema.md Section 4.1 & Rules.md Section 4.2)
 */
export const HeaderLinkSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  label: z.string().default(""), // Concise display: "github.com/username"
  url: z.string().default(""), // Normalized href: "https://github.com/username"
  isVisible: z.boolean().default(true),
});
export type HeaderLink = z.infer<typeof HeaderLinkSchema>;

export const HeaderDataSchema = z.object({
  fullName: z.string().default(""),
  location: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  links: z.array(HeaderLinkSchema).default([]),
});
export type HeaderData = z.infer<typeof HeaderDataSchema>;

/**
 * 3. TYPOGRAPHY & STYLE CONFIGURATION (Matching Schema.md Section 3.3 & Design.md Section 3.2)
 */
export const StyleConfigSchema = z.object({
  paperSize: z.enum(["A4", "LETTER"]).default("A4"),
  fontFamily: z
    .enum([
      "Times New Roman",
      "Charter",
      "Calibri",
      "Arial",
      "Inter",
      "CMU Serif",
    ])
    .default("Times New Roman"),
  baseFontSizePt: z.number().min(8.5).max(11.5).default(10),
  nameFontSizePt: z.number().min(15).max(24).default(18),
  sectionFontSizePt: z.number().min(10).max(13).default(11),
  lineHeight: z.number().min(1.05).max(1.45).default(1.2),
  marginXIn: z.number().min(0.3).max(1.0).default(0.5),
  marginYIn: z.number().min(0.3).max(1.0).default(0.45),
  sectionGapPt: z.number().min(4).max(16).default(8),
  itemGapPt: z.number().min(2).max(10).default(5),
  justifyText: z.boolean().default(false),
});
export type StyleConfig = z.infer<typeof StyleConfigSchema>;

/**
 * 4. SECTION ITEM SCHEMAS (Matching Schema.md Section 4.2)
 */

// Shared Bullet Point Schema (Rich-text HTML sanitized at render time)
export const BulletItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  htmlText: z.string().default(""),
  isVisible: z.boolean().default(true),
});
export type BulletItem = z.infer<typeof BulletItemSchema>;

// A. Summary / Paragraph Item
export const SummaryItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  htmlText: z.string().default(""),
  isVisible: z.boolean().default(true),
});
export type SummaryItem = z.infer<typeof SummaryItemSchema>;

// B. Education Item
export const EducationItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  institution: z.string().default(""),
  location: z.string().default(""),
  degree: z.string().default(""),
  dateRange: z.string().default(""),
  gpa: z.string().optional().default(""),
  relevantCoursework: z.string().optional().default(""),
  bullets: z.array(BulletItemSchema).default([]),
  isVisible: z.boolean().default(true),
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

// C. Experience Item (Used by Work, Project, Leadership, Volunteering, Custom Standard)
export const ExperienceItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().default(""),
  subtitleOrRole: z.string().optional().default(""),
  organizationOrLocation: z.string().optional().default(""),
  techStack: z.array(z.string()).optional().default([]),
  url: z.string().optional().default(""),
  dateRange: z.string().default(""),
  bullets: z.array(BulletItemSchema).default([]),
  isVisible: z.boolean().default(true),
});
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

// D. Compact Row Item (Used by Certifications, Honors & Awards)
export const CompactRowItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().default(""),
  issuer: z.string().optional().default(""),
  metricOrScore: z.string().optional().default(""),
  credentialUrl: z.string().optional().default(""),
  date: z.string().default(""),
  isVisible: z.boolean().default(true),
});
export type CompactRowItem = z.infer<typeof CompactRowItemSchema>;

// E. Publication Item
export const PublicationItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().default(""),
  authors: z.string().default(""),
  venue: z.string().default(""),
  date: z.string().default(""),
  doiOrUrl: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  isVisible: z.boolean().default(true),
});
export type PublicationItem = z.infer<typeof PublicationItemSchema>;

/**
 * 5. EXPANDED SKILLS ARCHITECTURE SCHEMAS (Matching Schema.md Section 3.5)
 */
export const SkillItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  categoryId: z.string().default(""),
  name: z.string().default(""),
  proficiency: z.string().optional().default(""),
  yearsExperience: z.number().nonnegative().optional(),
  isHighlighted: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type SkillItem = z.infer<typeof SkillItemSchema>;

export const SkillCategorySchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().default(""),
  displayMode: SkillDisplayModeEnum.default("INLINE_COMMA"),
  showProficiency: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  items: z.array(SkillItemSchema).default([]),
});
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

/**
 * 6. POLYMORPHIC RESUME SECTION & FULL DOCUMENT SCHEMA
 */
export const SectionContentItemSchema = z.union([
  SummaryItemSchema,
  EducationItemSchema,
  ExperienceItemSchema,
  CompactRowItemSchema,
  PublicationItemSchema,
]);

export const ResumeSectionSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  sectionType: SectionTypeEnum,
  title: z.string().default("SECTION"),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  layoutVariant: LayoutVariantEnum.default("STANDARD"),
  content: z.array(z.record(z.string(), z.unknown())).default([]),
});
export type ResumeSection = z.infer<typeof ResumeSectionSchema>;

export const ResumeDocumentSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().default("Technical ATS Resume"),
  slug: z.string().optional().default(""),
  isPublic: z.boolean().default(false),
  headerData: HeaderDataSchema.default(() => HeaderDataSchema.parse({})),
  styleConfig: StyleConfigSchema.default(() => StyleConfigSchema.parse({})),
  sections: z.array(ResumeSectionSchema).default([]),
  skillCategories: z.array(SkillCategorySchema).default([]),
  updatedAt: z.string().default(() => new Date().toISOString()),
});
export type ResumeDocumentType = z.infer<typeof ResumeDocumentSchema>;
