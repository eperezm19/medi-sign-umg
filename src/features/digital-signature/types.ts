export type DigitalSignature = {
  id: string
  recordId: string
  keyPairId: string
  algorithm: "RSA-PSS"
  signatureBase64: string
  contentHash: string
  signedAt: string
  signerName: string
}
