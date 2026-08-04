import { CheckCircle2Icon, CircleIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export function DemoRequirement({
  ok,
  label,
  tone = "success",
}: {
  ok: boolean
  label: string
  tone?: "success" | "warning"
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
        ok
          ? tone === "warning"
            ? "border-amber-600/30 bg-amber-500/10 text-amber-950 dark:text-amber-50"
            : "border-emerald-600/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
          : "border-border bg-muted/40 text-muted-foreground"
      )}
    >
      {ok ? (
        <CheckCircle2Icon className="size-4 shrink-0" aria-hidden />
      ) : (
        <CircleIcon className="size-4 shrink-0" aria-hidden />
      )}
      {label}
    </div>
  )
}
