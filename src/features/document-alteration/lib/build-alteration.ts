import type { AlterationFormValues } from "@/features/document-alteration/schema"
import type { ModifiedField } from "@/features/document-alteration/types"
import { buildFictitiousSha256 } from "@/features/digital-signature/lib/build-signature"
import type { MedicalRecord } from "@/features/medical-record/types"

const FIELD_LABELS: Record<keyof AlterationFormValues, string> = {
  diagnosis: "Diagnóstico",
  treatment: "Tratamiento",
  clinicalNotes: "Observaciones",
}

export function detectModifiedFields(
  original: Pick<MedicalRecord, keyof AlterationFormValues>,
  draft: AlterationFormValues
): ModifiedField[] {
  const fields: (keyof AlterationFormValues)[] = [
    "diagnosis",
    "treatment",
    "clinicalNotes",
  ]

  return fields.flatMap((field) => {
    const originalValue = original[field].trim()
    const modifiedValue = draft[field].trim()

    if (originalValue === modifiedValue) {
      return []
    }

    return [
      {
        field,
        label: FIELD_LABELS[field],
        originalValue,
        modifiedValue,
      },
    ]
  })
}

export function buildAlteredRecord(
  base: MedicalRecord,
  values: AlterationFormValues
): MedicalRecord {
  const updatedAt = new Date().toISOString()
  const next: MedicalRecord = {
    ...base,
    diagnosis: values.diagnosis.trim(),
    treatment: values.treatment.trim(),
    clinicalNotes: values.clinicalNotes.trim(),
    status: "altered",
    updatedAt,
  }

  return {
    ...next,
    contentHash: buildFictitiousSha256(next),
  }
}

export function recordToAlterationValues(
  record: MedicalRecord
): AlterationFormValues {
  return {
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    clinicalNotes: record.clinicalNotes,
  }
}
