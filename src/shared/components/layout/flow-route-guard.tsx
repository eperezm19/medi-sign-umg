"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  DEMO_STEPS,
  getStepIndex,
} from "@/shared/config/demo-navigation"
import { useDemoStepAccess } from "@/shared/hooks/use-demo-step-access"

export function FlowRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { hasHydrated, maxUnlockedIndex } = useDemoStepAccess()

  const stepIndex = getStepIndex(pathname)
  const isBlocked =
    hasHydrated && stepIndex !== -1 && stepIndex > maxUnlockedIndex

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    if (stepIndex === -1) {
      return
    }

    if (stepIndex > maxUnlockedIndex) {
      const fallback = DEMO_STEPS[maxUnlockedIndex]?.href ?? "/expediente"
      router.replace(fallback)
    }
  }, [pathname, hasHydrated, maxUnlockedIndex, router, stepIndex])

  if (!hasHydrated) {
    return (
      <div
        className="flex flex-1 items-center justify-center px-4 py-16"
        aria-busy="true"
        aria-live="polite"
      >
        <p className="text-sm text-muted-foreground">
          Restaurando la demostración…
        </p>
      </div>
    )
  }

  if (isBlocked) {
    return null
  }

  return children
}
