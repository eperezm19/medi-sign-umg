"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { alterDocument } from "@/features/document-alteration/api"
import type { AlterationFormValues } from "@/features/document-alteration/schema"
import { queryKeys } from "@/shared/api/query-keys"

export function useAlterDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: AlterationFormValues) => alterDocument(values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.record }),
        queryClient.invalidateQueries({ queryKey: queryKeys.verification }),
        queryClient.invalidateQueries({ queryKey: queryKeys.comparison }),
      ])
    },
  })
}
