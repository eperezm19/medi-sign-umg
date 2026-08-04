"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2Icon, RotateCcwIcon } from "lucide-react"
import { toast } from "sonner"

import { useResetDemoMutation } from "@/shared/api/demo-mutations"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"

export function DemoResetButton({
  className,
  onResetComplete,
}: {
  className?: string
  onResetComplete?: () => void
}) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const resetMutation = useResetDemoMutation()
  const isPending = resetMutation.isPending

  async function handleConfirmReset() {
    try {
      await resetMutation.mutateAsync()
      setConfirmOpen(false)
      toast.success("Demostración reiniciada", {
        description:
          "Se limpió el estado local y puedes comenzar de nuevo desde el expediente.",
      })
      onResetComplete?.()
      router.push("/expediente")
    } catch (error) {
      toast.error("No se pudo reiniciar la demostración", {
        description:
          error instanceof Error
            ? error.message
            : "Intenta de nuevo en unos segundos.",
      })
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(className)}
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2Icon className="animate-spin" data-icon="inline-start" />
        ) : (
          <RotateCcwIcon data-icon="inline-start" />
        )}
        Reiniciar demo
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="default" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reiniciar la demostración?</AlertDialogTitle>
            <AlertDialogDescription>
              Se limpiará el estado de Zustand, se eliminará la persistencia
              local y se invalidarán las consultas. Volverás al primer paso
              (expediente) con el escenario inicial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault()
                void handleConfirmReset()
              }}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              {isPending ? "Reiniciando…" : "Confirmar reinicio"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
