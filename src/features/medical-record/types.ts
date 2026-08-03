export type MedicalRecordStatus =
  | "draft"
  | "unsigned"
  | "signed"
  | "altered"
  | "verification_failed"

export type MedicalRecord = {
  id: string
  patientName: string
  patientDocumentId: string
  birthDate: string
  sex: "F" | "M" | "X"
  diagnosis: string
  treatment: string
  medications: string[]
  clinicalNotes: string
  physicianName: string
  physicianLicense: string
  facility: string
  createdAt: string
  updatedAt: string
  status: MedicalRecordStatus
  contentHash: string
}
