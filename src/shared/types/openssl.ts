export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiFailure = {
  success: false
  error: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export type GenerateKeysData = {
  privateKeyPem: string
  publicKeyPem: string
  algorithm: "RSA"
  bits: 2048
  generatedAt: string
  opensslVersion: string
}

export type SignFileData = {
  signatureBase64: string
  originalFileName: string
  signatureFileName: string
  hash: string
  algorithm: "SHA-256"
  signedAt: string
}

export type IntegrityStatus = "VERIFIED" | "COMPROMISED"

export type VerifyFileData = {
  valid: boolean
  technicalResult: "Verified OK" | "Verification Failure"
  integrity: IntegrityStatus
  currentHash: string
  originalFileName: string
  verifiedAt: string
}
