import { z } from "zod"

export const alterationSchema = z.object({
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
})

export type AlterationFormValues = z.infer<typeof alterationSchema>
