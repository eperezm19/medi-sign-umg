import { z } from "zod"

export const medicalRecordSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(1, "El nombre del paciente es obligatorio."),
  id: z
    .string()
    .trim()
    .min(1, "El número de expediente es obligatorio."),
  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Ingresa una fecha de nacimiento válida.",
    }),
  diagnosis: z
    .string()
    .trim()
    .min(3, "El diagnóstico debe tener al menos 3 caracteres."),
  treatment: z
    .string()
    .trim()
    .min(3, "El tratamiento debe tener al menos 3 caracteres."),
  clinicalNotes: z
    .string()
    .trim()
    .min(1, "Las observaciones son obligatorias."),
  physicianName: z
    .string()
    .trim()
    .min(1, "El médico responsable es obligatorio."),
  physicianLicense: z
    .string()
    .trim()
    .min(1, "El número de colegiado es obligatorio."),
  createdAt: z
    .string()
    .min(1, "La fecha y hora son obligatorias.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Ingresa una fecha y hora válidas.",
    }),
})

export type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>
