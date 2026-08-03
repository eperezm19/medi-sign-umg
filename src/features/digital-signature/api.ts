import type { DigitalSignature } from "@/features/digital-signature/types"
import type { MedicalRecord } from "@/features/medical-record/types"
import { delay, HEAVY_MUTATION_DELAY_MS, QUERY_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function fetchDigitalSignature(): Promise<DigitalSignature | null> {
  await delay(QUERY_DELAY_MS)
  return useMediSignStore.getState().signature
}

export async function signMedicalRecord(): Promise<{
  signature: DigitalSignature
  record: MedicalRecord
}> {
  await delay(HEAVY_MUTATION_DELAY_MS)
  useMediSignStore.getState().applySignedState()
  const { signature, currentRecord } = useMediSignStore.getState()

  if (!signature || !currentRecord) {
    throw new Error("No se pudo firmar el expediente de demostración.")
  }

  return { signature, record: currentRecord }
}
