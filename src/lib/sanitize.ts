// src/lib/sanitize.ts
import DOMPurify from "dompurify";

const ALLOWED_TAGS = ["b", "strong", "i", "em", "u", "a"];
const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Fallback server-side sanitizer for Next.js SSR (when `window` is not yet available)
 * so we never need `jsdom` on the server.
 */
function ssrSafeSanitize(dirtyHtml: string): string {
  return dirtyHtml.replace(
    /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g,
    (match, tagName: string, attrs: string | undefined) => {
      const lowerTag = tagName.toLowerCase();
      if (!ALLOWED_TAGS.includes(lowerTag)) {
        return "";
      }
      if (match.startsWith("</")) {
        return `</${lowerTag}>`;
      }
      if (lowerTag === "a" && attrs) {
        const hrefMatch = attrs.match(
          /href\s*=\s*(['"])(https?:\/\/[^'"]+|mailto:[^'"]+|tel:[^'"]+)\1/i,
        );
        if (hrefMatch) {
          return `<a href="${hrefMatch[2]}" target="_blank" rel="noopener noreferrer">`;
        }
      }
      return `<${lowerTag}>`;
    },
  );
}

/**
 * Sanitizes rich-text HTML strings for bullet points and summaries
 * to strictly comply with Rules.md Section 4.1.
 */
export function sanitizeResumeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return "";

  if (
    typeof window !== "undefined" &&
    typeof DOMPurify.sanitize === "function"
  ) {
    return DOMPurify.sanitize(dirtyHtml, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    });
  }

  return ssrSafeSanitize(dirtyHtml);
}

/**
 * Ensures any user-entered URL has a valid https:// protocol while
 * producing a clean display label without protocol prefixes (Rules.md Section 4.2).
 */
export function normalizeResumeLink(rawInput: string): {
  label: string;
  url: string;
} {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {label: "", url: ""};
  }

  // Strip protocol and trailing slash for the visible resume label
  const cleanLabel = trimmed
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/\/$/, "");

  // Ensure href has https:// (or mailto: / tel:)
  const normalizedUrl = /^(https?:\/\/|mailto:|tel:)/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  return {
    label: cleanLabel,
    url: normalizedUrl,
  };
}
