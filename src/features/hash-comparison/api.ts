import { delay, QUERY_DELAY_MS } from "@/shared/lib/delay"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchHashComparison() {
  await delay(QUERY_DELAY_MS)
  const state = useMedicalFileStore.getState()
  if (!state.originalHash || !state.currentHash) return null
  return {
    originalHash: state.originalHash,
    currentHash: state.currentHash,
    hashesMatch: state.originalHash === state.currentHash,
  }
}
