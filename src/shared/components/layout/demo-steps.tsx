"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { DEMO_STEPS, getStepIndex } from "@/shared/config/demo-navigation"
import { useDemoStepAccess } from "@/shared/hooks/use-demo-step-access"
import { cn } from "@/shared/lib/utils"

export function DemoSteps({ className }: { className?: string }) {
  const pathname = usePathname()
  const currentIndex = getStepIndex(pathname)
  const { maxUnlockedIndex, canAccess } = useDemoStepAccess()

  return (
    <nav
      aria-label="Flujo de la demostración"
      className={cn("border-b bg-muted/40", className)}
    >
      <ol className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:gap-2 lg:px-8">
        {DEMO_STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentIndex
          const isUnlocked = canAccess(step.href)
          const isLocked = !isUnlocked
          const isCompleted = isUnlocked && index < maxUnlockedIndex && !isActive

          const content = (
            <>
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-primary/15 text-primary",
                  !isActive &&
                    !isCompleted &&
                    "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
                  <span className="truncate text-xs font-medium sm:text-sm">
                    {step.label}
                  </span>
                </span>
                <span className="mt-0.5 hidden truncate text-[11px] text-muted-foreground xl:block">
                  {isLocked ? "Completa el paso anterior" : step.description}
                </span>
              </span>
            </>
          )

          const itemClassName = cn(
            "flex min-w-[9.5rem] flex-1 items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors sm:min-w-0",
            isActive &&
              "border-primary/40 bg-primary/10 text-foreground shadow-sm",
            isCompleted &&
              "border-border bg-background text-foreground hover:bg-muted/80",
            isUnlocked &&
              !isActive &&
              !isCompleted &&
              "border-transparent bg-transparent text-muted-foreground hover:bg-background hover:text-foreground",
            isLocked &&
              "cursor-not-allowed border-transparent bg-transparent text-muted-foreground/60 opacity-70"
          )

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1 lg:gap-2">
              {isLocked ? (
                <span
                  aria-disabled="true"
                  title="Completa el paso anterior para continuar"
                  className={itemClassName}
                >
                  {content}
                </span>
              ) : (
                <Link
                  href={step.href}
                  aria-current={isActive ? "step" : undefined}
                  className={itemClassName}
                >
                  {content}
                </Link>
              )}
              {index < DEMO_STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "hidden h-px w-3 shrink-0 sm:block lg:w-5",
                    index < maxUnlockedIndex ? "bg-primary/50" : "bg-border"
                  )}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
