"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const THEMES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

const subscribe = () => () => {};

// Theme: System / Light / Dark segmented control (DESIGN_SPEC §9.10).
// Will live in the Account menu once that exists.
export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known on the client; render unselected on the server.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <ToggleGroup
      type="single"
      spacing={0}
      aria-label="Theme"
      value={mounted ? theme : undefined}
      onValueChange={(value) => value && setTheme(value)}
      className="w-full rounded-[9px] border border-subtle bg-sunken p-[3px]"
    >
      {THEMES.map(({ value, label }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className="h-11 flex-1 rounded-[7px]! border border-transparent text-[12.5px] text-ink-muted hover:bg-transparent hover:text-ink data-[state=on]:border-border data-[state=on]:bg-card data-[state=on]:text-ink data-[state=on]:shadow-card lg:h-8"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
