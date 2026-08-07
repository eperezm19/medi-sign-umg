"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { DigitalSignatureResult } from "@/features/file-signing/components/digital-signature-result"
import { useSignFileMutation } from "@/features/file-signing/hooks"
import { ConfirmationDialog } from "@/shared/components/confirmation-dialog"
import { FileProcessStatusBadge } from "@/shared/components/file-process-status-badge"
import { LoadingSimulation } from "@/shared/components/loading-simulation"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { useMedicalFileStore } from "@/stores/medical-file.store"

const SIGN_STAGES = [
  "Leyendo archivo",
  "Generando hash SHA-256",
  "Firmando hash con llave privada",
  "Generando archivo de firma",
]

export function FileSigningPanel() {
  const originalFile = useMedicalFileStore((s) => s.originalFile)
  const keyPair = useMedicalFileStore((s) => s.keyPair)
  const signature = useMedicalFileStore((s) => s.signature)
  const status = useMedicalFileStore((s) => s.status)
  const mutation = useSignFileMutation()
  const [stageIndex, setStageIndex] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

  const canSign = Boolean(
    originalFile &&
      originalFile.bytes.length > 0 &&
      keyPair?.privateKey &&
      !signature
  )

  useEffect(() => {
    if (!mutation.isPending) {
      setStageIndex(0)
      return
    }

    const timers = SIGN_STAGES.map((_, index) =>
      window.setTimeout(() => setStageIndex(index), index * 450)
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [mutation.isPending])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Firma digital del archivo</CardTitle>
            <FileProcessStatusBadge status={status} />
          </div>
          <CardDescription>
            Hash SHA-256 · Firma RSA-SHA256 · OpenSSL dgst -sign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Archivo seleccionado</dt>
              <dd className="font-medium">{originalFile?.name ?? "Ninguno"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Llaves</dt>
              <dd className="font-medium">
                {keyPair?.privateKey ? "Disponibles" : "No generadas"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Algoritmo de hash</dt>
              <dd className="font-medium">SHA-256</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Algoritmo de firma</dt>
              <dd className="font-medium">RSA-SHA256</dd>
            </div>
          </dl>

          {mutation.isPending ? (
            <LoadingSimulation stages={SIGN_STAGES} activeIndex={stageIndex} />
          ) : null}

          <ConfirmationDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="¿Firmar el archivo médico?"
            description="Se calculará el hash SHA-256 real y se firmará con OpenSSL (dgst -sha256 -sign). El resultado será un archivo .sig separado. El archivo original no se modifica."
            confirmLabel="Firmar archivo"
            pending={mutation.isPending}
            onConfirm={async () => {
              await mutation.mutateAsync()
              setDialogOpen(false)
            }}
            trigger={
              <Button type="button" disabled={!canSign || mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : null}
                Firmar archivo
              </Button>
            }
          />

          {!canSign && !signature ? (
            <p className="text-sm text-muted-foreground">
              Cargue un archivo, genere las llaves y asegúrese de que el archivo
              aún no esté firmado.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <DigitalSignatureResult />
    </div>
  )
}
