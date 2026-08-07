"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  fetchMedicalFile,
  uploadDemoMedicalFile,
  uploadMedicalFile,
} from "@/features/medical-file-upload/api"
import { allLabQueryKeys, queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useMedicalFileQuery() {
  const hydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.medicalFile,
    queryFn: fetchMedicalFile,
    enabled: hydrated,
  })
}

export function useUploadMedicalFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadMedicalFile,
    onSuccess: async () => {
      await Promise.all(
        allLabQueryKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        )
      )
      toast.success("Archivo médico cargado")
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo cargar el archivo")
    },
  })
}

export function useUploadDemoMedicalFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDemoMedicalFile,
    onSuccess: async () => {
      await Promise.all(
        allLabQueryKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        )
      )
      toast.success("Archivo de ejemplo cargado")
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo cargar el archivo de ejemplo")
    },
  })
}
