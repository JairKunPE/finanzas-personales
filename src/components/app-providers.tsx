"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { fetcher } from "@/lib/api/fetcher";

export function AppProviders({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          shouldRetryOnError: false,
          dedupingInterval: 10000,
          onError(error) {
            if (error instanceof Error && error.message.includes("No autorizado")) {
              router.push("/login");
            }
          },
        }}
      >
        {children}
        <Toaster richColors position="top-right" />
      </SWRConfig>
    </ThemeProvider>
  );
}
