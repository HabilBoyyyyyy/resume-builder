// src/app/page.tsx
"use client";

import React, {useCallback, useRef} from "react";
import {
  FileText,
  Undo2,
  Redo2,
  Download,
  Upload,
  RotateCcw,
  FilePlus2,
  Printer,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
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

  const activeSection = useResumeStore(
    useCallback(
      (state) =>
        state.resume.sections.find((s) => s.id === state.activeSectionId),
      [],
    ),
  );

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
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#09090B] text-zinc-100">
      {/* Hidden File Input for JSON Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportJsonChange}
      />

      {/* Top Application Bar (Hidden when printing) */}
      <header className="no-print flex h-13 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            ATS Resume Builder
          </span>
          <span className="text-zinc-700">/</span>
          <Input
            value={resumeTitle}
            onChange={(e) => updateResumeTitle(e.target.value)}
            className="h-7 w-56 border-transparent bg-transparent px-2 text-xs font-medium text-zinc-200 hover:border-zinc-800 focus:border-blue-500 focus:bg-zinc-900"
          />
        </div>

        {/* Center Undo/Redo & Template Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => useResumeStore.temporal.getState().undo()}
            className="h-8 gap-1 text-xs text-zinc-300 hover:text-white"
            title="Undo">
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => useResumeStore.temporal.getState().redo()}
            className="h-8 gap-1 text-xs text-zinc-300 hover:text-white"
            title="Redo">
            <Redo2 className="h-3.5 w-3.5" />
            Redo
          </Button>

          <div className="mx-1 h-4 w-[1px] bg-zinc-800" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadSampleResume}
            className="h-8 gap-1.5 border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" />
            Sample
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetToBlankResume}
            className="h-8 gap-1.5 border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white">
            <FilePlus2 className="h-3.5 w-3.5" />
            Blank
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 gap-1.5 border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white">
            <Upload className="h-3.5 w-3.5" />
            Import JSON
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="h-8 gap-1.5 border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </Button>

          <AtsCheckerModal />

          <Button
            type="button"
            size="sm"
            onClick={() => window.print()}
            className="h-8 gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500">
            <Printer className="h-3.5 w-3.5" />
            Export Vector PDF
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => window.print()}
            className="h-8 gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500">
            <Printer className="h-3.5 w-3.5" />
            Export Vector PDF
          </Button>
        </div>
      </header>

      {/* Main 3-Pane Split Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pane 1: Section Navigation Rail (Hidden on print) */}
        <div className="no-print h-full">
          <SidebarNav />
        </div>

        {/* Pane 2: Active Section Form Editor (Hidden on print) */}
        <main className="no-print h-full w-[480px] shrink-0 overflow-y-auto border-r border-zinc-800 bg-[#09090B] p-6 xl:w-[540px]">
          {renderActiveEditorPane()}
        </main>

        {/* Pane 3: Live Paginated Resume Preview Canvas */}
        <section className="flex-1 h-full overflow-hidden">
          <ResumePreviewViewport />
        </section>
      </div>
    </div>
  );
}
