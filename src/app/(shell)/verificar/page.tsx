import type { Metadata } from "next"

import { PageContainer } from "@/shared/components/layout/page-container"

export const metadata: Metadata = {
  title: "Verificar archivo",
}

export default function VerificarPage() {
  return (
    <PageContainer>
      <section className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Verificar archivo
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Pendiente de implementación. Aquí se verificará el archivo original y
          el archivo modificado externamente contra la firma y la llave pública.
        </p>
      </section>
    </PageContainer>
  )
}
