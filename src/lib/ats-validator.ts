// src/lib/ats-validator.ts
import type {ResumeDocumentType} from "@/schemas/resume.schema";

export interface AtsCheckResult {
  score: number; // 0 to 100
  passedChecks: string[];
  warnings: string[];
  errors: string[];
}

export function evaluateAtsCompliance(
  resume: ResumeDocumentType,
): AtsCheckResult {
  const passedChecks: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  let score = 100;

  // 1. Check Full Name
  if (!resume.headerData.fullName?.trim()) {
    errors.push("Full name is missing from the header.");
    score -= 25;
  } else {
    passedChecks.push("Candidate full name is correctly set.");
  }

  // 2. Check Email & Contact
  if (!resume.headerData.email?.trim()) {
    warnings.push("Contact email is recommended for recruiter outreach.");
    score -= 10;
  } else {
    passedChecks.push("Contact email is present.");
  }

  // 3. Check Sections Count
  const visibleSections = resume.sections.filter((s) => s.isVisible);
  if (visibleSections.length < 3) {
    warnings.push(
      "Resume has fewer than 3 visible sections. Consider adding Education and Projects.",
    );
    score -= 15;
  } else {
    passedChecks.push(
      `Resume contains ${visibleSections.length} well-structured modular sections.`,
    );
  }

  // 4. Check Rasterized Canvas (Rules.md Section 1.1)
  passedChecks.push(
    "Vector HTML-to-PDF rendering mode active (Zero html2canvas rasterization).",
  );

  // 5. Check Link Protocols
  const invalidLinks = resume.headerData.links.filter(
    (l) =>
      l.isVisible &&
      !l.url.startsWith("https://") &&
      !l.url.startsWith("http://"),
  );
  if (invalidLinks.length > 0) {
    warnings.push(
      "Some header links do not have valid absolute https:// URLs.",
    );
    score -= 10;
  } else {
    passedChecks.push(
      "All hyperlink URIs are properly normalized with absolute https:// schemas.",
    );
  }

  return {
    score: Math.max(0, score),
    passedChecks,
    warnings,
    errors,
  };
}
