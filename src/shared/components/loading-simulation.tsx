"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export function LoadingSimulation({
  stages,
  activeIndex,
  className,
}: {
  stages: string[]
  activeIndex: number
  className?: string
}) {
  return (
    <div className={cn("space-y-3 rounded-xl border bg-muted/40 p-4", className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Procesando…
      </div>
      <ol className="space-y-2">
        {stages.map((stage, index) => {
          const isActive = index === activeIndex
          const isDone = index < activeIndex
          return (
            <li
              key={stage}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                isActive && "font-medium text-foreground",
                isDone && "text-muted-foreground",
                !isActive && !isDone && "text-muted-foreground/60"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[10px] font-semibold",
                  isActive && "bg-primary text-primary-foreground",
                  isDone && "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
                  !isActive && !isDone && "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              {stage}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
