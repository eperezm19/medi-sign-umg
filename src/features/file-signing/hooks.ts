"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchSignature, signMedicalFile } from "@/features/file-signing/api"
import { queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useSignatureQuery() {
  const hydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.signature,
    queryFn: fetchSignature,
    enabled: hydrated,
  })
}

export function useSignMedicalFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signMedicalFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.signature })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.originalVerification,
      })
      toast.success("Archivo firmado digitalmente")
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo firmar el archivo")
    },
  })
}
