import type { AlterationFormValues } from "@/features/document-alteration/schema"
import type { ModifiedField } from "@/features/document-alteration/types"
import type { MedicalRecord } from "@/features/medical-record/types"
import { delay, HEAVY_MUTATION_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function alterDocument(
  values: AlterationFormValues
): Promise<{
  record: MedicalRecord
  modifiedFields: ModifiedField[]
}> {
  await delay(HEAVY_MUTATION_DELAY_MS)
  return useMediSignStore.getState().alterCurrentRecord(values)
}
