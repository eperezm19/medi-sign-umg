import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { PageContainer } from "@/shared/components/layout/page-container"
import { Button } from "@/shared/components/ui/button"
import { DEMO_STEPS } from "@/shared/config/demo-navigation"

export default function HomePage() {
  return (
    <PageContainer className="space-y-8">
      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" aria-hidden />
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Demostración de firma digital clínica
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Recorre un flujo guiado para firmar un expediente médico de
              ejemplo, verificar su integridad, simular una alteración y
              comparar resultados. Pensado como apoyo académico, no como
              sistema hospitalario.
            </p>
          </div>
          <div>
            <Button size="lg" render={<Link href="/expediente" />}>
              Iniciar demostración
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Pasos de la demostración
          </h2>
          <p className="text-sm text-muted-foreground">
            Usa la barra superior o selecciona un paso para continuar.
          </p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <li key={step.id}>
                <Link
                  href={step.href}
                  className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
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
                      {step.description}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </PageContainer>
  )
}
