import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchHashComparison() {
  const state = useMedicalFileStore.getState()
  if (!state.originalHash || !state.currentHash) return null
  return {
    originalHash: state.originalHash,
    currentHash: state.currentHash,
    hashesMatch: state.originalHash === state.currentHash,
  }
}
