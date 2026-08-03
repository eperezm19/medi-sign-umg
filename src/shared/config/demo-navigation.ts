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
