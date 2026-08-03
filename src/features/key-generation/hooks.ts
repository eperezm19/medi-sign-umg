"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fetchKeyPair, generateKeyPair } from "@/features/key-generation/api"
import { queryKeys } from "@/shared/api/query-keys"

export function useKeyPairQuery() {
  return useQuery({
    queryKey: queryKeys.keys,
    queryFn: fetchKeyPair,
  })
}

export function useGenerateKeysMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateKeyPair,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.keys })
    },
  })
}
