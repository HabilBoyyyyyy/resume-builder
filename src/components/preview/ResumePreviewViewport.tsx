// src/components/preview/ResumePreviewViewport.tsx
"use client";

import React, {useState, useRef, useEffect, useCallback} from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  FileCheck2,
  Maximize2,
  ChevronLeft,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {ResumeDocument} from "./ResumeDocument";

interface ResumePreviewViewportProps {
  onBackToEditor?: () => void;
}

export function ResumePreviewViewport({
  onBackToEditor,
}: ResumePreviewViewportProps = {}) {
  const resume = useResumeStore((state) => state.resume);
  const [zoom, setZoom] = useState<number>(0.82);
  const [pageCount, setPageCount] = useState<number>(1);
  const viewportContainerRef = useRef<HTMLDivElement | null>(null);

  const isLetter = resume.styleConfig.paperSize === "LETTER";

  const handleZoomIn = () =>
    setZoom((z) => Math.min(1.4, Number((z + 0.08).toFixed(2))));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(0.35, Number((z - 0.08).toFixed(2))));
  const handleZoomReset = () => setZoom(0.82);

  const handleZoomFit = useCallback(() => {
    if (!viewportContainerRef.current) return;
    const containerWidth = viewportContainerRef.current.clientWidth;
    // Allow for padding
    const padding = containerWidth < 640 ? 24 : 48;
    const targetWidthPx = isLetter ? 816 : 794;
    const calculated = (containerWidth - padding) / targetWidthPx;
    const nextZoom = Math.min(
      1.2,
      Math.max(0.35, Number(calculated.toFixed(2))),
    );
    setZoom(nextZoom);
  }, [isLetter]);

  // Auto-fit initial zoom on small screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      handleZoomFit();
    }
  }, [handleZoomFit]);

  const handleDownloadPdf = () => {
    const previousTitle = document.title;
    const candidateName = (
      resume.headerData.fullName ||
      resume.title ||
      "Resume"
    )
      .trim()
      .replace(/\s+/g, "_");
    document.title = `${candidateName}_Resume`;
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  };

  return (
    <div className="print-unlock relative flex h-full w-full flex-col bg-slate-200 overflow-hidden">
      {/* Top Preview Toolbar (Hidden in PDF) */}
      <div className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-2.5 sm:px-4 py-2 text-xs text-slate-600 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {onBackToEditor && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBackToEditor}
              className="lg:hidden h-7 gap-1 px-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 shrink-0">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Editor</span>
            </Button>
          )}

          <span className="font-semibold text-slate-800 text-[11px] sm:text-xs shrink-0">
            {resume.styleConfig.paperSize === "A4" ? "A4" : "Letter"}
          </span>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="hidden md:inline truncate max-w-[100px]">
            {resume.styleConfig.fontFamily}
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="hidden sm:inline shrink-0">
            {resume.styleConfig.baseFontSizePt}pt
          </span>
          <span className="text-slate-300">•</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold shrink-0 ${
              pageCount === 1
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
            <FileCheck2 className="h-3 w-3 shrink-0" />
            <span>
              {pageCount} {pageCount === 1 ? "Page" : "Pages"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={handleZoomOut}
            title="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 sm:w-12 text-center font-mono text-[11px] sm:text-xs font-semibold text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={handleZoomIn}
            title="Zoom In">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={handleZoomFit}
            title="Fit to Width">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex h-7 w-7 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={handleZoomReset}
            title="Reset Zoom (82%)">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <div className="mx-1 h-4 w-[1px] bg-slate-200" />
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 sm:gap-1.5 border-slate-300 bg-white px-2 sm:px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            onClick={handleDownloadPdf}>
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save PDF</span>
          </Button>
        </div>
      </div>

      {/* Scrollable Paper Viewport (print-unlock removes scale() and scroll clipping during PDF export) */}
      <div
        ref={viewportContainerRef}
        className="print-unlock flex-1 overflow-auto p-3 sm:p-6 md:p-8 flex justify-center items-start">
        <div
          className="print-unlock relative transition-[width,height] duration-150"
          style={{
            width: isLetter ? `${8.5 * zoom}in` : `${210 * zoom}mm`,
          }}>
          <div
            className="print-unlock origin-top-left"
            style={{
              width: isLetter ? "8.5in" : "210mm",
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              transition: "transform 120ms ease-out",
            }}>
            <ResumeDocument resume={resume} onPageCountChange={setPageCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
