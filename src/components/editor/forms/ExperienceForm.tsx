// src/components/editor/forms/ExperienceForm.tsx
"use client";

import React, {useCallback} from "react";
import {Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {
  ExperienceItemSchema,
  type ExperienceItem,
} from "@/schemas/resume.schema";
import {RichTextInput} from "@/components/editor/RichTextInput";

interface ExperienceFormProps {
  sectionId: string;
}

export function ExperienceForm({sectionId}: ExperienceFormProps) {
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

  const items: ExperienceItem[] = section.content
    .map((raw) => ExperienceItemSchema.safeParse(raw))
    .filter((r) => r.success)
    .map((r) => r.data!);

  const saveItems = (updated: ExperienceItem[]) => {
    updateSectionContent(
      sectionId,
      updated as unknown as Array<Record<string, unknown>>,
    );
  };

  const handleAddEntry = () => {
    saveItems([
      ...items,
      ExperienceItemSchema.parse({
        id: crypto.randomUUID(),
        title: "New Project or Role Title",
        subtitleOrRole: "",
        organizationOrLocation: "",
        techStack: [],
        url: "",
        dateRange: "2026",
        bullets: [
          {
            id: crypto.randomUUID(),
            htmlText:
              "Developed and deployed scalable feature achieving <b>99% reliability</b>.",
            isVisible: true,
          },
        ],
        isVisible: true,
      }),
    ]);
  };

  const handleMoveEntry = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    saveItems(copy);
  };

  const handleUpdateEntry = (id: string, partial: Partial<ExperienceItem>) => {
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
          Add Entry
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold text-zinc-200 truncate">
                #{idx + 1} — {item.title || "Untitled Entry"}
              </span>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={idx === 0}
                  onClick={() => handleMoveEntry(idx, -1)}
                  className="h-7 w-7 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Move Up">
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMoveEntry(idx, 1)}
                  className="h-7 w-7 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Move Down">
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleUpdateEntry(item.id, {isVisible: !item.isVisible})
                  }
                  className="h-7 w-7 text-zinc-400 hover:text-white"
                  title="Toggle Visibility">
                  {item.isVisible ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEntry(item.id)}
                  className="h-7 w-7 text-zinc-400 hover:text-red-400"
                  title="Delete Entry">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
                  Primary Title (Project / Organization / Company)
                </Label>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {title: e.target.value})
                  }
                  placeholder="VeriVision"
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
                  placeholder="July 2026 or Oct 2024 – July 2025"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
                  Role / Subtitle (Optional)
                </Label>
                <Input
                  value={item.subtitleOrRole ?? ""}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {
                      subtitleOrRole: e.target.value,
                    })
                  }
                  placeholder="Vice Project Manager or AI Engineer Intern"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
                  Institution / Location (Optional)
                </Label>
                <Input
                  value={item.organizationOrLocation ?? ""}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {
                      organizationOrLocation: e.target.value,
                    })
                  }
                  placeholder="President University or Jakarta, Indonesia"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
                  Inline Tech Stack (Comma-separated, optional)
                </Label>
                <Input
                  value={(item.techStack ?? []).join(", ")}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {
                      techStack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Python, YOLOv8, PyTorch, MobileSAM"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-zinc-400">
                  Project / Repo URL (Optional)
                </Label>
                <Input
                  value={item.url ?? ""}
                  onChange={(e) =>
                    handleUpdateEntry(item.id, {url: e.target.value})
                  }
                  placeholder="https://github.com/..."
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>
            </div>

            {/* Rich Text Bullets */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-zinc-400">
                  Impact & Achievement Bullets (Select text & click B / I /
                  Link)
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
                <div key={b.id} className="flex items-start gap-2">
                  <RichTextInput
                    value={b.htmlText}
                    onChange={(newHtml) => {
                      const updatedBullets = item.bullets.map((bul) =>
                        bul.id === b.id ? {...bul, htmlText: newHtml} : bul,
                      );
                      handleUpdateEntry(item.id, {bullets: updatedBullets});
                    }}
                    placeholder="Engineered pipeline achieving 97.7% accuracy..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleUpdateEntry(item.id, {
                        bullets: item.bullets.filter((bul) => bul.id !== b.id),
                      })
                    }
                    className="mt-1 h-7 w-7 text-zinc-500 hover:text-red-400">
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
