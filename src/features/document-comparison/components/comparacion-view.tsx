"use client"

import { DocumentComparisonPanel } from "@/features/document-comparison/components/document-comparison-panel"
import { PageContainer } from "@/shared/components/layout/page-container"

export function ComparacionView() {
  return (
    <PageContainer className="max-w-6xl">
      <DocumentComparisonPanel />
    </PageContainer>
  )
}
