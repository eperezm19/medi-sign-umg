"use client"

import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { StoreProvider } from "@/providers/store-provider"
import { ToasterProvider } from "@/providers/toaster-provider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <StoreProvider>
          {children}
          <ToasterProvider />
        </StoreProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
