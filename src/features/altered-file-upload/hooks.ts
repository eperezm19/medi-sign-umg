"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  fetchAlteredFile,
  uploadAlteredFile,
} from "@/features/altered-file-upload/api"
import { queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useAlteredFileQuery() {
  const hydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.alteredFile,
    queryFn: fetchAlteredFile,
    enabled: hydrated,
  })
}

export function useUploadAlteredFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadAlteredFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.alteredFile })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.alteredVerification,
      })
      toast.success("Archivo modificado cargado")
    },
    onError: () => {
      toast.error("No se pudo cargar el archivo modificado")
    },
  })
}
