export type { MedicalRecord, MedicalRecordStatus } from "./types"
export {
  ALTERED_CONTENT_HASH,
  ORIGINAL_CONTENT_HASH,
  ORIGINAL_RECORD_ID,
  mockAlteredRecord,
  mockOriginalRecord,
  mockSignedRecord,
} from "./mocks"
export { createMedicalRecord, fetchMedicalRecord } from "./api"
export {
  useCreateMedicalRecordMutation,
  useMedicalRecordQuery,
} from "./hooks"
