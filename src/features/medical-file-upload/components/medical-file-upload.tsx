"use client"

import { useRef, useState } from "react"
import { FileUp, Loader2 } from "lucide-react"

import {
  useUploadDemoMedicalFileMutation,
  useUploadMedicalFileMutation,
} from "@/features/medical-file-upload/hooks"
import {
  FilePreview,
  UploadedFileSummary,
} from "@/features/medical-file-upload/components/file-summary"
import { AcademicWarning } from "@/shared/components/academic-warning"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"
import { useMedicalFileStore } from "@/stores/medical-file.store"

const ACCEPTED = ".txt,.pdf,.json,text/plain,application/json,application/pdf"

export function MedicalFileUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const originalFile = useMedicalFileStore((s) => s.originalFile)
  const uploadMutation = useUploadMedicalFileMutation()
  const demoMutation = useUploadDemoMedicalFileMutation()
  const pending = uploadMutation.isPending || demoMutation.isPending

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file || pending) return
    await uploadMutation.mutateAsync(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargar archivo médico</CardTitle>
        <CardDescription>
          Arrastre un archivo ficticio o seleccione uno desde su equipo. Se
          priorizan archivos .txt para la práctica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AcademicWarning>
          Utilice únicamente archivos ficticios. Este prototipo no debe procesar
          información médica real.
        </AcademicWarning>

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
            pending && "pointer-events-none opacity-70"
          )}
        >
          {pending ? (
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          ) : (
            <FileUp className="size-8 text-muted-foreground" aria-hidden />
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Arrastre y suelte el archivo aquí
            </p>
            <p className="text-xs text-muted-foreground">
              o haga clic para seleccionar (.txt, .pdf, .json)
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="sr-only"
            disabled={pending}
            onChange={(event) => {
              void handleFiles(event.target.files)
              event.target.value = ""
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => void demoMutation.mutateAsync()}
          >
            {demoMutation.isPending ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : null}
            Cargar archivo de ejemplo
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            Seleccionar archivo
          </Button>
        </div>

        {originalFile ? (
          <div className="space-y-4">
            <UploadedFileSummary file={originalFile} />
            {originalFile.content ? (
              <FilePreview content={originalFile.content} />
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
