import { postOpenSSLJson } from "@/shared/api/openssl-client"
import type { GenerateKeysData } from "@/shared/types/openssl"
import type { KeyPairData } from "@/shared/types/medical-file"
import { useMedicalFileStore } from "@/stores/medical-file.store"

export async function fetchKeyPair(): Promise<KeyPairData | null> {
  return useMedicalFileStore.getState().keyPair
}

export async function generateKeyPair(): Promise<KeyPairData> {
  const data = await postOpenSSLJson<GenerateKeysData>("/api/openssl/keys")
  return useMedicalFileStore.getState().setKeyPair(data)
}
