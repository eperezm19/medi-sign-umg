"use client"

import { DocumentAlterationPanel } from "@/features/document-alteration/components/document-alteration-panel"
import { PageContainer } from "@/shared/components/layout/page-container"

export function AlteracionView() {
  return (
    <PageContainer className="max-w-4xl">
      <DocumentAlterationPanel />
    </PageContainer>
  )
}
