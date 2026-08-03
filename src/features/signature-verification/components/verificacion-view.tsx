"use client"

import { ValidVerificationPanel } from "@/features/signature-verification/components/valid-verification-panel"
import { PageContainer } from "@/shared/components/layout/page-container"

export function VerificacionView() {
  return (
    <PageContainer className="max-w-4xl">
      <ValidVerificationPanel />
    </PageContainer>
  )
}
