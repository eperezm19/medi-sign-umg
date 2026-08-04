import type { Metadata } from "next"

import { ComparacionView } from "@/features/document-comparison/components/comparacion-view"

export const metadata: Metadata = {
  title: "Comparación",
}

export default function ComparacionPage() {
  return <ComparacionView />
}
