"use client"

import { useEffect, useState } from "react"

import { useMedicalFileStore } from "@/stores/medical-file.store"

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsub = useMedicalFileStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    if (useMedicalFileStore.persist.hasHydrated()) {
      setHydrated(true)
    }

    return unsub
  }, [])

  return hydrated
}
