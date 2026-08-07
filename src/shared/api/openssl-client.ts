import type { ApiResponse } from "@/shared/types/openssl"

export class OpenSSLApiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message)
    this.name = "OpenSSLApiError"
  }
}

export async function parseOpenSSLResponse<T>(
  response: Response
): Promise<T> {
  let payload: ApiResponse<T> | null = null

  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    throw new OpenSSLApiError(
      "La respuesta del servidor no es válida.",
      response.status
    )
  }

  if (!payload.success) {
    throw new OpenSSLApiError(
      payload.error || "Error en la operación OpenSSL.",
      response.status
    )
  }

  if (!response.ok) {
    throw new OpenSSLApiError(
      "Error en la operación OpenSSL.",
      response.status
    )
  }

  return payload.data
}

export async function postOpenSSLJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: "POST" })
  return parseOpenSSLResponse<T>(response)
}

export async function postOpenSSLFormData<T>(
  url: string,
  formData: FormData
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })
  return parseOpenSSLResponse<T>(response)
}
