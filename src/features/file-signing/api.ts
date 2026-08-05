import { FILE_SIGNING_DELAY_MS } from "@/shared/constants/crypto-demo"
import { delay } from "@/shared/lib/delay"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchSignature() {
  await delay(FILE_SIGNING_DELAY_MS / 4)
  const state = useMedicalFileStore.getState()
  if (!state.signature) return null
  return {
    signature: state.signature,
    signatureFileName: state.signatureFileName,
    originalHash: state.originalHash,
    signedAt: state.signedAt,
  }
}

export async function signMedicalFile() {
  await delay(FILE_SIGNING_DELAY_MS)
  return useMedicalFileStore.getState().applySignature()
}
