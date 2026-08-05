import { AlertTriangle } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export function AcademicWarning({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-50",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}
