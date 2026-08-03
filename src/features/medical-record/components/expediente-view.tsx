"use client"

import { MedicalRecordForm } from "@/features/medical-record/components/medical-record-form"
import { MedicalRecordPreview } from "@/features/medical-record/components/medical-record-preview"
import { PageContainer } from "@/shared/components/layout/page-container"

export function ExpedienteView() {
  return (
    <PageContainer className="max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <MedicalRecordForm />
        <div className="lg:sticky lg:top-20">
          <MedicalRecordPreview />
        </div>
      </div>
    </PageContainer>
  )
}
