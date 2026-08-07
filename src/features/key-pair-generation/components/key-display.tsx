"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { AcademicWarning } from "@/shared/components/academic-warning"
import { CopyButton } from "@/shared/components/copy-download-buttons"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"

export function KeyDisplay({
  publicKey,
  privateKey,
}: {
  publicKey: string
  privateKey: string
}) {
  const [showPrivate, setShowPrivate] = useState(false)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium">Llave pública</h3>
          <CopyButton value={publicKey} label="Copiar pública" />
        </div>
        <Textarea readOnly value={publicKey} className="min-h-28 font-mono text-xs" />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium">Llave privada</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivate((value) => !value)}
            >
              {showPrivate ? (
                <EyeOff data-icon="inline-start" />
              ) : (
                <Eye data-icon="inline-start" />
              )}
              {showPrivate ? "Ocultar" : "Mostrar"}
            </Button>
            <CopyButton value={privateKey} label="Copiar privada" />
          </div>
        </div>
        <Textarea
          readOnly
          value={showPrivate ? privateKey : "••••••••••••••••••••••••••••••••"}
          className="min-h-28 font-mono text-xs"
        />
      </div>

      <AcademicWarning>
        La llave privada se proporciona únicamente para fines académicos y no
        debe compartirse en un entorno real.
      </AcademicWarning>
    </div>
  )
}
