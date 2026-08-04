"use client"

import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useStoreHydration()
  return children
}
