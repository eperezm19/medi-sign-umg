export const queryKeys = {
  record: ["medical-record"] as const,
  keys: ["key-pair"] as const,
  signature: ["digital-signature"] as const,
  verification: ["verification"] as const,
  comparison: ["comparison"] as const,
}

export const allDemoQueryKeys = [
  queryKeys.record,
  queryKeys.keys,
  queryKeys.signature,
  queryKeys.verification,
  queryKeys.comparison,
] as const
