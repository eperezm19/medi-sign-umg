"use client"

import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ConfirmationDialogButton } from "@/shared/components/confirmation-dialog"
import { allLabQueryKeys } from "@/shared/api/query-keys"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export function ResetPracticeButton() {
  const resetPractice = useMedicalFileStore((s) => s.resetPractice)
  const queryClient = useQueryClient()
  const router = useRouter()

  return (
    <ConfirmationDialogButton
      label="Reiniciar práctica"
      variant="outline"
      destructive
      title="¿Reiniciar la práctica?"
      description="Se limpiará el estado local de la práctica, las llaves en memoria y los resultados de verificación. Volverá al paso de carga."
      confirmLabel="Reiniciar"
      onConfirm={async () => {
        resetPractice()
        await Promise.all(
          allLabQueryKeys.map((key) =>
            queryClient.invalidateQueries({ queryKey: key })
          )
        )
        toast.success("Práctica reiniciada")
        router.push("/firmar")
      }}
    />
  )
}
