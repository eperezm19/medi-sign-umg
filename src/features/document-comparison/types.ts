import type { MedicalRecord } from "@/features/medical-record/types"
import type { ModifiedField } from "@/features/document-alteration/types"

export type ComparisonResult = {
  signedOriginalRecord: MedicalRecord | null
  currentRecord: MedicalRecord | null
  modifiedFields: ModifiedField[]
  originalHash: string | null
  currentHash: string | null
  hashesMatch: boolean
}
