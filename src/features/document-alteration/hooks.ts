"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { alterDocument } from "@/features/document-alteration/api"
import { queryKeys } from "@/shared/api/query-keys"

export function useAlterDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: alterDocument,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.record }),
        queryClient.invalidateQueries({ queryKey: queryKeys.verification }),
        queryClient.invalidateQueries({ queryKey: queryKeys.comparison }),
      ])
    },
  })
}
