import type { MedicalRecord } from "./types"

export const ORIGINAL_RECORD_ID = "exp-umg-2026-001"
export const ORIGINAL_CONTENT_HASH =
  "sha256:a3f1c9e8b2d0471e6f5a8c0d9b7e4a1f2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f"
export const ALTERED_CONTENT_HASH =
  "sha256:f7e6d5c4b3a29180f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b"

export const mockOriginalRecord: MedicalRecord = {
  id: ORIGINAL_RECORD_ID,
  patientName: "Ana Lucía Méndez",
  patientDocumentId: "2458 789 012 0101",
  birthDate: "1994-03-18",
  sex: "F",
  diagnosis: "Hipertensión arterial esencial (I10)",
  treatment:
    "Control ambulatorio con ajuste de antihipertensivos y seguimiento en 30 días.",
  medications: [
    "Losartán 50 mg VO cada 24 h",
    "Amlodipino 5 mg VO cada 24 h",
  ],
  clinicalNotes:
    "Paciente estable, sin dolor torácico. Se recomienda dieta hiposódica y actividad física moderada.",
  physicianName: "Dr. Carlos Ruiz",
  physicianLicense: "COLMED-UMG-45821",
  facility: "Clínica Docente Universidad Mariano Gálvez",
  createdAt: "2026-07-28T14:20:00.000Z",
  updatedAt: "2026-07-28T14:20:00.000Z",
  status: "unsigned",
  contentHash: ORIGINAL_CONTENT_HASH,
}

export const mockSignedRecord: MedicalRecord = {
  ...mockOriginalRecord,
  status: "signed",
  updatedAt: "2026-07-28T15:05:00.000Z",
}

export const mockAlteredRecord: MedicalRecord = {
  ...mockOriginalRecord,
  diagnosis: "Diabetes mellitus tipo 2 sin complicaciones (E11.9)",
  medications: [
    "Metformina 850 mg VO cada 12 h",
    "Amlodipino 5 mg VO cada 24 h",
  ],
  clinicalNotes:
    "Paciente estable. Se modifica esquema farmacológico y se solicita control glucémico.",
  status: "altered",
  updatedAt: "2026-07-28T16:40:00.000Z",
  contentHash: ALTERED_CONTENT_HASH,
}
