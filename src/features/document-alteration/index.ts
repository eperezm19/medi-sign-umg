export type { ModifiedField } from "./types"
export type { AlterationFormValues } from "./schema"
export { alterationSchema } from "./schema"
export { mockModifiedFields } from "./mocks"
export { alterDocument } from "./api"
export { useAlterDocumentMutation } from "./hooks"
export {
  buildAlteredRecord,
  detectModifiedFields,
  recordToAlterationValues,
} from "./lib/build-alteration"
export { DocumentAlterationPanel } from "./components/document-alteration-panel"
export { AlteracionView } from "./components/alteracion-view"
