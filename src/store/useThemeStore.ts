// src/store/useThemeStore.ts
import {create} from "zustand";
import {persist} from "zustand/middleware";

export type ThemeMode = "warm" | "dim" | "stone" | "light";

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  badge: string;
  description: string;
  previewBg: string;
  previewText: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "warm",
    name: "Warm Paper",
    badge: "Recommended",
    description: "Soothing cream & parchment tones that cut blue/white glare",
    previewBg: "#f4efe6",
    previewText: "#2b2520",
  },
  {
    id: "dim",
    name: "Dim Slate",
    badge: "Twilight",
    description: "Relaxed mid-dark slate, no pitch-black darkness",
    previewBg: "#171b24",
    previewText: "#f1f5f9",
  },
  {
    id: "stone",
    name: "Soft Stone",
    badge: "Matte Gray",
    description: "Desaturated cool gray, softens bright screens",
    previewBg: "#e8eaed",
    previewText: "#1f2937",
  },
  {
    id: "light",
    name: "Crisp Light",
    badge: "Original",
    description: "Standard high-contrast light mode",
    previewBg: "#ffffff",
    previewText: "#0f172a",
  },
];

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "dim") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "warm",
      setTheme: (theme: ThemeMode) => {
        applyThemeToDocument(theme);
        set({theme});
      },
    }),
    {
      name: "resume_builder_theme_mode",
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDocument(state.theme);
        } else {
          applyThemeToDocument("warm");
        }
      },
    },
  ),
);
