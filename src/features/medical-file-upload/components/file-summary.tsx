"use client"

import { formatDateTime, formatBytes, getExtension } from "@/shared/lib/file-utils"
import { FileProcessStatusBadge } from "@/shared/components/file-process-status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import type { MedicalFileData } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export function UploadedFileSummary({ file }: { file: MedicalFileData }) {
  const status = useMedicalFileStore((s) => s.status)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{file.name}</CardTitle>
          <FileProcessStatusBadge
            status={status === "EMPTY" ? "UPLOADED" : status}
          />
        </div>
        <CardDescription>Resumen del archivo médico cargado</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Extensión</dt>
            <dd className="font-medium">{getExtension(file.name) || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tipo MIME</dt>
            <dd className="font-medium">{file.mimeType}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tamaño</dt>
            <dd className="font-medium">{formatBytes(file.size)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Fecha de carga</dt>
            <dd className="font-medium">{formatDateTime(file.uploadedAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

export function FilePreview({ content }: { content: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Vista previa</h3>
      <pre className="max-h-64 overflow-auto rounded-xl border bg-muted/40 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  )
}
