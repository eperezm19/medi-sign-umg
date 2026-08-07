"use client"

import { Loader2 } from "lucide-react"

import { KeyDisplay } from "@/features/key-pair-generation/components/key-display"
import { useGenerateKeysMutation } from "@/features/key-pair-generation/hooks"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export function KeyPairGenerator() {
  const originalFile = useMedicalFileStore((s) => s.originalFile)
  const keyPair = useMedicalFileStore((s) => s.keyPair)
  const mutation = useGenerateKeysMutation()
  const hasUsableKeys = Boolean(keyPair?.privateKey)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Generación de llaves</CardTitle>
          <Badge variant={hasUsableKeys ? "default" : "secondary"}>
            {hasUsableKeys ? "Llaves disponibles" : "No generado"}
          </Badge>
        </div>
        <CardDescription>
          Algoritmo RSA · 2048 bits · OpenSSL / LibreSSL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Algoritmo</dt>
            <dd className="font-medium">RSA</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Longitud</dt>
            <dd className="font-medium">2048 bits</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estado</dt>
            <dd className="font-medium">
              {hasUsableKeys ? "Llaves disponibles" : "No generado"}
            </dd>
          </div>
        </dl>

        <Button
          type="button"
          disabled={!originalFile || mutation.isPending}
          onClick={() => void mutation.mutateAsync()}
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : null}
          Generar par de llaves RSA
        </Button>

        {!originalFile ? (
          <p className="text-sm text-muted-foreground">
            Cargue un archivo médico antes de generar las llaves.
          </p>
        ) : null}

        {keyPair && !keyPair.privateKey ? (
          <p className="text-sm text-muted-foreground">
            La llave privada no está en memoria de esta sesión. Genérela de
            nuevo para firmar.
          </p>
        ) : null}

        {hasUsableKeys && keyPair ? (
          <KeyDisplay
            publicKey={keyPair.publicKey}
            privateKey={keyPair.privateKey}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
