import type { VerificationResult } from "./types"

export const mockVerificationSuccess: VerificationResult = {
  id: "ver-umg-ok-001",
  recordId: "exp-umg-2026-001",
  signatureId: "sig-umg-2026-001",
  isValid: true,
  verifiedAt: "2026-07-28T15:10:00.000Z",
  hashMatches: true,
  signatureMatches: true,
  message:
    "La firma digital es válida. El contenido del expediente coincide con el hash firmado.",
}

export const mockVerificationFailure: VerificationResult = {
  id: "ver-umg-fail-001",
  recordId: "exp-umg-2026-001",
  signatureId: "sig-umg-2026-001",
  isValid: false,
  verifiedAt: "2026-07-28T16:45:00.000Z",
  hashMatches: false,
  signatureMatches: false,
  message:
    "Verificación fallida. El expediente fue alterado: el hash actual no coincide con la firma digital.",
}
