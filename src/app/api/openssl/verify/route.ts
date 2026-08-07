import {
  assertAllowedMedicalFile,
  handleRouteError,
  jsonSuccess,
  readFileBuffer,
  requireFormFile,
  requirePemText,
  ValidationError,
} from "@/server/openssl/http"
import { verifyFile } from "@/server/openssl/verify-file"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const document = requireFormFile(formData, "file", "el archivo a verificar")
    assertAllowedMedicalFile(document)

    const signatureFile = requireFormFile(
      formData,
      "signature",
      "la firma (.sig)"
    )
    const publicKeyPem = await requirePemText(
      formData,
      "publicKey",
      "la llave pública (.pem)"
    )

    if (!publicKeyPem.includes("PUBLIC KEY")) {
      throw new ValidationError("La llave pública PEM no es válida.")
    }

    const fileBuffer = await readFileBuffer(document)
    const signatureBuffer = await readFileBuffer(signatureFile)

    const data = await verifyFile({
      fileBuffer,
      signatureBuffer,
      publicKeyPem,
      originalFileName: document.name,
    })

    return jsonSuccess(data)
  } catch (error) {
    return handleRouteError(error)
  }
}
