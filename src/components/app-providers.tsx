"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { fetcher } from "@/lib/api/fetcher";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false, shouldRetryOnError: false, dedupingInterval: 10000 }}>
        {children}
        <Toaster richColors position="top-right" />
      </SWRConfig>
    </ThemeProvider>
  );
}
