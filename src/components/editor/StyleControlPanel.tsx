// src/components/editor/StyleControlPanel.tsx
"use client";

import React from "react";
import {Minimize2, RotateCcw} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {useResumeStore} from "@/store/useResumeStore";
import type {StyleConfig} from "@/schemas/resume.schema";

export function StyleControlPanel() {
  const styleConfig = useResumeStore((state) => state.resume.styleConfig);
  const updateStyleConfig = useResumeStore((state) => state.updateStyleConfig);

  const handleOnePageFitter = () => {
    updateStyleConfig({
      baseFontSizePt: 9.5,
      nameFontSizePt: 17,
      sectionFontSizePt: 10.5,
      lineHeight: 1.12,
      marginXIn: 0.42,
      marginYIn: 0.38,
      sectionGapPt: 6,
      itemGapPt: 3.5,
    });
  };

  const handleResetDefault = () => {
    updateStyleConfig({
      paperSize: "A4",
      fontFamily: "Times New Roman",
      baseFontSizePt: 10,
      nameFontSizePt: 18,
      sectionFontSizePt: 11,
      lineHeight: 1.2,
      marginXIn: 0.5,
      marginYIn: 0.45,
      sectionGapPt: 8,
      itemGapPt: 5,
      justifyText: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            Typography, Layout & Spacing Tokens
          </h2>
          <p className="text-xs text-zinc-400">
            Customize density and paper dimensions while preserving ATS reading
            order.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOnePageFitter}
            className="gap-1.5 border-blue-500/40 bg-blue-950/30 text-xs text-blue-300 hover:bg-blue-900/40">
            <Minimize2 className="h-3.5 w-3.5" />
            1-Page Dense Fit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetDefault}
            className="gap-1 text-xs text-zinc-400 hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Paper Size */}
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-300">Paper Size</Label>
          <select
            value={styleConfig.paperSize}
            onChange={(e) =>
              updateStyleConfig({
                paperSize: e.target.value as StyleConfig["paperSize"],
              })
            }
            className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100">
            <option value="A4">A4 (210mm × 297mm — International)</option>
            <option value="LETTER">
              US Letter (8.5in × 11in — North America)
            </option>
          </select>
        </div>

        {/* Font Family */}
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-300">Primary Document Font</Label>
          <select
            value={styleConfig.fontFamily}
            onChange={(e) =>
              updateStyleConfig({
                fontFamily: e.target.value as StyleConfig["fontFamily"],
              })
            }
            className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100">
            <option value="Times New Roman">
              Times New Roman (Classic Serif)
            </option>
            <option value="Charter">Charter (Academic Serif)</option>
            <option value="CMU Serif">CMU Serif (LaTeX Computer Modern)</option>
            <option value="Calibri">Calibri (Clean Corporate Sans)</option>
            <option value="Inter">Inter (Modern Technical Sans)</option>
            <option value="Arial">Arial (Standard ATS Sans)</option>
          </select>
        </div>

        {/* Base Font Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <Label className="text-zinc-300">Body Font Size</Label>
            <span className="font-mono text-zinc-400">
              {styleConfig.baseFontSizePt}pt
            </span>
          </div>
          <input
            type="range"
            min={8.5}
            max={11.5}
            step={0.5}
            value={styleConfig.baseFontSizePt}
            onChange={(e) =>
              updateStyleConfig({baseFontSizePt: parseFloat(e.target.value)})
            }
            className="w-full accent-blue-600"
          />
        </div>

        {/* Line Height */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <Label className="text-zinc-300">Line Height</Label>
            <span className="font-mono text-zinc-400">
              {styleConfig.lineHeight}
            </span>
          </div>
          <input
            type="range"
            min={1.05}
            max={1.45}
            step={0.05}
            value={styleConfig.lineHeight}
            onChange={(e) =>
              updateStyleConfig({lineHeight: parseFloat(e.target.value)})
            }
            className="w-full accent-blue-600"
          />
        </div>

        {/* Horizontal Margin */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <Label className="text-zinc-300">Left / Right Margin</Label>
            <span className="font-mono text-zinc-400">
              {styleConfig.marginXIn} in
            </span>
          </div>
          <input
            type="range"
            min={0.35}
            max={1.0}
            step={0.05}
            value={styleConfig.marginXIn}
            onChange={(e) =>
              updateStyleConfig({marginXIn: parseFloat(e.target.value)})
            }
            className="w-full accent-blue-600"
          />
        </div>

        {/* Vertical Margin */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <Label className="text-zinc-300">Top / Bottom Margin</Label>
            <span className="font-mono text-zinc-400">
              {styleConfig.marginYIn} in
            </span>
          </div>
          <input
            type="range"
            min={0.35}
            max={1.0}
            step={0.05}
            value={styleConfig.marginYIn}
            onChange={(e) =>
              updateStyleConfig({marginYIn: parseFloat(e.target.value)})
            }
            className="w-full accent-blue-600"
          />
        </div>

        {/* Section Gap */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <Label className="text-zinc-300">Section Vertical Gap</Label>
            <span className="font-mono text-zinc-400">
              {styleConfig.sectionGapPt}pt
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            step={1}
            value={styleConfig.sectionGapPt}
            onChange={(e) =>
              updateStyleConfig({sectionGapPt: parseFloat(e.target.value)})
            }
            className="w-full accent-blue-600"
          />
        </div>

        {/* Entry Item Gap */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <Label className="text-zinc-300">Entry Item Gap</Label>
            <span className="font-mono text-zinc-400">
              {styleConfig.itemGapPt}pt
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={0.5}
            value={styleConfig.itemGapPt}
            onChange={(e) =>
              updateStyleConfig({itemGapPt: parseFloat(e.target.value)})
            }
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
        <div>
          <div className="text-xs font-medium text-zinc-200">
            Justify Bullet & Summary Text
          </div>
          <div className="text-[11px] text-zinc-400">
            Aligns both left and right edges of paragraph and bullet text.
          </div>
        </div>
        <Switch
          checked={styleConfig.justifyText}
          onCheckedChange={(checked) =>
            updateStyleConfig({justifyText: checked})
          }
        />
      </div>
    </div>
  );
}
