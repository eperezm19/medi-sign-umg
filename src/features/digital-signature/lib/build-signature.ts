import type { DigitalSignature } from "@/features/digital-signature/types"
import type { KeyPair } from "@/features/key-generation/types"
import type { MedicalRecord } from "@/features/medical-record/types"

function hashPayload(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0")
  return `sha256:${hex}${hex}${hex}${hex}`
}

export function buildFictitiousSha256(record: MedicalRecord): string {
  const payload = [
    record.id,
    record.patientName,
    record.patientDocumentId,
    record.birthDate,
    record.diagnosis,
    record.treatment,
    record.medications.join("|"),
    record.clinicalNotes,
    record.physicianName,
    record.physicianLicense,
    record.facility,
    record.createdAt,
  ].join("::")

  return hashPayload(payload)
}

export function buildFictitiousSignatureBase64(input: {
  recordId: string
  keyPairId: string
  contentHash: string
  signedAt: string
  signerName: string
}): string {
  const raw = [
    "MediSignUMG",
    input.recordId,
    input.keyPairId,
    input.contentHash,
    input.signedAt,
    input.signerName,
  ].join("|")

  if (typeof btoa === "function") {
    return btoa(unescape(encodeURIComponent(raw)))
  }

  return Buffer.from(raw, "utf8").toString("base64")
}

export function buildDigitalSignature(input: {
  record: MedicalRecord
  keyPair: KeyPair
  contentHash: string
  signedAt: string
}): DigitalSignature {
  const signerName = input.record.physicianName || input.keyPair.ownerName

  return {
    id: `sig-${input.record.id}-${Date.now()}`,
    recordId: input.record.id,
    keyPairId: input.keyPair.id,
    algorithm: "RSA-PSS",
    signatureBase64: buildFictitiousSignatureBase64({
      recordId: input.record.id,
      keyPairId: input.keyPair.id,
      contentHash: input.contentHash,
      signedAt: input.signedAt,
      signerName,
    }),
    contentHash: input.contentHash,
    signedAt: input.signedAt,
    signerName,
  }
}

export function buildSignedRecord(
  record: MedicalRecord,
  contentHash: string,
  signedAt: string
): MedicalRecord {
  return {
    ...record,
    status: "signed",
    contentHash,
    updatedAt: signedAt,
  }
}
