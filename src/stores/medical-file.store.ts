import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  SIMULATED_ALTERED_HASH,
  SIMULATED_ORIGINAL_HASH,
  SIMULATED_PRIVATE_KEY,
  SIMULATED_PUBLIC_KEY,
  SIMULATED_SIGNATURE,
} from "@/shared/constants/crypto-demo"
import { toSignatureFileName } from "@/shared/lib/file-utils"
import type {
  FileProcessStatus,
  MedicalFileData,
  SimulatedKeyPair,
  VerificationOutcome,
} from "@/shared/types/medical-file"

type MedicalFileState = {
  originalFile: MedicalFileData | null
  keyPair: SimulatedKeyPair | null
  originalHash: string | null
  currentHash: string | null
  signature: string | null
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
  setKeyPair: () => SimulatedKeyPair
  applySignature: () => {
    signature: string
    signatureFileName: string
    originalHash: string
  }
  applyOriginalVerification: () => VerificationOutcome
  setAlteredFile: (file: MedicalFileData) => void
  applyAlteredVerification: () => VerificationOutcome
  resetPractice: () => void
}

export type MedicalFileStore = MedicalFileState & MedicalFileActions

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

export const useMedicalFileStore = create<MedicalFileStore>()(
  persist(
    (set, get) => ({
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

      setKeyPair: () => {
        const keyPair: SimulatedKeyPair = {
          publicKey: SIMULATED_PUBLIC_KEY,
          privateKey: SIMULATED_PRIVATE_KEY,
          algorithm: "RSA",
          bits: 2048,
          generatedAt: new Date().toISOString(),
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

      applySignature: () => {
        const { originalFile, keyPair } = get()
        if (!originalFile || !keyPair) {
          throw new Error("Se requiere archivo y llaves para firmar.")
        }

        const signatureFileName = toSignatureFileName(originalFile.name)
        const signedAt = new Date().toISOString()

        set({
          signature: SIMULATED_SIGNATURE,
          signatureFileName,
          originalHash: SIMULATED_ORIGINAL_HASH,
          currentHash: SIMULATED_ORIGINAL_HASH,
          signedAt,
          status: "SIGNED",
          originalVerification: null,
          alteredFile: null,
          alteredVerification: null,
          verifiedAt: null,
          isAltered: false,
        })

        return {
          signature: SIMULATED_SIGNATURE,
          signatureFileName,
          originalHash: SIMULATED_ORIGINAL_HASH,
        }
      },

      applyOriginalVerification: () => {
        const { originalFile, signature, originalHash } = get()
        if (!originalFile || !signature || !originalHash) {
          throw new Error("No hay un archivo firmado para verificar.")
        }

        const verifiedAt = new Date().toISOString()
        const outcome: VerificationOutcome = {
          valid: true,
          technicalResult: "Verified OK",
          message:
            "El archivo conserva el mismo contenido que tenía al momento de ser firmado.",
          originalHash,
          currentHash: originalHash,
          hashesMatch: true,
          isAltered: false,
          verifiedAt,
        }

        set({
          currentHash: originalHash,
          originalVerification: outcome,
          verifiedAt,
          status: "VERIFIED",
          isAltered: false,
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

      applyAlteredVerification: () => {
        const { originalFile, alteredFile, signature, originalHash } = get()
        if (!originalFile || !alteredFile || !signature || !originalHash) {
          throw new Error(
            "Se requiere archivo original firmado y archivo modificado."
          )
        }

        const contentChanged = alteredFile.content !== originalFile.content
        const verifiedAt = new Date().toISOString()

        if (!contentChanged) {
          const outcome: VerificationOutcome = {
            valid: true,
            technicalResult: "Verified OK",
            message:
              "El archivo cargado coincide con el contenido firmado. La firma sigue siendo válida.",
            originalHash,
            currentHash: originalHash,
            hashesMatch: true,
            isAltered: false,
            verifiedAt,
          }

          set({
            currentHash: originalHash,
            alteredVerification: outcome,
            verifiedAt,
            status: "VERIFIED",
            isAltered: false,
          })

          return outcome
        }

        const outcome: VerificationOutcome = {
          valid: false,
          technicalResult: "Verification Failure",
          message:
            "El archivo fue modificado después de haber sido firmado. La firma original ya no corresponde con el contenido actual.",
          originalHash,
          currentHash: SIMULATED_ALTERED_HASH,
          hashesMatch: false,
          isAltered: true,
          verifiedAt,
        }

        set({
          currentHash: SIMULATED_ALTERED_HASH,
          alteredVerification: outcome,
          verifiedAt,
          status: "INVALID",
          isAltered: true,
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
    }
  )
)
