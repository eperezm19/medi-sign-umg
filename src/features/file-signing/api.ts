import { postOpenSSLFormData } from "@/shared/api/openssl-client"
import {
  medicalFileToBrowserFile,
  signatureToBlob,
} from "@/shared/lib/file-utils"
import type { SignFileData } from "@/shared/types/openssl"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchSignature() {
  const state = useMedicalFileStore.getState()
  if (!state.signature) return null
  return {
    signature: state.signature,
    signatureFileName: state.signatureFileName,
    originalHash: state.originalHash,
    signedAt: state.signedAt,
  }
}

export async function signFile() {
  const state = useMedicalFileStore.getState()
  const { originalFile, keyPair } = state

  if (!originalFile || originalFile.bytes.length === 0) {
    throw new Error(
      "Se requiere el archivo médico en memoria. Vuelva a cargarlo."
    )
  }
  if (!keyPair?.privateKey) {
    throw new Error(
      "Se requiere la llave privada en memoria. Genere las llaves de nuevo."
    )
  }

  const formData = new FormData()
  formData.append("file", medicalFileToBrowserFile(originalFile))
  formData.append(
    "privateKey",
    new Blob([keyPair.privateKey], { type: "application/x-pem-file" }),
    "llave_privada.pem"
  )

  const data = await postOpenSSLFormData<SignFileData>(
    "/api/openssl/sign",
    formData
  )

  return useMedicalFileStore.getState().applySignature(data)
}

/** @deprecated Use signFile */
export const signMedicalFile = signFile

export function getSignatureBlob(): Blob | null {
  const signature = useMedicalFileStore.getState().signature
  if (!signature) return null
  return signatureToBlob(signature)
}
