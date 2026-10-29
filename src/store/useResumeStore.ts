import {create} from "zustand";
import {persist} from "zustand/middleware";
import {temporal} from "zundo";
import {produce} from "immer";
import {
  ResumeDocumentSchema,
  type ResumeDocumentType,
  type HeaderData,
  type StyleConfig,
  type ResumeSection,
  type SectionType,
  type LayoutVariant,
  type SkillCategory,
  type SkillItem,
} from "@/schemas/resume.schema";
import {createSampleResume, createBlankResume} from "@/lib/sample-resume";

export interface ResumeStoreState {
  resume: ResumeDocumentType;
  activeSectionId: string; // 'HEADER' | 'STYLE' | section.id

  // Navigation & Initialization Actions
  setActiveSectionId: (id: string) => void;
  loadSampleResume: () => void;
  resetToBlankResume: () => void;
  importResumeJson: (rawJson: unknown) => {success: boolean; error?: string};

  // Document & Header Actions
  updateResumeTitle: (title: string) => void;
  updateHeaderData: (partial: Partial<HeaderData>) => void;
  updateStyleConfig: (partial: Partial<StyleConfig>) => void;

  // Section CRUD & Reordering Actions
  addSection: (
    sectionType: SectionType,
    title: string,
    layoutVariant?: LayoutVariant,
  ) => void;
  updateSection: (
    sectionId: string,
    partial: Partial<Omit<ResumeSection, "id">>,
  ) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (activeId: string, overId: string) => void;

  // Section Content (Items) Actions
  updateSectionContent: (
    sectionId: string,
    content: Array<Record<string, unknown>>,
  ) => void;

  // Expanded Skills Matrix Actions
  addSkillCategory: (name: string) => void;
  updateSkillCategory: (
    categoryId: string,
    partial: Partial<Omit<SkillCategory, "id" | "items">>,
  ) => void;
  removeSkillCategory: (categoryId: string) => void;
  reorderSkillCategories: (activeId: string, overId: string) => void;

  addSkillItem: (
    categoryId: string,
    name: string,
    proficiency?: string,
  ) => void;
  updateSkillItem: (
    categoryId: string,
    itemId: string,
    partial: Partial<Omit<SkillItem, "id" | "categoryId">>,
  ) => void;
  removeSkillItem: (categoryId: string, itemId: string) => void;
}

export const useResumeStore = create<ResumeStoreState>()(
  temporal(
    persist(
      (set) => ({
        resume: createSampleResume(),
        activeSectionId: "HEADER",

        setActiveSectionId: (id) => set({activeSectionId: id}),

        loadSampleResume: () =>
          set({
            resume: createSampleResume(),
            activeSectionId: "HEADER",
          }),

        resetToBlankResume: () =>
          set({
            resume: createBlankResume(),
            activeSectionId: "HEADER",
          }),

        importResumeJson: (rawJson: unknown) => {
          const parsed = ResumeDocumentSchema.safeParse(rawJson);
          if (!parsed.success) {
            return {
              success: false,
              error: parsed.error.issues
                .map((issue) => issue.message)
                .join(", "),
            };
          }
          set({
            resume: parsed.data,
            activeSectionId: "HEADER",
          });
          return {success: true};
        },

        updateResumeTitle: (title) =>
          set(
            produce((draft: ResumeStoreState) => {
              draft.resume.title = title;
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        updateHeaderData: (partial) =>
          set(
            produce((draft: ResumeStoreState) => {
              Object.assign(draft.resume.headerData, partial);
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        updateStyleConfig: (partial) =>
          set(
            produce((draft: ResumeStoreState) => {
              Object.assign(draft.resume.styleConfig, partial);
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        addSection: (sectionType, title, layoutVariant = "STANDARD") =>
          set(
            produce((draft: ResumeStoreState) => {
              // Guard: Disallow duplicate section types except for CUSTOM sections
              if (
                sectionType !== "CUSTOM" &&
                draft.resume.sections.some((s) => s.sectionType === sectionType)
              ) {
                // Focus existing section if user somehow triggers duplicate
                const existing = draft.resume.sections.find(
                  (s) => s.sectionType === sectionType,
                );
                if (existing) {
                  draft.activeSectionId = existing.id;
                }
                return;
              }

              const newId = crypto.randomUUID();
              draft.resume.sections.push({
                id: newId,
                sectionType,
                title,
                sortOrder: draft.resume.sections.length,
                isVisible: true,
                layoutVariant,
                content: [],
              });
              draft.activeSectionId = newId;
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        updateSection: (sectionId, partial) =>
          set(
            produce((draft: ResumeStoreState) => {
              const section = draft.resume.sections.find(
                (s) => s.id === sectionId,
              );
              if (section) {
                Object.assign(section, partial);
                draft.resume.updatedAt = new Date().toISOString();
              }
            }),
          ),

        removeSection: (sectionId) =>
          set(
            produce((draft: ResumeStoreState) => {
              draft.resume.sections = draft.resume.sections
                .filter((s) => s.id !== sectionId)
                .map((s, idx) => ({...s, sortOrder: idx}));
              if (draft.activeSectionId === sectionId) {
                draft.activeSectionId = "HEADER";
              }
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        reorderSections: (activeId, overId) =>
          set(
            produce((draft: ResumeStoreState) => {
              const oldIndex = draft.resume.sections.findIndex(
                (s) => s.id === activeId,
              );
              const newIndex = draft.resume.sections.findIndex(
                (s) => s.id === overId,
              );
              if (oldIndex === -1 || newIndex === -1) return;

              const [moved] = draft.resume.sections.splice(oldIndex, 1);
              draft.resume.sections.splice(newIndex, 0, moved);
              draft.resume.sections.forEach((s, idx) => {
                s.sortOrder = idx;
              });
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        updateSectionContent: (sectionId, content) =>
          set(
            produce((draft: ResumeStoreState) => {
              const section = draft.resume.sections.find(
                (s) => s.id === sectionId,
              );
              if (section) {
                section.content = content;
                draft.resume.updatedAt = new Date().toISOString();
              }
            }),
          ),

        addSkillCategory: (name) =>
          set(
            produce((draft: ResumeStoreState) => {
              draft.resume.skillCategories.push({
                id: crypto.randomUUID(),
                name,
                displayMode: "INLINE_COMMA",
                showProficiency: false,
                sortOrder: draft.resume.skillCategories.length,
                isVisible: true,
                items: [],
              });
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        updateSkillCategory: (categoryId, partial) =>
          set(
            produce((draft: ResumeStoreState) => {
              const category = draft.resume.skillCategories.find(
                (c) => c.id === categoryId,
              );
              if (category) {
                Object.assign(category, partial);
                draft.resume.updatedAt = new Date().toISOString();
              }
            }),
          ),

        removeSkillCategory: (categoryId) =>
          set(
            produce((draft: ResumeStoreState) => {
              draft.resume.skillCategories = draft.resume.skillCategories
                .filter((c) => c.id !== categoryId)
                .map((c, idx) => ({...c, sortOrder: idx}));
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        reorderSkillCategories: (activeId, overId) =>
          set(
            produce((draft: ResumeStoreState) => {
              const oldIndex = draft.resume.skillCategories.findIndex(
                (c) => c.id === activeId,
              );
              const newIndex = draft.resume.skillCategories.findIndex(
                (c) => c.id === overId,
              );
              if (oldIndex === -1 || newIndex === -1) return;

              const [moved] = draft.resume.skillCategories.splice(oldIndex, 1);
              draft.resume.skillCategories.splice(newIndex, 0, moved);
              draft.resume.skillCategories.forEach((c, idx) => {
                c.sortOrder = idx;
              });
              draft.resume.updatedAt = new Date().toISOString();
            }),
          ),

        addSkillItem: (categoryId, name, proficiency = "") =>
          set(
            produce((draft: ResumeStoreState) => {
              const category = draft.resume.skillCategories.find(
                (c) => c.id === categoryId,
              );
              if (category) {
                category.items.push({
                  id: crypto.randomUUID(),
                  categoryId,
                  name,
                  proficiency,
                  isHighlighted: false,
                  isVisible: true,
                  sortOrder: category.items.length,
                });
                draft.resume.updatedAt = new Date().toISOString();
              }
            }),
          ),

        updateSkillItem: (categoryId, itemId, partial) =>
          set(
            produce((draft: ResumeStoreState) => {
              const category = draft.resume.skillCategories.find(
                (c) => c.id === categoryId,
              );
              if (category) {
                const item = category.items.find((i) => i.id === itemId);
                if (item) {
                  Object.assign(item, partial);
                  draft.resume.updatedAt = new Date().toISOString();
                }
              }
            }),
          ),

        removeSkillItem: (categoryId, itemId) =>
          set(
            produce((draft: ResumeStoreState) => {
              const category = draft.resume.skillCategories.find(
                (c) => c.id === categoryId,
              );
              if (category) {
                category.items = category.items
                  .filter((i) => i.id !== itemId)
                  .map((i, idx) => ({...i, sortOrder: idx}));
                draft.resume.updatedAt = new Date().toISOString();
              }
            }),
          ),
      }),
      {
        name: "ats-resume-builder-storage",
      },
    ),
    {
      limit: 50,
    },
  ),
);
