"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { Button } from "@/shared/components/ui/button"

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  pending,
  destructive,
  open,
  onOpenChange,
}: {
  trigger: React.ReactElement
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  pending?: boolean
  destructive?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            variant={destructive ? "destructive" : "default"}
            onClick={(event) => {
              event.preventDefault()
              void onConfirm()
            }}
          >
            {pending ? "Procesando…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ConfirmationDialogButton({
  label,
  variant = "outline",
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof ConfirmationDialog>, "trigger"> & {
  label: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  disabled?: boolean
}) {
  return (
    <ConfirmationDialog
      {...props}
      trigger={
        <Button type="button" variant={variant} disabled={disabled || props.pending}>
          {label}
        </Button>
      }
    />
  )
}
