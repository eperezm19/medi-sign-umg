"use client"

import {
  BadgeCheckIcon,
  CheckCircle2Icon,
  CircleIcon,
  Loader2Icon,
  ShieldCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

import { MedicalRecordStatusBadge } from "@/features/medical-record/components/medical-record-status-badge"
import { useVerifySignatureMutation } from "@/features/signature-verification/hooks"
import { VERIFICATION_OK } from "@/features/signature-verification/lib/build-verification"
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
import { cn } from "@/shared/lib/utils"
import { useMediSignStore } from "@/stores/medi-sign-store"

function Requirement({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
        ok
          ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
          : "border-border bg-muted/40 text-muted-foreground"
      )}
    >
      {ok ? (
        <CheckCircle2Icon className="size-4 shrink-0" aria-hidden />
      ) : (
        <CircleIcon className="size-4 shrink-0" aria-hidden />
      )}
      {label}
    </div>
  )
}

function ResultRow({
  ok,
  title,
  description,
}: {
  ok: boolean
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-background/60 p-3">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
          ok
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            : "bg-muted text-muted-foreground"
        )}
      >
        <BadgeCheckIcon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function ValidVerificationPanel() {
  const currentRecord = useMediSignStore((state) => state.currentRecord)
  const signature = useMediSignStore((state) => state.signature)
  const originalHash = useMediSignStore((state) => state.originalHash)
  const currentHash = useMediSignStore((state) => state.currentHash)
  const verificationResult = useMediSignStore(
    (state) => state.verificationResult
  )
  const verifyMutation = useVerifySignatureMutation()

  const hasSignature = Boolean(signature)
  const hashesMatch =
    Boolean(originalHash) &&
    Boolean(currentHash) &&
    originalHash === currentHash
  const status = currentRecord?.status
  const isAltered =
    status === "altered" ||
    status === "verification_failed" ||
    (Boolean(originalHash) &&
      Boolean(currentHash) &&
      originalHash !== currentHash)
  const isSignedOrVerified = status === "signed" || status === "verified"
  const canVerify =
    hasSignature &&
    hashesMatch &&
    isSignedOrVerified &&
    !isAltered &&
    !verifyMutation.isPending

  const showValidResult =
    verificationResult?.isValid === true &&
    currentRecord?.status === "verified"

  async function handleVerify() {
    try {
      const result = await verifyMutation.mutateAsync()
      toast.success("Verificación completada", {
        description: VERIFICATION_OK,
      })
      return result
    } catch (error) {
      toast.error("No se pudo verificar la firma", {
        description:
          error instanceof Error
            ? error.message
            : "Revisa que el expediente esté firmado y sin alteraciones.",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Verificación de firma</CardTitle>
          <CardDescription>
            Comprueba la integridad del expediente firmado cuando no ha sido
            modificado.
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
          <Requirement
            ok={hasSignature}
            label={
              hasSignature
                ? "Firma digital presente"
                : "Firma el expediente primero"
            }
          />
          <Requirement
            ok={hashesMatch && !isAltered}
            label={
              isAltered
                ? "Documento modificado (verificación de alteración)"
                : hashesMatch
                  ? "Hashes coincidentes"
                  : "Hashes no disponibles"
            }
          />
        </div>

        {isAltered ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-6 text-sm text-amber-950 dark:text-amber-50">
            El documento fue modificado; usa la verificación de alteración.
          </div>
        ) : null}

        {!hasSignature && !isAltered ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Firma el expediente primero para habilitar la verificación.
          </div>
        ) : null}

        {showValidResult ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-600/30 bg-emerald-500/15 font-mono text-emerald-800 dark:text-emerald-200"
              >
                {VERIFICATION_OK}
              </Badge>
              <MedicalRecordStatusBadge status="verified" />
            </div>

            <div className="grid gap-3">
              <ResultRow
                ok
                title="Firma digital válida"
                description="La firma simulada corresponde al expediente firmado."
              />
              <ResultRow
                ok
                title="Integridad verificada"
                description="No se detectaron cambios respecto a la copia firmada."
              />
              <ResultRow
                ok
                title="Hash original y actual coincidentes"
                description="Ambos digests SHA-256 ficticios son idénticos."
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

            {verificationResult ? (
              <p className="text-sm text-muted-foreground">
                {verificationResult.message}
              </p>
            ) : null}
          </div>
        ) : null}

        {canVerify && !showValidResult ? (
          <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            El expediente está firmado y sin alteraciones. Ejecuta la
            verificación para confirmar integridad.
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="justify-end">
        <Button type="button" onClick={handleVerify} disabled={!canVerify}>
          {verifyMutation.isPending ? (
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
          ) : (
            <ShieldCheckIcon data-icon="inline-start" />
          )}
          {verifyMutation.isPending ? "Verificando…" : "Verificar firma"}
        </Button>
      </CardFooter>
    </Card>
  )
}
