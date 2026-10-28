// src/components/preview/sections/SkillsSection.tsx
import React from "react";
import type {SkillCategory, SkillItem} from "@/schemas/resume.schema";

interface SkillsSectionProps {
  title: string;
  categories: SkillCategory[];
}

function renderSkillItemNode(item: SkillItem, showProficiency: boolean) {
  const details = [
    showProficiency && item.proficiency?.trim() ? item.proficiency.trim() : "",
    item.yearsExperience !== undefined && item.yearsExperience > 0
      ? `${item.yearsExperience} yrs`
      : "",
  ].filter(Boolean);

  const suffix = details.length > 0 ? ` (${details.join(", ")})` : "";

  return (
    <span key={item.id}>
      <span style={{fontWeight: item.isHighlighted ? 700 : 400}}>
        {item.name.trim()}
      </span>
      {suffix}
    </span>
  );
}

export function SkillsSection({title, categories}: SkillsSectionProps) {
  const visibleCategories = (categories ?? [])
    .filter((cat) => cat.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => ({
      ...cat,
      visibleItems: (cat.items ?? [])
        .filter((item) => item.isVisible && item.name.trim())
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .filter((cat) => cat.visibleItems.length > 0);

  if (visibleCategories.length === 0) return null;

  // Check if all categories use MULTI_COLUMN_GRID
  const isGridMode = visibleCategories.every(
    (c) => c.displayMode === "MULTI_COLUMN_GRID",
  );

  return (
    <section className="resume-section">
      <h2 className="resume-section-heading">{title}</h2>

      <div
        style={
          isGridMode
            ? {
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                columnGap: "16px",
                rowGap: "3px",
              }
            : {display: "flex", flexDirection: "column", gap: "2px"}
        }>
        {visibleCategories.map((cat) => {
          const shouldShowProf =
            cat.showProficiency || cat.displayMode === "PROFICIENCY_GROUPED";

          if (cat.displayMode === "ALIGNED_TABLE") {
            return (
              <div
                key={cat.id}
                className="resume-entry-item"
                style={{
                  display: "grid",
                  gridTemplateColumns: "155px 1fr",
                  alignItems: "baseline",
                  marginBottom: "2px",
                }}>
                <div style={{fontWeight: 700}}>{cat.name}:</div>
                <div>
                  {cat.visibleItems.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 && ", "}
                      {renderSkillItemNode(item, shouldShowProf)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          }

          // Default: INLINE_COMMA, PROFICIENCY_GROUPED, or MULTI_COLUMN_GRID cell
          return (
            <div
              key={cat.id}
              className="resume-entry-item"
              style={{marginBottom: "1.5px"}}>
              <span style={{fontWeight: 700}}>{cat.name}: </span>
              <span>
                {cat.visibleItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && ", "}
                    {renderSkillItemNode(item, shouldShowProf)}
                  </React.Fragment>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
