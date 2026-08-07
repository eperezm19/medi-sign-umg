import {
  DEMO_FILE_CONTENT,
  DEMO_FILE_NAME,
} from "@/shared/constants/crypto-demo"
import { fileToMedicalFileData } from "@/shared/lib/file-utils"
import type { MedicalFileData } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchMedicalFile(): Promise<MedicalFileData | null> {
  return useMedicalFileStore.getState().originalFile
}

export async function uploadMedicalFile(file: File): Promise<MedicalFileData> {
  const data = await fileToMedicalFileData(file)
  useMedicalFileStore.getState().setUploadedFile(data)
  return data
}

export async function uploadDemoMedicalFile(): Promise<MedicalFileData> {
  const file = new File([DEMO_FILE_CONTENT], DEMO_FILE_NAME, {
    type: "text/plain",
  })
  return uploadMedicalFile(file)
}
