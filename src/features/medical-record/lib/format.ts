const dateFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
})

const dateTimeFormatter = new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return dateFormatter.format(date)
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return dateTimeFormatter.format(date)
}

export function formatSex(sex: "F" | "M" | "X"): string {
  switch (sex) {
    case "F":
      return "Femenino"
    case "M":
      return "Masculino"
    default:
      return "No especificado"
  }
}
