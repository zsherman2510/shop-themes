"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "modern" | "dark" | "light";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  themes?: Theme[];
  attribute?: string;
  enableSystem?: boolean;
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = "modern",
  themes = ["modern", "dark", "light"],
  attribute = "data-theme",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem("theme") as Theme;

    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
      root.setAttribute(attribute, savedTheme);
    } else if (enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
      root.setAttribute(attribute, systemTheme);
    }
  }, [attribute, enableSystem, themes]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute(attribute, theme);
    localStorage.setItem("theme", theme);
  }, [theme, attribute]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
