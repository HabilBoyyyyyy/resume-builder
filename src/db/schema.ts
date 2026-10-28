// src/db/schema.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const sectionTypeEnum = pgEnum("section_type_enum", [
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

export const skillDisplayModeEnum = pgEnum("skill_display_mode_enum", [
  "INLINE_COMMA",
  "ALIGNED_TABLE",
  "MULTI_COLUMN_GRID",
  "PROFICIENCY_GROUPED",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", {length: 255}).notNull().unique(),
  fullName: varchar("full_name", {length: 150}),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", {withTimezone: true})
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {withTimezone: true})
    .notNull()
    .defaultNow(),
});

export const resumesTable = pgTable(
  "resumes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {onDelete: "cascade"}),
    title: varchar("title", {length: 150}).notNull().default("Untitled Resume"),
    slug: varchar("slug", {length: 100}).unique(),
    isPublic: boolean("is_public").notNull().default(false),
    headerData: text("header_data").notNull().default("{}"), // Stored as JSON string
    styleConfig: text("style_config").notNull().default("{}"), // Stored as JSON string
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_resumes_user_id").on(table.userId)],
);

export const resumeSectionsTable = pgTable(
  "resume_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumesTable.id, {onDelete: "cascade"}),
    sectionType: sectionTypeEnum("section_type").notNull(),
    title: varchar("title", {length: 100}).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    layoutVariant: varchar("layout_variant", {length: 50})
      .notNull()
      .default("STANDARD"),
    content: text("content").notNull().default("[]"), // Stored as JSON string
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_resume_sections_resume_id").on(table.resumeId)],
);

export const skillCategoriesTable = pgTable(
  "skill_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumesTable.id, {onDelete: "cascade"}),
    name: varchar("name", {length: 100}).notNull(),
    displayMode: skillDisplayModeEnum("display_mode")
      .notNull()
      .default("INLINE_COMMA"),
    showProficiency: boolean("show_proficiency").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_skill_categories_resume").on(table.resumeId, table.sortOrder),
  ],
);

export const skillItemsTable = pgTable(
  "skill_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => skillCategoriesTable.id, {onDelete: "cascade"}),
    name: varchar("name", {length: 100}).notNull(),
    proficiency: varchar("proficiency", {length: 60}),
    yearsExperience: numeric("years_experience", {precision: 3, scale: 1}),
    isHighlighted: boolean("is_highlighted").notNull().default(false),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("idx_skill_items_category").on(table.categoryId, table.sortOrder),
  ],
);
