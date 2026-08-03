import type { MedicalRecord } from "@/features/medical-record/types"
import type { ModifiedField } from "@/features/document-alteration/types"
import { delay, HEAVY_MUTATION_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function alterDocument(): Promise<{
  record: MedicalRecord
  modifiedFields: ModifiedField[]
}> {
  await delay(HEAVY_MUTATION_DELAY_MS)
  useMediSignStore.getState().applyAlteredState()
  const { currentRecord, modifiedFields } = useMediSignStore.getState()

  if (!currentRecord) {
    throw new Error("No se pudo alterar el expediente de demostración.")
  }

  return { record: currentRecord, modifiedFields }
}
