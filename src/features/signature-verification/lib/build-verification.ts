import type { DigitalSignature } from "@/features/digital-signature/types"
import type { ModifiedField } from "@/features/document-alteration/types"
import type { MedicalRecord } from "@/features/medical-record/types"
import type { VerificationResult } from "@/features/signature-verification/types"

export const VERIFICATION_OK = "Verification OK"
export const VERIFICATION_FAILURE = "Verification Failure"

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

export function buildInvalidVerificationResult(input: {
  record: MedicalRecord
  signature: DigitalSignature
  originalHash: string
  currentHash: string
  modifiedFields: ModifiedField[]
}): VerificationResult {
  const fieldsLabel =
    input.modifiedFields.length > 0
      ? input.modifiedFields.map((field) => field.label).join(", ")
      : "campos clínicos"

  return {
    id: `ver-fail-${input.record.id}-${Date.now()}`,
    recordId: input.record.id,
    signatureId: input.signature.id,
    isValid: false,
    verifiedAt: new Date().toISOString(),
    hashMatches: false,
    signatureMatches: false,
    message: `Firma digital inválida. Integridad comprometida. El hash original difiere del actual. Campos modificados: ${fieldsLabel}. Verification Failure.`,
  }
}
