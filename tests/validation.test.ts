import { describe, expect, it } from 'vitest'
import { validateExecution } from '../src/validator'
const code = { language:'python' as const, filename:'main.py', code:'print("hello")', command:'python3 main.py', explanation:'demo' }
describe('evidence validation', () => { it('requires real E2B provenance', () => { expect(validateExecution(code,{sessionId:'x',provider:'test-only',command:'python3 main.py',stdout:'hello',stderr:'',exitCode:0,durationMs:1,timedOut:false}).passed).toBe(false) }); it('passes successful E2B execution', () => { expect(validateExecution(code,{sessionId:'e2b-1',provider:'e2b',command:'python3 main.py',stdout:'hello',stderr:'',exitCode:0,durationMs:1,timedOut:false}).passed).toBe(true) }) })
