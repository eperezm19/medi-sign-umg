import type { MedicalRecordStatus } from "@/features/medical-record/types"
import {
  FilePenLine,
  FileSearch,
  FileWarning,
  FolderOpen,
  GitCompareArrows,
  type LucideIcon,
} from "lucide-react"

export type DemoStep = {
  id: string
  label: string
  href: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

export type DemoProgressState = {
  currentRecord: { status: MedicalRecordStatus } | null
  signature: unknown | null
  verificationResult: unknown | null
  modifiedFields: unknown[]
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: "expediente",
    label: "Expediente",
    shortLabel: "1. Expediente",
    href: "/expediente",
    description: "Consulta el expediente médico de demostración.",
    icon: FolderOpen,
  },
  {
    id: "firma-digital",
    label: "Firma digital",
    shortLabel: "2. Firma",
    href: "/firma-digital",
    description: "Aplica la firma digital al documento clínico.",
    icon: FilePenLine,
  },
  {
    id: "verificacion",
    label: "Verificación",
    shortLabel: "3. Verificación",
    href: "/verificacion",
    description: "Valida la integridad y autenticidad de la firma.",
    icon: FileSearch,
  },
  {
    id: "alteracion",
    label: "Alteración",
    shortLabel: "4. Alteración",
    href: "/alteracion",
    description: "Simula una manipulación del documento firmado.",
    icon: FileWarning,
  },
  {
    id: "comparacion",
    label: "Comparación",
    shortLabel: "5. Comparación",
    href: "/comparacion",
    description: "Compara el original firmado contra la versión alterada.",
    icon: GitCompareArrows,
  },
]

export function getStepIndex(pathname: string): number {
  return DEMO_STEPS.findIndex(
    (step) => pathname === step.href || pathname.startsWith(`${step.href}/`)
  )
}

export function getMaxUnlockedStepIndex(state: DemoProgressState): number {
  let max = 0

  if (state.currentRecord) {
    max = 1
  }

  if (state.signature) {
    max = 2
  }

  if (state.verificationResult) {
    max = 3
  }

  const status = state.currentRecord?.status
  const isAltered =
    state.modifiedFields.length > 0 ||
    status === "altered" ||
    status === "verification_failed"

  if (isAltered) {
    max = 4
  }

  return max
}

export function canAccessStep(
  pathnameOrHref: string,
  maxUnlockedIndex: number
): boolean {
  const index = getStepIndex(pathnameOrHref)
  if (index === -1) {
    return true
  }
  return index <= maxUnlockedIndex
}
