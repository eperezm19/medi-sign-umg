"use client"

import { useEffect } from "react"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  GitCompareArrowsIcon,
  Loader2Icon,
} from "lucide-react"

import { useComparisonQuery } from "@/features/document-comparison/hooks"
import { MedicalRecordStatusBadge } from "@/features/medical-record/components/medical-record-status-badge"
import type { MedicalRecord } from "@/features/medical-record/types"
import { DemoEmptyState } from "@/shared/components/demo/demo-empty-state"
import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"
import { useMediSignStore } from "@/stores/medi-sign-store"

function isFieldChanged(
  original: string | null | undefined,
  current: string | null | undefined
): boolean {
  return (original ?? "").trim() !== (current ?? "").trim()
}

function DiffField({
  label,
  value,
  changed,
  mono,
}: {
  label: string
  value: string
  changed?: boolean
  mono?: boolean
}) {
  return (
    <div
      className={cn(
        "space-y-1 rounded-xl border p-3",
        changed
          ? "border-amber-600/35 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10"
          : "border-border bg-muted/20"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {changed ? (
          <Badge
            variant="outline"
            className="border-amber-600/30 bg-amber-500/15 text-[10px] text-amber-900 dark:text-amber-100"
          >
            Modificado
          </Badge>
        ) : null}
      </div>
      <p
        className={cn(
          "text-sm leading-relaxed break-all",
          mono && "font-mono text-xs"
        )}
      >
        {value || "—"}
      </p>
    </div>
  )
}

function DocumentColumn({
  title,
  description,
  record,
  hash,
  hashChanged,
  fields,
  side,
}: {
  title: string
  description: string
  record: MedicalRecord | null
  hash: string | null
  hashChanged: boolean
  fields: {
    diagnosisChanged: boolean
    treatmentChanged: boolean
    notesChanged: boolean
  }
  side: "original" | "current"
}) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {record ? <MedicalRecordStatusBadge status={record.status} /> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <DiffField
          label={side === "original" ? "Diagnóstico original" : "Diagnóstico actual"}
          value={record?.diagnosis ?? ""}
          changed={fields.diagnosisChanged}
        />
        <DiffField
          label={side === "original" ? "Tratamiento original" : "Tratamiento actual"}
          value={record?.treatment ?? ""}
          changed={fields.treatmentChanged}
        />
        <DiffField
          label={
            side === "original"
              ? "Observaciones originales"
              : "Observaciones actuales"
          }
          value={record?.clinicalNotes ?? ""}
          changed={fields.notesChanged}
        />
        <DiffField
          label={side === "original" ? "Hash original" : "Hash actual"}
          value={hash ?? ""}
          changed={hashChanged}
          mono
        />
      </CardContent>
    </Card>
  )
}

export function DocumentComparisonPanel() {
  const setFlowStep = useMediSignStore((state) => state.setFlowStep)
  const storeOriginal = useMediSignStore((state) => state.signedOriginalRecord)
  const storeCurrent = useMediSignStore((state) => state.currentRecord)
  const storeOriginalHash = useMediSignStore((state) => state.originalHash)
  const storeCurrentHash = useMediSignStore((state) => state.currentHash)
  const storeModifiedFields = useMediSignStore((state) => state.modifiedFields)

  const comparisonQuery = useComparisonQuery()

  useEffect(() => {
    setFlowStep("comparacion")
  }, [setFlowStep])

  const data = comparisonQuery.data
  const originalRecord = data?.signedOriginalRecord ?? storeOriginal
  const currentRecord = data?.currentRecord ?? storeCurrent
  const originalHash = data?.originalHash ?? storeOriginalHash
  const currentHash = data?.currentHash ?? storeCurrentHash
  const modifiedFields = data?.modifiedFields?.length
    ? data.modifiedFields
    : storeModifiedFields
  const hashesMatch =
    data?.hashesMatch ??
    (Boolean(originalHash) &&
      Boolean(currentHash) &&
      originalHash === currentHash)

  const diagnosisChanged = isFieldChanged(
    originalRecord?.diagnosis,
    currentRecord?.diagnosis
  )
  const treatmentChanged = isFieldChanged(
    originalRecord?.treatment,
    currentRecord?.treatment
  )
  const notesChanged = isFieldChanged(
    originalRecord?.clinicalNotes,
    currentRecord?.clinicalNotes
  )
  const hashChanged = !hashesMatch

  const canCompare = Boolean(originalRecord && currentRecord)
  const isLoading =
    (!comparisonQuery.isFetched && comparisonQuery.isPending) ||
    (comparisonQuery.isPending && !canCompare)

  if (comparisonQuery.isError && !canCompare) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparación de documentos</CardTitle>
          <CardDescription>
            No se pudo cargar la comparación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemoEmptyState icon={AlertTriangleIcon}>
            {comparisonQuery.error instanceof Error
              ? comparisonQuery.error.message
              : "Ocurrió un error al consultar la comparación. Intenta recargar."}
          </DemoEmptyState>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2Icon className="size-8 animate-spin text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">
            Cargando comparación…
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!canCompare) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparación de documentos</CardTitle>
          <CardDescription>
            Firma y/o altera el expediente para comparar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemoEmptyState icon={GitCompareArrowsIcon}>
            Necesitas un documento original firmado y la versión actual del
            expediente para visualizar las diferencias.
          </DemoEmptyState>
        </CardContent>
      </Card>
    )
  }

  const fieldFlags = {
    diagnosisChanged,
    treatmentChanged,
    notesChanged,
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Comparación de documento y hashes
        </h1>
        <p className="text-sm text-muted-foreground">
          Contrasta el expediente firmado original con la versión actual.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <DocumentColumn
          side="original"
          title="Documento original"
          description="Copia firmada conservada al momento de la firma."
          record={originalRecord}
          hash={originalHash}
          hashChanged={hashChanged}
          fields={fieldFlags}
        />
        <DocumentColumn
          side="current"
          title="Documento actual"
          description="Estado vigente del expediente en la demostración."
          record={currentRecord}
          hash={currentHash}
          hashChanged={hashChanged}
          fields={fieldFlags}
        />
      </div>

      {modifiedFields.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campos modificados</CardTitle>
            <CardDescription>
              Resumen de diferencias detectadas entre ambas versiones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {modifiedFields.map((field) => (
                <li key={field.field} className="rounded-lg border p-3">
                  <p className="font-medium">{field.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Original: {field.originalValue}
                  </p>
                  <p className="text-xs">Actual: {field.modifiedValue}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div
        role="note"
        className={cn(
          "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
          hashChanged
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : "border-emerald-600/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
        )}
      >
        {hashChanged ? (
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
        ) : (
          <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
        )}
        <p>
          Cualquier modificación del contenido genera un hash distinto y hace
          inválida la firma digital anterior.
          {hashChanged
            ? " En este caso, el hash actual ya no coincide con el original firmado."
            : " Mientras no haya cambios, los hashes coinciden y la firma permanece íntegra."}
        </p>
      </div>
    </div>
  )
}
