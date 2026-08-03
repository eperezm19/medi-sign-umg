"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { resetDemoScenario } from "@/features/document-comparison/api"
import { allDemoQueryKeys } from "@/shared/api/query-keys"

export function useResetDemoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resetDemoScenario,
    onSuccess: async () => {
      await Promise.all(
        allDemoQueryKeys.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey })
        )
      )
    },
  })
}
