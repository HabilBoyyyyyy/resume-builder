// src/components/editor/forms/HeaderForm.tsx
"use client";

import React from "react";
import {Plus, Trash2, Eye, EyeOff} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useResumeStore} from "@/store/useResumeStore";
import {normalizeResumeLink} from "@/lib/sanitize";

export function HeaderForm() {
  const headerData = useResumeStore((state) => state.resume.headerData);
  const updateHeaderData = useResumeStore((state) => state.updateHeaderData);

  const handleAddLink = () => {
    updateHeaderData({
      links: [
        ...headerData.links,
        {
          id: crypto.randomUUID(),
          label: "github.com/username",
          url: "https://github.com/username",
          isVisible: true,
        },
      ],
    });
  };

  const handleUpdateLink = (
    id: string,
    field: "label" | "url" | "isVisible",
    value: string | boolean,
  ) => {
    const updated = headerData.links.map((link) => {
      if (link.id !== id) return link;
      if (field === "url" && typeof value === "string") {
        const normalized = normalizeResumeLink(value);
        return {
          ...link,
          url: normalized.url,
          label: link.label || normalized.label,
        };
      }
      return {...link, [field]: value};
    });
    updateHeaderData({links: updated});
  };

  const handleRemoveLink = (id: string) => {
    updateHeaderData({
      links: headerData.links.filter((l) => l.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-100">
          Header & Contact Information
        </h2>
        <p className="text-xs text-zinc-400">
          Centered contact block at the top of the resume. Empty fields will
          automatically hide their pipe separator (|).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="fullName" className="text-xs text-zinc-300">
            Full Name (Rendered Uppercase)
          </Label>
          <Input
            id="fullName"
            value={headerData.fullName}
            onChange={(e) => updateHeaderData({fullName: e.target.value})}
            placeholder="HABIL BAIHAKI RAMADHAN"
            className="bg-zinc-900 border-zinc-800 text-zinc-100"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-xs text-zinc-300">
            Location (City, Province, Country)
          </Label>
          <Input
            id="location"
            value={headerData.location}
            onChange={(e) => updateHeaderData({location: e.target.value})}
            placeholder="Bekasi, West Java, Indonesia"
            className="bg-zinc-900 border-zinc-800 text-zinc-100"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs text-zinc-300">
            Phone Number
          </Label>
          <Input
            id="phone"
            value={headerData.phone}
            onChange={(e) => updateHeaderData({phone: e.target.value})}
            placeholder="+6283899254467"
            className="bg-zinc-900 border-zinc-800 text-zinc-100"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="email" className="text-xs text-zinc-300">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={headerData.email}
            onChange={(e) => updateHeaderData({email: e.target.value})}
            placeholder="name@example.com"
            className="bg-zinc-900 border-zinc-800 text-zinc-100"
          />
        </div>
      </div>

      {/* Links Section */}
      <div className="space-y-3 border-t border-zinc-800 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Portfolio, LinkedIn & GitHub Links
            </h3>
            <p className="text-[11px] text-zinc-400">
              Display labels stay concise (without https://) while links remain
              clickable in the PDF.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddLink}
            className="h-7 gap-1 border-zinc-700 bg-zinc-900 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Link
          </Button>
        </div>

        <div className="space-y-2.5">
          {headerData.links.map((link) => (
            <div
              key={link.id}
              className="grid grid-cols-1 gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 p-2.5 sm:grid-cols-12 items-center">
              <div className="sm:col-span-5">
                <Input
                  value={link.label}
                  onChange={(e) =>
                    handleUpdateLink(link.id, "label", e.target.value)
                  }
                  placeholder="Display Label (e.g. github.com/user)"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>
              <div className="sm:col-span-5">
                <Input
                  value={link.url}
                  onChange={(e) =>
                    handleUpdateLink(link.id, "url", e.target.value)
                  }
                  placeholder="https://github.com/user"
                  className="h-8 bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-1 sm:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-zinc-400 hover:text-white"
                  onClick={() =>
                    handleUpdateLink(link.id, "isVisible", !link.isVisible)
                  }>
                  {link.isVisible ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-zinc-400 hover:text-red-400"
                  onClick={() => handleRemoveLink(link.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
