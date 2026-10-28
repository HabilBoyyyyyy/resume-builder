// src/components/preview/ResumePreviewViewport.tsx
"use client";

import React, {useState} from "react";
import {ZoomIn, ZoomOut, RotateCcw, Download, FileCheck2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {ResumeDocument} from "./ResumeDocument";

export function ResumePreviewViewport() {
  const resume = useResumeStore((state) => state.resume);
  const [zoom, setZoom] = useState<number>(0.82);
  const [pageCount, setPageCount] = useState<number>(1);

  const handleZoomIn = () =>
    setZoom((z) => Math.min(1.3, Number((z + 0.08).toFixed(2))));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(0.5, Number((z - 0.08).toFixed(2))));
  const handleZoomReset = () => setZoom(0.82);

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
    <div className="print-unlock relative flex h-full w-full flex-col bg-slate-200/80 overflow-hidden">
      {/* Top Preview Toolbar (Hidden in PDF) */}
      <div className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">
            {resume.styleConfig.paperSize === "A4"
              ? "A4 (210 × 297 mm)"
              : "US Letter (8.5 × 11 in)"}
          </span>
          <span className="text-slate-300">•</span>
          <span>{resume.styleConfig.fontFamily}</span>
          <span className="text-slate-300">•</span>
          <span>{resume.styleConfig.baseFontSizePt}pt</span>
          <span className="text-slate-300">•</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              pageCount === 1
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
            <FileCheck2 className="h-3 w-3" />
            {pageCount} {pageCount === 1 ? "Page" : "Pages"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={handleZoomOut}
            title="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="w-12 text-center font-mono text-xs font-semibold text-slate-700">
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
            onClick={handleZoomReset}
            title="Reset Zoom">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <div className="mx-1.5 h-4 w-[1px] bg-slate-200" />
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50"
            onClick={handleDownloadPdf}>
            <Download className="h-3.5 w-3.5" />
            Save as Multi-Page PDF
          </Button>
        </div>
      </div>

      {/* Scrollable Paper Viewport (print-unlock removes scale() and scroll clipping during PDF export) */}
      <div className="print-unlock flex-1 overflow-auto p-6 md:p-8 flex justify-center items-start">
        <div
          className="print-unlock"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 120ms ease-out",
          }}>
          <ResumeDocument resume={resume} onPageCountChange={setPageCount} />
        </div>
      </div>
    </div>
  );
}
