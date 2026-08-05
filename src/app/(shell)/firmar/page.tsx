import type { Metadata } from "next"

import { FirmarArchivoView } from "@/features/file-signing/components/firmar-archivo-view"

export const metadata: Metadata = {
  title: "Firmar archivo",
}

export default function FirmarPage() {
  return <FirmarArchivoView />
}
