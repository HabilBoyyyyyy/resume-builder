// src/components/editor/RichTextInput.tsx
"use client";

import React, {useEffect} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
} from "lucide-react";

interface RichTextInputProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

function stripOuterParagraphs(html: string): string {
  return html
    .replace(/^<p>/i, "")
    .replace(/<\/p>$/i, "")
    .replace(/<\/p><p>/gi, "<br />")
    .trim();
}

export function RichTextInput({
  value,
  onChange,
  placeholder = "Write achievement or summary...",
  multiline = false,
}: RichTextInputProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: `w-full px-3 py-2 text-xs leading-relaxed text-slate-900 focus:outline-none ${
          multiline ? "min-h-[80px]" : "min-h-[38px]"
        }`,
      },
    },
    onUpdate: ({editor: ed}) => {
      const rawHtml = ed.getHTML();
      const cleaned = ed.isEmpty ? "" : stripOuterParagraphs(rawHtml);
      onChange(cleaned);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentCleaned = editor.isEmpty
      ? ""
      : stripOuterParagraphs(editor.getHTML());
    if (value !== currentCleaned && !editor.isFocused) {
      editor.commands.setContent(value || "", {emitUpdate: false});
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-10 w-full animate-pulse rounded-md border border-slate-200 bg-slate-50" />
    );
  }

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(
      "Enter URL (e.g. https://github.com/...)",
      previousUrl || "https://",
    );
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({href: url.trim()})
      .run();
  };

  return (
    <div className="flex-1 rounded-md border border-slate-300 bg-white shadow-2xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
      {/* Mini Inline Formatting Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2 py-1 rounded-t-md">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            className={`rounded p-1 transition ${
              editor.isActive("bold")
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}>
            <Bold className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            className={`rounded p-1 transition ${
              editor.isActive("italic")
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}>
            <Italic className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
            className={`rounded p-1 transition ${
              editor.isActive("underline")
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}>
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleSetLink}
            title="Insert/Edit Link"
            className={`rounded p-1 transition ${
              editor.isActive("link")
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}>
            <LinkIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {editor.isEmpty && (
          <span className="pr-1 text-[11px] text-slate-400 truncate max-w-[200px]">
            {placeholder}
          </span>
        )}
      </div>

      {/* Editable Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
