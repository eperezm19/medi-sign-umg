"use client"

import { InvalidVerificationPanel } from "@/features/signature-verification/components/invalid-verification-panel"
import { ValidVerificationPanel } from "@/features/signature-verification/components/valid-verification-panel"
import { PageContainer } from "@/shared/components/layout/page-container"

export function VerificacionView() {
  return (
    <PageContainer className="flex max-w-4xl flex-col gap-6">
      <ValidVerificationPanel />
      <InvalidVerificationPanel />
    </PageContainer>
  )
}
