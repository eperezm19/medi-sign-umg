"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  fetchOriginalVerification,
  verifyFile,
  verifyOriginalFile,
} from "@/features/original-file-verification/api"
import { queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useOriginalVerificationQuery() {
  const hydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.originalVerification,
    queryFn: fetchOriginalVerification,
    enabled: hydrated,
  })
}

export function useVerifyFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifyFile,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.originalVerification,
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
      toast.error(error.message || "No se pudo verificar el archivo")
    },
  })
}

export function useVerifyOriginalFileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifyOriginalFile,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.originalVerification,
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
      toast.error(error.message || "No se pudo verificar el archivo")
    },
  })
}
