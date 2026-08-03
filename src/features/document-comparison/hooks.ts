"use client"

import { useQuery } from "@tanstack/react-query"

import { fetchComparison } from "@/features/document-comparison/api"
import { queryKeys } from "@/shared/api/query-keys"

export function useComparisonQuery() {
  return useQuery({
    queryKey: queryKeys.comparison,
    queryFn: fetchComparison,
  })
}
