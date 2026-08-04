"use client"

import Link from "next/link"

import { DEMO_STEPS } from "@/shared/config/demo-navigation"
import { useDemoStepAccess } from "@/shared/hooks/use-demo-step-access"
import { cn } from "@/shared/lib/utils"

export function HomeDemoSteps() {
  const { canAccess } = useDemoStepAccess()

  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DEMO_STEPS.map((step, index) => {
        const Icon = step.icon
        const isUnlocked = canAccess(step.href)

        const content = (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Paso {index + 1}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{step.label}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isUnlocked
                  ? step.description
                  : "Completa el paso anterior para desbloquear este acceso."}
              </p>
            </div>
          </>
        )

        const className = cn(
          "flex h-full flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors",
          isUnlocked
            ? "hover:border-primary/40 hover:bg-primary/5"
            : "cursor-not-allowed opacity-70"
        )

        return (
          <li key={step.id}>
            {isUnlocked ? (
              <Link href={step.href} className={className}>
                {content}
              </Link>
            ) : (
              <div
                aria-disabled="true"
                aria-label={`Paso bloqueado: ${step.label}. Completa el paso anterior para continuar.`}
                title="Completa el paso anterior para continuar"
                className={className}
              >
                {content}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
