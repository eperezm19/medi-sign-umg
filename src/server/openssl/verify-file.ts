import { createHash } from "node:crypto"

import { OPENSSL_INTERNAL_NAMES } from "@/shared/constants/openssl"
import type { VerifyFileData } from "@/shared/types/openssl"
import {
  checkOpenSSLAvailability,
  runOpenSSL,
} from "@/server/openssl/run-openssl"
import { withTempDirectory } from "@/server/openssl/temporary-files"

export type VerifyFileInput = {
  fileBuffer: Buffer
  signatureBuffer: Buffer
  publicKeyPem: string
  originalFileName: string
}

function normalizeTechnicalResult(
  valid: boolean,
  stdout: string,
  stderr: string
): "Verified OK" | "Verification Failure" {
  const combined = `${stdout}\n${stderr}`.toLowerCase()

  if (valid) {
    return "Verified OK"
  }

  if (combined.includes("verified ok")) {
    return "Verified OK"
  }

  return "Verification Failure"
}

export async function verifyFile(
  input: VerifyFileInput
): Promise<VerifyFileData> {
  await checkOpenSSLAvailability()

  const currentHash = createHash("sha256")
    .update(input.fileBuffer)
    .digest("hex")

  return withTempDirectory(async (temp) => {
    const documentPath = await temp.write(
      OPENSSL_INTERNAL_NAMES.document,
      input.fileBuffer
    )
    const signaturePath = await temp.write(
      OPENSSL_INTERNAL_NAMES.signature,
      input.signatureBuffer
    )
    const publicKeyPath = await temp.write(
      OPENSSL_INTERNAL_NAMES.publicKey,
      input.publicKeyPem
    )

    const result = await runOpenSSL(
      [
        "dgst",
        "-sha256",
        "-verify",
        publicKeyPath,
        "-signature",
        signaturePath,
        documentPath,
      ],
      { allowNonZeroExit: true }
    )

    const valid = result.exitCode === 0
    const technicalResult = normalizeTechnicalResult(
      valid,
      result.stdout,
      result.stderr
    )

    return {
      valid,
      technicalResult: valid ? "Verified OK" : technicalResult,
      integrity: valid ? "VERIFIED" : "COMPROMISED",
      currentHash,
      originalFileName: input.originalFileName,
      verifiedAt: new Date().toISOString(),
    }
  })
}
