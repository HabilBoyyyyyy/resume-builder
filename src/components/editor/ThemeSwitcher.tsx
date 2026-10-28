// src/components/editor/ThemeSwitcher.tsx
"use client";

import React, {useState, useRef, useEffect} from "react";
import {
  Sun,
  Moon,
  Feather,
  Coffee,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  useThemeStore,
  THEME_OPTIONS,
  type ThemeMode,
  applyThemeToDocument,
} from "@/store/useThemeStore";

export function ThemeSwitcher() {
  const currentTheme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Sync theme to DOM on initial client mount
  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const getThemeIcon = (theme: ThemeMode, className = "h-3.5 w-3.5") => {
    switch (theme) {
      case "warm":
        return <Coffee className={className} />;
      case "dim":
        return <Moon className={className} />;
      case "stone":
        return <Feather className={className} />;
      case "light":
        return <Sun className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const activeOption =
    THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-8 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        title="Change workspace color theme (Eye Care)">
        <span className="flex items-center text-amber-700 dark:text-blue-400">
          {getThemeIcon(currentTheme)}
        </span>
        <span className="hidden sm:inline-block font-semibold">
          {activeOption.name}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-900/5 animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="border-b border-slate-100 px-2.5 pb-2 pt-1 mb-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Eye Care & Themes
              </span>
              <span className="text-[10px] text-slate-400">
                Zero glare modes
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Pick a soothing tone for long editing sessions.
            </p>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = opt.id === currentTheme;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition ${
                    isSelected
                      ? "bg-slate-100/90 text-slate-900 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}>
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-300 text-xs shadow-2xs"
                    style={{
                      backgroundColor: opt.previewBg,
                      color: opt.previewText,
                    }}>
                    {getThemeIcon(opt.id, "h-3.5 w-3.5")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold truncate text-slate-900">
                        {opt.name}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          opt.id === "warm"
                            ? "bg-amber-100 text-amber-800"
                            : opt.id === "dim"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-200 text-slate-700"
                        }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                      {opt.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-1 text-blue-600">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
