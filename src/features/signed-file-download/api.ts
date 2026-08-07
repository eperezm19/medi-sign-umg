import { downloadBlob, signatureToBlob } from "@/shared/lib/file-utils"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export type DownloadableArtifact =
  | "original"
  | "signature"
  | "publicKey"
  | "privateKey"

export async function prepareAndDownload(
  artifact: DownloadableArtifact
): Promise<{ filename: string }> {
  const state = useMedicalFileStore.getState()

  switch (artifact) {
    case "original": {
      if (!state.originalFile || state.originalFile.bytes.length === 0) {
        throw new Error(
          "No hay archivo original en memoria. Vuelva a cargarlo."
        )
      }
      downloadBlob(
        state.originalFile.name,
        state.originalFile.bytes,
        state.originalFile.mimeType
      )
      return { filename: state.originalFile.name }
    }
    case "signature": {
      if (!state.signature || !state.signatureFileName) {
        throw new Error("No hay firma digital en memoria.")
      }
      downloadBlob(
        state.signatureFileName,
        signatureToBlob(state.signature),
        "application/octet-stream"
      )
      return { filename: state.signatureFileName }
    }
    case "publicKey": {
      if (!state.keyPair?.publicKey) {
        throw new Error("No hay llave pública.")
      }
      downloadBlob(
        "llave_publica.pem",
        state.keyPair.publicKey,
        "application/x-pem-file"
      )
      return { filename: "llave_publica.pem" }
    }
    case "privateKey": {
      if (!state.keyPair?.privateKey) {
        throw new Error(
          "No hay llave privada en memoria. Genere las llaves de nuevo."
        )
      }
      downloadBlob(
        "llave_privada.pem",
        state.keyPair.privateKey,
        "application/x-pem-file"
      )
      return { filename: "llave_privada.pem" }
    }
  }
}
