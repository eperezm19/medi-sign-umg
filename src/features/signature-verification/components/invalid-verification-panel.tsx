"use client"

import { AlertTriangleIcon, Loader2Icon, ShieldAlertIcon } from "lucide-react"
import { toast } from "sonner"

import { MedicalRecordStatusBadge } from "@/features/medical-record/components/medical-record-status-badge"
import { useVerifyAlteredDocumentMutation } from "@/features/signature-verification/hooks"
import { VERIFICATION_FAILURE } from "@/features/signature-verification/lib/build-verification"
import { DemoEmptyState } from "@/shared/components/demo/demo-empty-state"
import { DemoRequirement } from "@/shared/components/demo/demo-requirement"
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
import { useMediSignStore } from "@/stores/medi-sign-store"

function FailureRow({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function InvalidVerificationPanel() {
  const currentRecord = useMediSignStore((state) => state.currentRecord)
  const signature = useMediSignStore((state) => state.signature)
  const originalHash = useMediSignStore((state) => state.originalHash)
  const currentHash = useMediSignStore((state) => state.currentHash)
  const modifiedFields = useMediSignStore((state) => state.modifiedFields)
  const verificationResult = useMediSignStore(
    (state) => state.verificationResult
  )
  const verifyMutation = useVerifyAlteredDocumentMutation()

  const hasSignature = Boolean(signature)
  const hashesDiffer =
    Boolean(originalHash) &&
    Boolean(currentHash) &&
    originalHash !== currentHash
  const status = currentRecord?.status
  const isAltered =
    status === "altered" ||
    status === "verification_failed" ||
    hashesDiffer
  const canVerify =
    hasSignature && isAltered && hashesDiffer && !verifyMutation.isPending

  const showInvalidResult =
    verificationResult?.isValid === false &&
    currentRecord?.status === "verification_failed"

  async function handleVerify() {
    try {
      await verifyMutation.mutateAsync()
      toast.warning("Verificación fallida", {
        description: VERIFICATION_FAILURE,
      })
    } catch (error) {
      toast.error("No se pudo verificar el documento alterado", {
        description:
          error instanceof Error
            ? error.message
            : "Altera el expediente firmado antes de esta verificación.",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Verificación tras alteración</CardTitle>
          <CardDescription>
            Vuelve a verificar el expediente después de modificarlo. El
            resultado esperado es inválido.
          </CardDescription>
        </div>
        {currentRecord ? (
          <MedicalRecordStatusBadge status={currentRecord.status} />
        ) : (
          <Badge variant="outline">Sin expediente</Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <DemoRequirement
            tone="warning"
            ok={hasSignature}
            label={
              hasSignature
                ? "Firma original conservada"
                : "Se requiere una firma previa"
            }
          />
          <DemoRequirement
            tone="warning"
            ok={isAltered && hashesDiffer}
            label={
              hashesDiffer
                ? "Documento alterado (hashes distintos)"
                : "Aún no hay alteración detectada"
            }
          />
        </div>

        {!isAltered ? (
          <DemoEmptyState className="py-8">
            Altera el expediente firmado para habilitar esta verificación.
          </DemoEmptyState>
        ) : null}

        {showInvalidResult ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-destructive/40 bg-destructive/10 font-mono text-destructive"
              >
                {VERIFICATION_FAILURE}
              </Badge>
              <Badge
                variant="outline"
                className="border-destructive/40 bg-destructive/10 font-semibold tracking-wide text-destructive"
              >
                INVALID
              </Badge>
              <MedicalRecordStatusBadge status="verification_failed" />
            </div>

            <div className="grid gap-3">
              <FailureRow
                title="Firma digital inválida"
                description="La firma ya no corresponde al contenido actual del expediente."
              />
              <FailureRow
                title="Integridad comprometida"
                description="Se detectaron cambios respecto a la copia firmada original."
              />
              <FailureRow
                title="Hash original diferente al actual"
                description="Los digests SHA-256 ficticios no coinciden."
              />
            </div>

            <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Hash original
                </p>
                <p className="mt-1 break-all font-mono text-xs">{originalHash}</p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Hash actual
                </p>
                <p className="mt-1 break-all font-mono text-xs">{currentHash}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border p-4">
              <p className="text-sm font-medium">Campos modificados</p>
              {modifiedFields.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {modifiedFields.map((field) => (
                    <li key={field.field} className="rounded-lg border p-2">
                      <p className="font-medium">{field.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Antes: {field.originalValue}
                      </p>
                      <p className="text-xs">Después: {field.modifiedValue}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay detalle de campos, pero los hashes difieren.
                </p>
              )}
            </div>

            {verificationResult ? (
              <p className="text-sm text-muted-foreground">
                {verificationResult.message}
              </p>
            ) : null}
          </div>
        ) : null}

        {canVerify && !showInvalidResult ? (
          <DemoEmptyState className="py-8">
            El expediente está alterado. Ejecuta la verificación para confirmar
            el fallo de integridad.
          </DemoEmptyState>
        ) : null}
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          type="button"
          variant="destructive"
          onClick={handleVerify}
          disabled={!canVerify}
        >
          {verifyMutation.isPending ? (
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
          ) : (
            <ShieldAlertIcon data-icon="inline-start" />
          )}
          {verifyMutation.isPending
            ? "Verificando…"
            : "Verificar documento alterado"}
        </Button>
      </CardFooter>
    </Card>
  )
}
