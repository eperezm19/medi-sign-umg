import {
  mockAlteredRecord,
  mockOriginalRecord,
  mockSignedRecord,
} from "@/features/medical-record"
import { mockKeyPair } from "@/features/key-generation"
import { mockDigitalSignature } from "@/features/digital-signature"
import {
  mockVerificationFailure,
  mockVerificationSuccess,
} from "@/features/signature-verification"
import { mockModifiedFields } from "@/features/document-alteration"

import type { MedicalRecord } from "@/features/medical-record"
import type { KeyPair } from "@/features/key-generation"
import type { DigitalSignature } from "@/features/digital-signature"
import type { VerificationResult } from "@/features/signature-verification"
import type { ModifiedField } from "@/features/document-alteration"

export type DemoScenario = {
  originalRecord: MedicalRecord
  signedRecord: MedicalRecord
  alteredRecord: MedicalRecord
  keyPair: KeyPair
  signature: DigitalSignature
  verificationSuccess: VerificationResult
  verificationFailure: VerificationResult
  modifiedFields: ModifiedField[]
}

export const demoScenario: DemoScenario = {
  originalRecord: mockOriginalRecord,
  signedRecord: mockSignedRecord,
  alteredRecord: mockAlteredRecord,
  keyPair: mockKeyPair,
  signature: mockDigitalSignature,
  verificationSuccess: mockVerificationSuccess,
  verificationFailure: mockVerificationFailure,
  modifiedFields: mockModifiedFields,
}
