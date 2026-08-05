import type { Metadata } from "next"

import { VerificarArchivoView } from "@/features/original-file-verification/components/verificar-archivo-view"

export const metadata: Metadata = {
  title: "Verificar archivo",
}

export default function VerificarPage() {
  return <VerificarArchivoView />
}
