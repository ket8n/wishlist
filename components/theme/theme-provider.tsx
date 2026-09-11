"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Sets the theme class on <html> before first paint, so there is no flash.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
