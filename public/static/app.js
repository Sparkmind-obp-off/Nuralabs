const state = { selectedId: null, poll: null }
const $ = selector => document.querySelector(selector)
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[char])
const parseJson = value => { try { return JSON.parse(value || '{}') } catch { return {} } }

async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { 'content-type': 'application/json', ...(options.headers || {}) } })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`)
  return data
}
function toast(message, error = false) { const el = $('#toast'); el.textContent = message; el.className = error ? 'show error' : 'show'; setTimeout(() => { el.className = '' }, 3500) }
function statusClass(status) { return ['completed','failed','cancelled','running','validating','planning'].includes(status) ? status : 'pending' }

async function boot() {
  await api('/api/session', { method: 'POST', body: '{}' })
  const health = await api('/api/health'); const healthEl = $('#system-health'); healthEl.textContent = health.status === 'healthy' ? 'System ready' : 'System degraded'; healthEl.dataset.status = health.status
  await loadTasks()
}
async function loadTasks() {
  const { tasks } = await api('/api/tasks')
  $('#task-list').innerHTML = tasks.length ? tasks.map(task => `<li><button class="task-item ${state.selectedId === task.id ? 'selected' : ''}" data-task-id="${task.id}"><span class="task-copy"><strong>${escapeHtml(task.original_request)}</strong><small>${new Date(task.created_at).toLocaleString('id-ID')}</small></span><span class="status-badge ${statusClass(task.status)}">${escapeHtml(task.status)}</span></button></li>`).join('') : '<li class="empty-state">No tasks yet.</li>'
  document.querySelectorAll('[data-task-id]').forEach(button => button.addEventListener('click', () => selectTask(button.dataset.taskId)))
}
async function selectTask(id, quiet = false) {
  state.selectedId = id; const detail = await api(`/api/tasks/${id}`); renderDetail(detail); if (!quiet) await loadTasks()
}
function renderDetail(task) {
  $('#empty-execution').hidden = true; $('#task-detail').hidden = false
  $('#detail-id').textContent = `TASK · ${task.id.slice(0, 13)}`; $('#detail-goal').textContent = task.original_request; $('#detail-status').innerHTML = `<span class="status-badge ${statusClass(task.status)}">${escapeHtml(task.status)}</span>`
  $('#detail-budget').textContent = `$${Number(task.budget_used_usd || 0).toFixed(3)} / $${Number(task.budget_limit_usd).toFixed(2)}`
  const retries = (task.steps || []).reduce((sum, step) => sum + Number(step.retry_count || 0), 0); $('#detail-retries').textContent = `${retries} / 1`
  const validationStep = (task.steps || []).find(step => step.step_type === 'validate_result'); const validation = parseJson(validationStep?.metadata_json); $('#detail-validation').textContent = validation.passed === true ? 'Passed' : validation.passed === false ? 'Failed' : 'Pending'
  $('#export-link').href = `/api/tasks/${task.id}/export`; $('#cancel-button').disabled = ['completed','failed','cancelled'].includes(task.status); $('#cancel-button').dataset.id = task.id
  $('#step-timeline').innerHTML = (task.steps || []).map(step => { const metadata = parseJson(step.metadata_json); const evidence = step.error || (metadata.provider ? `${metadata.provider} · ${metadata.durationMs || 0}ms · exit ${metadata.exitCode}` : metadata.model ? `${metadata.provider} · ${metadata.model}` : 'State persisted'); return `<li class="timeline-step ${statusClass(step.status)}"><span class="step-index">${step.sequence}</span><article><header><strong>${escapeHtml(step.step_type.replaceAll('_',' '))}</strong><span class="status-badge ${statusClass(step.status)}">${escapeHtml(step.status)}</span></header><p>${escapeHtml(evidence)}</p>${step.retry_count ? `<small>Bounded retry count: ${step.retry_count}</small>` : ''}</article></li>` }).join('') || '<li class="empty-state">Plan has not been persisted yet.</li>'
  const artifact = task.artifacts?.[0]; $('#artifact-section').hidden = !artifact; if (artifact) $('#artifact-download').href = `/api/tasks/${task.id}/artifacts/${artifact.id}`
  $('#audit-list').innerHTML = (task.auditEvents || []).map(event => `<li><time>${new Date(event.timestamp).toLocaleTimeString('id-ID')}</time><span><strong>${escapeHtml(event.event_type)}</strong><small>${escapeHtml(event.actor)}</small></span></li>`).join('')
  if (['planning','running','validating'].includes(task.status)) startPolling(task.id); else stopPolling()
}
function startPolling(id) { if (state.poll) return; state.poll = setInterval(() => selectTask(id, true).catch(() => {}), 1200) }
function stopPolling() { if (state.poll) clearInterval(state.poll); state.poll = null }

$('#task-form').addEventListener('submit', async event => {
  event.preventDefault(); const button = $('#run-button'); button.disabled = true; button.textContent = 'Creating task…'
  try {
    const created = await api('/api/tasks', { method: 'POST', body: JSON.stringify({ goal: $('#goal-input').value, deliberateFailure: $('#failure-toggle').checked }) })
    state.selectedId = created.task.id; await selectTask(created.task.id); button.textContent = 'Executing in E2B…'; startPolling(created.task.id)
    await api(`/api/tasks/${created.task.id}/run`, { method: 'POST', body: '{}' }); await selectTask(created.task.id); toast('Execution reached a terminal state.')
  } catch (error) { toast(error.message, true); if (state.selectedId) await selectTask(state.selectedId).catch(() => {}) }
  finally { button.disabled = false; button.innerHTML = 'Create & execute <span aria-hidden="true">→</span>'; stopPolling() }
})
$('#refresh-button').addEventListener('click', () => loadTasks().catch(error => toast(error.message, true)))
$('#cancel-button').addEventListener('click', async event => { try { await api(`/api/tasks/${event.currentTarget.dataset.id}/cancel`, { method: 'POST', body: '{}' }); toast('Cancellation requested.'); await selectTask(event.currentTarget.dataset.id) } catch (error) { toast(error.message, true) } })
boot().catch(error => toast(error.message, true))
