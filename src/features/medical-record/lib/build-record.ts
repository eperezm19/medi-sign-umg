import type { MedicalRecord } from "@/features/medical-record/types"
import type { MedicalRecordFormValues } from "@/features/medical-record/schema"
import { mockOriginalRecord } from "@/features/medical-record/mocks"

function toIsoDateTime(value: string): string {
  const date = new Date(value)
  return date.toISOString()
}

function buildDemoContentHash(values: MedicalRecordFormValues): string {
  const payload = [
    values.id,
    values.patientName,
    values.birthDate,
    values.diagnosis,
    values.treatment,
    values.clinicalNotes,
    values.physicianName,
    values.physicianLicense,
    values.createdAt,
  ].join("|")

  let hash = 0
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash << 5) - hash + payload.charCodeAt(i)
    hash |= 0
  }

  const hex = Math.abs(hash).toString(16).padStart(8, "0")
  return `sha256:demo${hex}${hex}${hex}${hex}`
}

export function buildUnsignedRecord(
  values: MedicalRecordFormValues
): MedicalRecord {
  const createdAt = toIsoDateTime(values.createdAt)

  return {
    id: values.id.trim(),
    patientName: values.patientName.trim(),
    patientDocumentId: mockOriginalRecord.patientDocumentId,
    birthDate: values.birthDate,
    sex: "F",
    diagnosis: values.diagnosis.trim(),
    treatment: values.treatment.trim(),
    medications: [],
    clinicalNotes: values.clinicalNotes.trim(),
    physicianName: values.physicianName.trim(),
    physicianLicense: values.physicianLicense.trim(),
    facility: mockOriginalRecord.facility,
    createdAt,
    updatedAt: createdAt,
    status: "unsigned",
    contentHash: buildDemoContentHash(values),
  }
}

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function recordToFormValues(
  record: MedicalRecord
): MedicalRecordFormValues {
  return {
    patientName: record.patientName,
    id: record.id,
    birthDate: record.birthDate,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    clinicalNotes: record.clinicalNotes,
    physicianName: record.physicianName,
    physicianLicense: record.physicianLicense,
    createdAt: toDatetimeLocalValue(record.createdAt),
  }
}

export function getExampleFormValues(): MedicalRecordFormValues {
  return recordToFormValues(mockOriginalRecord)
}
