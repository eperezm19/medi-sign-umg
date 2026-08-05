import { VERIFY_ORIGINAL_DELAY_MS } from "@/shared/constants/crypto-demo"
import { delay } from "@/shared/lib/delay"
import type { VerificationOutcome } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchOriginalVerification(): Promise<VerificationOutcome | null> {
  await delay(VERIFY_ORIGINAL_DELAY_MS / 3)
  return useMedicalFileStore.getState().originalVerification
}

export async function verifyOriginalFile(): Promise<VerificationOutcome> {
  await delay(VERIFY_ORIGINAL_DELAY_MS)
  return useMedicalFileStore.getState().applyOriginalVerification()
}
