export const DEMO_FILE_NAME = "historia-clinica-demo.txt"

export const DEMO_FILE_CONTENT = `HISTORIA CLÍNICA FICTICIA

Paciente: María López García
Expediente: EXP-2026-001
Diagnóstico: Infección respiratoria superior
Tratamiento: Administrar medicamento cada ocho horas durante cinco días
Médico: Dr. Carlos Pérez Morales
Colegiado: 12345

Documento creado únicamente para fines académicos.
`

export const SIMULATED_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MEDISIGN_PUBLIC_KEY_DEMO_2026
-----END PUBLIC KEY-----`

export const SIMULATED_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC
MEDISIGN_PRIVATE_KEY_DEMO_2026
-----END PRIVATE KEY-----`

export const SIMULATED_ORIGINAL_HASH =
  "a3f85b7c9d12e4f6703aa1c2567890ab45c18d9e632ffa71b08c4d9532a617bc"

export const SIMULATED_ALTERED_HASH =
  "f98d12a4b56c789e01d23f4567a89bc0d12e34f567a89bc01d23e45f6789a0bc"

export const SIMULATED_SIGNATURE =
  "X7pQm9K2sL4vN8fR3dT6yU1aB5cE7gH9jM2nP4qS6tV8wX0zA3cD5fG7hJ9kL1mN"

export const FILE_UPLOAD_DELAY_MS = 600
export const KEY_GENERATION_DELAY_MS = 1500
export const FILE_SIGNING_DELAY_MS = 1800
export const DOWNLOAD_PREPARE_DELAY_MS = 500
export const VERIFY_ORIGINAL_DELAY_MS = 1500
export const ALTERED_UPLOAD_DELAY_MS = 600
export const VERIFY_ALTERED_DELAY_MS = 1500
