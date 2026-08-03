import { buildUnsignedRecord } from "@/features/medical-record/lib/build-record"
import type { MedicalRecordFormValues } from "@/features/medical-record/schema"
import type { MedicalRecord } from "@/features/medical-record/types"
import { delay, LIGHT_MUTATION_DELAY_MS, QUERY_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function fetchMedicalRecord(): Promise<MedicalRecord | null> {
  await delay(QUERY_DELAY_MS)
  return useMediSignStore.getState().currentRecord
}

export async function createMedicalRecord(
  values: MedicalRecordFormValues
): Promise<MedicalRecord> {
  await delay(LIGHT_MUTATION_DELAY_MS)
  const record = buildUnsignedRecord(values)
  useMediSignStore.getState().createUnsignedRecord(record)
  return useMediSignStore.getState().currentRecord ?? record
}
