import { DOWNLOAD_PREPARE_DELAY_MS } from "@/shared/constants/crypto-demo"
import { delay } from "@/shared/lib/delay"
import { downloadBlob } from "@/shared/lib/file-utils"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export type DownloadableArtifact =
  | "original"
  | "signature"
  | "publicKey"
  | "privateKey"

export async function prepareAndDownload(
  artifact: DownloadableArtifact
): Promise<{ filename: string }> {
  await delay(DOWNLOAD_PREPARE_DELAY_MS)
  const state = useMedicalFileStore.getState()

  switch (artifact) {
    case "original": {
      if (!state.originalFile) throw new Error("No hay archivo original.")
      downloadBlob(
        state.originalFile.name,
        state.originalFile.content,
        state.originalFile.mimeType
      )
      return { filename: state.originalFile.name }
    }
    case "signature": {
      if (!state.signature || !state.signatureFileName) {
        throw new Error("No hay firma digital.")
      }
      downloadBlob(state.signatureFileName, state.signature, "application/octet-stream")
      return { filename: state.signatureFileName }
    }
    case "publicKey": {
      if (!state.keyPair) throw new Error("No hay llave pública.")
      downloadBlob("llave_publica.pem", state.keyPair.publicKey, "application/x-pem-file")
      return { filename: "llave_publica.pem" }
    }
    case "privateKey": {
      if (!state.keyPair) throw new Error("No hay llave privada.")
      downloadBlob("llave_privada.pem", state.keyPair.privateKey, "application/x-pem-file")
      return { filename: "llave_privada.pem" }
    }
  }
}
