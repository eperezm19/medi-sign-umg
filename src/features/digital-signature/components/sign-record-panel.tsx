"use client"

import { FilePenLine, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { useSignRecordMutation } from "@/features/digital-signature/hooks"
import { formatDateTime } from "@/features/medical-record/lib/format"
import { MedicalRecordStatusBadge } from "@/features/medical-record/components/medical-record-status-badge"
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
import { Textarea } from "@/shared/components/ui/textarea"
import { useMediSignStore } from "@/stores/medi-sign-store"

export function SignRecordPanel() {
  const currentRecord = useMediSignStore((state) => state.currentRecord)
  const keyPair = useMediSignStore((state) => state.keyPair)
  const signature = useMediSignStore((state) => state.signature)
  const signedOriginalRecord = useMediSignStore(
    (state) => state.signedOriginalRecord
  )
  const signMutation = useSignRecordMutation()

  const hasRecord = Boolean(currentRecord)
  const hasKeys = Boolean(keyPair)
  const status = currentRecord?.status
  const canSign =
    hasRecord &&
    hasKeys &&
    (status === "unsigned" || status === "draft") &&
    !signMutation.isPending

  async function handleSign() {
    try {
      const result = await signMutation.mutateAsync()
      toast.success("Expediente firmado", {
        description: `${result.record.id} · estado SIGNED`,
      })
    } catch (error) {
      toast.error("No se pudo firmar el expediente", {
        description:
          error instanceof Error
            ? error.message
            : "Verifica que exista expediente y llaves.",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Firma digital del expediente</CardTitle>
          <CardDescription>
            Genera un hash SHA-256 ficticio y una firma simulada. Se conserva
            una copia original firmada del expediente.
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
            ok={hasRecord}
            label={
              hasRecord
                ? `Expediente listo (${currentRecord?.id})`
                : "Falta crear el expediente"
            }
          />
          <DemoRequirement
            ok={hasKeys}
            label={
              hasKeys
                ? `Llaves listas (${keyPair?.algorithm} ${keyPair?.keySize})`
                : "Falta generar el par de llaves"
            }
          />
        </div>

        {signature && signedOriginalRecord ? (
          <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Médico firmante
                </p>
                <p className="mt-1 text-sm font-medium">{signature.signerName}</p>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Fecha de firma
                </p>
                <p className="mt-1 text-sm font-medium">
                  {formatDateTime(signature.signedAt)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Hash SHA-256
                </p>
                <p className="mt-1 break-all font-mono text-xs">
                  {signature.contentHash}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="digital-signature-value"
                className="text-sm font-medium"
              >
                Firma digital
              </label>
              <Textarea
                id="digital-signature-value"
                readOnly
                value={signature.signatureBase64}
                rows={4}
                className="font-mono text-xs"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Copia original firmada conservada: {signedOriginalRecord.id} ·
              estado {signedOriginalRecord.status.toUpperCase()}
            </p>
          </div>
        ) : (
          <DemoEmptyState className="py-8">
            {canSign
              ? "Listo para firmar. Se generará el hash, la firma y se cambiará el estado a SIGNED."
              : "Completa el expediente y genera las llaves para habilitar la firma."}
          </DemoEmptyState>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button type="button" onClick={handleSign} disabled={!canSign}>
          {signMutation.isPending ? (
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
          ) : (
            <FilePenLine data-icon="inline-start" />
          )}
          {signMutation.isPending ? "Firmando…" : "Firmar expediente"}
        </Button>
      </CardFooter>
    </Card>
  )
}
