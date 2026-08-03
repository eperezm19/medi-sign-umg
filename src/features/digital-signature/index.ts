export type { DigitalSignature } from "./types"
export { DEMO_SIGNATURE_ID, mockDigitalSignature } from "./mocks"
export { fetchDigitalSignature, signMedicalRecord } from "./api"
export {
  useDigitalSignatureQuery,
  useSignRecordMutation,
} from "./hooks"
export {
  buildDigitalSignature,
  buildFictitiousSha256,
  buildFictitiousSignatureBase64,
  buildSignedRecord,
} from "./lib/build-signature"
export { SignRecordPanel } from "./components/sign-record-panel"
