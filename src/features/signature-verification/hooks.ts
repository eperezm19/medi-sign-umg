"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  fetchVerificationResult,
  verifyAlteredDocument,
  verifySignature,
} from "@/features/signature-verification/api"
import { queryKeys } from "@/shared/api/query-keys"

export function useVerificationQuery() {
  return useQuery({
    queryKey: queryKeys.verification,
    queryFn: fetchVerificationResult,
  })
}

export function useVerifySignatureMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifySignature,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.record }),
        queryClient.invalidateQueries({ queryKey: queryKeys.verification }),
        queryClient.invalidateQueries({ queryKey: queryKeys.comparison }),
      ])
    },
  })
}

export function useVerifyAlteredDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifyAlteredDocument,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.record }),
        queryClient.invalidateQueries({ queryKey: queryKeys.verification }),
        queryClient.invalidateQueries({ queryKey: queryKeys.comparison }),
      ])
    },
  })
}
