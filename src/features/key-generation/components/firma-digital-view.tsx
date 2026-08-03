"use client"

import { SignRecordPanel } from "@/features/digital-signature/components/sign-record-panel"
import { KeyGenerationPanel } from "@/features/key-generation/components/key-generation-panel"
import { PageContainer } from "@/shared/components/layout/page-container"

export function FirmaDigitalView() {
  return (
    <PageContainer className="flex max-w-4xl flex-col gap-6">
      <KeyGenerationPanel />
      <SignRecordPanel />
    </PageContainer>
  )
}
