import type { TaskPlan } from './types'

const unsupported = /(transfer uang|kirim uang|buy stock|beli saham|deploy production|hapus database|browser automation|login ke)/i

export class UnsupportedCapabilityError extends Error {}

export function createPlan(goal: string): TaskPlan {
  if (unsupported.test(goal)) throw new UnsupportedCapabilityError('Permintaan memerlukan side effect atau kapabilitas di luar coding-script MVP.')
  return {
    version: 1, goal, capability: 'coding_script', riskLevel: 'low',
    steps: [
      { id: 'generate', type: 'generate_code', requiresApproval: false },
      { id: 'execute', type: 'execute_code', tool: 'code_exec', requiresApproval: false },
      { id: 'validate', type: 'validate_result', requiresApproval: false },
    ],
  }
}
