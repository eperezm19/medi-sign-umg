"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, SaveIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { useCreateMedicalRecordMutation } from "@/features/medical-record/hooks"
import {
  getExampleFormValues,
  recordToFormValues,
} from "@/features/medical-record/lib/build-record"
import {
  medicalRecordSchema,
  type MedicalRecordFormValues,
} from "@/features/medical-record/schema"
import { MedicalRecordStatusBadge } from "@/features/medical-record/components/medical-record-status-badge"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { useMediSignStore } from "@/stores/medi-sign-store"

const emptyValues: MedicalRecordFormValues = {
  patientName: "",
  id: "",
  birthDate: "",
  diagnosis: "",
  treatment: "",
  clinicalNotes: "",
  physicianName: "",
  physicianLicense: "",
  createdAt: "",
}

export function MedicalRecordForm() {
  const currentRecord = useMediSignStore((state) => state.currentRecord)
  const createMutation = useCreateMedicalRecordMutation()

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: currentRecord
      ? recordToFormValues(currentRecord)
      : emptyValues,
  })

  useEffect(() => {
    if (!currentRecord) {
      return
    }

    form.reset(recordToFormValues(currentRecord))
  }, [currentRecord, form])

  function handleLoadExample() {
    form.reset(getExampleFormValues())
    toast.message("Datos de ejemplo cargados", {
      description: "Puedes editarlos antes de guardar el expediente.",
    })
  }

  async function onSubmit(values: MedicalRecordFormValues) {
    try {
      const record = await createMutation.mutateAsync(values)
      toast.success("Expediente guardado como UNSIGNED", {
        description: `${record.patientName} · ${record.id}`,
      })
    } catch {
      toast.error("No se pudo guardar el expediente", {
        description: "Intenta de nuevo en unos segundos.",
      })
    }
  }

  const isPending = createMutation.isPending

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Crear expediente médico</CardTitle>
          <CardDescription>
            Completa los datos del paciente ficticio para iniciar la
            demostración. Al guardar, el expediente queda en estado UNSIGNED.
          </CardDescription>
        </div>
        {currentRecord ? (
          <MedicalRecordStatusBadge status={currentRecord.status} />
        ) : null}
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <FieldGroup className="gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                name="patientName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="patientName">
                      Nombre del paciente
                    </FieldLabel>
                    <Input
                      {...field}
                      id="patientName"
                      placeholder="Ana Lucía Méndez"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="recordId">
                      Número de expediente
                    </FieldLabel>
                    <Input
                      {...field}
                      id="recordId"
                      placeholder="exp-umg-2026-001"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="birthDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="birthDate">
                      Fecha de nacimiento
                    </FieldLabel>
                    <Input
                      {...field}
                      id="birthDate"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="createdAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="createdAt">Fecha y hora</FieldLabel>
                    <Input
                      {...field}
                      id="createdAt"
                      type="datetime-local"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <Controller
              name="diagnosis"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
                  <Textarea
                    {...field}
                    id="diagnosis"
                    rows={3}
                    placeholder="Hipertensión arterial esencial (I10)"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="treatment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="treatment">Tratamiento</FieldLabel>
                  <Textarea
                    {...field}
                    id="treatment"
                    rows={3}
                    placeholder="Control ambulatorio y seguimiento..."
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="clinicalNotes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="clinicalNotes">Observaciones</FieldLabel>
                  <Textarea
                    {...field}
                    id="clinicalNotes"
                    rows={3}
                    placeholder="Notas clínicas adicionales..."
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                name="physicianName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="physicianName">
                      Médico responsable
                    </FieldLabel>
                    <Input
                      {...field}
                      id="physicianName"
                      placeholder="Dr. Carlos Ruiz"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="physicianLicense"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="physicianLicense">
                      Número de colegiado
                    </FieldLabel>
                    <Input
                      {...field}
                      id="physicianLicense"
                      placeholder="COLMED-UMG-45821"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadExample}
            disabled={isPending}
          >
            <SparklesIcon data-icon="inline-start" />
            Cargar datos de ejemplo
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : (
              <SaveIcon data-icon="inline-start" />
            )}
            {isPending ? "Guardando..." : "Guardar expediente"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
