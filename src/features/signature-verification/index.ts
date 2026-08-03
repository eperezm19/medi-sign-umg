export type { VerificationResult } from "./types"
export {
  mockVerificationFailure,
  mockVerificationSuccess,
} from "./mocks"
export {
  fetchVerificationResult,
  verifyAlteredDocument,
  verifySignature,
} from "./api"
export {
  useVerificationQuery,
  useVerifyAlteredDocumentMutation,
  useVerifySignatureMutation,
} from "./hooks"
export {
  VERIFICATION_OK,
  buildValidVerificationResult,
} from "./lib/build-verification"
export { ValidVerificationPanel } from "./components/valid-verification-panel"
export { VerificacionView } from "./components/verificacion-view"
