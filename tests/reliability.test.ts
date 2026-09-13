import { describe, expect, it } from 'vitest'
import { withBoundedRetry, withTimeout } from '../src/reliability'

describe('execution reliability', () => {
  it('recovers once and records retry count', async () => { const calls:number[] = []; const result = await withBoundedRetry(async attempt => { calls.push(attempt); if (attempt === 0) throw new Error('recoverable'); return 'verified' }, 1); expect(result).toEqual({ value:'verified', retries:1 }); expect(calls).toEqual([0,1]) })
  it('never exceeds retry cap', async () => { let calls=0; await expect(withBoundedRetry(async () => { calls += 1; throw new Error('still failing') }, 1)).rejects.toThrow('still failing'); expect(calls).toBe(2) })
  it('fails bounded operations on timeout', async () => { await expect(withTimeout(new Promise(resolve => setTimeout(resolve, 30)), 5)).rejects.toThrow('OPERATION_TIMEOUT') })
})
