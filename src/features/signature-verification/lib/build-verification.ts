import type { DigitalSignature } from "@/features/digital-signature/types"
import type { MedicalRecord } from "@/features/medical-record/types"
import type { VerificationResult } from "@/features/signature-verification/types"

export const VERIFICATION_OK = "Verification OK"

export function buildValidVerificationResult(input: {
  record: MedicalRecord
  signature: DigitalSignature
  originalHash: string
  currentHash: string
}): VerificationResult {
  return {
    id: `ver-ok-${input.record.id}-${Date.now()}`,
    recordId: input.record.id,
    signatureId: input.signature.id,
    isValid: true,
    verifiedAt: new Date().toISOString(),
    hashMatches: input.originalHash === input.currentHash,
    signatureMatches: true,
    message:
      "Firma digital válida. Integridad verificada. El hash original y el actual coinciden. Verification OK.",
  }
}
