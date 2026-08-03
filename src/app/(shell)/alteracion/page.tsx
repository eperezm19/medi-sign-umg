import type { Metadata } from "next"

import { StepPlaceholder } from "@/shared/components/layout/step-placeholder"
import { DEMO_STEPS } from "@/shared/config/demo-navigation"

const step = DEMO_STEPS[3]

export const metadata: Metadata = {
  title: step.label,
}

export default function AlteracionPage() {
  return (
    <StepPlaceholder
      stepId={step.id}
      title={step.label}
      description={step.description}
      icon={step.icon}
    />
  )
}
