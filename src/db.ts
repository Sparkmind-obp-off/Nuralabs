import { assertTransition } from './state-machine'
import type { StepStatus, TaskPlan, TaskStatus, TenantContext } from './types'

export interface TaskRow { id: string; tenant_id: string; user_id: string; original_request: string; status: TaskStatus; plan_json: string | null; checkpoint_json: string | null; budget_limit_usd: number; budget_used_usd: number; cancellation_requested: number; deliberate_failure: number; created_at: string; started_at: string | null; completed_at: string | null; failure_summary: string | null }
export interface StepRow { id: string; task_id: string; sequence: number; step_type: string; status: StepStatus; tool_used: string | null; model_used: string | null; retry_count: number; started_at: string | null; completed_at: string | null; error: string | null; metadata_json: string | null }

export async function createTenant(db: D1Database): Promise<TenantContext> {
  const tenantId = crypto.randomUUID(); const userId = crypto.randomUUID()
  await db.batch([
    db.prepare('INSERT INTO tenants (id) VALUES (?)').bind(tenantId),
    db.prepare('INSERT INTO users (id, tenant_id, external_identity) VALUES (?, ?, ?)').bind(userId, tenantId, `anonymous:${userId}`),
  ])
  return { tenantId, userId }
}

export async function createTask(db: D1Database, owner: TenantContext, goal: string, budget: number, deliberateFailure: boolean): Promise<TaskRow> {
  const id = crypto.randomUUID()
  await db.prepare('INSERT INTO tasks (id, tenant_id, user_id, original_request, status, budget_limit_usd, deliberate_failure) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, owner.tenantId, owner.userId, goal, 'pending', budget, deliberateFailure ? 1 : 0).run()
  await audit(db, owner.tenantId, id, 'user', 'task.created', { autonomyLevel: 1, budgetLimitUsd: budget })
  const task = await getTaskRow(db, owner.tenantId, id)
  if (!task) throw new Error('Task creation failed')
  return task
}

export async function getTaskRow(db: D1Database, tenantId: string, id: string): Promise<TaskRow | null> {
  return await db.prepare('SELECT * FROM tasks WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first<TaskRow>()
}

export async function getTaskDetail(db: D1Database, tenantId: string, id: string): Promise<Record<string, unknown> | null> {
  const task = await getTaskRow(db, tenantId, id); if (!task) return null
  const [steps, artifacts, audits] = await Promise.all([
    db.prepare('SELECT * FROM task_steps WHERE task_id = ? ORDER BY sequence').bind(id).all<StepRow>(),
    db.prepare('SELECT id, task_id, type, filename, storage_ref, provenance_json, created_at FROM artifacts WHERE task_id = ? AND tenant_id = ? ORDER BY created_at').bind(id, tenantId).all(),
    db.prepare('SELECT id, actor, event_type, metadata_json, timestamp FROM audit_events WHERE task_id = ? AND tenant_id = ? ORDER BY timestamp').bind(id, tenantId).all(),
  ])
  return { ...task, plan: task.plan_json ? JSON.parse(task.plan_json) : null, checkpoint: task.checkpoint_json ? JSON.parse(task.checkpoint_json) : null, steps: steps.results, artifacts: artifacts.results, auditEvents: audits.results }
}

export async function listTasks(db: D1Database, tenantId: string): Promise<TaskRow[]> {
  return (await db.prepare('SELECT * FROM tasks WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 30').bind(tenantId).all<TaskRow>()).results
}

export async function setTaskStatus(db: D1Database, task: TaskRow, next: TaskStatus, failure?: string): Promise<TaskRow> {
  assertTransition(task.status, next)
  const started = next === 'planning' ? new Date().toISOString() : task.started_at
  const finished = ['completed','failed','cancelled'].includes(next) ? new Date().toISOString() : null
  await db.prepare('UPDATE tasks SET status = ?, started_at = COALESCE(started_at, ?), completed_at = ?, failure_summary = ? WHERE id = ? AND tenant_id = ?')
    .bind(next, started, finished, failure ?? null, task.id, task.tenant_id).run()
  await audit(db, task.tenant_id, task.id, 'orchestrator', `task.${next}`, failure ? { failure } : {})
  const updated = await getTaskRow(db, task.tenant_id, task.id); if (!updated) throw new Error('Task disappeared')
  return updated
}

export async function persistPlan(db: D1Database, task: TaskRow, plan: TaskPlan): Promise<void> {
  await db.prepare('UPDATE tasks SET plan_json = ?, checkpoint_json = ? WHERE id = ?').bind(JSON.stringify(plan), JSON.stringify({ phase: 'planned', nextSequence: 1 }), task.id).run()
  const statements = plan.steps.map((step, index) => db.prepare('INSERT INTO task_steps (id, task_id, sequence, step_type, status, tool_used) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), task.id, index + 1, step.type, 'pending', step.tool ?? null))
  await db.batch(statements)
}

export async function updateStep(db: D1Database, taskId: string, sequence: number, patch: { status: StepStatus; tool?: string; model?: string; retryCount?: number; error?: string | null; metadata?: unknown }): Promise<void> {
  const now = new Date().toISOString(); const done = ['completed','failed','cancelled'].includes(patch.status)
  await db.prepare(`UPDATE task_steps SET status=?, tool_used=COALESCE(?,tool_used), model_used=COALESCE(?,model_used), retry_count=COALESCE(?,retry_count), error=?, metadata_json=COALESCE(?,metadata_json), started_at=COALESCE(started_at,?), completed_at=? WHERE task_id=? AND sequence=?`)
    .bind(patch.status, patch.tool ?? null, patch.model ?? null, patch.retryCount ?? null, patch.error ?? null, patch.metadata === undefined ? null : JSON.stringify(patch.metadata), now, done ? now : null, taskId, sequence).run()
  await db.prepare('UPDATE tasks SET checkpoint_json = ? WHERE id = ?').bind(JSON.stringify({ phase: patch.status, sequence, updatedAt: now }), taskId).run()
}

export async function createArtifact(db: D1Database, task: TaskRow, filename: string, content: string, provenance: unknown): Promise<string> {
  const id = crypto.randomUUID(); const ref = `d1://artifacts/${id}`
  await db.prepare('INSERT INTO artifacts (id, task_id, tenant_id, type, filename, content, storage_ref, provenance_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, task.id, task.tenant_id, 'source_code', filename, content, ref, JSON.stringify(provenance)).run()
  return id
}

export async function readArtifact(db: D1Database, tenantId: string, artifactId: string): Promise<{ filename: string; content: string } | null> {
  return await db.prepare('SELECT filename, content FROM artifacts WHERE id = ? AND tenant_id = ?').bind(artifactId, tenantId).first<{ filename: string; content: string }>()
}

export async function audit(db: D1Database, tenantId: string, taskId: string | null, actor: string, eventType: string, metadata: unknown): Promise<void> {
  await db.prepare('INSERT INTO audit_events (id, task_id, tenant_id, actor, event_type, metadata_json) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), taskId, tenantId, actor, eventType, JSON.stringify(metadata)).run()
}

export async function failRunningSteps(db: D1Database, taskId: string, error: string): Promise<void> {
  await db.prepare("UPDATE task_steps SET status='failed', error=?, completed_at=? WHERE task_id=? AND status='running'").bind(error, new Date().toISOString(), taskId).run()
}

export async function requestCancellation(db: D1Database, tenantId: string, taskId: string): Promise<boolean> {
  const result = await db.prepare("UPDATE tasks SET cancellation_requested = 1 WHERE id = ? AND tenant_id = ? AND status NOT IN ('completed','failed','cancelled')").bind(taskId, tenantId).run()
  if (result.meta.changes > 0) await audit(db, tenantId, taskId, 'user', 'task.cancellation_requested', {})
  return result.meta.changes > 0
}
