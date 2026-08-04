import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { HomeDemoSteps } from "@/shared/components/layout/home-demo-steps"
import { PageContainer } from "@/shared/components/layout/page-container"
import { Button } from "@/shared/components/ui/button"

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
            Usa la barra superior o selecciona un paso para continuar. Los
            pasos posteriores se desbloquean al completar el anterior.
          </p>
        </div>

        <HomeDemoSteps />
      </section>
    </PageContainer>
  )
}
