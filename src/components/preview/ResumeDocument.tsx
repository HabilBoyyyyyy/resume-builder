// src/components/preview/ResumeDocument.tsx
import React from "react";
import type {ResumeDocumentType} from "@/schemas/resume.schema";
import {HeaderSection} from "./sections/HeaderSection";
import {SummarySection} from "./sections/SummarySection";
import {StandardEntrySection} from "./sections/StandardEntrySection";
import {CompactListSection} from "./sections/CompactListSection";
import {SkillsSection} from "./sections/SkillsSection";

interface ResumeDocumentProps {
  resume: ResumeDocumentType;
}

const FONT_STACK_MAP: Record<string, string> = {
  "Times New Roman": "'Times New Roman', Times, Georgia, serif",
  Charter: "Charter, 'Bitstream Charter', Georgia, serif",
  Calibri: "Calibri, 'Carlito', Arial, sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  Inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  "CMU Serif": "'CMU Serif', 'Latin Modern Roman', 'Times New Roman', serif",
};

export function ResumeDocument({resume}: ResumeDocumentProps) {
  const {headerData, styleConfig, sections, skillCategories} = resume;

  const isLetter = styleConfig.paperSize === "LETTER";
  const pageWidth = isLetter ? "8.5in" : "210mm";
  const pageHeight = isLetter ? "11in" : "297mm";

  const cssVariables = {
    "--resume-font-family":
      FONT_STACK_MAP[styleConfig.fontFamily] ||
      FONT_STACK_MAP["Times New Roman"],
    "--resume-page-width": pageWidth,
    "--resume-page-height": pageHeight,
    "--resume-margin-x": `${styleConfig.marginXIn}in`,
    "--resume-margin-y": `${styleConfig.marginYIn}in`,
    "--resume-font-size-base": `${styleConfig.baseFontSizePt}pt`,
    "--resume-font-size-name": `${styleConfig.nameFontSizePt}pt`,
    "--resume-font-size-section": `${styleConfig.sectionFontSizePt}pt`,
    "--resume-line-height": String(styleConfig.lineHeight),
    "--resume-section-gap": `${styleConfig.sectionGapPt}pt`,
    "--resume-item-gap": `${styleConfig.itemGapPt}pt`,
  } as React.CSSProperties;

  const visibleSections = [...sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <article
      className="resume-canvas shadow-2xl"
      style={cssVariables}
      aria-label="Resume Document Preview">
      {/* 1. Header Block */}
      <HeaderSection headerData={headerData} />

      {/* 2. Polymorphic Sections */}
      {visibleSections.map((section) => {
        if (section.sectionType === "SKILLS_LANGUAGES") {
          return (
            <SkillsSection
              key={section.id}
              title={section.title}
              categories={skillCategories}
            />
          );
        }

        if (
          section.sectionType === "SUMMARY" ||
          section.layoutVariant === "PARAGRAPH"
        ) {
          return (
            <SummarySection
              key={section.id}
              title={section.title}
              content={section.content}
              justifyText={styleConfig.justifyText}
            />
          );
        }

        if (
          section.sectionType === "CERTIFICATIONS" ||
          section.sectionType === "HONORS_AWARDS" ||
          section.layoutVariant === "COMPACT_ROW"
        ) {
          return (
            <CompactListSection
              key={section.id}
              title={section.title}
              content={section.content}
            />
          );
        }

        return (
          <StandardEntrySection
            key={section.id}
            sectionType={section.sectionType}
            title={section.title}
            content={section.content}
            justifyText={styleConfig.justifyText}
          />
        );
      })}
    </article>
  );
}
