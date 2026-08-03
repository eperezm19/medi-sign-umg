import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"

import { PageContainer } from "@/shared/components/layout/page-container"
import { Button } from "@/shared/components/ui/button"
import { DEMO_STEPS } from "@/shared/config/demo-navigation"

export function StepPlaceholder({
  title,
  description,
  icon: Icon,
  stepId,
}: {
  title: string
  description: string
  icon: LucideIcon
  stepId: string
}) {
  const index = DEMO_STEPS.findIndex((step) => step.id === stepId)
  const previous = index > 0 ? DEMO_STEPS[index - 1] : null
  const next =
    index >= 0 && index < DEMO_STEPS.length - 1 ? DEMO_STEPS[index + 1] : null

  return (
    <PageContainer>
      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Paso {index + 1} de {DEMO_STEPS.length}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed bg-muted/40 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Contenido funcional de este paso pendiente de implementación.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            {previous ? (
              <Button variant="outline" render={<Link href={previous.href} />}>
                Anterior: {previous.label}
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button render={<Link href={next.href} />}>
                Siguiente: {next.label}
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
