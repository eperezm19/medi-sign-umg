import type { Metadata } from "next"

import { MedicalRecordForm } from "@/features/medical-record/components/medical-record-form"
import { PageContainer } from "@/shared/components/layout/page-container"

export const metadata: Metadata = {
  title: "Expediente",
}

export default function ExpedientePage() {
  return (
    <PageContainer className="max-w-4xl">
      <MedicalRecordForm />
    </PageContainer>
  )
}
