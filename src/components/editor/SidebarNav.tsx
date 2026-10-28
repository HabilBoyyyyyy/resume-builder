// src/components/editor/SidebarNav.tsx
"use client";

import React, {useState} from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Users,
  Award,
  Wrench,
  BookOpen,
  HeartHandshake,
  LayoutList,
  Plus,
  Sliders,
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {useResumeStore} from "@/store/useResumeStore";
import type {
  SectionType,
  LayoutVariant,
  ResumeSection,
} from "@/schemas/resume.schema";

const SECTION_LIBRARY: Array<{
  type: SectionType;
  defaultTitle: string;
  variant: LayoutVariant;
  description: string;
}> = [
  {
    type: "WORK_EXPERIENCE",
    defaultTitle: "WORK EXPERIENCE",
    variant: "STANDARD",
    description:
      "Company, Role, Location, Date Range, and Achievement Bullets.",
  },
  {
    type: "PROJECT_EXPERIENCE",
    defaultTitle: "PROJECT EXPERIENCES",
    variant: "STANDARD",
    description: "Project Name, Inline Tech Stack, Repo Link, and Bullets.",
  },
  {
    type: "EDUCATION",
    defaultTitle: "EDUCATION",
    variant: "STANDARD",
    description: "Institution, Degree, GPA, Coursework, and Honors.",
  },
  {
    type: "LEADERSHIP_ACTIVITY",
    defaultTitle: "LEADERSHIP ACTIVITIES",
    variant: "STANDARD",
    description: "Organization, Role, Institution, and Impact Bullets.",
  },
  {
    type: "CERTIFICATIONS",
    defaultTitle: "CERTIFICATIONS",
    variant: "COMPACT_ROW",
    description:
      "Compact single-line Certification Name, Issuer, Score, and Date.",
  },
  {
    type: "HONORS_AWARDS",
    defaultTitle: "HONORS & AWARDS",
    variant: "COMPACT_ROW",
    description:
      "Compact single-line Award Title, Issuer, Score/Rank, and Date.",
  },
  {
    type: "PUBLICATIONS",
    defaultTitle: "PUBLICATIONS",
    variant: "STANDARD",
    description: "Academic Papers, Authors, Venue/IEEE/ACM, and DOI Link.",
  },
  {
    type: "VOLUNTEERING",
    defaultTitle: "VOLUNTEERING",
    variant: "STANDARD",
    description: "Community Service, Organization, Role, and Impact Bullets.",
  },
  {
    type: "SUMMARY",
    defaultTitle: "SUMMARY",
    variant: "PARAGRAPH",
    description: "Executive summary or objective paragraph.",
  },
  {
    type: "CUSTOM",
    defaultTitle: "CUSTOM SECTION",
    variant: "STANDARD",
    description: "Custom section title with standard entry & bullet layout.",
  },
];

function getSectionIcon(type: SectionType) {
  switch (type) {
    case "SUMMARY":
      return <FileText className="h-4 w-4 shrink-0" />;
    case "EDUCATION":
      return <GraduationCap className="h-4 w-4 shrink-0" />;
    case "WORK_EXPERIENCE":
      return <Briefcase className="h-4 w-4 shrink-0" />;
    case "PROJECT_EXPERIENCE":
      return <FolderGit2 className="h-4 w-4 shrink-0" />;
    case "LEADERSHIP_ACTIVITY":
      return <Users className="h-4 w-4 shrink-0" />;
    case "CERTIFICATIONS":
    case "HONORS_AWARDS":
      return <Award className="h-4 w-4 shrink-0" />;
    case "SKILLS_LANGUAGES":
      return <Wrench className="h-4 w-4 shrink-0" />;
    case "PUBLICATIONS":
      return <BookOpen className="h-4 w-4 shrink-0" />;
    case "VOLUNTEERING":
      return <HeartHandshake className="h-4 w-4 shrink-0" />;
    default:
      return <LayoutList className="h-4 w-4 shrink-0" />;
  }
}

interface SortableSectionNavItemProps {
  sec: ResumeSection;
  isActive: boolean;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string, next: boolean) => void;
  onDelete: (id: string) => void;
}

function SortableSectionNavItem({
  sec,
  isActive,
  onSelect,
  onToggleVisible,
  onDelete,
}: SortableSectionNavItemProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({id: sec.id});

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between rounded-md px-1.5 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
          : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
      }`}>
      <button
        type="button"
        {...(isMounted ? attributes : {})}
        {...(isMounted ? listeners : {})}
        title="Drag to reorder section"
        className="cursor-grab p-1 text-zinc-600 hover:text-zinc-300 active:cursor-grabbing">
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onSelect(sec.id)}
        className="flex flex-1 items-center gap-2 truncate py-0.5 text-left">
        {getSectionIcon(sec.sectionType)}
        <span
          className={`truncate ${
            !sec.isVisible ? "line-through opacity-50" : ""
          }`}>
          {sec.title}
        </span>
      </button>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          title={sec.isVisible ? "Hide section" : "Show section"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisible(sec.id, !sec.isVisible);
          }}
          className="p-1 text-zinc-400 hover:text-white">
          {sec.isVisible ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-amber-500" />
          )}
        </button>
        {sec.sectionType !== "SKILLS_LANGUAGES" && (
          <button
            type="button"
            title="Delete section"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(sec.id);
            }}
            className="p-1 text-zinc-400 hover:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SidebarNav() {
  const sections = useResumeStore((state) => state.resume.sections);
  const activeSectionId = useResumeStore((state) => state.activeSectionId);
  const setActiveSectionId = useResumeStore(
    (state) => state.setActiveSectionId,
  );
  const addSection = useResumeStore((state) => state.addSection);
  const updateSection = useResumeStore((state) => state.updateSection);
  const removeSection = useResumeStore((state) => state.removeSection);
  const reorderSections = useResumeStore((state) => state.reorderSections);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const sortedSections = [...sections].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {activationConstraint: {distance: 4}}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (over && active.id !== over.id) {
      reorderSections(String(active.id), String(over.id));
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 select-none">
      <div className="flex items-center justify-between px-3 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Document Sections
        </span>
        <span className="text-[10px] text-zinc-500">Drag to reorder</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {/* 1. Fixed Header Item */}
        <button
          type="button"
          onClick={() => setActiveSectionId("HEADER")}
          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors ${
            activeSectionId === "HEADER"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}>
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate">Header & Contact</span>
        </button>

        {/* 2. Drag-and-Drop Dynamic Sections List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={sortedSections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {sortedSections.map((sec) => (
                <SortableSectionNavItem
                  key={sec.id}
                  sec={sec}
                  isActive={activeSectionId === sec.id}
                  onSelect={setActiveSectionId}
                  onToggleVisible={(id, next) =>
                    updateSection(id, {isVisible: next})
                  }
                  onDelete={removeSection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* 3. Add Section Library Modal ([+ Sect]) */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="w-full justify-start gap-2 border-dashed border-zinc-700 bg-transparent text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white">
            <Plus className="h-3.5 w-3.5" />
            Add Section
          </Button>

          <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100">
              <DialogHeader>
                <DialogTitle className="text-base">
                  Add Extended Resume / CV Section
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-2 max-h-[65vh] overflow-y-auto pr-1 pt-2">
                {SECTION_LIBRARY.map((item) => (
                  <button
                    key={`${item.type}-${item.defaultTitle}`}
                    type="button"
                    onClick={() => {
                      addSection(item.type, item.defaultTitle, item.variant);
                      setDrawerOpen(false);
                    }}
                    className="flex flex-col items-start rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-left transition hover:border-blue-500/50 hover:bg-zinc-900">
                    <div className="flex items-center gap-2 font-semibold text-xs text-zinc-100">
                      {getSectionIcon(item.type)}
                      <span>{item.defaultTitle}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 4. Bottom Style & Typography Controls Tab */}
      <div className="border-t border-zinc-800 p-2 space-y-1">
        <button
          type="button"
          onClick={() => setActiveSectionId("STYLE")}
          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors ${
            activeSectionId === "STYLE"
              ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
              : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}>
          <Sliders className="h-4 w-4 shrink-0" />
          <span>Style & Typography</span>
        </button>
      </div>
    </aside>
  );
}
