"use client"

import { MedicalFileUpload } from "@/features/medical-file-upload"
import { KeyPairGenerator } from "@/features/key-pair-generation"
import { FileSigningPanel } from "@/features/file-signing"
import { GeneratedFilesPanel } from "@/features/signed-file-download"
import { ResetPracticeButton } from "@/shared/components/reset-practice-button"
import { PageContainer } from "@/shared/components/layout/page-container"
import { FileProcessStatusBadge } from "@/shared/components/file-process-status-badge"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export function FirmarArchivoView() {
  const status = useMedicalFileStore((s) => s.status)

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Firmar archivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Cargue un archivo médico ficticio, genere llaves RSA y produzca una
            firma digital separada (.sig).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FileProcessStatusBadge status={status} />
          <ResetPracticeButton />
        </div>
      </div>

      <MedicalFileUpload />
      <KeyPairGenerator />
      <FileSigningPanel />
      <GeneratedFilesPanel />
    </PageContainer>
  )
}
