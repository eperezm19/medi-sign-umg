"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createMedicalRecord, fetchMedicalRecord } from "@/features/medical-record/api"
import { allDemoQueryKeys, queryKeys } from "@/shared/api/query-keys"

export function useMedicalRecordQuery() {
  return useQuery({
    queryKey: queryKeys.record,
    queryFn: fetchMedicalRecord,
  })
}

export function useCreateMedicalRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicalRecord,
    onSuccess: async () => {
      await Promise.all(
        allDemoQueryKeys.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey })
        )
      )
    },
  })
}
