"use client"

import { useRef, useState } from "react"
import { FileUp, Loader2 } from "lucide-react"

import { useUploadAlteredFileMutation } from "@/features/altered-file-upload/hooks"
import { FilePreview } from "@/features/medical-file-upload"
import { FileProcessStatusBadge } from "@/shared/components/file-process-status-badge"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { formatBytes, formatDateTime } from "@/shared/lib/file-utils"
import { cn } from "@/shared/lib/utils"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export function AlteredFileUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const signature = useMedicalFileStore((s) => s.signature)
  const alteredFile = useMedicalFileStore((s) => s.alteredFile)
  const mutation = useUploadAlteredFileMutation()

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file || mutation.isPending) return
    await mutation.mutateAsync(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargar archivo modificado</CardTitle>
        <CardDescription>
          Suba el archivo que modificó externamente. Se conservan la firma y la
          llave pública originales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!signature ? (
          <p className="text-sm text-muted-foreground">
            Debe existir una firma original antes de cargar un archivo
            modificado.
          </p>
        ) : (
          <>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  inputRef.current?.click()
                }
              }}
              onDragEnter={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={(event) => {
                event.preventDefault()
                setDragging(false)
              }}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                void handleFiles(event.dataTransfer.files)
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors",
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 bg-muted/20 hover:bg-muted/40",
                mutation.isPending && "pointer-events-none opacity-70"
              )}
            >
              {mutation.isPending ? (
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              ) : (
                <FileUp className="size-8 text-muted-foreground" aria-hidden />
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Arrastre el archivo modificado
                </p>
                <p className="text-xs text-muted-foreground">
                  No se creará una firma nueva
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".txt,.pdf,.json,text/plain,application/json,application/pdf"
                className="sr-only"
                disabled={mutation.isPending}
                onChange={(event) => {
                  void handleFiles(event.target.files)
                  event.target.value = ""
                }}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => inputRef.current?.click()}
            >
              Seleccionar archivo modificado
            </Button>
          </>
        )}

        {alteredFile ? (
          <div className="space-y-3 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{alteredFile.name}</p>
              <FileProcessStatusBadge status="ALTERED_FILE_UPLOADED" />
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Tipo</dt>
                <dd>{alteredFile.mimeType}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tamaño</dt>
                <dd>{formatBytes(alteredFile.size)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fecha</dt>
                <dd>{formatDateTime(alteredFile.uploadedAt)}</dd>
              </div>
            </dl>
            {alteredFile.content ? (
              <FilePreview content={alteredFile.content} />
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
