// src/app/print/[resumeId]/page.tsx
"use client";

import React from "react";
import {useResumeStore} from "@/store/useResumeStore";
import {ResumeDocument} from "@/components/preview/ResumeDocument";

export default function PrintResumePage() {
  const resume = useResumeStore((state) => state.resume);

  return (
    <main className="bg-white text-black min-h-screen">
      <ResumeDocument resume={resume} />
    </main>
  );
}
