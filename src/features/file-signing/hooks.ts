"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { fetchSignature, signFile } from "@/features/file-signing/api"
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

export function useSignFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.signature })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.originalVerification,
      })
      toast.success("Archivo firmado con OpenSSL")
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo firmar el archivo")
    },
  })
}

/** @deprecated Use useSignFileMutation */
export const useSignMedicalFileMutation = useSignFileMutation
