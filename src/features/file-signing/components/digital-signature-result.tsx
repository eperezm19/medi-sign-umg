"use client"

import { CopyButton } from "@/shared/components/copy-download-buttons"
import { FileProcessStatusBadge } from "@/shared/components/file-process-status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { formatBytes, formatDateTime } from "@/shared/lib/file-utils"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export function DigitalSignatureResult() {
  const signature = useMedicalFileStore((s) => s.signature)
  const signatureFileName = useMedicalFileStore((s) => s.signatureFileName)
  const originalHash = useMedicalFileStore((s) => s.originalHash)
  const signedAt = useMedicalFileStore((s) => s.signedAt)
  const originalFile = useMedicalFileStore((s) => s.originalFile)

  if (!signature || !signatureFileName || !originalHash || !originalFile) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Resultado de la firma</CardTitle>
          <FileProcessStatusBadge status="SIGNED" />
        </div>
        <CardDescription>
          La firma se genera como archivo binario separado (.sig) con OpenSSL y
          no modifica el archivo médico original.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Archivo médico</dt>
            <dd className="font-medium">{originalFile.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Archivo de firma</dt>
            <dd className="font-medium">{signatureFileName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Algoritmo</dt>
            <dd className="font-medium">SHA-256</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Fecha de firma</dt>
            <dd className="font-medium">{formatDateTime(signedAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tamaño de la firma</dt>
            <dd className="font-medium">{formatBytes(signature.byteLength)}</dd>
          </div>
        </dl>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium">Hash SHA-256</h3>
            <CopyButton value={originalHash} />
          </div>
          <p className="break-all rounded-lg border bg-muted/40 p-3 font-mono text-xs">
            {originalHash}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Firma digital</h3>
          <p className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            Archivo binario generado por OpenSSL ({signatureFileName}).
            Descarguelo desde la sección de archivos generados.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
