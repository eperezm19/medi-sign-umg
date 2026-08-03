import type { KeyPair } from "@/features/key-generation/types"
import { demoScenario } from "@/shared/data/demo-scenario"
import { delay, HEAVY_MUTATION_DELAY_MS, QUERY_DELAY_MS } from "@/shared/lib/delay"
import { useMediSignStore } from "@/stores/medi-sign-store"

export async function fetchKeyPair(): Promise<KeyPair | null> {
  await delay(QUERY_DELAY_MS)
  return useMediSignStore.getState().keyPair
}

export async function generateKeyPair(): Promise<KeyPair> {
  await delay(HEAVY_MUTATION_DELAY_MS)
  const { setKeyPair, setFlowStep } = useMediSignStore.getState()
  setKeyPair(demoScenario.keyPair)
  setFlowStep("firma-digital")
  return demoScenario.keyPair
}
