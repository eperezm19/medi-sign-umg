import type { ModifiedField } from "./types"

export const mockModifiedFields: ModifiedField[] = [
  {
    field: "diagnosis",
    label: "Diagnóstico",
    originalValue: "Hipertensión arterial esencial (I10)",
    modifiedValue: "Diabetes mellitus tipo 2 sin complicaciones (E11.9)",
  },
  {
    field: "medications",
    label: "Medicamentos",
    originalValue:
      "Losartán 50 mg VO cada 24 h; Amlodipino 5 mg VO cada 24 h",
    modifiedValue:
      "Metformina 850 mg VO cada 12 h; Amlodipino 5 mg VO cada 24 h",
  },
  {
    field: "clinicalNotes",
    label: "Notas clínicas",
    originalValue:
      "Paciente estable, sin dolor torácico. Se recomienda dieta hiposódica y actividad física moderada.",
    modifiedValue:
      "Paciente estable. Se modifica esquema farmacológico y se solicita control glucémico.",
  },
]
