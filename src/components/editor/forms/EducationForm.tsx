// src/components/editor/forms/EducationForm.tsx
"use client";

import React, {useCallback} from "react";
import {Plus, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {EducationItemSchema, type EducationItem} from "@/schemas/resume.schema";
import {DateRangePicker} from "@/components/editor/DateRangePicker";
import {RichTextInput} from "@/components/editor/RichTextInput";

interface EducationFormProps {
  sectionId: string;
}

export function EducationForm({sectionId}: EducationFormProps) {
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

  const items: EducationItem[] = section.content
    .map((raw) => EducationItemSchema.safeParse(raw))
    .filter((r) => r.success)
    .map((r) => r.data!);

  const saveItems = (updated: EducationItem[]) => {
    updateSectionContent(
      sectionId,
      updated as unknown as Array<Record<string, unknown>>,
    );
  };

  const handleAddEntry = () => {
    saveItems([
      ...items,
      EducationItemSchema.parse({
        id: crypto.randomUUID(),
        institution: "University Name",
        location: "City, Country",
        degree: "Bachelor of Science in Computer Science",
        dateRange: "Aug. 2023 – Present",
        gpa: "",
        relevantCoursework: "",
        bullets: [],
        isVisible: true,
      }),
    ]);
  };

  const handleUpdateEntry = (id: string, partial: Partial<EducationItem>) => {
    saveItems(
      items.map((item) => (item.id === id ? {...item, ...partial} : item)),
    );
  };

  const handleRemoveEntry = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const handleAddBullet = (entryId: string) => {
    const target = items.find((i) => i.id === entryId);
    if (!target) return;
    handleUpdateEntry(entryId, {
      bullets: [
        ...target.bullets,
        {id: crypto.randomUUID(), htmlText: "", isVisible: true},
      ],
    });
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
          onClick={handleAddEntry}
          className="h-9 gap-1.5 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-800">
                #{idx + 1} — {item.institution || "Untitled Institution"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveEntry(item.id)}
                className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Institution
                </Label>
                <Input
                  value={item.institution}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {institution: e.target.value})
                  }
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Location
                </Label>
                <Input
                  value={item.location}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {location: e.target.value})
                  }
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Degree / Major
                </Label>
                <Input
                  value={item.degree}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {degree: e.target.value})
                  }
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Calendar Date Range Picker */}
              <DateRangePicker
                label="Date Range (Click to Pick)"
                mode="range"
                value={item.dateRange}
                onChange={(val) => handleUpdateEntry(item.id, {dateRange: val})}
              />

              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  GPA (Optional — Leave blank to hide)
                </Label>
                <Input
                  value={item.gpa ?? ""}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {gpa: e.target.value})
                  }
                  placeholder="3.92/4.00"
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Relevant Coursework (Optional)
                </Label>
                <Input
                  value={item.relevantCoursework ?? ""}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {
                      relevantCoursework: e.target.value,
                    })
                  }
                  placeholder="AI, Machine Learning, Web Development"
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Bullets */}
            <div className="space-y-2.5 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">
                  Honors & Academic Highlights
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBullet(item.id)}
                  className="h-7 gap-1 border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-50">
                  <Plus className="h-3 w-3" />
                  Add Highlight
                </Button>
              </div>
              {item.bullets.map((b) => (
                <div key={b.id} className="flex items-start gap-2">
                  <RichTextInput
                    value={b.htmlText}
                    onChange={(newHtml) => {
                      const updatedBullets = item.bullets.map((bul) =>
                        bul.id === b.id ? {...bul, htmlText: newHtml} : bul,
                      );
                      handleUpdateEntry(item.id, {bullets: updatedBullets});
                    }}
                    placeholder="Dean's List Honoree..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      handleUpdateEntry(item.id, {
                        bullets: item.bullets.filter((bul) => bul.id !== b.id),
                      });
                    }}
                    className="mt-1 h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
