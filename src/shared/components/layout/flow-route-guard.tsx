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
  const { maxUnlockedIndex } = useDemoStepAccess()

  useEffect(() => {
    const stepIndex = getStepIndex(pathname)
    if (stepIndex === -1) {
      return
    }

    if (stepIndex > maxUnlockedIndex) {
      const fallback = DEMO_STEPS[maxUnlockedIndex]?.href ?? "/expediente"
      router.replace(fallback)
    }
  }, [pathname, maxUnlockedIndex, router])

  return children
}
