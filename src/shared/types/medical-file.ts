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
  /** Vista previa de texto (best-effort; PDFs pueden no ser legibles). */
  content: string
  /** Bytes exactos del archivo en memoria de sesión (no persistir). */
  bytes: Uint8Array
  uploadedAt: string
}

export type KeyPairData = {
  publicKey: string
  privateKey: string
  algorithm: "RSA"
  bits: 2048
  generatedAt: string
  opensslVersion?: string
}

export type VerificationOutcome = {
  valid: boolean
  technicalResult: "Verified OK" | "Verification Failure"
  message: string
  originalHash: string
  currentHash: string
  hashesMatch: boolean
  isAltered: boolean
  integrity: "VERIFIED" | "COMPROMISED"
  verifiedAt: string
}

/** @deprecated Use KeyPairData */
export type SimulatedKeyPair = KeyPairData
