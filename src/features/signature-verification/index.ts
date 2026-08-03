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
