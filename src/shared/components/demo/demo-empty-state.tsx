import type { LucideIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export function DemoEmptyState({
  icon: Icon,
  children,
  className,
}: {
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-10 text-center",
        className
      )}
    >
      {Icon ? (
        <Icon className="size-8 text-muted-foreground" aria-hidden />
      ) : null}
      <div className="max-w-md text-sm text-muted-foreground">{children}</div>
    </div>
  )
}
