import { Sandbox } from 'e2b'
import { codeExecContract } from './contracts'
import { ProviderConfigurationError, SandboxExecutionError } from './errors'
import { redact } from './security'
import type { Bindings, ExecutionResult } from './types'

export interface SandboxProvider {
  createSession(): Promise<string>
  writeFiles(sessionId: string, files: Array<{ path: string; content: string }>): Promise<void>
  execute(sessionId: string, command: string, timeoutSeconds: number): Promise<ExecutionResult>
  readFiles(sessionId: string, paths: string[]): Promise<Record<string, string>>
  getLogs(sessionId: string): Promise<{ stdout: string; stderr: string }>
  kill(sessionId: string): Promise<void>
  destroy(sessionId: string): Promise<void>
}

export class E2BSandboxProvider implements SandboxProvider {
  private readonly sessions = new Map<string, Sandbox>()
  private readonly logs = new Map<string, { stdout: string; stderr: string }>()
  private readonly apiKey: string
  constructor(env: Bindings) {
    this.apiKey = env.E2B_API_KEY || env.E2B_SANDBOX || ''
    if (!this.apiKey) throw new ProviderConfigurationError('E2B_API_KEY is not configured; production execution is disabled rather than faked')
  }
  async createSession(): Promise<string> {
    const sandbox = await Sandbox.create({ apiKey: this.apiKey, timeoutMs: 180_000 })
    this.sessions.set(sandbox.sandboxId, sandbox); return sandbox.sandboxId
  }
  private session(id: string): Sandbox { const sandbox = this.sessions.get(id); if (!sandbox) throw new SandboxExecutionError('Sandbox session is unavailable in this request checkpoint', false, 'SESSION_NOT_FOUND'); return sandbox }
  async writeFiles(sessionId: string, files: Array<{ path: string; content: string }>): Promise<void> { const sandbox = this.session(sessionId); for (const file of files) await sandbox.files.write(`/home/user/${file.path}`, file.content) }
  async execute(sessionId: string, command: string, timeoutSeconds: number): Promise<ExecutionResult> {
    const validated = codeExecContract.inputSchema.shape.command.parse(command); const started = Date.now()
    try {
      const result = await this.session(sessionId).commands.run(`cd /home/user && ${validated}`, { timeoutMs: Math.min(timeoutSeconds, codeExecContract.timeoutSeconds) * 1000 })
      const output = { stdout: redact(result.stdout), stderr: redact(result.stderr) }; this.logs.set(sessionId, output)
      return codeExecContract.outputSchema.parse({ sessionId, provider: 'e2b', command: validated, ...output, exitCode: result.exitCode, durationMs: Date.now() - started, timedOut: false })
    } catch (error) {
      const message = redact(error instanceof Error ? error.message : 'E2B execution failed')
      throw new SandboxExecutionError(message, /timeout|exit|command/i.test(message), /timeout/i.test(message) ? 'TIMEOUT' : 'EXECUTION_FAILED')
    }
  }
  async readFiles(sessionId: string, paths: string[]): Promise<Record<string, string>> { const sandbox = this.session(sessionId); const entries = await Promise.all(paths.map(async path => [path, await sandbox.files.read(`/home/user/${path}`)] as const)); return Object.fromEntries(entries) }
  async getLogs(sessionId: string): Promise<{ stdout: string; stderr: string }> { return this.logs.get(sessionId) || { stdout: '', stderr: '' } }
  async kill(sessionId: string): Promise<void> { const sandbox = this.sessions.get(sessionId); if (sandbox) await sandbox.kill() }
  async destroy(sessionId: string): Promise<void> { try { await this.kill(sessionId) } finally { this.sessions.delete(sessionId); this.logs.delete(sessionId) } }
}
