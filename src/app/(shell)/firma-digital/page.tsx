import type { Metadata } from "next"

import { FirmaDigitalView } from "@/features/key-generation/components/firma-digital-view"

export const metadata: Metadata = {
  title: "Firma digital",
}

export default function FirmaDigitalPage() {
  return <FirmaDigitalView />
}
