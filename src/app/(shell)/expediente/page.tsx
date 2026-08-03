import type { Metadata } from "next"

import { ExpedienteView } from "@/features/medical-record/components/expediente-view"

export const metadata: Metadata = {
  title: "Expediente",
}

export default function ExpedientePage() {
  return <ExpedienteView />
}
