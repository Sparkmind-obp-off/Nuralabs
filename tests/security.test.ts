import { describe, expect, it } from 'vitest'
import { redact } from '../src/security'

describe('secret redaction', () => { it('redacts common secret shapes before persistence', () => { const result = redact('api_key=super-secret-value token: abcdefghijklmnop cfat_1234567890abcdefghijkl'); expect(result).not.toContain('super-secret-value'); expect(result).not.toContain('cfat_'); expect(result).toContain('[REDACTED]') }) })
