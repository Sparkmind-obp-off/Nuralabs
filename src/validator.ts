import type { ExecutionResult, GeneratedCode } from './types'

export interface ValidationReport { passed: boolean; checks: Array<{ name: string; passed: boolean; evidence: string }> }

export function validateExecution(code: GeneratedCode, result: ExecutionResult): ValidationReport {
  const checks = [
    { name: 'generated_code_present', passed: code.code.trim().length >= 10, evidence: `${code.code.length} characters` },
    { name: 'sandbox_exit_success', passed: result.exitCode === 0 && !result.timedOut, evidence: `exit=${result.exitCode}, timeout=${result.timedOut}` },
    { name: 'sandbox_provenance', passed: result.provider === 'e2b' && result.sessionId.length > 0, evidence: `provider=${result.provider}, session=${result.sessionId}` },
  ]
  return { passed: checks.every(check => check.passed), checks }
}
