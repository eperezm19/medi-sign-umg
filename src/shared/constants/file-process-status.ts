import type { FileProcessStatus } from "@/shared/types/medical-file"

export const FILE_PROCESS_STATUS_CONFIG: Record<
  FileProcessStatus,
  { label: string; className: string }
> = {
  EMPTY: {
    label: "Sin archivo",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  UPLOADED: {
    label: "Archivo cargado",
    className: "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  },
  KEYS_GENERATED: {
    label: "Llaves generadas",
    className: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  },
  SIGNED: {
    label: "Firmado",
    className:
      "border-transparent bg-blue-900 text-blue-50 dark:bg-blue-800 dark:text-blue-50",
  },
  VERIFIED: {
    label: "Verificado",
    className:
      "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  ALTERED_FILE_UPLOADED: {
    label: "Archivo modificado cargado",
    className:
      "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  },
  INVALID: {
    label: "Firma inválida",
    className:
      "border-transparent bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  },
}
