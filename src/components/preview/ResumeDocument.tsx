// src/components/preview/ResumeDocument.tsx
"use client";

import React, {useEffect, useRef, useState} from "react";
import type {ResumeDocumentType} from "@/schemas/resume.schema";
import {HeaderSection} from "./sections/HeaderSection";
import {SummarySection} from "./sections/SummarySection";
import {StandardEntrySection} from "./sections/StandardEntrySection";
import {CompactListSection} from "./sections/CompactListSection";
import {SkillsSection} from "./sections/SkillsSection";

interface ResumeDocumentProps {
  resume: ResumeDocumentType;
  onPageCountChange?: (pages: number) => void;
}

const FONT_STACK_MAP: Record<string, string> = {
  "Times New Roman": "'Times New Roman', Times, Georgia, serif",
  Charter: "Charter, 'Bitstream Charter', Georgia, serif",
  Calibri: "Calibri, 'Carlito', Arial, sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  Inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  "CMU Serif": "'CMU Serif', 'Latin Modern Roman', 'Times New Roman', serif",
};

const A4_HEIGHT_PX = 1122.52;
const LETTER_HEIGHT_PX = 1056;

export function ResumeDocument({
  resume,
  onPageCountChange,
}: ResumeDocumentProps) {
  const {headerData, styleConfig, sections, skillCategories} = resume;
  const articleRef = useRef<HTMLElement | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);

  const isLetter = styleConfig.paperSize === "LETTER";
  const pageWidth = isLetter ? "8.5in" : "210mm";
  const pageHeight = isLetter ? "11in" : "297mm";
  const singlePageHeightPx = isLetter ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;

    const updatePages = () => {
      const totalHeight = el.scrollHeight;
      const calculatedPages = Math.max(
        1,
        Math.ceil((totalHeight - 4) / singlePageHeightPx),
      );
      setPageCount(calculatedPages);
      onPageCountChange?.(calculatedPages);
    };

    updatePages();

    const observer = new ResizeObserver(updatePages);
    observer.observe(el);
    return () => observer.disconnect();
  }, [resume, singlePageHeightPx, onPageCountChange]);

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

  // Setting @page margin: 0 !important forces the browser to hide the Timestamp,
  // Document Title, URL (https://typecv.vercel.app), and 1/1 page numbers!
  const dynamicPrintPageCss = `
    @media print {
      @page {
        size: ${isLetter ? "letter" : "A4"} portrait;
        margin: 0mm !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: dynamicPrintPageCss}} />

      <article
        ref={articleRef}
        className="resume-canvas shadow-xl"
        style={cssVariables}
        aria-label="Resume Document Preview">
        {/* Visual Multi-Page Break Guides (Shown in Live Editor Preview, Hidden in Print PDF) */}
        {pageCount > 1 &&
          Array.from({length: pageCount - 1}).map((_, idx) => {
            const pageNum = idx + 1;
            const topOffsetPx = pageNum * singlePageHeightPx;
            return (
              <div
                key={pageNum}
                className="no-print pointer-events-none absolute left-0 right-0 z-20 flex items-center justify-between border-b-2 border-dashed border-blue-500/70 bg-blue-50/40 px-3 py-0.5"
                style={{top: `${topOffsetPx}px`}}>
                <span className="rounded bg-blue-600 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  End of Page {pageNum} • Start of Page {pageNum + 1}
                </span>
                <span className="font-sans text-[10px] font-semibold text-blue-700">
                  {isLetter ? "US Letter Page Break" : "A4 Page Break"}
                </span>
              </div>
            );
          })}

        {/* Repeating Print Table Wrapper:
            In @media print, <thead> repeats at the top of every page and <tfoot> repeats
            at the bottom of every page, giving us multi-page top/bottom margins while
            keeping @page { margin: 0 } so browser timestamps/URLs never appear! */}
        <table className="resume-print-table">
          <thead className="resume-print-margin-spacer">
            <tr>
              <td>
                <div style={{height: "var(--resume-margin-y)"}} />
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="resume-print-body-cell">
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
              </td>
            </tr>
          </tbody>

          <tfoot className="resume-print-margin-spacer">
            <tr>
              <td>
                <div style={{height: "var(--resume-margin-y)"}} />
              </td>
            </tr>
          </tfoot>
        </table>
      </article>
    </>
  );
}
