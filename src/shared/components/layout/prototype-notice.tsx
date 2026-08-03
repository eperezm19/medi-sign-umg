import { Badge } from "@/shared/components/ui/badge"
import { GraduationCap } from "lucide-react"

export function PrototypeNotice() {
  return (
    <div
      role="note"
      className="border-b border-amber-500/25 bg-amber-500/10 text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-50"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-2.5 sm:items-center sm:px-6 lg:px-8">
        <GraduationCap className="mt-0.5 size-4 shrink-0 sm:mt-0" aria-hidden />
        <p className="text-xs leading-relaxed sm:text-sm">
          <Badge
            variant="outline"
            className="mr-2 border-amber-600/30 bg-amber-500/15 text-amber-950 dark:border-amber-300/30 dark:text-amber-50"
          >
            Prototipo académico
          </Badge>
          MediSign UMG es una demostración educativa de la Universidad Mariano
          Gálvez. No utilizar con datos clínicos reales ni en entornos
          productivos.
        </p>
      </div>
    </div>
  )
}
