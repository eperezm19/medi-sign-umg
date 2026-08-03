import type { KeyPair } from "./types"

export const DEMO_KEY_PAIR_ID = "kp-umg-ruiz-001"

export const mockKeyPair: KeyPair = {
  id: DEMO_KEY_PAIR_ID,
  ownerName: "Dr. Carlos Ruiz",
  algorithm: "RSA-PSS",
  keySize: 2048,
  publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0demoPublicKeyUMG2026
MediSignAcademicPrototypeOnlyNotARealKey000111222333444555666777888
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789plusSlash==
rqZ9demoFingerprintMaterialForAcademicUseOnlyUMGMediSign0000000001
IDAQAB
-----END PUBLIC KEY-----`,
  privateKeyPem: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDAdemoPrivateKey
UMG2026MediSignAcademicPrototypeOnlyNotARealSecretKeyDoNotUseInProd
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789plusSlashEquals
MaterialForDemoPurposesOnlyUniversidadMarianoGalvezGuatemala2026xx
AgMBAAECggEADemoPrivateKeyContinuationNotValidCryptographyxxxxxxx
-----END PRIVATE KEY-----`,
  createdAt: "2026-07-28T14:55:00.000Z",
  fingerprint: "UMG:SHA256:7C:3A:91:E2:4B:D8:0F:56:A1:C9:2E:77:B4:18:6D:0A",
}
