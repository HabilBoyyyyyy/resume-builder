// src/components/preview/ResumePreviewViewport.tsx
"use client";

import React, {useState} from "react";
import {ZoomIn, ZoomOut, RotateCcw, Printer} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {ResumeDocument} from "./ResumeDocument";

export function ResumePreviewViewport() {
  // Granular selector for resume state
  const resume = useResumeStore((state) => state.resume);
  const [zoom, setZoom] = useState<number>(0.85);

  const handleZoomIn = () =>
    setZoom((z) => Math.min(1.3, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(2))));
  const handleZoomReset = () => setZoom(0.85);

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-zinc-900/95 overflow-hidden">
      {/* Floating Top Preview Toolbar (Hidden during Print) */}
      <div className="no-print flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-2 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-100">
            {resume.styleConfig.paperSize === "A4"
              ? "A4 (210 × 297 mm)"
              : "US Letter (8.5 × 11 in)"}
          </span>
          <span className="text-zinc-600">•</span>
          <span>{resume.styleConfig.fontFamily}</span>
          <span className="text-zinc-600">•</span>
          <span>{resume.styleConfig.baseFontSizePt}pt</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-300 hover:text-white"
            onClick={handleZoomOut}
            title="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="w-12 text-center font-mono text-xs">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-300 hover:text-white"
            onClick={handleZoomIn}
            title="Zoom In">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-300 hover:text-white"
            onClick={handleZoomReset}
            title="Reset Zoom">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <div className="mx-1 h-4 w-[1px] bg-zinc-800" />
          <Button
            variant="secondary"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleNativePrint}>
            <Printer className="h-3.5 w-3.5" />
            Quick Print / PDF
          </Button>
        </div>
      </div>

      {/* Scrollable Canvas Area */}
      <div className="flex-1 overflow-auto p-6 md:p-10 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 120ms ease-out",
          }}>
          <ResumeDocument resume={resume} />
        </div>
      </div>
    </div>
  );
}
