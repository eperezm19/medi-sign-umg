"use client"

import { AcademicWarning } from "@/shared/components/academic-warning"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

export function AlteredFileInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modificar el archivo externamente</CardTitle>
        <CardDescription>
          El cambio debe ocurrir fuera de MediSign para simular una alteración
          real del documento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>Descargue el archivo médico original.</li>
          <li>Ábralo en un editor de texto.</li>
          <li>Cambie una línea (por ejemplo, el tratamiento).</li>
          <li>Guárdelo con el mismo nombre u otro nombre.</li>
          <li>
            Vuelva a subirlo aquí para verificarlo con la firma original.
          </li>
        </ol>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border bg-muted/30 p-3">
            <p className="mb-1 font-medium">Contenido original</p>
            <p className="font-mono text-xs leading-relaxed">
              Tratamiento: Administrar medicamento cada ocho horas durante cinco
              días
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-3">
            <p className="mb-1 font-medium">Contenido modificado</p>
            <p className="font-mono text-xs leading-relaxed">
              Tratamiento: Administrar medicamento cada dos horas durante diez
              días
            </p>
          </div>
        </div>

        <AcademicWarning>
          No se debe generar una nueva firma. La práctica debe utilizar la firma
          original y la misma llave pública.
        </AcademicWarning>
      </CardContent>
    </Card>
  )
}
