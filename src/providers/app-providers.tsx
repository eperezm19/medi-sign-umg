"use client"

import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { ToasterProvider } from "@/providers/toaster-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <ToasterProvider />
      </QueryProvider>
    </ThemeProvider>
  )
}
