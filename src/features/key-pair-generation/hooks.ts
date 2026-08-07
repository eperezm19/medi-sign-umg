"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  fetchKeyPair,
  generateKeyPair,
} from "@/features/key-pair-generation/api"
import { queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useKeyPairQuery() {
  const hydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.keyPair,
    queryFn: fetchKeyPair,
    enabled: hydrated,
  })
}

export function useGenerateKeysMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateKeyPair,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.keyPair })
      await queryClient.invalidateQueries({ queryKey: queryKeys.signature })
      toast.success("Par de llaves RSA generado con OpenSSL")
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudieron generar las llaves")
    },
  })
}

/** @deprecated Use useGenerateKeysMutation */
export const useGenerateKeyPairMutation = useGenerateKeysMutation
