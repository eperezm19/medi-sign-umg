import type { Metadata } from "next"

import { AlteracionView } from "@/features/document-alteration/components/alteracion-view"

export const metadata: Metadata = {
  title: "Alteración",
}

export default function AlteracionPage() {
  return <AlteracionView />
}
