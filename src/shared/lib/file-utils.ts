import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
} from "@/shared/constants/openssl"
import type { MedicalFileData } from "@/shared/types/medical-file"

export function downloadBlob(
  filename: string,
  content: string | Blob | Uint8Array,
  mimeType = "text/plain;charset=utf-8"
): void {
  const blob =
    content instanceof Blob
      ? content
      : content instanceof Uint8Array
        ? new Blob([toArrayBuffer(content)], { type: mimeType })
        : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "")
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error("No se pudo leer el archivo."))
    }
    reader.readAsText(file)
  })
}

export async function readFileAsBytes(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer()
  return new Uint8Array(buffer)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

export function getExtension(filename: string): string {
  const parts = filename.split(".")
  return parts.length > 1 ? `.${parts.at(-1)}` : ""
}

export function toSignatureFileName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "") || filename
  return `${base}.sig`
}

export function isAllowedExtension(filename: string): boolean {
  const extension = getExtension(filename).toLowerCase()
  return ALLOWED_EXTENSIONS.includes(
    extension as (typeof ALLOWED_EXTENSIONS)[number]
  )
}

export function assertClientFileConstraints(file: File): void {
  if (file.size <= 0) {
    throw new Error("El archivo está vacío.")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `El archivo supera el tamaño máximo de ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`
    )
  }
  if (!isAllowedExtension(file.name)) {
    throw new Error(
      `Extensión no permitida. Use: ${ALLOWED_EXTENSIONS.join(", ")}`
    )
  }
}

export function isTextLikeFile(filename: string): boolean {
  const extension = getExtension(filename).toLowerCase()
  return extension === ".txt" || extension === ".json"
}

export async function fileToMedicalFileData(file: File): Promise<MedicalFileData> {
  assertClientFileConstraints(file)
  const bytes = await readFileAsBytes(file)
  const content = isTextLikeFile(file.name)
    ? new TextDecoder().decode(bytes)
    : `[Archivo binario: ${file.name}]`

  return {
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    content,
    bytes,
    uploadedAt: new Date().toISOString(),
  }
}

export function medicalFileToBrowserFile(data: MedicalFileData): File {
  return new File([toArrayBuffer(data.bytes)], data.name, {
    type: data.mimeType || "application/octet-stream",
  })
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary)
}

export function signatureToBlob(bytes: Uint8Array): Blob {
  return new Blob([toArrayBuffer(bytes)], { type: "application/octet-stream" })
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}
