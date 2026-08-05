import type { Metadata } from "next"

import { PageContainer } from "@/shared/components/layout/page-container"

export const metadata: Metadata = {
  title: "Firmar archivo",
}

export default function FirmarPage() {
  return (
    <PageContainer>
      <section className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Firmar archivo
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Pendiente de implementación. Aquí se cargará el archivo médico, se
          generarán las llaves RSA y se firmará el documento con SHA-256.
        </p>
      </section>
    </PageContainer>
  )
}
