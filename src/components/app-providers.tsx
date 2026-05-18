"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";

import { ThemeProvider } from "@/components/theme-provider";
import { fetcher } from "@/lib/api/fetcher";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>{children}</SWRConfig>
    </ThemeProvider>
  );
}
