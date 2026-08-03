import type { Metadata } from "next"

import { VerificacionView } from "@/features/signature-verification/components/verificacion-view"

export const metadata: Metadata = {
  title: "Verificación",
}

export default function VerificacionPage() {
  return <VerificacionView />
}
