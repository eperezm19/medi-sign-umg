import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"
import type { MedicalRecordStatus } from "@/features/medical-record/types"
import { getStatusConfig } from "@/features/medical-record/lib/status-config"

export function MedicalRecordStatusBadge({
  status,
  className,
  showIcon = true,
}: {
  status: MedicalRecordStatus
  className?: string
  showIcon?: boolean
}) {
  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 uppercase", config.className, className)}
      title={config.description}
    >
      {showIcon ? <Icon aria-hidden /> : null}
      {config.label}
    </Badge>
  )
}
