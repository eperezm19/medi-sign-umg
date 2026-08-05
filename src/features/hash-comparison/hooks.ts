"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchHashComparison } from "@/features/hash-comparison/api"
import { queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useHashComparisonQuery() {
  const hydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.hashComparison,
    queryFn: fetchHashComparison,
    enabled: hydrated,
  })
}
