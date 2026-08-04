"use client"

import {
  canAccessStep,
  getMaxUnlockedStepIndex,
} from "@/shared/config/demo-navigation"
import { useMediSignStore } from "@/stores/medi-sign-store"

export function useDemoStepAccess() {
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
    maxUnlockedIndex,
    canAccess: (pathnameOrHref: string) =>
      canAccessStep(pathnameOrHref, maxUnlockedIndex),
  }
}
