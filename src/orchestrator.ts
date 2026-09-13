import { createArtifact, failRunningSteps, getTaskRow, persistPlan, setTaskStatus, updateStep, audit, type TaskRow } from './db'
import { errorMessage } from './errors'
import { ModelGateway } from './model'
import { createPlan } from './planner'
import { E2BSandboxProvider, type SandboxProvider } from './sandbox'
import { redact } from './security'
import type { Bindings, GeneratedCode } from './types'
import { validateExecution } from './validator'

const MAX_RETRIES = 1

async function ensureNotCancelled(db: D1Database, task: TaskRow): Promise<TaskRow> {
  const current = await getTaskRow(db, task.tenant_id, task.id); if (!current) throw new Error('Task not found')
  if (current.cancellation_requested) { await setTaskStatus(db, current, 'cancelled'); throw new Error('TASK_CANCELLED') }
  return current
}

export async function runTask(env: Bindings, tenantId: string, taskId: string, injected?: { sandbox?: SandboxProvider; gateway?: ModelGateway }): Promise<void> {
  let task = await getTaskRow(env.DB, tenantId, taskId); if (!task) throw new Error('Task not found')
  let sessionId: string | null = null
  let sandboxProvider: SandboxProvider | null = null
  try {
    task = await setTaskStatus(env.DB, task, 'planning')
    const plan = createPlan(task.original_request); await persistPlan(env.DB, task, plan)
    task = await ensureNotCancelled(env.DB, task); task = await setTaskStatus(env.DB, task, 'running')

    const gateway = injected?.gateway || new ModelGateway(env)
    await updateStep(env.DB, task.id, 1, { status: 'running' })
    let generated = await gateway.generate(task.original_request)
    await updateStep(env.DB, task.id, 1, { status: 'completed', model: `${generated.usage.provider}:${generated.usage.model}`, metadata: generated.usage })

    const sandbox = injected?.sandbox || new E2BSandboxProvider(env)
    sandboxProvider = sandbox
    let execution = null; let lastError = ''; let retry = 0
    while (retry <= MAX_RETRIES) {
      task = await ensureNotCancelled(env.DB, task)
      await updateStep(env.DB, task.id, 2, { status: 'running', tool: 'code_exec', retryCount: retry })
      try {
        sessionId = await sandbox.createSession()
        let code: GeneratedCode = generated.value
        if (task.deliberate_failure && retry === 0) code = { ...code, code: code.language === 'python' ? `${code.code}\nraise RuntimeError('Nuralabs deliberate recoverable test')` : `${code.code}\nthrow new Error('Nuralabs deliberate recoverable test')` }
        await sandbox.writeFiles(sessionId, [{ path: code.filename, content: code.code }])
        execution = await sandbox.execute(sessionId, code.command, 120)
        if (execution.exitCode !== 0) throw new Error(`Process exited ${execution.exitCode}: ${execution.stderr}`)
        await updateStep(env.DB, task.id, 2, { status: 'completed', tool: 'code_exec', retryCount: retry, metadata: execution })
        break
      } catch (error) {
        lastError = redact(errorMessage(error)); await audit(env.DB, task.tenant_id, task.id, 'orchestrator', 'step.retry', { sequence: 2, retry, error: lastError })
        if (sessionId) { await sandbox.destroy(sessionId); sessionId = null }
        if (retry >= MAX_RETRIES) throw error
        retry += 1; generated = await gateway.generate(task.original_request, lastError)
      }
    }
    if (!execution) throw new Error(lastError || 'Execution produced no result')
    task = await ensureNotCancelled(env.DB, task); task = await setTaskStatus(env.DB, task, 'validating')
    await updateStep(env.DB, task.id, 3, { status: 'running' })
    const report = validateExecution(generated.value, execution)
    await updateStep(env.DB, task.id, 3, { status: report.passed ? 'completed' : 'failed', metadata: report, error: report.passed ? null : 'Validation failed' })
    if (!report.passed) throw new Error('Final validation failed')
    const artifactId = await createArtifact(env.DB, task, generated.value.filename, generated.value.code, { generatedBy: generated.usage, executedBy: { provider: execution.provider, sessionId: execution.sessionId, exitCode: execution.exitCode }, validation: report, warning: 'AI-generated code; review before production use.' })
    await audit(env.DB, task.tenant_id, task.id, 'validator', 'artifact.verified', { artifactId, validation: report })
    task = await getTaskRow(env.DB, tenantId, taskId) as TaskRow; await setTaskStatus(env.DB, task, 'completed')
  } catch (error) {
    if (errorMessage(error) !== 'TASK_CANCELLED') {
      const current = await getTaskRow(env.DB, tenantId, taskId)
      if (current && !['failed','cancelled','completed'].includes(current.status)) {
        const message = redact(errorMessage(error));
        await failRunningSteps(env.DB, taskId, message)
        try { await setTaskStatus(env.DB, current, 'failed', message) } catch { await env.DB.prepare("UPDATE tasks SET status='failed', failure_summary=?, completed_at=? WHERE id=? AND tenant_id=?").bind(message, new Date().toISOString(), taskId, tenantId).run() }
      }
    }
  } finally {
    if (sessionId && sandboxProvider) { try { await sandboxProvider.destroy(sessionId) } catch { /* cleanup is best-effort and audit state is already persisted */ } }
  }
}
