"use client"

import {
  canAccessStep,
  getMaxUnlockedStepIndex,
} from "@/shared/config/demo-navigation"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"
import { useMediSignStore } from "@/stores/medi-sign-store"

export function useDemoStepAccess() {
  const hasHydrated = useStoreHydration()
  const maxUnlockedIndex = useMediSignStore((state) =>
    getMaxUnlockedStepIndex({
      currentRecord: state.currentRecord
        ? { status: state.currentRecord.status }
        : null,
      signature: state.signature,
      verificationResult: state.verificationResult,
      modifiedFields: state.modifiedFields,
    })
  )

  return {
    hasHydrated,
    maxUnlockedIndex,
    canAccess: (pathnameOrHref: string) =>
      !hasHydrated || canAccessStep(pathnameOrHref, maxUnlockedIndex),
  }
}
