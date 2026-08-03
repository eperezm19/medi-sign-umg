export type KeyPair = {
  id: string
  ownerName: string
  algorithm: "RSA-PSS"
  keySize: 2048
  publicKeyPem: string
  privateKeyPem: string
  createdAt: string
  fingerprint: string
}
