"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  fetchAlteredVerification,
  verifyAlteredFile,
} from "@/features/altered-file-verification/api"
import { queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useAlteredVerificationQuery() {
  const hydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.alteredVerification,
    queryFn: fetchAlteredVerification,
    enabled: hydrated,
  })
}

export function useVerifyAlteredFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifyAlteredFile,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.alteredVerification,
      })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.hashComparison,
      })
      if (result.valid) {
        toast.success(result.technicalResult)
      } else {
        toast.error(result.technicalResult)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo verificar el archivo modificado")
    },
  })
}
