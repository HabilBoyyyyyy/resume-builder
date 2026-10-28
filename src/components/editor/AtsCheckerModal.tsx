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
} from "@/components/ui/dialog";
import {useResumeStore} from "@/store/useResumeStore";
import {evaluateAtsCompliance} from "@/lib/ats-validator";

export function AtsCheckerModal() {
  const resume = useResumeStore((state) => state.resume);
  const [open, setOpen] = useState(false);

  const report = evaluateAtsCompliance(resume);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-800 border-emerald-200 bg-emerald-50";
    if (score >= 70) return "text-amber-800 border-amber-200 bg-amber-50";
    return "text-red-800 border-red-200 bg-red-50";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50">
        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
        ATS Score:{" "}
        <span className="font-mono font-bold text-slate-900">
          {report.score}%
        </span>
      </Button>

      <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            ATS Optimization Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div
            className={`flex items-center justify-between rounded-xl border p-4 ${getScoreColor(
              report.score,
            )}`}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                Compatibility Index
              </div>
              <div className="text-2xl font-bold font-mono">
                {report.score} / 100
              </div>
            </div>
            <div className="text-right text-xs max-w-[180px] font-medium">
              {report.score >= 90
                ? "Excellent! Optimized for Workday, Greenhouse & Lever parsers."
                : "Address recommendations below to improve parsing."}
            </div>
          </div>

          {report.errors.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Critical Fixes Required
              </div>
              <ul className="space-y-1 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
                {report.errors.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {report.warnings.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Recommendations (
                {report.warnings.length})
              </div>
              <ul className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                {report.warnings.map((warn, idx) => (
                  <li key={idx}>• {warn}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Passed Heuristics (
              {report.passedChecks.length})
            </div>
            <ul className="space-y-1 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900 max-h-40 overflow-y-auto">
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
