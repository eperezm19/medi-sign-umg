import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { AcademicWarning } from "@/shared/components/academic-warning"
import { PageContainer } from "@/shared/components/layout/page-container"
import { Button } from "@/shared/components/ui/button"

const FLOW_STEPS = [
  "Cargar archivo",
  "Generar llaves",
  "Firmar",
  "Descargar",
  "Verificar original",
  "Modificar externamente",
  "Volver a cargar",
  "Detectar alteración",
] as const

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
              MediSign
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Laboratorio académico de firma y verificación real de archivos
              médicos con OpenSSL. Si el contenido no cambia, la verificación es
              válida; si se altera después de firmar, la verificación falla.
            </p>
          </div>
          <AcademicWarning>
            Utilice únicamente archivos ficticios. Este prototipo no debe
            procesar información médica real.
          </AcademicWarning>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/firmar" />}>
              Firmar archivo
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/verificar" />}
            >
              Verificar archivo
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Flujo de la práctica
          </h2>
          <p className="text-sm text-muted-foreground">
            Ocho pasos para demostrar integridad documental con una firma
            separada (.sig) y comparación de hashes.
          </p>
        </div>

        <ol className="grid gap-2 sm:grid-cols-2">
          {FLOW_STEPS.map((label, index) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                {index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
      </section>
    </PageContainer>
  )
}
