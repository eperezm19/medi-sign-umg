export const queryKeys = {
  medicalFile: ["medical-file"] as const,
  keyPair: ["key-pair"] as const,
  signature: ["signature"] as const,
  originalVerification: ["original-verification"] as const,
  alteredFile: ["altered-file"] as const,
  alteredVerification: ["altered-verification"] as const,
  hashComparison: ["hash-comparison"] as const,
}

export const allLabQueryKeys = [
  queryKeys.medicalFile,
  queryKeys.keyPair,
  queryKeys.signature,
  queryKeys.originalVerification,
  queryKeys.alteredFile,
  queryKeys.alteredVerification,
  queryKeys.hashComparison,
]
