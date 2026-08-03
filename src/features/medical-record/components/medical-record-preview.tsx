"use client"

import { FolderOpen } from "lucide-react"

import { MedicalRecordStatusBadge } from "@/features/medical-record/components/medical-record-status-badge"
import {
  formatDate,
  formatDateTime,
  formatSex,
} from "@/features/medical-record/lib/format"
import { getStatusConfig } from "@/features/medical-record/lib/status-config"
import type { MedicalRecord } from "@/features/medical-record/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { useMediSignStore } from "@/stores/medi-sign-store"

function PreviewField({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  )
}

function PreviewSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function MedicalRecordPreviewContent({ record }: { record: MedicalRecord }) {
  const statusConfig = getStatusConfig(record.status)
  const truncatedHash =
    record.contentHash.length > 28
      ? `${record.contentHash.slice(0, 28)}…`
      : record.contentHash

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Vista previa del expediente</CardTitle>
          <CardDescription>{statusConfig.description}</CardDescription>
        </div>
        <MedicalRecordStatusBadge status={record.status} />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Número de expediente
            </p>
            <p className="font-mono text-sm font-medium">{record.id}</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Hash de contenido
            </p>
            <p className="font-mono text-xs text-muted-foreground" title={record.contentHash}>
              {truncatedHash}
            </p>
          </div>
        </div>

        <PreviewSection title="Datos del paciente">
          <PreviewField label="Nombre" value={record.patientName} />
          <PreviewField label="Documento" value={record.patientDocumentId || "—"} />
          <PreviewField label="Fecha de nacimiento" value={formatDate(record.birthDate)} />
          <PreviewField label="Sexo" value={formatSex(record.sex)} />
        </PreviewSection>

        <Separator />

        <PreviewSection title="Información clínica">
          <PreviewField label="Diagnóstico" value={record.diagnosis} />
          <PreviewField label="Tratamiento" value={record.treatment} />
          <PreviewField
            label="Medicamentos"
            value={
              record.medications.length > 0
                ? record.medications.join("; ")
                : "Ninguno registrado"
            }
          />
          <PreviewField label="Observaciones" value={record.clinicalNotes} />
        </PreviewSection>

        <Separator />

        <PreviewSection title="Datos del médico">
          <PreviewField label="Médico responsable" value={record.physicianName} />
          <PreviewField label="Colegiado" value={record.physicianLicense} />
          <PreviewField label="Establecimiento" value={record.facility} />
        </PreviewSection>

        <Separator />

        <PreviewSection title="Emisión">
          <PreviewField
            label="Fecha de emisión"
            value={formatDateTime(record.createdAt)}
          />
          <PreviewField
            label="Última actualización"
            value={formatDateTime(record.updatedAt)}
          />
          <PreviewField
            label="Estado actual"
            value={<MedicalRecordStatusBadge status={record.status} />}
          />
        </PreviewSection>
      </CardContent>
    </Card>
  )
}

export function MedicalRecordPreview() {
  const currentRecord = useMediSignStore((state) => state.currentRecord)

  if (!currentRecord) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vista previa del expediente</CardTitle>
          <CardDescription>
            Guarda un expediente para ver la vista previa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-10 text-center">
            <FolderOpen className="size-8 text-muted-foreground" aria-hidden />
            <p className="max-w-sm text-sm text-muted-foreground">
              Completa y guarda el formulario para visualizar los datos del
              paciente, la información clínica y el estado del documento.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <MedicalRecordPreviewContent record={currentRecord} />
}
