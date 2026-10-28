// src/components/editor/AtsCheckerModal.tsx
"use client";

import React, {useState} from "react";
import {ShieldCheck, AlertTriangle, XCircle, CheckCircle2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useResumeStore} from "@/store/useResumeStore";
import {evaluateAtsCompliance} from "@/lib/ats-validator";

export function AtsCheckerModal() {
  const resume = useResumeStore((state) => state.resume);
  const [open, setOpen] = useState(false);

  const report = evaluateAtsCompliance(resume);

  const getScoreColor = (score: number) => {
    if (score >= 90)
      return "text-emerald-400 border-emerald-500/40 bg-emerald-950/20";
    if (score >= 70)
      return "text-amber-400 border-amber-500/40 bg-amber-950/20";
    return "text-red-400 border-red-500/40 bg-red-950/20";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white">
        <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
        ATS Score: <span className="font-mono font-bold">{report.score}%</span>
      </Button>

      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            ATS Optimization Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Score Badge */}
          <div
            className={`flex items-center justify-between rounded-lg border p-4 ${getScoreColor(
              report.score,
            )}`}>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-80">
                Compatibility Index
              </div>
              <div className="text-2xl font-bold font-mono">
                {report.score} / 100
              </div>
            </div>
            <div className="text-right text-xs max-w-[180px] opacity-90">
              {report.score >= 90
                ? "Excellent! Fully optimized for Workday, Greenhouse & Lever parsers."
                : "Good, but address warnings below to maximize keyword extraction."}
            </div>
          </div>

          {/* Errors */}
          {report.errors.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Critical Fixes Required
              </div>
              <ul className="space-y-1 rounded-md border border-red-950 bg-red-950/20 p-2 text-xs text-red-200">
                {report.errors.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {report.warnings.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Recommendations (
                {report.warnings.length})
              </div>
              <ul className="space-y-1 rounded-md border border-amber-950 bg-amber-950/20 p-2 text-xs text-amber-200">
                {report.warnings.map((warn, idx) => (
                  <li key={idx}>• {warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Passed Checks */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Passed Heuristics (
              {report.passedChecks.length})
            </div>
            <ul className="space-y-1 rounded-md border border-emerald-950 bg-emerald-950/20 p-2 text-xs text-emerald-200 max-h-36 overflow-y-auto">
              {report.passedChecks.map((chk, idx) => (
                <li key={idx}>✓ {chk}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
