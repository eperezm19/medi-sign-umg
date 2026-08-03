"use client"

import { useEffect } from "react"

import { useMediSignStore } from "@/stores/medi-sign-store"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useMediSignStore.persist.rehydrate()
  }, [])

  return children
}
