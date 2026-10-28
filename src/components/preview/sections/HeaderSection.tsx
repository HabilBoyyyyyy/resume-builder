// src/components/preview/sections/HeaderSection.tsx
import React from "react";
import type {HeaderData} from "@/schemas/resume.schema";
import {normalizeResumeLink} from "@/lib/sanitize";

interface HeaderSectionProps {
  headerData: HeaderData;
}

export function HeaderSection({headerData}: HeaderSectionProps) {
  const {fullName, location, phone, email, links} = headerData;

  // Filter out empty contact fields so we never render dangling pipes "|" (Rules.md Section 2.1)
  const primaryContactItems: React.ReactNode[] = [];

  if (location?.trim()) {
    primaryContactItems.push(<span key="location">{location.trim()}</span>);
  }
  if (phone?.trim()) {
    primaryContactItems.push(
      <a key="phone" href={`tel:${phone.trim()}`}>
        {phone.trim()}
      </a>,
    );
  }
  if (email?.trim()) {
    primaryContactItems.push(
      <a key="email" href={`mailto:${email.trim()}`}>
        {email.trim()}
      </a>,
    );
  }

  const visibleLinks = (links ?? []).filter(
    (link) => link.isVisible && (link.label.trim() || link.url.trim()),
  );

  for (const link of visibleLinks) {
    const normalized = normalizeResumeLink(link.url || link.label);
    const displayLabel = link.label.trim() || normalized.label;
    primaryContactItems.push(
      <a
        key={link.id}
        href={normalized.url}
        target="_blank"
        rel="noopener noreferrer">
        {displayLabel}
      </a>,
    );
  }

  return (
    <header
      style={{
        textAlign: "center",
        marginBottom: "var(--resume-section-gap)",
      }}>
      <h1
        style={{
          fontSize: "var(--resume-font-size-name)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          margin: "0 0 3px 0",
          lineHeight: 1.15,
        }}>
        {fullName || "YOUR FULL NAME"}
      </h1>

      {primaryContactItems.length > 0 && (
        <div
          style={{
            fontSize: "0.95em",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            rowGap: "2px",
          }}>
          {primaryContactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  style={{padding: "0 0.4em", userSelect: "none"}}>
                  |
                </span>
              )}
              {item}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
}
