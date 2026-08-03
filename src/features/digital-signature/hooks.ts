"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  fetchDigitalSignature,
  signMedicalRecord,
} from "@/features/digital-signature/api"
import { queryKeys } from "@/shared/api/query-keys"

export function useDigitalSignatureQuery() {
  return useQuery({
    queryKey: queryKeys.signature,
    queryFn: fetchDigitalSignature,
  })
}

export function useSignRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signMedicalRecord,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.record }),
        queryClient.invalidateQueries({ queryKey: queryKeys.keys }),
        queryClient.invalidateQueries({ queryKey: queryKeys.signature }),
        queryClient.invalidateQueries({ queryKey: queryKeys.verification }),
        queryClient.invalidateQueries({ queryKey: queryKeys.comparison }),
      ])
    },
  })
}
