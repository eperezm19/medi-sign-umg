export function downloadBlob(
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "")
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error("No se pudo leer el archivo."))
    }
    reader.readAsText(file)
  })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

export function getExtension(filename: string): string {
  const parts = filename.split(".")
  return parts.length > 1 ? `.${parts.at(-1)}` : ""
}

export function toSignatureFileName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "") || filename
  return `${base}.sig`
}
