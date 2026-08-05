import { VERIFY_ALTERED_DELAY_MS } from "@/shared/constants/crypto-demo"
import { delay } from "@/shared/lib/delay"
import type { VerificationOutcome } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchAlteredVerification(): Promise<VerificationOutcome | null> {
  await delay(VERIFY_ALTERED_DELAY_MS / 3)
  return useMedicalFileStore.getState().alteredVerification
}

export async function verifyAlteredFile(): Promise<VerificationOutcome> {
  await delay(VERIFY_ALTERED_DELAY_MS)
  return useMedicalFileStore.getState().applyAlteredVerification()
}
