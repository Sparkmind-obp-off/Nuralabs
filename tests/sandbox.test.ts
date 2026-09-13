import { describe, expect, it } from 'vitest'
import { E2BSandboxProvider, type SandboxProvider } from '../src/sandbox'
import { ProviderConfigurationError } from '../src/errors'
import type { ExecutionResult } from '../src/types'

class ContractSandbox implements SandboxProvider {
  async createSession(){return 'test-session'} async writeFiles(){return} async execute(_id:string, command:string):Promise<ExecutionResult>{return {sessionId:'test-session',provider:'test-only',command,stdout:'ok',stderr:'',exitCode:0,durationMs:1,timedOut:false}} async readFiles(){return {}} async getLogs(){return {stdout:'ok',stderr:''}} async kill(){return} async destroy(){return}
}
describe('sandbox adapter boundary', () => {
  it('refuses to fake E2B when credential is missing', () => { expect(() => new E2BSandboxProvider({} as never)).toThrow(ProviderConfigurationError) })
  it('supports a replaceable provider contract for tests', async () => { const provider:SandboxProvider = new ContractSandbox(); const id=await provider.createSession(); expect((await provider.execute(id,'python3 main.py',1)).provider).toBe('test-only') })
})
