import {
  BadgeCheck,
  FilePenLine,
  FileWarning,
  ShieldAlert,
  ShieldOff,
  type LucideIcon,
} from "lucide-react"

import type { MedicalRecordStatus } from "@/features/medical-record/types"

export type StatusVisualConfig = {
  label: string
  description: string
  icon: LucideIcon
  className: string
}

export const medicalRecordStatusConfig: Record<
  MedicalRecordStatus,
  StatusVisualConfig
> = {
  draft: {
    label: "Sin firmar",
    description: "Borrador pendiente de completar o firmar.",
    icon: ShieldOff,
    className:
      "border-border bg-muted text-muted-foreground dark:bg-muted/50",
  },
  unsigned: {
    label: "Sin firmar",
    description: "El expediente aún no tiene firma digital.",
    icon: ShieldOff,
    className:
      "border-border bg-muted text-muted-foreground dark:bg-muted/50",
  },
  signed: {
    label: "Firmado",
    description: "El expediente fue firmado digitalmente.",
    icon: FilePenLine,
    className:
      "border-primary/30 bg-primary/10 text-primary dark:border-primary/40",
  },
  verified: {
    label: "Verificado",
    description: "La firma digital fue validada correctamente.",
    icon: BadgeCheck,
    className:
      "border-emerald-600/30 bg-emerald-500/15 text-emerald-800 dark:border-emerald-400/30 dark:text-emerald-200",
  },
  altered: {
    label: "Alterado",
    description: "El contenido del expediente fue modificado.",
    icon: FileWarning,
    className:
      "border-amber-600/30 bg-amber-500/15 text-amber-900 dark:border-amber-400/30 dark:text-amber-100",
  },
  verification_failed: {
    label: "Firma inválida",
    description: "La verificación detectó inconsistencias en la firma.",
    icon: ShieldAlert,
    className:
      "border-destructive/40 bg-destructive/10 text-destructive",
  },
}

export function getStatusConfig(status: MedicalRecordStatus): StatusVisualConfig {
  return medicalRecordStatusConfig[status]
}
