"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

import { useVerifyOriginalFileMutation } from "@/features/original-file-verification/hooks"
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
import { formatDateTime } from "@/shared/lib/file-utils"
import { useMedicalFileStore } from "@/stores/medical-file.store"

const STAGES = [
  "Leyendo archivo",
  "Calculando hash actual",
  "Cargando firma",
  "Verificando con llave pública",
]

export function OriginalFileVerification() {
  const originalFile = useMedicalFileStore((s) => s.originalFile)
  const signature = useMedicalFileStore((s) => s.signature)
  const signatureFileName = useMedicalFileStore((s) => s.signatureFileName)
  const keyPair = useMedicalFileStore((s) => s.keyPair)
  const originalVerification = useMedicalFileStore((s) => s.originalVerification)
  const mutation = useVerifyOriginalFileMutation()
  const [stageIndex, setStageIndex] = useState(0)

  const canVerify = Boolean(
    originalFile &&
      originalFile.bytes.length > 0 &&
      signature &&
      keyPair?.publicKey
  )

  useEffect(() => {
    if (!mutation.isPending) {
      setStageIndex(0)
      return
    }
    const timers = STAGES.map((_, index) =>
      window.setTimeout(() => setStageIndex(index), index * 350)
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [mutation.isPending])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificar firma</CardTitle>
        <CardDescription>
          Utiliza el archivo original, la firma .sig y la llave pública.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Archivo médico</dt>
            <dd className="font-medium">{originalFile?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Firma</dt>
            <dd className="font-medium">{signatureFileName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Llave pública</dt>
            <dd className="font-medium">
              {keyPair ? "llave_publica.pem" : "—"}
            </dd>
          </div>
        </dl>

        {!canVerify ? (
          <p className="text-sm text-muted-foreground">
            Primero firme un archivo en la sección Firmar archivo.
          </p>
        ) : null}

        {mutation.isPending ? (
          <LoadingSimulation stages={STAGES} activeIndex={stageIndex} />
        ) : null}

        <Button
          type="button"
          disabled={!canVerify || mutation.isPending}
          onClick={() => void mutation.mutateAsync()}
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : null}
          Verificar archivo original
        </Button>

        {originalVerification?.valid ? (
          <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-700 dark:text-emerald-300" />
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                Firma digital válida
              </p>
              <FileProcessStatusBadge status="VERIFIED" />
            </div>
            <ul className="space-y-1 text-sm text-emerald-950 dark:text-emerald-50">
              <li>Integridad verificada</li>
              <li>Archivo alterado: No</li>
              <li>Los hashes coinciden</li>
              <li>
                Resultado técnico:{" "}
                <code className="font-mono">{originalVerification.technicalResult}</code>
              </li>
              <li>
                Verificado: {formatDateTime(originalVerification.verifiedAt)}
              </li>
            </ul>
            <p className="text-sm">{originalVerification.message}</p>
            <div className="grid gap-2 font-mono text-xs sm:grid-cols-2">
              <p className="break-all rounded-lg bg-background/60 p-2">
                Hash original: {originalVerification.originalHash}
              </p>
              <p className="break-all rounded-lg bg-background/60 p-2">
                Hash actual: {originalVerification.currentHash}
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
