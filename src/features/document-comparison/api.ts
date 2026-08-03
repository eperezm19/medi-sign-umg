import type { ComparisonResult } from "@/features/document-comparison/types"
import { delay, LIGHT_MUTATION_DELAY_MS, QUERY_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function fetchComparison(): Promise<ComparisonResult> {
  await delay(QUERY_DELAY_MS)
  const {
    signedOriginalRecord,
    currentRecord,
    modifiedFields,
    originalHash,
    currentHash,
  } = useMediSignStore.getState()

  return {
    signedOriginalRecord,
    currentRecord,
    modifiedFields,
    originalHash,
    currentHash,
    hashesMatch:
      originalHash !== null &&
      currentHash !== null &&
      originalHash === currentHash,
  }
}

export async function resetDemoScenario(): Promise<void> {
  await delay(LIGHT_MUTATION_DELAY_MS)
  useMediSignStore.getState().resetDemo()
}
