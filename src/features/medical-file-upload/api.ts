import {
  DEMO_FILE_CONTENT,
  DEMO_FILE_NAME,
  FILE_UPLOAD_DELAY_MS,
} from "@/shared/constants/crypto-demo"
import { delay } from "@/shared/lib/delay"
import { readFileAsText } from "@/shared/lib/file-utils"
import type { MedicalFileData } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchMedicalFile(): Promise<MedicalFileData | null> {
  await delay(FILE_UPLOAD_DELAY_MS)
  return useMedicalFileStore.getState().originalFile
}

export async function uploadMedicalFile(file: File): Promise<MedicalFileData> {
  await delay(FILE_UPLOAD_DELAY_MS)
  const content = await readFileAsText(file)
  const data: MedicalFileData = {
    name: file.name,
    mimeType: file.type || "text/plain",
    size: file.size,
    content,
    uploadedAt: new Date().toISOString(),
  }
  useMedicalFileStore.getState().setUploadedFile(data)
  return data
}

export async function uploadDemoMedicalFile(): Promise<MedicalFileData> {
  await delay(FILE_UPLOAD_DELAY_MS)
  const content = DEMO_FILE_CONTENT
  const data: MedicalFileData = {
    name: DEMO_FILE_NAME,
    mimeType: "text/plain",
    size: new Blob([content]).size,
    content,
    uploadedAt: new Date().toISOString(),
  }
  useMedicalFileStore.getState().setUploadedFile(data)
  return data
}
