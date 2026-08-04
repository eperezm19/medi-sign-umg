import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { MedicalRecord } from "@/features/medical-record"
import type { KeyPair } from "@/features/key-generation"
import type { DigitalSignature } from "@/features/digital-signature"
import {
  buildDigitalSignature,
  buildFictitiousSha256,
  buildSignedRecord,
} from "@/features/digital-signature/lib/build-signature"
import type { VerificationResult } from "@/features/signature-verification"
import {
  buildInvalidVerificationResult,
  buildValidVerificationResult,
} from "@/features/signature-verification/lib/build-verification"
import type { ModifiedField } from "@/features/document-alteration"
import type { AlterationFormValues } from "@/features/document-alteration/schema"
import {
  buildAlteredRecord,
  detectModifiedFields,
} from "@/features/document-alteration/lib/build-alteration"
import { demoScenario } from "@/shared/data/demo-scenario"

export type FlowStep =
  | "home"
  | "expediente"
  | "firma-digital"
  | "verificacion"
  | "alteracion"
  | "comparacion"

type MediSignState = {
  currentRecord: MedicalRecord | null
  signedOriginalRecord: MedicalRecord | null
  keyPair: KeyPair | null
  originalHash: string | null
  currentHash: string | null
  signature: DigitalSignature | null
  verificationResult: VerificationResult | null
  modifiedFields: ModifiedField[]
  flowStep: FlowStep
}

type MediSignActions = {
  setCurrentRecord: (record: MedicalRecord | null) => void
  setSignedOriginalRecord: (record: MedicalRecord | null) => void
  setKeyPair: (keyPair: KeyPair | null) => void
  setOriginalHash: (hash: string | null) => void
  setCurrentHash: (hash: string | null) => void
  setSignature: (signature: DigitalSignature | null) => void
  setVerificationResult: (result: VerificationResult | null) => void
  setModifiedFields: (fields: ModifiedField[]) => void
  setFlowStep: (step: FlowStep) => void
  loadUnsignedRecord: () => void
  createUnsignedRecord: (record: MedicalRecord) => void
  signCurrentRecord: () => {
    record: MedicalRecord
    signature: DigitalSignature
  }
  verifyCurrentSignature: () => VerificationResult
  verifyAlteredCurrentDocument: () => VerificationResult
  alterCurrentRecord: (values: AlterationFormValues) => {
    record: MedicalRecord
    modifiedFields: ModifiedField[]
  }
  applySignedState: () => void
  applyAlteredState: () => void
  resetDemo: () => void
}

export type MediSignStore = MediSignState & MediSignActions

const initialState = (): MediSignState => {
  const original = demoScenario.originalRecord

  return {
    currentRecord: original,
    signedOriginalRecord: null,
    keyPair: null,
    originalHash: null,
    currentHash: original.contentHash,
    signature: null,
    verificationResult: null,
    modifiedFields: [],
    flowStep: "expediente",
  }
}

export const useMediSignStore = create<MediSignStore>()(
  persist(
    (set, get) => ({
      ...initialState(),

      setCurrentRecord: (currentRecord) => set({ currentRecord }),
      setSignedOriginalRecord: (signedOriginalRecord) =>
        set({ signedOriginalRecord }),
      setKeyPair: (keyPair) => set({ keyPair }),
      setOriginalHash: (originalHash) => set({ originalHash }),
      setCurrentHash: (currentHash) => set({ currentHash }),
      setSignature: (signature) => set({ signature }),
      setVerificationResult: (verificationResult) =>
        set({ verificationResult }),
      setModifiedFields: (modifiedFields) => set({ modifiedFields }),
      setFlowStep: (flowStep) => set({ flowStep }),

      loadUnsignedRecord: () => {
        const original = demoScenario.originalRecord
        set({
          currentRecord: original,
          signedOriginalRecord: null,
          keyPair: null,
          originalHash: null,
          currentHash: original.contentHash,
          signature: null,
          verificationResult: null,
          modifiedFields: [],
          flowStep: "expediente",
        })
      },

      createUnsignedRecord: (record) => {
        set({
          currentRecord: { ...record, status: "unsigned" },
          signedOriginalRecord: null,
          keyPair: null,
          originalHash: null,
          currentHash: record.contentHash,
          signature: null,
          verificationResult: null,
          modifiedFields: [],
          flowStep: "expediente",
        })
      },

      signCurrentRecord: () => {
        const { currentRecord, keyPair } = get()

        if (!currentRecord) {
          throw new Error("No hay un expediente para firmar.")
        }

        if (!keyPair) {
          throw new Error("Debes generar las llaves antes de firmar.")
        }

        const signedAt = new Date().toISOString()
        const contentHash = buildFictitiousSha256(currentRecord)
        const signedRecord = buildSignedRecord(
          currentRecord,
          contentHash,
          signedAt
        )
        const signature = buildDigitalSignature({
          record: signedRecord,
          keyPair,
          contentHash,
          signedAt,
        })
        const signedOriginalRecord = structuredClone(signedRecord)

        set({
          currentRecord: signedRecord,
          signedOriginalRecord,
          originalHash: contentHash,
          currentHash: contentHash,
          signature,
          verificationResult: null,
          modifiedFields: [],
          flowStep: "firma-digital",
        })

        return { record: signedRecord, signature }
      },

      verifyCurrentSignature: () => {
        const {
          currentRecord,
          signature,
          originalHash,
          currentHash,
        } = get()

        if (!currentRecord) {
          throw new Error("No hay un expediente para verificar.")
        }

        if (!signature) {
          throw new Error("Firma el expediente primero.")
        }

        if (!originalHash || !currentHash) {
          throw new Error("No hay hashes disponibles para verificar.")
        }

        if (
          currentRecord.status === "altered" ||
          currentRecord.status === "verification_failed" ||
          originalHash !== currentHash
        ) {
          throw new Error(
            "El documento fue modificado; usa la verificación de alteración."
          )
        }

        if (
          currentRecord.status !== "signed" &&
          currentRecord.status !== "verified"
        ) {
          throw new Error("El expediente debe estar firmado para verificarse.")
        }

        const result = buildValidVerificationResult({
          record: currentRecord,
          signature,
          originalHash,
          currentHash,
        })

        set({
          verificationResult: result,
          currentRecord: { ...currentRecord, status: "verified" },
          flowStep: "verificacion",
        })

        return result
      },

      verifyAlteredCurrentDocument: () => {
        const {
          currentRecord,
          signature,
          originalHash,
          currentHash,
          modifiedFields,
        } = get()

        if (!currentRecord) {
          throw new Error("No hay un expediente para verificar.")
        }

        if (!signature) {
          throw new Error("No hay una firma digital asociada al expediente.")
        }

        if (!originalHash || !currentHash) {
          throw new Error("No hay hashes disponibles para verificar.")
        }

        const isAltered =
          currentRecord.status === "altered" ||
          currentRecord.status === "verification_failed" ||
          originalHash !== currentHash

        if (!isAltered) {
          throw new Error(
            "El documento no está alterado; usa la verificación de firma válida."
          )
        }

        const result = buildInvalidVerificationResult({
          record: currentRecord,
          signature,
          originalHash,
          currentHash,
          modifiedFields,
        })

        set({
          verificationResult: result,
          currentRecord: {
            ...currentRecord,
            status: "verification_failed",
          },
          flowStep: "verificacion",
        })

        return result
      },

      alterCurrentRecord: (values) => {
        const { currentRecord, signature, signedOriginalRecord, originalHash } =
          get()

        if (!currentRecord) {
          throw new Error("No hay un expediente para alterar.")
        }

        if (!signature) {
          throw new Error("Debes firmar el expediente antes de alterarlo.")
        }

        const original = signedOriginalRecord ?? currentRecord

        if (
          currentRecord.status !== "signed" &&
          currentRecord.status !== "verified" &&
          currentRecord.status !== "altered"
        ) {
          throw new Error(
            "El expediente debe estar firmado o verificado para alterarlo."
          )
        }

        const modifiedFields = detectModifiedFields(original, values)

        if (modifiedFields.length === 0) {
          throw new Error("No hay cambios respecto al documento original firmado.")
        }

        const altered = buildAlteredRecord(currentRecord, values)

        if (originalHash && altered.contentHash === originalHash) {
          throw new Error(
            "El hash actual no cambió; ajusta el contenido antes de continuar."
          )
        }

        set({
          currentRecord: altered,
          currentHash: altered.contentHash,
          modifiedFields,
          verificationResult: null,
          flowStep: "alteracion",
        })

        return { record: altered, modifiedFields }
      },

      applySignedState: () => {
        const { signedRecord, keyPair, signature } = demoScenario
        set({
          currentRecord: signedRecord,
          signedOriginalRecord: structuredClone(signedRecord),
          keyPair,
          originalHash: signedRecord.contentHash,
          currentHash: signedRecord.contentHash,
          signature,
          verificationResult: null,
          modifiedFields: [],
          flowStep: "firma-digital",
        })
      },

      applyAlteredState: () => {
        const { alteredRecord, modifiedFields, signature, keyPair, signedRecord } =
          demoScenario
        set({
          currentRecord: alteredRecord,
          signedOriginalRecord: signedRecord,
          keyPair,
          originalHash: signedRecord.contentHash,
          currentHash: alteredRecord.contentHash,
          signature,
          verificationResult: null,
          modifiedFields,
          flowStep: "alteracion",
        })
      },

      resetDemo: () => set(initialState()),
    }),
    {
      name: "medi-sign-umg",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
