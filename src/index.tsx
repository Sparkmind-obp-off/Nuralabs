import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { z } from 'zod'
import { createTask, createTenant, getTaskDetail, listTasks, readArtifact, requestCancellation } from './db'
import { ModelGateway } from './model'
import { runTask } from './orchestrator'
import { issueSession, readSession } from './security'
import { taskInputSchema } from './contracts'
import type { Bindings, TenantContext } from './types'

const app = new Hono<{ Bindings: Bindings; Variables: { owner: TenantContext } }>()
app.use('*', secureHeaders({ contentSecurityPolicy: { defaultSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], scriptSrc: ["'self'"], imgSrc: ["'self'", 'data:'], connectSrc: ["'self'"] } }))

app.get('/api/health', async c => {
  let database = 'unavailable'
  try { await c.env.DB.prepare('SELECT 1').first(); database = 'ready' } catch { database = 'unavailable' }
  const gateway = new ModelGateway(c.env)
  return c.json({ service: 'nuralabs', version: '0.1.0', status: database === 'ready' ? 'healthy' : 'degraded', database, providers: gateway.status(), sandbox: { provider: 'e2b', configured: Boolean(c.env.E2B_API_KEY || c.env.E2B_SANDBOX) }, timestamp: new Date().toISOString() }, database === 'ready' ? 200 : 503)
})

app.post('/api/session', async c => {
  let owner = await readSession(c)
  if (!owner) { owner = await createTenant(c.env.DB); await issueSession(c, owner) }
  return c.json({ authenticated: true, mode: 'signed-anonymous-tenant', tenantRef: owner.tenantId.slice(0, 8) })
})

app.use('/api/tasks/*', async (c, next) => { const owner = await readSession(c); if (!owner) return c.json({ error: 'Session required' }, 401); c.set('owner', owner); await next() })
app.use('/api/tasks', async (c, next) => { const owner = await readSession(c); if (!owner) return c.json({ error: 'Session required' }, 401); c.set('owner', owner); await next() })

app.get('/api/tasks', async c => c.json({ tasks: await listTasks(c.env.DB, c.get('owner').tenantId) }))
app.post('/api/tasks', async c => {
  try {
    const input = taskInputSchema.parse(await c.req.json()); const owner = c.get('owner')
    const configuredBudget = Number(c.env.MAX_TASK_BUDGET_USD || '0.25'); const budget = Number.isFinite(configuredBudget) ? Math.min(Math.max(configuredBudget, 0.01), 5) : 0.25
    const task = await createTask(c.env.DB, owner, input.goal, budget, input.deliberateFailure)
    return c.json({ task }, 201)
  } catch (error) {
    if (error instanceof z.ZodError) return c.json({ error: 'Invalid task input', issues: error.issues }, 400)
    return c.json({ error: error instanceof Error ? error.message : 'Task creation failed' }, 500)
  }
})
app.get('/api/tasks/:id', async c => { const detail = await getTaskDetail(c.env.DB, c.get('owner').tenantId, c.req.param('id')); return detail ? c.json(detail) : c.json({ error: 'Task not found' }, 404) })
app.post('/api/tasks/:id/run', async c => { const owner = c.get('owner'); const existing = await getTaskDetail(c.env.DB, owner.tenantId, c.req.param('id')); if (!existing) return c.json({ error: 'Task not found' }, 404); if (existing.status !== 'pending') return c.json({ error: 'Task has already started', status: existing.status }, 409); await runTask(c.env, owner.tenantId, c.req.param('id')); const result = await getTaskDetail(c.env.DB, owner.tenantId, c.req.param('id')); return c.json(result) })
app.post('/api/tasks/:id/cancel', async c => c.json({ accepted: await requestCancellation(c.env.DB, c.get('owner').tenantId, c.req.param('id')) }, 202))
app.get('/api/tasks/:id/export', async c => { const detail = await getTaskDetail(c.env.DB, c.get('owner').tenantId, c.req.param('id')); if (!detail) return c.json({ error: 'Task not found' }, 404); c.header('content-disposition', `attachment; filename="nuralabs-task-${c.req.param('id')}.json"`); return c.json({ format: 'nuralabs-portable-task', version: 1, exportedAt: new Date().toISOString(), task: detail }) })
app.get('/api/tasks/:taskId/artifacts/:artifactId', async c => { const artifact = await readArtifact(c.env.DB, c.get('owner').tenantId, c.req.param('artifactId')); if (!artifact) return c.json({ error: 'Artifact not found' }, 404); c.header('content-type', 'text/plain; charset=utf-8'); c.header('content-disposition', `attachment; filename="${artifact.filename}"`); return c.body(artifact.content) })

app.get('/favicon.ico', c => c.body(null, 204))

app.get('/', c => c.html(`<!doctype html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Nuralabs reliable AI execution workspace"><title>Nuralabs — Execution Workspace</title><link rel="stylesheet" href="/static/style.css"></head><body><header class="site-header"><a class="brand" href="/" aria-label="Nuralabs home"><span class="brand-mark">N</span><span>Nuralabs</span></a><nav aria-label="Workspace navigation"><span class="prototype-label">MVP · Level 1 autonomy</span><span id="system-health" class="health-pill">Checking system</span></nav></header><main class="workspace"><section id="hero-section" class="hero"><p class="eyebrow">RELIABLE AI EXECUTION</p><h1>From intent to<br><em>verified outcome.</em></h1><p class="hero-copy">Nuralabs turns a coding goal into an observable workflow: plan, generate, execute in E2B, validate, and preserve evidence.</p></section><section id="task-composer" class="composer panel"><form id="task-form"><label for="goal-input">What should Nuralabs execute?</label><textarea id="goal-input" name="goal" rows="5" minlength="10" maxlength="4000" required placeholder="Contoh: Buat script Python untuk mengubah daftar suhu Celsius menjadi Fahrenheit, lalu tampilkan hasil uji."></textarea><div class="form-actions"><label class="test-toggle"><input id="failure-toggle" type="checkbox"> Test bounded retry</label><button id="run-button" type="submit">Create & execute <span aria-hidden="true">→</span></button></div></form><p class="safety-note"><strong>Prototype safety:</strong> generated code runs in an isolated sandbox, but must still be reviewed before production use. No external writes are permitted.</p></section><section class="dashboard"><aside id="task-history" class="history panel"><div class="section-heading"><div><p class="eyebrow">TASK LEDGER</p><h2>Recent runs</h2></div><button id="refresh-button" class="icon-button" aria-label="Refresh tasks">↻</button></div><ol id="task-list" class="task-list"><li class="empty-state">No tasks yet.</li></ol></aside><section id="execution-view" class="execution panel"><div id="empty-execution" class="empty-execution"><span class="orbit-mark">◎</span><h2>Execution evidence appears here</h2><p>Submit a small script task to create a persistent workflow graph.</p></div><article id="task-detail" hidden><header class="detail-header"><div><p id="detail-id" class="mono eyebrow"></p><h2 id="detail-goal"></h2></div><div class="detail-actions"><a id="export-link" class="secondary-button" href="#">Export JSON</a><button id="cancel-button" class="secondary-button">Cancel</button></div></header><section class="metrics" aria-label="Task metrics"><article><span>Status</span><strong id="detail-status">—</strong></article><article><span>Budget</span><strong id="detail-budget">—</strong></article><article><span>Retries</span><strong id="detail-retries">—</strong></article><article><span>Validation</span><strong id="detail-validation">—</strong></article></section><section><div class="section-heading"><div><p class="eyebrow">WORKFLOW GRAPH</p><h3>Execution timeline</h3></div></div><ol id="step-timeline" class="timeline"></ol></section><section id="artifact-section" hidden><div class="section-heading"><div><p class="eyebrow">VERIFIED OUTPUT</p><h3>Artifact</h3></div><a id="artifact-download" class="secondary-button" href="#">Download</a></div><pre id="artifact-preview"><code>Artifact ready for secure download.</code></pre></section><section><div class="section-heading"><div><p class="eyebrow">AUDIT TRAIL</p><h3>Evidence log</h3></div></div><ol id="audit-list" class="audit-list"></ol></section></article></section></section></main><footer><p>Nuralabs is an original execution product. Provider-independent by design.</p></footer><div id="toast" role="status" aria-live="polite"></div><script src="/static/app.js" defer></script></body></html>`))

export default app
