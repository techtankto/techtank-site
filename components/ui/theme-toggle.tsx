"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { THEMES } from "@/constants/theme";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { cva } from "@/utils/theme";

const styles = {
  icon: cva("size-4"),
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useIsHydrated();

  if (!hydrated) {
    return <Button variant="ghost" size="icon" aria-label="Toggle theme" />;
  }

  const isDark = resolvedTheme === THEMES.DARK;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? THEMES.LIGHT : THEMES.DARK)}
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className={styles.icon()} aria-hidden="true" />
      ) : (
        <Moon className={styles.icon()} aria-hidden="true" />
      )}
    </Button>
  );
}
