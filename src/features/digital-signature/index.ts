export type { DigitalSignature } from "./types"
export { DEMO_SIGNATURE_ID, mockDigitalSignature } from "./mocks"
export { fetchDigitalSignature, signMedicalRecord } from "./api"
export {
  useDigitalSignatureQuery,
  useSignRecordMutation,
} from "./hooks"
