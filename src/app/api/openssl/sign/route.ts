import {
  assertAllowedMedicalFile,
  handleRouteError,
  jsonSuccess,
  readFileBuffer,
  requireFormFile,
  requirePemText,
  ValidationError,
} from "@/server/openssl/http"
import { signFile } from "@/server/openssl/sign-file"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const document = requireFormFile(formData, "file", "el archivo médico")
    assertAllowedMedicalFile(document)

    const privateKeyPem = await requirePemText(
      formData,
      "privateKey",
      "la llave privada (.pem)"
    )

    if (!privateKeyPem.includes("PRIVATE KEY")) {
      throw new ValidationError("La llave privada PEM no es válida.")
    }

    const fileBuffer = await readFileBuffer(document)
    const data = await signFile({
      fileBuffer,
      privateKeyPem,
      originalFileName: document.name,
    })

    return jsonSuccess(data)
  } catch (error) {
    return handleRouteError(error)
  }
}
