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
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#F8FAFC] text-slate-900">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportJsonChange}
      />

      {/* Top Application Bar */}
      <header className="no-print flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">
            ATS Resume Builder
          </span>
          <span className="text-slate-300">/</span>
          <Input
            value={resumeTitle}
            onChange={(e) => updateResumeTitle(e.target.value)}
            className="h-8 w-60 border-slate-200 bg-slate-50/70 px-2.5 text-xs font-semibold text-slate-800 hover:border-slate-300 focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-1.5">
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
            Load Sample
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
            Import JSON
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="h-8 gap-1.5 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </Button>

          <AtsCheckerModal />

          <Button
            type="button"
            size="sm"
            onClick={() => window.print()}
            className="h-8 gap-1.5 bg-blue-600 text-xs font-semibold text-white shadow-xs hover:bg-blue-700">
            <Printer className="h-3.5 w-3.5" />
            Export Vector PDF
          </Button>
        </div>
      </header>

      {/* Main 3-Pane Split Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pane 1: Section Navigation Rail */}
        <div className="no-print h-full">
          <SidebarNav />
        </div>

        {/* Pane 2: Active Section Form Editor */}
        <main className="no-print h-full w-[500px] shrink-0 overflow-y-auto border-r border-slate-200 bg-[#F8FAFC] p-6 xl:w-[560px]">
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
