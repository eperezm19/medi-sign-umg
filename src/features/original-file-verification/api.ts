import { postOpenSSLFormData } from "@/shared/api/openssl-client"
import {
  medicalFileToBrowserFile,
  signatureToBlob,
} from "@/shared/lib/file-utils"
import type { VerificationOutcome } from "@/shared/types/medical-file"
import type { VerifyFileData } from "@/shared/types/openssl"
import { useMedicalFileStore } from "@/stores/medical-file.store"

async function verifyWithOpenSSL(params: {
  file: ReturnType<typeof medicalFileToBrowserFile>
  signature: Uint8Array
  publicKeyPem: string
}): Promise<VerifyFileData> {
  const formData = new FormData()
  formData.append("file", params.file)
  formData.append(
    "signature",
    signatureToBlob(params.signature),
    "firma.sig"
  )
  formData.append(
    "publicKey",
    new Blob([params.publicKeyPem], { type: "application/x-pem-file" }),
    "llave_publica.pem"
  )

  return postOpenSSLFormData<VerifyFileData>("/api/openssl/verify", formData)
}

export async function fetchOriginalVerification(): Promise<VerificationOutcome | null> {
  return useMedicalFileStore.getState().originalVerification
}

export async function verifyOriginalFile(): Promise<VerificationOutcome> {
  const state = useMedicalFileStore.getState()
  const { originalFile, signature, keyPair, originalHash } = state

  if (!originalFile || originalFile.bytes.length === 0) {
    throw new Error(
      "No hay archivo original en memoria. Vuelva a cargarlo y fírmelo."
    )
  }
  if (!signature || !keyPair?.publicKey || !originalHash) {
    throw new Error("No hay un archivo firmado para verificar.")
  }

  const data = await verifyWithOpenSSL({
    file: medicalFileToBrowserFile(originalFile),
    signature,
    publicKeyPem: keyPair.publicKey,
  })

  return useMedicalFileStore
    .getState()
    .applyOriginalVerification(data, originalHash)
}

export async function verifyFile(): Promise<VerificationOutcome> {
  return verifyOriginalFile()
}
