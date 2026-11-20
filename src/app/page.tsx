// src/app/page.tsx
"use client";

import React, {useCallback, useRef, useState} from "react";
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  RotateCcw,
  FilePlus2,
  Printer,
  LayoutList,
  PenSquare,
  Eye,
  MoreVertical,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {useResumeStore} from "@/store/useResumeStore";
import {SidebarNav} from "@/components/editor/SidebarNav";
import {HeaderForm} from "@/components/editor/forms/HeaderForm";
import {SummaryForm} from "@/components/editor/forms/SummaryForm";
import {EducationForm} from "@/components/editor/forms/EducationForm";
import {ExperienceForm} from "@/components/editor/forms/ExperienceForm";
import {CertificationsForm} from "@/components/editor/forms/CertificationsForm";
import {SkillsMatrixForm} from "@/components/editor/forms/SkillsMatrixForm";
import {PublicationsForm} from "@/components/editor/forms/PublicationsForm";
import {StyleControlPanel} from "@/components/editor/StyleControlPanel";
import {ResumePreviewViewport} from "@/components/preview/ResumePreviewViewport";
import {AtsCheckerModal} from "@/components/editor/AtsCheckerModal";
import {ThemeSwitcher} from "@/components/editor/ThemeSwitcher";

type MobileViewTab = "sections" | "editor" | "preview";

export default function ResumeBuilderWorkspacePage() {
  const resumeTitle = useResumeStore((state) => state.resume.title);
  const activeSectionId = useResumeStore((state) => state.activeSectionId);
  const updateResumeTitle = useResumeStore((state) => state.updateResumeTitle);
  const loadSampleResume = useResumeStore((state) => state.loadSampleResume);
  const resetToBlankResume = useResumeStore(
    (state) => state.resetToBlankResume,
  );
  const importResumeJson = useResumeStore((state) => state.importResumeJson);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Responsive state for mobile & tablet navigation
  const [mobileViewTab, setMobileViewTab] = useState<MobileViewTab>("editor");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const activeSection = useResumeStore(
    useCallback(
      (state) =>
        state.resume.sections.find((s) => s.id === state.activeSectionId),
      [],
    ),
  );

  const getActiveSectionTitle = () => {
    if (activeSectionId === "HEADER") return "Header & Contact";
    if (activeSectionId === "STYLE") return "Typography & Layout";
    if (activeSection) return activeSection.title;
    return "Editor";
  };

  const handleExportJson = () => {
    const fullState = useResumeStore.getState().resume;
    const blob = new Blob([JSON.stringify(fullState, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(fullState.title || "resume")
      .toLowerCase()
      .replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVectorPdf = () => {
    const fullState = useResumeStore.getState().resume;
    const previousTitle = document.title;
    const candidateName = (
      fullState.headerData.fullName ||
      fullState.title ||
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

  const handleImportJsonChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const rawData: unknown = JSON.parse(text);
      const res = importResumeJson(rawData);
      if (!res.success) {
        alert(`Invalid Resume JSON: ${res.error}`);
      }
    } catch {
      alert("Failed to parse JSON file.");
    } finally {
      e.target.value = "";
    }
  };

  const renderActiveEditorPane = () => {
    if (activeSectionId === "HEADER") {
      return <HeaderForm />;
    }
    if (activeSectionId === "STYLE") {
      return <StyleControlPanel />;
    }
    if (!activeSection) {
      return <HeaderForm />;
    }

    switch (activeSection.sectionType) {
      case "SUMMARY":
        return <SummaryForm sectionId={activeSection.id} />;
      case "EDUCATION":
        return <EducationForm sectionId={activeSection.id} />;
      case "SKILLS_LANGUAGES":
        return <SkillsMatrixForm sectionId={activeSection.id} />;
      case "CERTIFICATIONS":
      case "HONORS_AWARDS":
        return <CertificationsForm sectionId={activeSection.id} />;
      case "PUBLICATIONS":
        return <PublicationsForm sectionId={activeSection.id} />;
      default:
        return <ExperienceForm sectionId={activeSection.id} />;
    }
  };

  return (
    <div className="print-unlock flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-50 text-slate-900">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportJsonChange}
      />

      {/* Top Application Bar */}
      <header className="no-print flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Desktop Sidebar Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="hidden lg:inline-flex h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shrink-0"
            title={isSidebarOpen ? "Collapse sections sidebar" : "Expand sections sidebar"}>
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>

          <img
            src="/logo.png"
            alt="TypeCV Logo"
            className="h-7 w-auto sm:h-8 shrink-0 select-none object-contain drop-shadow-2xs"
          />
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              TypeCV
            </span>
            <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
              ATS
            </span>
          </div>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <Input
            value={resumeTitle}
            onChange={(e) => updateResumeTitle(e.target.value)}
            className="h-8 w-28 sm:w-44 md:w-56 border-slate-200 bg-slate-50/70 px-2 sm:px-2.5 text-xs font-semibold text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white truncate"
            title="Resume Title"
          />
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-2 shrink-0">
          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => useResumeStore.temporal.getState().undo()}
              className="h-8 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              title="Undo">
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => useResumeStore.temporal.getState().redo()}
              className="h-8 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              title="Redo">
              <Redo2 className="h-3.5 w-3.5" />
              Redo
            </Button>

            <div className="mx-1 h-4 w-[1px] bg-slate-200" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadSampleResume}
              className="h-8 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50"
              title="Load Complete Sample Resume">
              <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
              Sample
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetToBlankResume}
              className="h-8 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50">
              <FilePlus2 className="h-3.5 w-3.5" />
              Blank
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Upload className="h-3.5 w-3.5" />
              Import
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="h-8 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>

          {/* Mobile & Tablet More Actions Menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shrink-0"
                title="More actions">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 shadow-xl">
                <DropdownMenuItem
                  onClick={() => useResumeStore.temporal.getState().undo()}
                  className="flex items-center gap-2 text-xs">
                  <Undo2 className="h-3.5 w-3.5" />
                  <span>Undo</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => useResumeStore.temporal.getState().redo()}
                  className="flex items-center gap-2 text-xs">
                  <Redo2 className="h-3.5 w-3.5" />
                  <span>Redo</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={loadSampleResume}
                  className="flex items-center gap-2 text-xs">
                  <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                  <span>Load Sample Resume</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={resetToBlankResume}
                  className="flex items-center gap-2 text-xs">
                  <FilePlus2 className="h-3.5 w-3.5" />
                  <span>Blank Template</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-xs">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Import JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportJson}
                  className="flex items-center gap-2 text-xs">
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <AtsCheckerModal />

          <ThemeSwitcher />

          <Button
            type="button"
            size="sm"
            onClick={handleDownloadVectorPdf}
            className="h-8 gap-1.5 bg-blue-600 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 px-2 sm:px-3 shrink-0">
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="print-unlock flex flex-1 overflow-hidden relative">
        {/* DESKTOP SPLIT VIEW (>= lg) */}
        <div className="hidden lg:flex flex-1 overflow-hidden print-unlock w-full">
          {/* Pane 1: Section Navigation Rail */}
          {isSidebarOpen && (
            <div className="no-print h-full w-64 shrink-0 transition-all">
              <SidebarNav />
            </div>
          )}

          {/* Pane 2: Active Section Form Editor */}
          <main className="no-print h-full w-[480px] xl:w-[540px] shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-6">
            {renderActiveEditorPane()}
          </main>

          {/* Pane 3: Live Paginated Resume Preview Canvas */}
          <section className="print-unlock flex-1 h-full overflow-hidden">
            <ResumePreviewViewport />
          </section>
        </div>

        {/* MOBILE & TABLET TABBED VIEW (< lg) */}
        <div className="lg:hidden flex-1 overflow-hidden flex flex-col w-full relative print-unlock">
          {/* Tab 1: Sections Manager */}
          {mobileViewTab === "sections" && (
            <div className="no-print h-full w-full overflow-y-auto pb-16 bg-white">
              <SidebarNav
                className="w-full border-r-0 pb-16"
                onSelectSection={() => setMobileViewTab("editor")}
              />
            </div>
          )}

          {/* Tab 2: Section Editor Form */}
          {mobileViewTab === "editor" && (
            <div className="no-print flex h-full w-full flex-col overflow-hidden pb-14">
              {/* Context Header for Editor on Mobile */}
              <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4 shadow-2xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileViewTab("sections")}
                  className="h-8 gap-1 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sections</span>
                </Button>

                <span className="truncate max-w-[160px] sm:max-w-[260px] text-xs font-bold text-slate-900">
                  {getActiveSectionTitle()}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileViewTab("preview")}
                  className="h-8 gap-1 px-2 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                  <span>Preview</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 bg-slate-50">
                {renderActiveEditorPane()}
              </main>
            </div>
          )}

          {/* Tab 3: Live Resume Preview Viewport */}
          {mobileViewTab === "preview" && (
            <section className="print-unlock h-full w-full overflow-hidden pb-14">
              <ResumePreviewViewport
                onBackToEditor={() => setMobileViewTab("editor")}
              />
            </section>
          )}

          {/* Bottom Mobile / Tablet Tab Navigation Bar */}
          <nav className="no-print fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 shadow-lg">
            <button
              type="button"
              onClick={() => setMobileViewTab("sections")}
              className={`flex flex-1 flex-col items-center justify-center py-1 text-xs transition ${
                mobileViewTab === "sections"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}>
              <LayoutList className="h-4 w-4" />
              <span className="mt-0.5 text-[11px]">Sections</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileViewTab("editor")}
              className={`flex flex-1 flex-col items-center justify-center py-1 text-xs transition ${
                mobileViewTab === "editor"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}>
              <PenSquare className="h-4 w-4" />
              <span className="mt-0.5 text-[11px]">Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileViewTab("preview")}
              className={`flex flex-1 flex-col items-center justify-center py-1 text-xs transition ${
                mobileViewTab === "preview"
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}>
              <Eye className="h-4 w-4" />
              <span className="mt-0.5 text-[11px]">Preview</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
