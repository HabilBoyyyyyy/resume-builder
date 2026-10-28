// src/components/preview/sections/StandardEntrySection.tsx
import React from "react";
import {
  EducationItemSchema,
  ExperienceItemSchema,
  PublicationItemSchema,
  type SectionType,
} from "@/schemas/resume.schema";
import {sanitizeResumeHtml, normalizeResumeLink} from "@/lib/sanitize";

interface StandardEntrySectionProps {
  sectionType: SectionType;
  title: string;
  content: Array<Record<string, unknown>>;
  justifyText: boolean;
}

export function StandardEntrySection({
  sectionType,
  title,
  content,
  justifyText,
}: StandardEntrySectionProps) {
  if (!content || content.length === 0) return null;

  // 1. EDUCATION RENDERING
  if (sectionType === "EDUCATION") {
    const items = content
      .map((raw) => EducationItemSchema.safeParse(raw))
      .filter((r) => r.success && r.data.isVisible)
      .map((r) => r.data!);

    if (items.length === 0) return null;

    return (
      <section className="resume-section">
        <h2 className="resume-section-heading">{title}</h2>
        {items.map((item) => {
          // Strict Null Check for GPA and Coursework (Rules.md Section 2.1)
          const metaParts = [
            item.gpa?.trim() && `GPA: ${item.gpa.trim()}`,
            item.relevantCoursework?.trim() &&
              `Relevant Coursework: ${item.relevantCoursework.trim()}`,
          ].filter(Boolean);

          const visibleBullets = (item.bullets ?? []).filter(
            (b) => b.isVisible && b.htmlText.trim(),
          );

          return (
            <div key={item.id} className="resume-entry-item">
              {/* Row 1: Institution (Left) & Location/Date (Right) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "8px",
                }}>
                <div style={{fontWeight: 700}}>{item.institution}</div>
                <div style={{whiteSpace: "nowrap", textAlign: "right"}}>
                  {item.location || item.dateRange}
                </div>
              </div>

              {/* Row 2: Degree (Left) & Date Range (Right, if location occupied Row 1) */}
              {(item.degree || (item.location && item.dateRange)) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "8px",
                  }}>
                  <div style={{fontStyle: "italic"}}>{item.degree}</div>
                  {item.location && item.dateRange && (
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textAlign: "right",
                        fontStyle: "italic",
                      }}>
                      {item.dateRange}
                    </div>
                  )}
                </div>
              )}

              {/* Optional GPA & Relevant Coursework Line */}
              {metaParts.length > 0 && (
                <div style={{marginTop: "1px"}}>{metaParts.join(" | ")}</div>
              )}

              {/* Bullet Points */}
              {visibleBullets.length > 0 && (
                <ul
                  className="resume-bullet-list"
                  style={{textAlign: justifyText ? "justify" : "left"}}>
                  {visibleBullets.map((b) => (
                    <li
                      key={b.id}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeResumeHtml(b.htmlText),
                      }}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    );
  }

  // 2. PUBLICATIONS RENDERING
  if (sectionType === "PUBLICATIONS") {
    const items = content
      .map((raw) => PublicationItemSchema.safeParse(raw))
      .filter((r) => r.success && r.data.isVisible)
      .map((r) => r.data!);

    if (items.length === 0) return null;

    return (
      <section className="resume-section">
        <h2 className="resume-section-heading">{title}</h2>
        {items.map((item) => {
          const link = item.doiOrUrl
            ? normalizeResumeLink(item.doiOrUrl)
            : null;
          return (
            <div key={item.id} className="resume-entry-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "8px",
                }}>
                <div>
                  <span style={{fontWeight: 700}}>{item.title}</span>
                  {item.venue && (
                    <span style={{fontStyle: "italic"}}> — {item.venue}</span>
                  )}
                  {link?.url && (
                    <span>
                      {" "}
                      (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {link.label}
                      </a>
                      )
                    </span>
                  )}
                </div>
                <div style={{whiteSpace: "nowrap", textAlign: "right"}}>
                  {item.date}
                </div>
              </div>
              {item.authors && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeResumeHtml(item.authors),
                  }}
                />
              )}
              {item.summary && (
                <div
                  style={{
                    marginTop: "2px",
                    textAlign: justifyText ? "justify" : "left",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeResumeHtml(item.summary),
                  }}
                />
              )}
            </div>
          );
        })}
      </section>
    );
  }

  // 3. STANDARD EXPERIENCE RENDERING (Project, Work, Leadership, Volunteering, Custom)
  const items = content
    .map((raw) => ExperienceItemSchema.safeParse(raw))
    .filter((r) => r.success && r.data.isVisible)
    .map((r) => r.data!);

  if (items.length === 0) return null;

  return (
    <section className="resume-section">
      <h2 className="resume-section-heading">{title}</h2>
      {items.map((item) => {
        const cleanTechStack = (item.techStack ?? [])
          .map((t) => t.trim())
          .filter(Boolean);
        const link = item.url ? normalizeResumeLink(item.url) : null;
        const visibleBullets = (item.bullets ?? []).filter(
          (b) => b.isVisible && b.htmlText.trim(),
        );

        const hasSecondRow = Boolean(
          item.subtitleOrRole?.trim() && item.organizationOrLocation?.trim(),
        );

        return (
          <div key={item.id} className="resume-entry-item">
            {/* Row 1: Primary Title + Inline Tech Stack (Left) & Date or Location (Right) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "8px",
              }}>
              <div>
                <span style={{fontWeight: 700}}>{item.title}</span>
                {!hasSecondRow && item.subtitleOrRole?.trim() && (
                  <span style={{fontStyle: "italic"}}>
                    {" "}
                    — {item.subtitleOrRole.trim()}
                  </span>
                )}
                {cleanTechStack.length > 0 && (
                  <span style={{fontStyle: "italic", fontWeight: 400}}>
                    {" "}
                    | {cleanTechStack.join(", ")}
                  </span>
                )}
                {link?.url && (
                  <span>
                    {" "}
                    |{" "}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </span>
                )}
              </div>
              <div style={{whiteSpace: "nowrap", textAlign: "right"}}>
                {hasSecondRow
                  ? item.organizationOrLocation?.trim()
                  : item.dateRange}
              </div>
            </div>

            {/* Row 2 (Used when both Subtitle/Role AND Organization/Location are present) */}
            {hasSecondRow && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "8px",
                }}>
                <div style={{fontStyle: "italic"}}>
                  {item.subtitleOrRole?.trim()}
                </div>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "right",
                    fontStyle: "italic",
                  }}>
                  {item.dateRange}
                </div>
              </div>
            )}

            {/* Achievement Bullet Points */}
            {visibleBullets.length > 0 && (
              <ul
                className="resume-bullet-list"
                style={{textAlign: justifyText ? "justify" : "left"}}>
                {visibleBullets.map((b) => (
                  <li
                    key={b.id}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeResumeHtml(b.htmlText),
                    }}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}
