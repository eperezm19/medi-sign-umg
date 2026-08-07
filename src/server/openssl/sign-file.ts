import { createHash } from "node:crypto"

import { OPENSSL_INTERNAL_NAMES } from "@/shared/constants/openssl"
import type { SignFileData } from "@/shared/types/openssl"
import {
  checkOpenSSLAvailability,
  runOpenSSL,
} from "@/server/openssl/run-openssl"
import { withTempDirectory } from "@/server/openssl/temporary-files"

export type SignFileInput = {
  fileBuffer: Buffer
  privateKeyPem: string
  originalFileName: string
}

function toSignatureFileName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "") || filename
  return `${base}.sig`
}

export async function signFile(input: SignFileInput): Promise<SignFileData> {
  await checkOpenSSLAvailability()

  const hash = createHash("sha256").update(input.fileBuffer).digest("hex")

  return withTempDirectory(async (temp) => {
    const documentPath = await temp.write(
      OPENSSL_INTERNAL_NAMES.document,
      input.fileBuffer
    )
    const privateKeyPath = await temp.write(
      OPENSSL_INTERNAL_NAMES.privateKey,
      input.privateKeyPem
    )
    const signaturePath = temp.join(OPENSSL_INTERNAL_NAMES.signature)

    await runOpenSSL([
      "dgst",
      "-sha256",
      "-sign",
      privateKeyPath,
      "-out",
      signaturePath,
      documentPath,
    ])

    const signatureBuffer = await temp.read(OPENSSL_INTERNAL_NAMES.signature)

    return {
      signatureBase64: signatureBuffer.toString("base64"),
      originalFileName: input.originalFileName,
      signatureFileName: toSignatureFileName(input.originalFileName),
      hash,
      algorithm: "SHA-256",
      signedAt: new Date().toISOString(),
    }
  })
}
