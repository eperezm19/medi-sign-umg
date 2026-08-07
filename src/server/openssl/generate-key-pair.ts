import { OPENSSL_INTERNAL_NAMES } from "@/shared/constants/openssl"
import type { GenerateKeysData } from "@/shared/types/openssl"
import {
  checkOpenSSLAvailability,
  runOpenSSL,
} from "@/server/openssl/run-openssl"
import { withTempDirectory } from "@/server/openssl/temporary-files"

export async function generateKeyPair(): Promise<GenerateKeysData> {
  const opensslVersion = await checkOpenSSLAvailability()

  return withTempDirectory(async (temp) => {
    const privateKeyPath = temp.join(OPENSSL_INTERNAL_NAMES.privateKeyOut)
    const publicKeyPath = temp.join(OPENSSL_INTERNAL_NAMES.publicKeyOut)

    await runOpenSSL([
      "genpkey",
      "-algorithm",
      "RSA",
      "-out",
      privateKeyPath,
      "-pkeyopt",
      "rsa_keygen_bits:2048",
    ])

    await runOpenSSL([
      "rsa",
      "-pubout",
      "-in",
      privateKeyPath,
      "-out",
      publicKeyPath,
    ])

    const privateKeyPem = await temp.readText(
      OPENSSL_INTERNAL_NAMES.privateKeyOut
    )
    const publicKeyPem = await temp.readText(
      OPENSSL_INTERNAL_NAMES.publicKeyOut
    )

    return {
      privateKeyPem,
      publicKeyPem,
      algorithm: "RSA",
      bits: 2048,
      generatedAt: new Date().toISOString(),
      opensslVersion,
    }
  })
}
