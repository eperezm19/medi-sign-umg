import type { VerificationResult } from "@/features/signature-verification/types"
import { demoScenario } from "@/shared/data/demo-scenario"
import { delay, HEAVY_MUTATION_DELAY_MS, QUERY_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function fetchVerificationResult(): Promise<VerificationResult | null> {
  await delay(QUERY_DELAY_MS)
  return useMediSignStore.getState().verificationResult
}

export async function verifySignature(): Promise<VerificationResult> {
  await delay(HEAVY_MUTATION_DELAY_MS)
  const result = demoScenario.verificationSuccess
  const { setVerificationResult, setFlowStep, setCurrentRecord, currentRecord } =
    useMediSignStore.getState()

  setVerificationResult(result)
  setFlowStep("verificacion")

  if (currentRecord) {
    setCurrentRecord({ ...currentRecord, status: "signed" })
  }

  return result
}

export async function verifyAlteredDocument(): Promise<VerificationResult> {
  await delay(HEAVY_MUTATION_DELAY_MS)
  const result = demoScenario.verificationFailure
  const { setVerificationResult, setFlowStep, setCurrentRecord, currentRecord } =
    useMediSignStore.getState()

  setVerificationResult(result)
  setFlowStep("comparacion")

  if (currentRecord) {
    setCurrentRecord({
      ...currentRecord,
      status: "verification_failed",
    })
  }

  return result
}
