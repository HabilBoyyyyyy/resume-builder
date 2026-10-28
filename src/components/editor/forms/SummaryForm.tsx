// src/components/editor/forms/SummaryForm.tsx
"use client";

import React, {useCallback} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useResumeStore} from "@/store/useResumeStore";
import {SummaryItemSchema} from "@/schemas/resume.schema";
import {RichTextInput} from "@/components/editor/RichTextInput";

interface SummaryFormProps {
  sectionId: string;
}

export function SummaryForm({sectionId}: SummaryFormProps) {
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

  const firstItem =
    section.content.length > 0
      ? SummaryItemSchema.safeParse(section.content[0]).data
      : undefined;

  const currentText = firstItem?.htmlText ?? "";

  const handleTextChange = (value: string) => {
    updateSectionContent(sectionId, [
      {
        id: firstItem?.id ?? crypto.randomUUID(),
        htmlText: value,
        isVisible: true,
      },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-xs text-zinc-300">Section Heading Title</Label>
        <Input
          value={section.title}
          onChange={(e) => updateSection(sectionId, {title: e.target.value})}
          className="bg-zinc-900 border-zinc-800 font-semibold text-zinc-100"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-zinc-300">
            Summary Paragraph (Rich Text)
          </Label>
          <span className="text-[11px] text-zinc-400">
            {currentText.replace(/<[^>]*>/g, "").length} chars
          </span>
        </div>
        <RichTextInput
          multiline
          value={currentText}
          onChange={handleTextChange}
          placeholder="Write a 2–3 line technical summary..."
        />
      </div>
    </div>
  );
}
