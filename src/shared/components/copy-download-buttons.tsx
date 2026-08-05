"use client"

import { Check, Copy, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"

export function CopyButton({
  value,
  label = "Copiar",
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success("Copiado al portapapeles")
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("No se pudo copiar")
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(className)}
      onClick={handleCopy}
    >
      {copied ? (
        <Check data-icon="inline-start" />
      ) : (
        <Copy data-icon="inline-start" />
      )}
      {copied ? "Copiado" : label}
    </Button>
  )
}

export function DownloadButton({
  onDownload,
  label = "Descargar",
  disabled,
  pending,
  className,
}: {
  onDownload: () => void | Promise<void>
  label?: string
  disabled?: boolean
  pending?: boolean
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      disabled={disabled || pending}
      onClick={() => void onDownload()}
    >
      {pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
      {pending ? "Preparando…" : label}
    </Button>
  )
}
