import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

export type TempDirectory = {
  path: string
  join: (...segments: string[]) => string
  write: (filename: string, data: string | Buffer | Uint8Array) => Promise<string>
  read: (filename: string) => Promise<Buffer>
  readText: (filename: string) => Promise<string>
  cleanup: () => Promise<void>
}

export async function createTempDirectory(): Promise<TempDirectory> {
  const path = await mkdtemp(join(tmpdir(), "medisign-"))

  return {
    path,
    join: (...segments: string[]) => join(path, ...segments),
    async write(filename, data) {
      const filePath = join(path, filename)
      await writeFile(filePath, data)
      return filePath
    },
    async read(filename) {
      return readFile(join(path, filename))
    },
    async readText(filename) {
      return readFile(join(path, filename), "utf8")
    },
    async cleanup() {
      await rm(path, { recursive: true, force: true })
    },
  }
}

export async function withTempDirectory<T>(
  fn: (temp: TempDirectory) => Promise<T>
): Promise<T> {
  const temp = await createTempDirectory()
  try {
    return await fn(temp)
  } finally {
    await temp.cleanup()
  }
}
