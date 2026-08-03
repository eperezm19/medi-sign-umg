import type { Metadata } from "next"

import { StepPlaceholder } from "@/shared/components/layout/step-placeholder"
import { DEMO_STEPS } from "@/shared/config/demo-navigation"

const step = DEMO_STEPS[1]

export const metadata: Metadata = {
  title: step.label,
}

export default function FirmaDigitalPage() {
  return (
    <StepPlaceholder
      stepId={step.id}
      title={step.label}
      description={step.description}
      icon={step.icon}
    />
  )
}
