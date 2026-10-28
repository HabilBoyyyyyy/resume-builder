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
import {DateRangePicker} from "@/components/editor/DateRangePicker";

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
        date: "Mar. 2026",
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
          Add Row
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">
                #{idx + 1} — {item.title || "Untitled Certification"}
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Certification / Award Title
                </Label>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    handleUpdate(item.id, {title: e.target.value})
                  }
                  placeholder="AWS Certified Solutions Architect"
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Issuing Organization
                </Label>
                <Input
                  value={item.issuer ?? ""}
                  onChange={(e) =>
                    handleUpdate(item.id, {issuer: e.target.value})
                  }
                  placeholder="Amazon Web Services"
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">
                  Score / Metric (Optional)
                </Label>
                <Input
                  value={item.metricOrScore ?? ""}
                  onChange={(e) =>
                    handleUpdate(item.id, {metricOrScore: e.target.value})
                  }
                  placeholder="Score: 890/1000"
                  className="h-9 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>

              {/* Single-Date Calendar Picker */}
              <DateRangePicker
                label="Date Issued (Click to Pick)"
                mode="single"
                value={item.date}
                onChange={(val) => handleUpdate(item.id, {date: val})}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
