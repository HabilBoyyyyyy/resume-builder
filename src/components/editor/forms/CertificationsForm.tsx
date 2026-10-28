// src/components/editor/forms/CertificationsForm.tsx
"use client";

import React, {useCallback} from "react";
import {Plus, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {
  CompactRowItemSchema,
  type CompactRowItem,
} from "@/schemas/resume.schema";

interface CertificationsFormProps {
  sectionId: string;
}

export function CertificationsForm({sectionId}: CertificationsFormProps) {
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

  const items: CompactRowItem[] = section.content
    .map((raw) => CompactRowItemSchema.safeParse(raw))
    .filter((r) => r.success)
    .map((r) => r.data!);

  const saveItems = (updated: CompactRowItem[]) => {
    updateSectionContent(
      sectionId,
      updated as unknown as Array<Record<string, unknown>>,
    );
  };

  const handleAdd = () => {
    saveItems([
      ...items,
      CompactRowItemSchema.parse({
        id: crypto.randomUUID(),
        title: "Certification or Award Name",
        issuer: "Issuing Organization",
        metricOrScore: "Score: 95/100",
        credentialUrl: "",
        date: "June 2026",
        isVisible: true,
      }),
    ]);
  };

  const handleUpdate = (id: string, partial: Partial<CompactRowItem>) => {
    saveItems(
      items.map((item) => (item.id === id ? {...item, ...partial} : item)),
    );
  };

  const handleRemove = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
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
          onClick={handleAdd}
          className="gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500">
          <Plus className="h-3.5 w-3.5" />
          Add Row
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 sm:grid-cols-12 items-end">
            <div className="space-y-1 sm:col-span-4">
              <Label className="text-[11px] text-zinc-400">Title</Label>
              <Input
                value={item.title}
                onChange={(e) => handleUpdate(item.id, {title: e.target.value})}
                placeholder="Data Analysis Camp Batch 1"
                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-3">
              <Label className="text-[11px] text-zinc-400">Issuer</Label>
              <Input
                value={item.issuer ?? ""}
                onChange={(e) =>
                  handleUpdate(item.id, {issuer: e.target.value})
                }
                placeholder="Ousean Indonesia"
                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px] text-zinc-400">
                Score / Metric
              </Label>
              <Input
                value={item.metricOrScore ?? ""}
                onChange={(e) =>
                  handleUpdate(item.id, {metricOrScore: e.target.value})
                }
                placeholder="Score: 90/100"
                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px] text-zinc-400">Date</Label>
              <Input
                value={item.date}
                onChange={(e) => handleUpdate(item.id, {date: e.target.value})}
                placeholder="Feb 2025"
                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
              />
            </div>

            <div className="flex justify-end sm:col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(item.id)}
                className="h-8 w-8 text-zinc-400 hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
