// src/components/preview/sections/SummarySection.tsx
import React from "react";
import {SummaryItemSchema} from "@/schemas/resume.schema";
import {sanitizeResumeHtml} from "@/lib/sanitize";

interface SummarySectionProps {
  title: string;
  content: Array<Record<string, unknown>>;
  justifyText: boolean;
}

export function SummarySection({
  title,
  content,
  justifyText,
}: SummarySectionProps) {
  const parsedItems = content
    .map((raw) => SummaryItemSchema.safeParse(raw))
    .filter(
      (res) => res.success && res.data.isVisible && res.data.htmlText.trim(),
    )
    .map((res) => res.data!);

  if (parsedItems.length === 0) return null;

  return (
    <section className="resume-section">
      <h2 className="resume-section-heading">{title}</h2>
      {parsedItems.map((item) => (
        <div
          key={item.id}
          className="resume-entry-item"
          style={{textAlign: justifyText ? "justify" : "left"}}
          dangerouslySetInnerHTML={{
            __html: sanitizeResumeHtml(item.htmlText),
          }}
        />
      ))}
    </section>
  );
}
