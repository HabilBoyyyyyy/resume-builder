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
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-base font-bold text-slate-900">
          Header & Contact Information
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Centered contact block at the top of the resume. Empty fields
          automatically hide their pipe separator (|).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label
            htmlFor="fullName"
            className="text-xs font-semibold text-slate-700">
            Full Name (Rendered Uppercase)
          </Label>
          <Input
            id="fullName"
            value={headerData.fullName}
            onChange={(e) => updateHeaderData({fullName: e.target.value})}
            placeholder="ALEXANDER M. RIVERA"
            className="bg-white border-slate-300 text-slate-900 focus:border-blue-600"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="location"
            className="text-xs font-semibold text-slate-700">
            Location (City, Country)
          </Label>
          <Input
            id="location"
            value={headerData.location}
            onChange={(e) => updateHeaderData({location: e.target.value})}
            placeholder="Jakarta, Indonesia"
            className="bg-white border-slate-300 text-slate-900 focus:border-blue-600"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="phone"
            className="text-xs font-semibold text-slate-700">
            Phone Number
          </Label>
          <Input
            id="phone"
            value={headerData.phone}
            onChange={(e) => updateHeaderData({phone: e.target.value})}
            placeholder="+62 812-3456-7890"
            className="bg-white border-slate-300 text-slate-900 focus:border-blue-600"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label
            htmlFor="email"
            className="text-xs font-semibold text-slate-700">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={headerData.email}
            onChange={(e) => updateHeaderData({email: e.target.value})}
            placeholder="alex.rivera@example.com"
            className="bg-white border-slate-300 text-slate-900 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Links Section */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Portfolio, LinkedIn & GitHub Links
            </h3>
            <p className="text-[11px] text-slate-500">
              Display labels stay concise (without https://) while links remain
              clickable in the PDF.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddLink}
            className="h-8 gap-1 border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Plus className="h-3.5 w-3.5" />
            Add Link
          </Button>
        </div>

        <div className="space-y-2.5 pt-1">
          {headerData.links.map((link) => (
            <div
              key={link.id}
              className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 sm:grid-cols-12 items-center">
              <div className="sm:col-span-5">
                <Input
                  value={link.label}
                  onChange={(e) =>
                    handleUpdateLink(link.id, "label", e.target.value)
                  }
                  placeholder="Label (e.g. github.com/user)"
                  className="h-8 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>
              <div className="sm:col-span-5">
                <Input
                  value={link.url}
                  onChange={(e) =>
                    handleUpdateLink(link.id, "url", e.target.value)
                  }
                  placeholder="https://github.com/user"
                  className="h-8 bg-white border-slate-300 text-xs text-slate-900"
                />
              </div>
              <div className="flex items-center justify-end gap-1 sm:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  onClick={() =>
                    handleUpdateLink(link.id, "isVisible", !link.isVisible)
                  }>
                  {link.isVisible ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-500 hover:bg-red-50 hover:text-red-600"
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
