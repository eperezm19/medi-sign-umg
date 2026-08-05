"use client"

import { AlteredFileInstructions, AlteredFileUpload } from "@/features/altered-file-upload"
import { AlteredFileVerification } from "@/features/altered-file-verification"
import { OriginalFileVerification } from "@/features/original-file-verification"
import { FileProcessStatusBadge } from "@/shared/components/file-process-status-badge"
import { PageContainer } from "@/shared/components/layout/page-container"
import { ResetPracticeButton } from "@/shared/components/reset-practice-button"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export function VerificarArchivoView() {
  const status = useMedicalFileStore((s) => s.status)

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verificar archivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Compruebe la firma del archivo original y detecte alteraciones
            posteriores comparando hashes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FileProcessStatusBadge status={status} />
          <ResetPracticeButton />
        </div>
      </div>

      <OriginalFileVerification />
      <AlteredFileInstructions />
      <AlteredFileUpload />
      <AlteredFileVerification />
    </PageContainer>
  )
}
