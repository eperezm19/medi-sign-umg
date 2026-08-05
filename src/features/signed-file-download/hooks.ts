"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  prepareAndDownload,
  type DownloadableArtifact,
} from "@/features/signed-file-download/api"

export function usePrepareDownloadMutation() {
  return useMutation({
    mutationFn: (artifact: DownloadableArtifact) => prepareAndDownload(artifact),
    onSuccess: ({ filename }) => {
      toast.success(`Descarga lista: ${filename}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo preparar la descarga")
    },
  })
}
