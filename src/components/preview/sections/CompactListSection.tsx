// src/components/preview/sections/CompactListSection.tsx
import React from "react";
import {CompactRowItemSchema} from "@/schemas/resume.schema";
import {normalizeResumeLink} from "@/lib/sanitize";

interface CompactListSectionProps {
  title: string;
  content: Array<Record<string, unknown>>;
}

export function CompactListSection({title, content}: CompactListSectionProps) {
  const items = content
    .map((raw) => CompactRowItemSchema.safeParse(raw))
    .filter((r) => r.success && r.data.isVisible && r.data.title.trim())
    .map((r) => r.data!);

  if (items.length === 0) return null;

  return (
    <section className="resume-section">
      <h2 className="resume-section-heading">{title}</h2>
      {items.map((item) => {
        const link = item.credentialUrl
          ? normalizeResumeLink(item.credentialUrl)
          : null;

        return (
          <div
            key={item.id}
            className="resume-entry-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "8px",
            }}>
            <div>
              <span style={{fontWeight: 700}}>{item.title.trim()}</span>
              {item.issuer?.trim() && <span> — {item.issuer.trim()}</span>}
              {item.metricOrScore?.trim() && (
                <span> | {item.metricOrScore.trim()}</span>
              )}
              {link?.url && (
                <span>
                  {" "}
                  (
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                  )
                </span>
              )}
            </div>
            {item.date?.trim() && (
              <div style={{whiteSpace: "nowrap", textAlign: "right"}}>
                {item.date.trim()}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
