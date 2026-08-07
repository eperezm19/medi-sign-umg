export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const ALLOWED_EXTENSIONS = [".txt", ".pdf", ".json"] as const

export const ALLOWED_MIME_TYPES = [
  "text/plain",
  "application/pdf",
  "application/json",
  "application/x-pem-file",
  "application/octet-stream",
] as const

export const OPENSSL_INTERNAL_NAMES = {
  document: "document.bin",
  privateKey: "private.pem",
  publicKey: "public.pem",
  signature: "signature.sig",
  privateKeyOut: "llave_privada.pem",
  publicKeyOut: "llave_publica.pem",
} as const
