// src/components/editor/forms/EducationForm.tsx
"use client";

import React, {useCallback} from "react";
import {Plus, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {EducationItemSchema, type EducationItem} from "@/schemas/resume.schema";

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
        dateRange: "Aug. 2024 – Present",
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
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-zinc-300">Section Heading Title</Label>
          <Input
            value={section.title}
            onChange={(e) => updateSection(sectionId, {title: e.target.value})}
            className="bg-zinc-900 border-zinc-800 font-semibold text-zinc-100"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleAddEntry}
          className="gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500">
          <Plus className="h-3.5 w-3.5" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-zinc-200">
                #{idx + 1} — {item.institution || "Untitled Institution"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveEntry(item.id)}
                className="h-7 w-7 text-zinc-400 hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">Institution</Label>
                <Input
                  value={item.institution}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {institution: e.target.value})
                  }
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">Location</Label>
                <Input
                  value={item.location}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {location: e.target.value})
                  }
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
                  Degree / Major
                </Label>
                <Input
                  value={item.degree}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {degree: e.target.value})
                  }
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">Date Range</Label>
                <Input
                  value={item.dateRange}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {dateRange: e.target.value})
                  }
                  placeholder="Aug. 2024 – Present"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
                  GPA (Optional — Leave blank to hide)
                </Label>
                <Input
                  value={item.gpa ?? ""}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {gpa: e.target.value})
                  }
                  placeholder="3.80/4.00"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
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
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>
            </div>

            {/* Bullets */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-zinc-400">
                  Honors / Activities Bullet Points
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBullet(item.id)}
                  className="h-6 gap-1 border-zinc-700 bg-zinc-950 text-[11px]">
                  <Plus className="h-3 w-3" />
                  Add Bullet
                </Button>
              </div>
              {item.bullets.map((b) => (
                <div key={b.id} className="flex items-center gap-2">
                  <Input
                    value={b.htmlText}
                    onChange={(e) => {
                      const updatedBullets = item.bullets.map((bul) =>
                        bul.id === b.id
                          ? {...bul, htmlText: e.target.value}
                          : bul,
                      );
                      handleUpdateEntry(item.id, {bullets: updatedBullets});
                    }}
                    placeholder="Recipient of Merit Scholarship..."
                    className="h-8 bg-zinc-950 border-zinc-800 text-xs"
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
                    className="h-7 w-7 text-zinc-500 hover:text-red-400">
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
