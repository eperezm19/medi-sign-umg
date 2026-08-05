"use client"

import { useEffect, useState } from "react"
import { Loader2, XCircle } from "lucide-react"

import { useVerifyAlteredFileMutation } from "@/features/altered-file-verification/hooks"
import { HashComparison } from "@/features/hash-comparison"
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
  "Leyendo archivo modificado",
  "Calculando hash actual",
  "Comparando con firma original",
  "Verificando con llave pública",
]

export function AlteredFileVerification() {
  const alteredFile = useMedicalFileStore((s) => s.alteredFile)
  const signature = useMedicalFileStore((s) => s.signature)
  const alteredVerification = useMedicalFileStore((s) => s.alteredVerification)
  const mutation = useVerifyAlteredFileMutation()
  const [stageIndex, setStageIndex] = useState(0)

  const canVerify = Boolean(alteredFile && signature)

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Verificar archivo modificado</CardTitle>
          <CardDescription>
            Se reutilizan la firma original y la misma llave pública.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canVerify ? (
            <p className="text-sm text-muted-foreground">
              Cargue un archivo modificado para intentar la verificación.
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
            Verificar archivo modificado
          </Button>

          {alteredVerification && !alteredVerification.valid ? (
            <div className="space-y-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <XCircle className="size-5 text-red-700 dark:text-red-300" />
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Firma digital inválida
                </p>
                <FileProcessStatusBadge status="INVALID" />
              </div>
              <ul className="space-y-1 text-sm text-red-950 dark:text-red-50">
                <li>Integridad comprometida</li>
                <li>Archivo alterado: Sí</li>
                <li>Los hashes no coinciden</li>
                <li>
                  Resultado técnico:{" "}
                  <code className="font-mono">
                    {alteredVerification.technicalResult}
                  </code>
                </li>
                <li>
                  Verificado: {formatDateTime(alteredVerification.verifiedAt)}
                </li>
              </ul>
              <p className="text-sm">{alteredVerification.message}</p>
            </div>
          ) : null}

          {alteredVerification?.valid ? (
            <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
              <p className="font-semibold">Verified OK</p>
              <p>{alteredVerification.message}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {alteredVerification && !alteredVerification.valid ? (
        <HashComparison
          originalHash={alteredVerification.originalHash}
          currentHash={alteredVerification.currentHash}
        />
      ) : null}
    </div>
  )
}
