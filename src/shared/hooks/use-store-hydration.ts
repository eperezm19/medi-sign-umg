"use client"

import { useEffect, useState } from "react"

import { useMediSignStore } from "@/stores/medi-sign-store"

export function useStoreHydration() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false

    const unsubFinish = useMediSignStore.persist.onFinishHydration(() => {
      if (!cancelled) {
        setHasHydrated(true)
      }
    })

    void Promise.resolve(useMediSignStore.persist.rehydrate()).then(() => {
      if (!cancelled && useMediSignStore.persist.hasHydrated()) {
        setHasHydrated(true)
      }
    })

    return () => {
      cancelled = true
      unsubFinish()
    }
  }, [])

  return hasHydrated
}
