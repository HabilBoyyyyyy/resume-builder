// src/components/editor/forms/SkillsMatrixForm.tsx
"use client";

import React, {useState, useCallback} from "react";
import {
  Plus,
  Trash2,
  Bold,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {useResumeStore} from "@/store/useResumeStore";
import type {SkillDisplayMode} from "@/schemas/resume.schema";

interface SkillsMatrixFormProps {
  sectionId: string;
}

export function SkillsMatrixForm({sectionId}: SkillsMatrixFormProps) {
  const section = useResumeStore(
    useCallback(
      (state) => state.resume.sections.find((s) => s.id === sectionId),
      [sectionId],
    ),
  );
  const categories = useResumeStore((state) => state.resume.skillCategories);
  const updateSection = useResumeStore((state) => state.updateSection);
  const addSkillCategory = useResumeStore((state) => state.addSkillCategory);
  const updateSkillCategory = useResumeStore(
    (state) => state.updateSkillCategory,
  );
  const removeSkillCategory = useResumeStore(
    (state) => state.removeSkillCategory,
  );
  const reorderSkillCategories = useResumeStore(
    (state) => state.reorderSkillCategories,
  );
  const addSkillItem = useResumeStore((state) => state.addSkillItem);
  const updateSkillItem = useResumeStore((state) => state.updateSkillItem);
  const removeSkillItem = useResumeStore((state) => state.removeSkillItem);

  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>(
    {},
  );

  if (!section) return null;

  const sortedCategories = [...categories].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const handleAddSkillSubmit = (categoryId: string) => {
    const raw = (newSkillInputs[categoryId] ?? "").trim();
    if (!raw) return;
    addSkillItem(categoryId, raw);
    setNewSkillInputs((prev) => ({...prev, [categoryId]: ""}));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-zinc-300">Section Heading Title</Label>
          <Input
            value={section.title}
            onChange={(e) => updateSection(sectionId, {title: e.target.value})}
            className="bg-zinc-900 border-zinc-800 font-semibold text-zinc-100"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => addSkillCategory("New Skill Category")}
          className="gap-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500">
          <Plus className="h-3.5 w-3.5" />
          Add Skill Category
        </Button>
      </div>

      <div className="space-y-4">
        {sortedCategories.map((cat, idx) => (
          <div
            key={cat.id}
            className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <Input
                value={cat.name}
                onChange={(e) =>
                  updateSkillCategory(cat.id, {name: e.target.value})
                }
                className="h-8 max-w-[220px] bg-zinc-950 border-zinc-800 text-xs font-semibold"
              />

              <div className="flex items-center gap-2">
                <select
                  value={cat.displayMode}
                  onChange={(e) =>
                    updateSkillCategory(cat.id, {
                      displayMode: e.target.value as SkillDisplayMode,
                    })
                  }
                  className="h-8 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-200">
                  <option value="INLINE_COMMA">Classic Inline</option>
                  <option value="ALIGNED_TABLE">Aligned 2-Col Table</option>
                  <option value="MULTI_COLUMN_GRID">2-Column Grid</option>
                  <option value="PROFICIENCY_GROUPED">
                    With Proficiency Suffix
                  </option>
                </select>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Switch
                    checked={cat.showProficiency}
                    onCheckedChange={(checked) =>
                      updateSkillCategory(cat.id, {showProficiency: checked})
                    }
                  />
                  <span>Proficiency</span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={idx === 0}
                  onClick={() =>
                    reorderSkillCategories(cat.id, sortedCategories[idx - 1].id)
                  }
                  className="h-7 w-7 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Move Category Up">
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={idx === sortedCategories.length - 1}
                  onClick={() =>
                    reorderSkillCategories(cat.id, sortedCategories[idx + 1].id)
                  }
                  className="h-7 w-7 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Move Category Down">
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSkillCategory(cat.id)}
                  className="h-7 w-7 text-zinc-400 hover:text-red-400"
                  title="Delete Category">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Interactive Skill Chips */}
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition ${
                    item.isHighlighted
                      ? "border-blue-500/60 bg-blue-950/40 text-blue-200 font-semibold"
                      : "border-zinc-800 bg-zinc-950 text-zinc-200"
                  } ${!item.isVisible ? "opacity-45" : ""}`}>
                  <span>{item.name}</span>

                  {cat.showProficiency && (
                    <input
                      type="text"
                      value={item.proficiency ?? ""}
                      onChange={(e) =>
                        updateSkillItem(cat.id, item.id, {
                          proficiency: e.target.value,
                        })
                      }
                      placeholder="Level..."
                      className="w-20 rounded bg-zinc-900 px-1 py-0.5 text-[10px] text-zinc-300 focus:outline-none"
                    />
                  )}

                  <button
                    type="button"
                    title="Toggle Bold Emphasis"
                    onClick={() =>
                      updateSkillItem(cat.id, item.id, {
                        isHighlighted: !item.isHighlighted,
                      })
                    }
                    className={`p-0.5 rounded hover:bg-zinc-800 ${
                      item.isHighlighted ? "text-blue-400" : "text-zinc-500"
                    }`}>
                    <Bold className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    title="Toggle Visibility"
                    onClick={() =>
                      updateSkillItem(cat.id, item.id, {
                        isVisible: !item.isVisible,
                      })
                    }
                    className="p-0.5 rounded text-zinc-500 hover:text-white">
                    {item.isVisible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-amber-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Remove Skill"
                    onClick={() => removeSkillItem(cat.id, item.id)}
                    className="p-0.5 rounded text-zinc-500 hover:text-red-400">
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Skill Input */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={newSkillInputs[cat.id] ?? ""}
                onChange={(e) =>
                  setNewSkillInputs((prev) => ({
                    ...prev,
                    [cat.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkillSubmit(cat.id);
                  }
                }}
                placeholder="Type a skill (e.g. FastAPI, Docker) and press Enter..."
                className="h-8 bg-zinc-950 border-zinc-800 text-xs"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleAddSkillSubmit(cat.id)}
                className="h-8 text-xs">
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
