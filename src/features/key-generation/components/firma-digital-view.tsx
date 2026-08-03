"use client"

import { KeyGenerationPanel } from "@/features/key-generation/components/key-generation-panel"
import { PageContainer } from "@/shared/components/layout/page-container"

export function FirmaDigitalView() {
  return (
    <PageContainer className="max-w-4xl">
      <KeyGenerationPanel />
    </PageContainer>
  )
}
