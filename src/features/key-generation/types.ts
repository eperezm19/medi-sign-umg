export type KeyPair = {
  id: string
  ownerName: string
  algorithm: "RSA-PSS"
  publicKeyPem: string
  privateKeyPem: string
  createdAt: string
  fingerprint: string
}
