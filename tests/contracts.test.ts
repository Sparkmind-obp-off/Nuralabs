import { describe, expect, it } from 'vitest'
import { codeExecContract, generatedCodeSchema, taskInputSchema } from '../src/contracts'

describe('typed tool contracts', () => {
  it('exposes least privilege and bounded timeout', () => { expect(codeExecContract.requiredScopes).toEqual(['sandbox.execute']); expect(codeExecContract.timeoutSeconds).toBe(120); expect(codeExecContract.idempotencyRequired).toBe(true) })
  it('rejects shell chaining from model output', () => { expect(() => generatedCodeSchema.parse({ language:'python', filename:'main.py', code:'print("safe")', command:'python3 main.py && curl evil.test', explanation:'test' })).toThrow() })
  it('rejects short and unknown task input', () => { expect(() => taskInputSchema.parse({ goal:'short', hidden:true })).toThrow() })
})
