import { ALTERED_UPLOAD_DELAY_MS } from "@/shared/constants/crypto-demo"
import { delay } from "@/shared/lib/delay"
import { readFileAsText } from "@/shared/lib/file-utils"
import type { MedicalFileData } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchAlteredFile(): Promise<MedicalFileData | null> {
  await delay(ALTERED_UPLOAD_DELAY_MS)
  return useMedicalFileStore.getState().alteredFile
}

export async function uploadAlteredFile(file: File): Promise<MedicalFileData> {
  await delay(ALTERED_UPLOAD_DELAY_MS)
  const content = await readFileAsText(file)
  const data: MedicalFileData = {
    name: file.name,
    mimeType: file.type || "text/plain",
    size: file.size,
    content,
    uploadedAt: new Date().toISOString(),
  }
  useMedicalFileStore.getState().setAlteredFile(data)
  return data
}
