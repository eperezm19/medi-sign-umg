import { Badge } from "@/shared/components/ui/badge"
import { FILE_PROCESS_STATUS_CONFIG } from "@/shared/constants/file-process-status"
import type { FileProcessStatus } from "@/shared/types/medical-file"
import { cn } from "@/shared/lib/utils"

export function FileProcessStatusBadge({
  status,
  className,
}: {
  status: FileProcessStatus
  className?: string
}) {
  const config = FILE_PROCESS_STATUS_CONFIG[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
