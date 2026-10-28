// src/components/editor/forms/PublicationsForm.tsx
"use client";

import React, {useCallback} from "react";
import {Plus, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {
  PublicationItemSchema,
  type PublicationItem,
} from "@/schemas/resume.schema";
import {RichTextInput} from "@/components/editor/RichTextInput";
import {DateRangePicker} from "@/components/editor/DateRangePicker";

interface PublicationsFormProps {
  sectionId: string;
}

export function PublicationsForm({sectionId}: PublicationsFormProps) {
  const section = useResumeStore(
    useCallback(
      (state) => state.resume.sections.find((s) => s.id === sectionId),
      [sectionId],
    ),
  );
  const updateSection = useResumeStore((state) => state.updateSection);
  const updateSectionContent = useResumeStore(
    (state) => state.updateSectionContent,
  );

  if (!section) return null;

  const items: PublicationItem[] = section.content
    .map((raw) => PublicationItemSchema.safeParse(raw))
    .filter((r) => r.success)
    .map((r) => r.data!);

  const saveItems = (updated: PublicationItem[]) => {
    updateSectionContent(
      sectionId,
      updated as unknown as Array<Record<string, unknown>>,
    );
  };

  const handleAdd = () => {
    saveItems([
      ...items,
      PublicationItemSchema.parse({
        id: crypto.randomUUID(),
        title: "Paper or Research Publication Title",
        authors: "<b>Your Name</b>, Co-Author Name",
        venue: "IEEE Conference / Journal Name",
        date: "Oct. 2026",
        doiOrUrl: "",
        summary: "",
        isVisible: true,
      }),
    ]);
  };

  const handleUpdate = (id: string, partial: Partial<PublicationItem>) => {
    saveItems(
      items.map((item) => (item.id === id ? {...item, ...partial} : item)),
    );
  };

  const handleRemove = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700">
            Section Heading Title
          </Label>
          <Input
            value={section.title}
            onChange={(e) => updateSection(sectionId, {title: e.target.value})}
            className="bg-white border-slate-300 font-bold text-slate-900"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          className="h-9 gap-1.5 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Add Publication
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">
                #{idx + 1} — {item.title || "Untitled Publication"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(item.id)}
                className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-medium text-slate-700">
                  Paper Title
                </Label>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    handleUpdate(item.id, {title: e.target.value})
                  }
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Conference / Journal Venue
                </Label>
                <Input
                  value={item.venue}
                  onChange={(e) =>
                    handleUpdate(item.id, {venue: e.target.value})
                  }
                  placeholder="IEEE ICCV 2026"
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Single-Date Calendar Picker */}
              <DateRangePicker
                label="Publication Date (Click to Pick)"
                mode="single"
                value={item.date}
                onChange={(val) => handleUpdate(item.id, {date: val})}
              />

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-medium text-slate-700">
                  Authors (Use Bold button to highlight your own name)
                </Label>
                <RichTextInput
                  value={item.authors}
                  onChange={(html) => handleUpdate(item.id, {authors: html})}
                  placeholder="Your Name, Co-Author..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-medium text-slate-700">
                  DOI or Paper URL (Optional)
                </Label>
                <Input
                  value={item.doiOrUrl ?? ""}
                  onChange={(e) =>
                    handleUpdate(item.id, {doiOrUrl: e.target.value})
                  }
                  placeholder="https://doi.org/10.1109/..."
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
