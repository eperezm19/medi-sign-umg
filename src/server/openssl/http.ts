import { extname } from "node:path"

import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
} from "@/shared/constants/openssl"
import type { ApiFailure, ApiSuccess } from "@/shared/types/openssl"
import { OpenSSLError } from "@/server/openssl/run-openssl"

export function jsonSuccess<T>(data: T, status = 200): Response {
  const body: ApiSuccess<T> = { success: true, data }
  return Response.json(body, { status })
}

export function jsonError(error: string, status: number): Response {
  const body: ApiFailure = { success: false, error }
  return Response.json(body, { status })
}

export function handleRouteError(error: unknown): Response {
  if (error instanceof OpenSSLError) {
    const isMissing = error.message.includes("no se encuentra disponible")
    return jsonError(error.message, isMissing ? 503 : 500)
  }

  if (error instanceof ValidationError) {
    return jsonError(error.message, 400)
  }

  console.error(error)
  return jsonError("Error interno del servidor.", 500)
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export function getExtensionLower(filename: string): string {
  return extname(filename).toLowerCase()
}

export function assertAllowedMedicalFile(file: File): void {
  if (!file || file.size <= 0) {
    throw new ValidationError("Debe enviar un archivo válido.")
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ValidationError(
      `El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB).`
    )
  }

  const extension = getExtensionLower(file.name)
  if (
    !ALLOWED_EXTENSIONS.includes(
      extension as (typeof ALLOWED_EXTENSIONS)[number]
    )
  ) {
    throw new ValidationError(
      `Extensión no permitida. Use: ${ALLOWED_EXTENSIONS.join(", ")}`
    )
  }
}

export async function readFileBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export function requireFormFile(
  formData: FormData,
  field: string,
  label: string
): File {
  const value = formData.get(field)
  if (!(value instanceof File) || value.size <= 0) {
    throw new ValidationError(`Debe enviar ${label}.`)
  }
  return value
}

export async function requirePemText(
  formData: FormData,
  field: string,
  label: string
): Promise<string> {
  const value = formData.get(field)

  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  if (value instanceof File && value.size > 0) {
    const text = (await value.text()).trim()
    if (!text) {
      throw new ValidationError(`El archivo de ${label} está vacío.`)
    }
    return text
  }

  throw new ValidationError(`Debe enviar ${label}.`)
}
