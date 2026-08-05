export type FileProcessStatus =
  | "EMPTY"
  | "UPLOADED"
  | "KEYS_GENERATED"
  | "SIGNED"
  | "VERIFIED"
  | "ALTERED_FILE_UPLOADED"
  | "INVALID"

export type MedicalFileData = {
  name: string
  mimeType: string
  size: number
  content: string
  uploadedAt: string
}

export type SimulatedKeyPair = {
  publicKey: string
  privateKey: string
  algorithm: "RSA"
  bits: 2048
  generatedAt: string
}

export type VerificationOutcome = {
  valid: boolean
  technicalResult: "Verified OK" | "Verification Failure"
  message: string
  originalHash: string
  currentHash: string
  hashesMatch: boolean
  isAltered: boolean
  verifiedAt: string
}
