"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

export function HashComparison({
  originalHash,
  currentHash,
}: {
  originalHash: string
  currentHash: string
}) {
  const match = originalHash === currentHash

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de hashes</CardTitle>
        <CardDescription>
          Un cambio mínimo en el archivo modifica su hash. Por ello, la firma
          generada sobre la versión original deja de ser válida.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border p-4">
            <h3 className="text-sm font-medium">Hash original</h3>
            <p className="break-all font-mono text-xs">{originalHash}</p>
          </div>
          <div className="space-y-2 rounded-xl border p-4">
            <h3 className="text-sm font-medium">Hash actual</h3>
            <p className="break-all font-mono text-xs">{currentHash}</p>
          </div>
        </div>
        <p
          className={
            match
              ? "text-sm font-medium text-emerald-700 dark:text-emerald-300"
              : "text-sm font-medium text-red-700 dark:text-red-300"
          }
        >
          {match ? "Los hashes coinciden" : "Los hashes no coinciden"}
        </p>
      </CardContent>
    </Card>
  )
}
