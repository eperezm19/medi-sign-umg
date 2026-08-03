export type { MedicalRecord, MedicalRecordStatus } from "./types"
export type { MedicalRecordFormValues } from "./schema"
export { medicalRecordSchema } from "./schema"
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
export {
  buildUnsignedRecord,
  getExampleFormValues,
  recordToFormValues,
  toDatetimeLocalValue,
} from "./lib/build-record"
export {
  getStatusConfig,
  medicalRecordStatusConfig,
} from "./lib/status-config"
export { formatDate, formatDateTime, formatSex } from "./lib/format"
export { MedicalRecordForm } from "./components/medical-record-form"
export { MedicalRecordPreview } from "./components/medical-record-preview"
export { MedicalRecordStatusBadge } from "./components/medical-record-status-badge"
export { ExpedienteView } from "./components/expediente-view"
