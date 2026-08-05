"use client"

import { useState } from "react"

import {
  type DownloadableArtifact,
} from "@/features/signed-file-download/api"
import { usePrepareDownloadMutation } from "@/features/signed-file-download/hooks"
import { AcademicWarning } from "@/shared/components/academic-warning"
import { ConfirmationDialog } from "@/shared/components/confirmation-dialog"
import { DownloadButton } from "@/shared/components/copy-download-buttons"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { formatBytes } from "@/shared/lib/file-utils"
import { useMedicalFileStore } from "@/stores/medical-file.store"

type ArtifactCard = {
  id: DownloadableArtifact
  name: string
  type: string
  description: string
  sizeLabel: string
  requiresWarning?: boolean
}

export function GeneratedFilesPanel() {
  const originalFile = useMedicalFileStore((s) => s.originalFile)
  const signature = useMedicalFileStore((s) => s.signature)
  const signatureFileName = useMedicalFileStore((s) => s.signatureFileName)
  const keyPair = useMedicalFileStore((s) => s.keyPair)
  const mutation = usePrepareDownloadMutation()
  const [privateDialogOpen, setPrivateDialogOpen] = useState(false)
  const [pendingArtifact, setPendingArtifact] =
    useState<DownloadableArtifact | null>(null)

  if (!originalFile || !signature || !signatureFileName || !keyPair) {
    return null
  }

  const artifacts: ArtifactCard[] = [
    {
      id: "original",
      name: originalFile.name,
      type: "Archivo médico",
      description: "Documento original utilizado para la firma.",
      sizeLabel: formatBytes(originalFile.size),
    },
    {
      id: "signature",
      name: signatureFileName,
      type: "Firma (.sig)",
      description: "Firma digital separada generada sobre el hash SHA-256.",
      sizeLabel: formatBytes(new Blob([signature]).size),
    },
    {
      id: "publicKey",
      name: "llave_publica.pem",
      type: "Llave pública",
      description: "Permite verificar la firma sin revelar la llave privada.",
      sizeLabel: formatBytes(new Blob([keyPair.publicKey]).size),
    },
    {
      id: "privateKey",
      name: "llave_privada.pem",
      type: "Llave privada",
      description: "Solo para fines académicos. No debe compartirse.",
      sizeLabel: formatBytes(new Blob([keyPair.privateKey]).size),
      requiresWarning: true,
    },
  ]

  async function download(artifact: DownloadableArtifact) {
    setPendingArtifact(artifact)
    try {
      await mutation.mutateAsync(artifact)
    } finally {
      setPendingArtifact(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archivos generados</CardTitle>
        <CardDescription>
          Descargue el archivo médico, la firma y las llaves simuladas. No hay
          almacenamiento en servidor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="flex flex-col gap-3 rounded-xl border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{artifact.name}</p>
                <p className="text-xs text-muted-foreground">{artifact.type}</p>
                <p className="text-sm text-muted-foreground">
                  {artifact.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tamaño simulado: {artifact.sizeLabel}
                </p>
              </div>

              {artifact.requiresWarning ? (
                <ConfirmationDialog
                  open={privateDialogOpen}
                  onOpenChange={setPrivateDialogOpen}
                  title="Descargar llave privada"
                  description="La llave privada no debe compartirse. Esta descarga se habilita únicamente por tratarse de una práctica académica."
                  confirmLabel="Descargar de todos modos"
                  pending={pendingArtifact === "privateKey"}
                  destructive
                  onConfirm={async () => {
                    await download("privateKey")
                    setPrivateDialogOpen(false)
                  }}
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      Descargar
                    </Button>
                  }
                />
              ) : (
                <DownloadButton
                  onDownload={() => download(artifact.id)}
                  pending={pendingArtifact === artifact.id}
                />
              )}
            </div>
          ))}
        </div>

        <AcademicWarning>
          En un entorno real la llave privada permanece bajo control exclusivo
          del firmante y no se distribuye junto con el documento.
        </AcademicWarning>
      </CardContent>
    </Card>
  )
}
