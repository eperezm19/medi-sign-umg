import type { MedicalRecord } from "@/features/medical-record/types"
import { delay, LIGHT_MUTATION_DELAY_MS, QUERY_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function fetchMedicalRecord(): Promise<MedicalRecord | null> {
  await delay(QUERY_DELAY_MS)
  return useMediSignStore.getState().currentRecord
}

export async function createMedicalRecord(): Promise<MedicalRecord | null> {
  await delay(LIGHT_MUTATION_DELAY_MS)
  useMediSignStore.getState().loadUnsignedRecord()
  return useMediSignStore.getState().currentRecord
}
