export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const QUERY_DELAY_MS = 600
export const LIGHT_MUTATION_DELAY_MS = 600
export const HEAVY_MUTATION_DELAY_MS = 1500
