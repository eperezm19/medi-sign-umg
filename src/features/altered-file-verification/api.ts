import { postOpenSSLFormData } from "@/shared/api/openssl-client"
import {
  medicalFileToBrowserFile,
  signatureToBlob,
} from "@/shared/lib/file-utils"
import type { VerificationOutcome } from "@/shared/types/medical-file"
import type { VerifyFileData } from "@/shared/types/openssl"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchAlteredVerification(): Promise<VerificationOutcome | null> {
  return useMedicalFileStore.getState().alteredVerification
}

export async function verifyAlteredFile(): Promise<VerificationOutcome> {
  const state = useMedicalFileStore.getState()
  const { alteredFile, signature, keyPair, originalHash } = state

  if (!alteredFile || alteredFile.bytes.length === 0) {
    throw new Error("Se requiere el archivo modificado en memoria.")
  }
  if (!signature || !keyPair?.publicKey || !originalHash) {
    throw new Error(
      "Se requiere la firma original y la llave pública para verificar."
    )
  }

  const formData = new FormData()
  formData.append("file", medicalFileToBrowserFile(alteredFile))
  formData.append("signature", signatureToBlob(signature), "firma.sig")
  formData.append(
    "publicKey",
    new Blob([keyPair.publicKey], { type: "application/x-pem-file" }),
    "llave_publica.pem"
  )

  const data = await postOpenSSLFormData<VerifyFileData>(
    "/api/openssl/verify",
    formData
  )

  return useMedicalFileStore
    .getState()
    .applyAlteredVerification(data, originalHash)
}
