export type VerificationResult = {
  id: string
  recordId: string
  signatureId: string
  isValid: boolean
  verifiedAt: string
  hashMatches: boolean
  signatureMatches: boolean
  message: string
}
