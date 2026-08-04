"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchComparison } from "@/features/document-comparison/api"
import { queryKeys } from "@/shared/api/query-keys"
import { useStoreHydration } from "@/shared/hooks/use-store-hydration"

export function useComparisonQuery() {
  const hasHydrated = useStoreHydration()

  return useQuery({
    queryKey: queryKeys.comparison,
    queryFn: fetchComparison,
    enabled: hasHydrated,
  })
}
