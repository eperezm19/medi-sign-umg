import { generateKeyPair } from "@/server/openssl/generate-key-pair"
import {
  handleRouteError,
  jsonSuccess,
} from "@/server/openssl/http"

export const runtime = "nodejs"

export async function POST() {
  try {
    const data = await generateKeyPair()
    return jsonSuccess(data)
  } catch (error) {
    return handleRouteError(error)
  }
}
