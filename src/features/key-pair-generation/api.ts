import { KEY_GENERATION_DELAY_MS } from "@/shared/constants/crypto-demo"
import { delay } from "@/shared/lib/delay"
import type { SimulatedKeyPair } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchKeyPair(): Promise<SimulatedKeyPair | null> {
  await delay(KEY_GENERATION_DELAY_MS / 3)
  return useMedicalFileStore.getState().keyPair
}

export async function generateKeyPair(): Promise<SimulatedKeyPair> {
  await delay(KEY_GENERATION_DELAY_MS)
  return useMedicalFileStore.getState().setKeyPair()
}
