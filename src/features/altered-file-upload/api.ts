import { fileToMedicalFileData } from "@/shared/lib/file-utils"
import type { MedicalFileData } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchAlteredFile(): Promise<MedicalFileData | null> {
  return useMedicalFileStore.getState().alteredFile
}

export async function uploadAlteredFile(file: File): Promise<MedicalFileData> {
  const data = await fileToMedicalFileData(file)
  useMedicalFileStore.getState().setAlteredFile(data)
  return data
}
