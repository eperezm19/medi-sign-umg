import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type {
  FileProcessStatus,
  KeyPairData,
  MedicalFileData,
  VerificationOutcome,
} from "@/shared/types/medical-file"
import type {
  GenerateKeysData,
  SignFileData,
  VerifyFileData,
} from "@/shared/types/openssl"
import { base64ToUint8Array } from "@/shared/lib/file-utils"

type MedicalFileState = {
  originalFile: MedicalFileData | null
  keyPair: KeyPairData | null
  originalHash: string | null
  currentHash: string | null
  signature: Uint8Array | null
  signatureFileName: string | null
  signedAt: string | null
  originalVerification: VerificationOutcome | null
  alteredFile: MedicalFileData | null
  alteredVerification: VerificationOutcome | null
  verifiedAt: string | null
  status: FileProcessStatus
  isAltered: boolean
}

type MedicalFileActions = {
  setUploadedFile: (file: MedicalFileData) => void
  setKeyPair: (data: GenerateKeysData) => KeyPairData
  applySignature: (data: SignFileData) => {
    signature: Uint8Array
    signatureFileName: string
    originalHash: string
  }
  applyOriginalVerification: (
    data: VerifyFileData,
    originalHash: string
  ) => VerificationOutcome
  setAlteredFile: (file: MedicalFileData) => void
  applyAlteredVerification: (
    data: VerifyFileData,
    originalHash: string
  ) => VerificationOutcome
  resetPractice: () => void
}

export type MedicalFileStore = MedicalFileState & MedicalFileActions

type PersistedMedicalFileState = {
  originalFile: Omit<MedicalFileData, "bytes" | "content"> & {
    content: string
  } | null
  alteredFile: Omit<MedicalFileData, "bytes" | "content"> & {
    content: string
  } | null
  keyPair: Omit<KeyPairData, "privateKey"> & { privateKey: "" } | null
  originalHash: string | null
  currentHash: string | null
  signatureFileName: string | null
  signedAt: string | null
  originalVerification: VerificationOutcome | null
  alteredVerification: VerificationOutcome | null
  verifiedAt: string | null
  status: FileProcessStatus
  isAltered: boolean
}

const initialState = (): MedicalFileState => ({
  originalFile: null,
  keyPair: null,
  originalHash: null,
  currentHash: null,
  signature: null,
  signatureFileName: null,
  signedAt: null,
  originalVerification: null,
  alteredFile: null,
  alteredVerification: null,
  verifiedAt: null,
  status: "EMPTY",
  isAltered: false,
})

function toOutcome(
  data: VerifyFileData,
  originalHash: string
): VerificationOutcome {
  const hashesMatch = data.currentHash === originalHash
  return {
    valid: data.valid,
    technicalResult: data.technicalResult,
    message: data.valid
      ? "El archivo conserva el mismo contenido que tenía al momento de ser firmado."
      : "El archivo fue modificado después de haber sido firmado. La firma original ya no corresponde con el contenido actual.",
    originalHash,
    currentHash: data.currentHash,
    hashesMatch,
    isAltered: !data.valid,
    integrity: data.integrity,
    verifiedAt: data.verifiedAt,
  }
}

function stripFileForPersist(
  file: MedicalFileData | null
): PersistedMedicalFileState["originalFile"] {
  if (!file) return null
  return {
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    content: "",
    uploadedAt: file.uploadedAt,
  }
}

export const useMedicalFileStore = create<MedicalFileStore>()(
  persist(
    (set) => ({
      ...initialState(),

      setUploadedFile: (file) => {
        set({
          originalFile: file,
          keyPair: null,
          originalHash: null,
          currentHash: null,
          signature: null,
          signatureFileName: null,
          signedAt: null,
          originalVerification: null,
          alteredFile: null,
          alteredVerification: null,
          verifiedAt: null,
          status: "UPLOADED",
          isAltered: false,
        })
      },

      setKeyPair: (data) => {
        const keyPair: KeyPairData = {
          publicKey: data.publicKeyPem,
          privateKey: data.privateKeyPem,
          algorithm: data.algorithm,
          bits: data.bits,
          generatedAt: data.generatedAt,
          opensslVersion: data.opensslVersion,
        }

        set({
          keyPair,
          status: "KEYS_GENERATED",
          signature: null,
          signatureFileName: null,
          originalHash: null,
          currentHash: null,
          signedAt: null,
          originalVerification: null,
          alteredFile: null,
          alteredVerification: null,
          verifiedAt: null,
          isAltered: false,
        })

        return keyPair
      },

      applySignature: (data) => {
        const signature = base64ToUint8Array(data.signatureBase64)

        set({
          signature,
          signatureFileName: data.signatureFileName,
          originalHash: data.hash,
          currentHash: data.hash,
          signedAt: data.signedAt,
          status: "SIGNED",
          originalVerification: null,
          alteredFile: null,
          alteredVerification: null,
          verifiedAt: null,
          isAltered: false,
        })

        return {
          signature,
          signatureFileName: data.signatureFileName,
          originalHash: data.hash,
        }
      },

      applyOriginalVerification: (data, originalHash) => {
        const outcome = toOutcome(data, originalHash)

        set({
          currentHash: data.currentHash,
          originalVerification: outcome,
          verifiedAt: data.verifiedAt,
          status: data.valid ? "VERIFIED" : "INVALID",
          isAltered: !data.valid,
        })

        return outcome
      },

      setAlteredFile: (file) => {
        set({
          alteredFile: file,
          alteredVerification: null,
          status: "ALTERED_FILE_UPLOADED",
          isAltered: false,
        })
      },

      applyAlteredVerification: (data, originalHash) => {
        const outcome = toOutcome(data, originalHash)

        set({
          currentHash: data.currentHash,
          alteredVerification: outcome,
          verifiedAt: data.verifiedAt,
          status: data.valid ? "VERIFIED" : "INVALID",
          isAltered: !data.valid,
        })

        return outcome
      },

      resetPractice: () => {
        set(initialState())
      },
    }),
    {
      name: "medisign-file-lab-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedMedicalFileState => ({
        originalFile: stripFileForPersist(state.originalFile),
        alteredFile: stripFileForPersist(state.alteredFile),
        keyPair: state.keyPair
          ? {
              publicKey: state.keyPair.publicKey,
              privateKey: "",
              algorithm: state.keyPair.algorithm,
              bits: state.keyPair.bits,
              generatedAt: state.keyPair.generatedAt,
              opensslVersion: state.keyPair.opensslVersion,
            }
          : null,
        originalHash: state.originalHash,
        currentHash: state.currentHash,
        signatureFileName: state.signatureFileName,
        signedAt: state.signedAt,
        originalVerification: state.originalVerification,
        alteredVerification: state.alteredVerification,
        verifiedAt: state.verifiedAt,
        status: state.status,
        isAltered: state.isAltered,
      }),
      merge: (persisted, current) => {
        const partial = (persisted ?? {}) as Partial<PersistedMedicalFileState>

        return {
          ...current,
          ...partial,
          // Sesión: bytes y secretos no se rehidratan desde localStorage.
          signature: null,
          originalFile: partial.originalFile
            ? {
                ...partial.originalFile,
                content: "",
                bytes: new Uint8Array(),
              }
            : null,
          alteredFile: partial.alteredFile
            ? {
                ...partial.alteredFile,
                content: "",
                bytes: new Uint8Array(),
              }
            : null,
          keyPair: partial.keyPair
            ? {
                ...partial.keyPair,
                privateKey: "",
              }
            : null,
        }
      },
    }
  )
)
