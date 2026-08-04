"use client"

import { useEffect, useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileWarningIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { useAlterDocumentMutation } from "@/features/document-alteration/hooks"
import {
  detectModifiedFields,
  recordToAlterationValues,
} from "@/features/document-alteration/lib/build-alteration"
import {
  alterationSchema,
  type AlterationFormValues,
} from "@/features/document-alteration/schema"
import { MedicalRecordStatusBadge } from "@/features/medical-record/components/medical-record-status-badge"
import { DemoEmptyState } from "@/shared/components/demo/demo-empty-state"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Badge } from "@/shared/components/ui/badge"
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
import { Textarea } from "@/shared/components/ui/textarea"
import { useMediSignStore } from "@/stores/medi-sign-store"

export function DocumentAlterationPanel() {
  const currentRecord = useMediSignStore((state) => state.currentRecord)
  const signedOriginalRecord = useMediSignStore(
    (state) => state.signedOriginalRecord
  )
  const signature = useMediSignStore((state) => state.signature)
  const originalHash = useMediSignStore((state) => state.originalHash)
  const currentHash = useMediSignStore((state) => state.currentHash)
  const modifiedFields = useMediSignStore((state) => state.modifiedFields)
  const alterMutation = useAlterDocumentMutation()

  const [confirmOpen, setConfirmOpen] = useState(false)

  const canAlter =
    Boolean(signature) &&
    Boolean(signedOriginalRecord || currentRecord) &&
    (currentRecord?.status === "signed" ||
      currentRecord?.status === "verified" ||
      currentRecord?.status === "altered" ||
      currentRecord?.status === "verification_failed")

  const baseline = signedOriginalRecord ?? currentRecord

  const form = useForm<AlterationFormValues>({
    resolver: zodResolver(alterationSchema),
    defaultValues: currentRecord
      ? recordToAlterationValues(currentRecord)
      : { diagnosis: "", treatment: "", clinicalNotes: "" },
  })

  useEffect(() => {
    if (!currentRecord) {
      return
    }
    form.reset(recordToAlterationValues(currentRecord))
  }, [currentRecord, form])

  const watched = useWatch({ control: form.control })

  const pendingChanges = useMemo(() => {
    if (!baseline) {
      return []
    }
    return detectModifiedFields(baseline, {
      diagnosis: watched.diagnosis ?? "",
      treatment: watched.treatment ?? "",
      clinicalNotes: watched.clinicalNotes ?? "",
    })
  }, [baseline, watched.clinicalNotes, watched.diagnosis, watched.treatment])

  const isPending = alterMutation.isPending

  async function applyAlteration(values: AlterationFormValues) {
    try {
      const result = await alterMutation.mutateAsync(values)
      setConfirmOpen(false)
      toast.success("Expediente alterado", {
        description: `Estado ALTERED · ${result.modifiedFields.length} campo(s) modificado(s)`,
      })
    } catch (error) {
      toast.error("No se pudo alterar el expediente", {
        description:
          error instanceof Error ? error.message : "Revisa los cambios e intenta de nuevo.",
      })
    }
  }

  function handleRequestConfirm(values: AlterationFormValues) {
    if (pendingChanges.length === 0) {
      toast.message("Sin cambios", {
        description: "Modifica al menos un campo respecto al original firmado.",
      })
      return
    }
    setConfirmOpen(true)
    form.reset(values, { keepValues: true })
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Alteración del expediente</CardTitle>
            <CardDescription>
              Modifica diagnóstico, tratamiento u observaciones después de
              firmar. Se conserva el original, la firma y el hash original.
            </CardDescription>
          </div>
          {currentRecord ? (
            <MedicalRecordStatusBadge status={currentRecord.status} />
          ) : (
            <Badge variant="outline">Sin expediente</Badge>
          )}
        </CardHeader>

        <form onSubmit={form.handleSubmit(handleRequestConfirm)} noValidate>
          <CardContent className="space-y-5">
            {!canAlter ? (
              <DemoEmptyState className="py-8">
                {!signature
                  ? "Firma el expediente primero para habilitar la alteración simulada."
                  : "El expediente debe estar firmado, verificado o alterado para continuar."}
              </DemoEmptyState>
            ) : (
              <>
                <FieldGroup className="gap-5">
                  <Controller
                    name="diagnosis"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="alter-diagnosis">
                          Diagnóstico
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="alter-diagnosis"
                          rows={3}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
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
                        <FieldLabel htmlFor="alter-treatment">
                          Tratamiento
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="alter-treatment"
                          rows={3}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
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
                        <FieldLabel htmlFor="alter-notes">
                          Observaciones
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="alter-notes"
                          rows={3}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </FieldGroup>

                {pendingChanges.length > 0 ? (
                  <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
                    <p className="text-sm font-medium">
                      Cambios detectados ({pendingChanges.length})
                    </p>
                    <ul className="space-y-2 text-sm">
                      {pendingChanges.map((change) => (
                        <li key={change.field} className="rounded-lg border p-2">
                          <p className="font-medium">{change.label}</p>
                          <p className="text-xs text-muted-foreground">
                            Antes: {change.originalValue}
                          </p>
                          <p className="text-xs">Después: {change.modifiedValue}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {currentRecord?.status === "altered" &&
                modifiedFields.length > 0 ? (
                  <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <MedicalRecordStatusBadge status="altered" />
                      <Badge variant="outline" className="font-mono text-xs">
                        hash distinto
                      </Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Hash original
                        </p>
                        <p className="mt-1 break-all font-mono text-xs">
                          {originalHash}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Hash actual
                        </p>
                        <p className="mt-1 break-all font-mono text-xs">
                          {currentHash}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {modifiedFields.map((field) => (
                        <li key={field.field}>
                          <span className="font-medium">{field.label}:</span>{" "}
                          modificado
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground">
                      Firma original y documento firmado conservados.
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="submit" disabled={!canAlter || isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : (
                <FileWarningIcon data-icon="inline-start" />
              )}
              {isPending ? "Aplicando…" : "Aplicar alteración"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent
          size="default"
          className="max-w-[calc(100%-2rem)] sm:max-w-md"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar alteración?</AlertDialogTitle>
            <AlertDialogDescription>
              Se modificará el expediente firmado. Se conservarán el documento
              original, la firma y el hash original. El estado pasará a ALTERED
              y se generará un hash actual distinto.
              {pendingChanges.length > 0
                ? ` Campos afectados: ${pendingChanges.map((c) => c.label).join(", ")}.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault()
                void form.handleSubmit(applyAlteration)()
              }}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              {isPending ? "Aplicando…" : "Confirmar alteración"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
