// src/components/editor/DateRangePicker.tsx
"use client";

import React, {useState, useRef, useEffect} from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

interface DateRangePickerProps {
  value: string;
  onChange: (formattedDate: string) => void;
  label?: string;
  mode?: "range" | "single";
}

const MONTHS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];

interface ParsedPart {
  monthIndex: number | null;
  year: number;
}

function parseSinglePart(raw: string, fallbackYear: number): ParsedPart {
  const trimmed = raw.trim();
  if (!trimmed) return {monthIndex: null, year: fallbackYear};

  const yearMatch = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : fallbackYear;

  const lower = trimmed.toLowerCase();
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  let monthIndex: number | null = null;
  for (let i = 0; i < monthNames.length; i++) {
    if (lower.includes(monthNames[i])) {
      monthIndex = i;
      break;
    }
  }

  return {monthIndex, year};
}

function formatPart(part: ParsedPart): string {
  if (part.monthIndex === null) return `${part.year}`;
  return `${MONTHS[part.monthIndex]} ${part.year}`;
}

export function DateRangePicker({
  value,
  onChange,
  label = "Date Range",
  mode = "range",
}: DateRangePickerProps) {
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"START" | "END">("START");

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Split existing value on en-dash or hyphen
  const parts = value.split(/\s*[–-]\s*/);
  const initialStart = parseSinglePart(parts[0] || "", currentYear - 1);
  const isInitiallyPresent = /present|current|now/i.test(parts[1] || "");
  const initialEnd =
    parts[1] && !isInitiallyPresent
      ? parseSinglePart(parts[1], currentYear)
      : {monthIndex: new Date().getMonth(), year: currentYear};

  const [startPart, setStartPart] = useState<ParsedPart>(initialStart);
  const [endPart, setEndPart] = useState<ParsedPart>(initialEnd);
  const [isPresent, setIsPresent] = useState<boolean>(
    mode === "range" ? (parts.length > 1 ? isInitiallyPresent : true) : false,
  );
  const [hasEndDate, setHasEndDate] = useState<boolean>(mode === "range");

  // Close calendar popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const emitFormattedChange = (
    nextStart: ParsedPart,
    nextEnd: ParsedPart,
    nextPresent: boolean,
    nextHasEnd: boolean,
  ) => {
    const startStr = formatPart(nextStart);
    if (mode === "single" || !nextHasEnd) {
      onChange(startStr);
      return;
    }
    if (nextPresent) {
      onChange(`${startStr} – Present`);
      return;
    }
    const endStr = formatPart(nextEnd);
    onChange(`${startStr} – ${endStr}`);
  };

  const handleSelectMonth = (monthIdx: number) => {
    if (mode === "single" || activeTab === "START") {
      const updatedStart = {...startPart, monthIndex: monthIdx};
      setStartPart(updatedStart);
      emitFormattedChange(updatedStart, endPart, isPresent, hasEndDate);
      if (mode === "single") {
        setIsOpen(false);
      } else {
        setActiveTab("END");
      }
    } else {
      const updatedEnd = {...endPart, monthIndex: monthIdx};
      setEndPart(updatedEnd);
      setIsPresent(false);
      setHasEndDate(true);
      emitFormattedChange(startPart, updatedEnd, false, true);
    }
  };

  const handleStepYear = (delta: number) => {
    if (mode === "single" || activeTab === "START") {
      const updatedStart = {...startPart, year: startPart.year + delta};
      setStartPart(updatedStart);
      emitFormattedChange(updatedStart, endPart, isPresent, hasEndDate);
    } else {
      const updatedEnd = {...endPart, year: endPart.year + delta};
      setEndPart(updatedEnd);
      setIsPresent(false);
      emitFormattedChange(startPart, updatedEnd, false, hasEndDate);
    }
  };

  const handleTogglePresent = () => {
    const nextPresent = !isPresent;
    setIsPresent(nextPresent);
    setHasEndDate(true);
    emitFormattedChange(startPart, endPart, nextPresent, true);
  };

  const handleSingleDateOnly = () => {
    const nextHasEnd = !hasEndDate;
    setHasEndDate(nextHasEnd);
    emitFormattedChange(startPart, endPart, isPresent, nextHasEnd);
  };

  const activePart =
    mode === "single" || activeTab === "START" ? startPart : endPart;

  return (
    <div ref={containerRef} className="relative space-y-1">
      <Label className="text-xs font-medium text-slate-700">{label}</Label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value ||
            (mode === "single"
              ? "Select Date..."
              : "Select Start – End Date...")}
        </span>
        <CalendarIcon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
      </button>

      {/* Interactive Calendar Popover */}
      {isOpen && (
        <div className="absolute right-0 top-16 z-50 w-76 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl ring-1 ring-slate-900/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
            <span className="text-xs font-semibold text-slate-800">
              {mode === "single" ? "Pick Month & Year" : "Select Date Range"}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Start / End Tabs for Range Mode */}
          {mode === "range" && (
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("START")}
                className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
                  activeTab === "START"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                Start: {formatPart(startPart)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasEndDate(true);
                  setActiveTab("END");
                }}
                className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
                  activeTab === "END"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                End:{" "}
                {!hasEndDate
                  ? "None"
                  : isPresent
                    ? "Present"
                    : formatPart(endPart)}
              </button>
            </div>
          )}

          {/* Ongoing / Present Checkbox when on END Tab */}
          {mode === "range" && activeTab === "END" && (
            <div className="mb-3 space-y-1.5">
              <button
                type="button"
                onClick={handleTogglePresent}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  isPresent && hasEndDate
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}>
                <span>Currently Ongoing (Present)</span>
                {isPresent && hasEndDate && (
                  <Check className="h-3.5 w-3.5 text-blue-600" />
                )}
              </button>

              <button
                type="button"
                onClick={handleSingleDateOnly}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-[11px] transition ${
                  !hasEndDate
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}>
                <span>Single Month/Year Only (No End Date)</span>
                {!hasEndDate && <Check className="h-3 w-3 text-blue-600" />}
              </button>
            </div>
          )}

          {/* Year Selector Bar */}
          {!(
            mode === "range" &&
            activeTab === "END" &&
            (isPresent || !hasEndDate)
          ) && (
            <>
              <div className="mb-2.5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                <button
                  type="button"
                  onClick={() => handleStepYear(-1)}
                  className="rounded p-1 text-slate-600 hover:bg-white hover:text-slate-900"
                  title="Previous Year">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {activePart.year}
                </span>
                <button
                  type="button"
                  onClick={() => handleStepYear(1)}
                  className="rounded p-1 text-slate-600 hover:bg-white hover:text-slate-900"
                  title="Next Year">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* 12-Month Calendar Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS.map((mName, idx) => {
                  const isSelected = activePart.monthIndex === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => handleSelectMonth(idx)}
                      className={`rounded-md py-1.5 text-xs font-medium transition ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      }`}>
                      {mName.replace(".", "")}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer Done Button */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="text-[11px] font-medium text-slate-400 hover:text-red-600">
              Clear Date
            </button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-7 bg-blue-600 px-3 text-xs text-white hover:bg-blue-700">
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
