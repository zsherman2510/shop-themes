"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "autumn" | "forest";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  themes?: Theme[];
  attribute?: string;
  enableSystem?: boolean;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Provide a default value to createContext
const ThemeContext = createContext<ThemeContextType>({
  theme: "autumn",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "autumn",
  themes = ["autumn", "forest"],
  attribute = "data-theme",
  enableSystem = true,
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme && themes.includes(savedTheme)) {
        return savedTheme;
      }
      if (enableSystem) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "forest"
          : "autumn";
      }
    }
    return defaultTheme;
  });

  // Only run after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.setAttribute(attribute, theme);
    localStorage.setItem("theme", theme);
  }, [theme, attribute, mounted]);

  // Handle system theme changes
  useEffect(() => {
    if (!mounted || !enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "forest" : "autumn");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableSystem, mounted]);

  const value = {
    theme,
    setTheme,
  };

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
