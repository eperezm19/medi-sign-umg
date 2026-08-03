import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { MedicalRecord } from "@/features/medical-record"
import type { KeyPair } from "@/features/key-generation"
import type { DigitalSignature } from "@/features/digital-signature"
import type { VerificationResult } from "@/features/signature-verification"
import type { ModifiedField } from "@/features/document-alteration"
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
    (set) => ({
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

      applySignedState: () => {
        const { signedRecord, keyPair, signature } = demoScenario
        set({
          currentRecord: signedRecord,
          signedOriginalRecord: signedRecord,
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
