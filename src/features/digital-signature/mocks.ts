import type { DigitalSignature } from "./types"

export const DEMO_SIGNATURE_ID = "sig-umg-2026-001"

export const mockDigitalSignature: DigitalSignature = {
  id: DEMO_SIGNATURE_ID,
  recordId: "exp-umg-2026-001",
  keyPairId: "kp-umg-ruiz-001",
  algorithm: "RSA-PSS",
  signatureBase64:
    "U01lZGlTaWduVU1HRGVtb1NpZ25hdHVyZU5vdFJlYWxDcnlwdG9HcmFwaHkxMjM0NTY3ODkwYWJjZGVmZ2hpams=",
  contentHash:
    "sha256:a3f1c9e8b2d0471e6f5a8c0d9b7e4a1f2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
  signedAt: "2026-07-28T15:05:00.000Z",
  signerName: "Dr. Carlos Ruiz",
}
