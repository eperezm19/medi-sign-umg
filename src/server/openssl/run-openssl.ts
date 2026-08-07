import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

export type OpenSSLResult = {
  stdout: string
  stderr: string
  exitCode: number
}

export class OpenSSLError extends Error {
  constructor(
    message: string,
    readonly details?: { stdout?: string; stderr?: string; exitCode?: number }
  ) {
    super(message)
    this.name = "OpenSSLError"
  }
}

const OPENSSL_MISSING_MESSAGE =
  "OpenSSL no se encuentra disponible en el servidor."

export async function runOpenSSL(
  args: string[],
  options?: { cwd?: string; allowNonZeroExit?: boolean }
): Promise<OpenSSLResult> {
  try {
    const { stdout, stderr } = await execFileAsync("openssl", args, {
      cwd: options?.cwd,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    })

    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: 0,
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      stdout?: string
      stderr?: string
      code?: string | number
      status?: number
    }

    if (err.code === "ENOENT") {
      throw new OpenSSLError(OPENSSL_MISSING_MESSAGE)
    }

    const exitCode =
      typeof err.status === "number"
        ? err.status
        : typeof err.code === "number"
          ? err.code
          : 1

    const result: OpenSSLResult = {
      stdout: (err.stdout ?? "").toString().trim(),
      stderr: (err.stderr ?? err.message ?? "").toString().trim(),
      exitCode,
    }

    if (options?.allowNonZeroExit) {
      return result
    }

    throw new OpenSSLError(
      `OpenSSL falló al ejecutar: openssl ${args.join(" ")}`,
      result
    )
  }
}

export async function checkOpenSSLAvailability(): Promise<string> {
  try {
    const result = await runOpenSSL(["version"])
    const version = result.stdout || result.stderr
    if (!version) {
      throw new OpenSSLError(OPENSSL_MISSING_MESSAGE)
    }
    return version
  } catch (error) {
    if (error instanceof OpenSSLError) {
      throw error
    }
    throw new OpenSSLError(OPENSSL_MISSING_MESSAGE)
  }
}
