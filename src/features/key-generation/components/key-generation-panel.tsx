"use client"

import { useState } from "react"
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  Loader2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { useGenerateKeysMutation } from "@/features/key-generation/hooks"
import { DemoEmptyState } from "@/shared/components/demo/demo-empty-state"
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
import { cn } from "@/shared/lib/utils"
import { useMediSignStore } from "@/stores/medi-sign-store"

type GenerationStatus = "idle" | "generating" | "ready"

function statusLabel(status: GenerationStatus): string {
  switch (status) {
    case "generating":
      return "Generando…"
    case "ready":
      return "Generadas"
    default:
      return "Sin generar"
  }
}

function statusClassName(status: GenerationStatus): string {
  switch (status) {
    case "generating":
      return "border-primary/30 bg-primary/10 text-primary"
    case "ready":
      return "border-emerald-600/30 bg-emerald-500/15 text-emerald-800 dark:border-emerald-400/30 dark:text-emerald-200"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

async function copyToClipboard(label: string, value: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast.success(`${label} copiada`, {
      description: "El contenido se guardó en el portapapeles.",
    })
  } catch {
    toast.error(`No se pudo copiar la ${label.toLowerCase()}`, {
      description: "Revisa los permisos del portapapeles del navegador.",
    })
  }
}

function KeyBlock({
  title,
  value,
  hidden,
  onCopy,
  copyDisabled,
  trailing,
  textareaId,
}: {
  title: string
  value: string
  hidden?: boolean
  onCopy: () => void
  copyDisabled?: boolean
  trailing?: React.ReactNode
  textareaId: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={textareaId} className="text-sm font-medium">
          {title}
        </label>
        <div className="flex items-center gap-1.5">
          {trailing}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCopy}
            disabled={copyDisabled || !value}
          >
            <CopyIcon data-icon="inline-start" />
            Copiar
          </Button>
        </div>
      </div>
      <Textarea
        id={textareaId}
        readOnly
        value={
          hidden
            ? "••••••••••••••••••••••••••••••••\n••••••••••••••••••••••••••••••••\n••••••••••••••••••••••••••••••••"
            : value
        }
        rows={6}
        className={cn(
          "font-mono text-xs",
          hidden && "text-muted-foreground select-none"
        )}
      />
    </div>
  )
}

export function KeyGenerationPanel() {
  const keyPair = useMediSignStore((state) => state.keyPair)
  const generateMutation = useGenerateKeysMutation()
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copiedField, setCopiedField] = useState<"public" | "private" | null>(
    null
  )

  const isPending = generateMutation.isPending
  const status: GenerationStatus = isPending
    ? "generating"
    : keyPair
      ? "ready"
      : "idle"

  async function handleGenerate() {
    try {
      setShowPrivateKey(false)
      const generated = await generateMutation.mutateAsync()
      toast.success("Par de llaves generado", {
        description: `${generated.ownerName} · RSA ${generated.keySize} bits`,
      })
    } catch (error) {
      toast.error("No se pudieron generar las llaves", {
        description:
          error instanceof Error
            ? error.message
            : "Intenta de nuevo en unos segundos.",
      })
    }
  }

  async function handleCopy(field: "public" | "private") {
    if (!keyPair) {
      return
    }

    const value =
      field === "public" ? keyPair.publicKeyPem : keyPair.privateKeyPem
    const label = field === "public" ? "Llave pública" : "Llave privada"
    await copyToClipboard(label, value)
    setCopiedField(field)
    window.setTimeout(() => setCopiedField(null), 1500)
  }

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Generación de llaves RSA</CardTitle>
          <CardDescription>
            Simulación académica de un par de llaves RSA de 2048 bits. Las
            claves no son criptográficamente reales.
          </CardDescription>
        </div>
        <Badge variant="outline" className={cn("uppercase", statusClassName(status))}>
          {isPending ? (
            <Loader2Icon className="animate-spin" aria-hidden />
          ) : (
            <KeyRoundIcon aria-hidden />
          )}
          {statusLabel(status)}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-muted/30 p-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Algoritmo
            </p>
            <p className="mt-1 text-sm font-medium">RSA</p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Tamaño
            </p>
            <p className="mt-1 text-sm font-medium">
              {keyPair?.keySize ?? 2048} bits
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Titular
            </p>
            <p className="mt-1 text-sm font-medium">
              {keyPair?.ownerName ?? "Pendiente"}
            </p>
          </div>
        </div>

        {!keyPair && !isPending ? (
          <DemoEmptyState icon={KeyRoundIcon}>
            Aún no hay un par de llaves. Genera uno simulado para continuar con
            la firma digital del expediente.
          </DemoEmptyState>
        ) : null}

        {isPending ? (
          <DemoEmptyState
            icon={Loader2Icon}
            className="[&_svg]:animate-spin [&_svg]:text-primary"
          >
            Generando par de llaves RSA-2048…
          </DemoEmptyState>
        ) : null}

        {keyPair && !isPending ? (
          <div className="space-y-5">
            <KeyBlock
              title="Llave pública"
              textareaId="rsa-public-key"
              value={keyPair.publicKeyPem}
              onCopy={() => handleCopy("public")}
              trailing={
                copiedField === "public" ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckIcon className="size-3.5" aria-hidden />
                    Copiada
                  </span>
                ) : null
              }
            />

            <KeyBlock
              title="Llave privada"
              textareaId="rsa-private-key"
              value={keyPair.privateKeyPem}
              hidden={!showPrivateKey}
              onCopy={() => handleCopy("private")}
              trailing={
                <>
                  {copiedField === "private" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                      <CheckIcon className="size-3.5" aria-hidden />
                      Copiada
                    </span>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPrivateKey((prev) => !prev)}
                  >
                    {showPrivateKey ? (
                      <EyeOffIcon data-icon="inline-start" />
                    ) : (
                      <EyeIcon data-icon="inline-start" />
                    )}
                    {showPrivateKey ? "Ocultar" : "Mostrar"}
                  </Button>
                </>
              }
            />

            <p className="font-mono text-xs text-muted-foreground">
              Fingerprint: {keyPair.fingerprint}
            </p>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="justify-end">
        <Button type="button" onClick={handleGenerate} disabled={isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin" data-icon="inline-start" />
          ) : (
            <KeyRoundIcon data-icon="inline-start" />
          )}
          {isPending
            ? "Generando…"
            : keyPair
              ? "Regenerar llaves"
              : "Generar llaves"}
        </Button>
      </CardFooter>
    </Card>
  )
}
