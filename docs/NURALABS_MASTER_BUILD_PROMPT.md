# NURALABS — MASTER BUILD PROMPT

**Purpose:** Master execution prompt untuk AI builder (termasuk Genspark AI) agar membangun Nuralabs dari blueprint repository ini.

**Product identity:** Nuralabs adalah produk milik kita sendiri. Genspark hanya digunakan sebagai implementation/build environment dan reference point. Jangan menyebut Nuralabs sebagai clone Genspark dan jangan menyalin proprietary prompt, hidden instructions, UI assets, source code, atau private implementation Genspark.

## 0. Strategic Product Boundary — NON-NEGOTIABLE

Nuralabs **bukan proyek untuk membuat ulang Genspark**. Genspark boleh dipelajari untuk memahami mekanisme agentic yang sudah terbukti berguna, tetapi tidak menjadi product specification Nuralabs.

Ambil mekanismenya bila bernilai:
- workspace terpadu
- planning/decomposition
- model routing
- tool execution
- sandboxed execution
- parallel work bila aman
- reusable skills/workflows
- artifact-first output
- connected tools/MCP
- progress dan execution visibility
- cost awareness

Tetapi Nuralabs harus memperbaiki failure modes kategori tersebut dengan desain milik kita sendiri:
- **Execution Reliability:** checkpoint, resume, timeout, cancellation, bounded retry, idempotency.
- **Trusted Context:** tenant, owner, source, timestamp, provenance, trusted/untrusted boundary.
- **Verification:** output tidak dianggap selesai sebelum validation/evidence sesuai task.
- **Policy & Risk:** least privilege, scopes, approval gates, dry-run, external-write controls.
- **Model Independence:** provider gateway dan fallback; orchestration tidak bergantung pada satu model.
- **Budget Control:** task budget, cost estimate/usage, hard limits, graceful stop.
- **Evaluation:** regression cases dan domain evaluation set untuk mengukur kualitas nyata.
- **Portability:** workflow, artifacts, task history, dan konfigurasi harus dapat diekspor tanpa vendor lock-in.

**Decision rule:** jika ada pilihan antara (A) membuat Nuralabs lebih mirip Genspark atau (B) membuat Nuralabs lebih reliable, observable, verifiable, secure, portable, dan domain-aware, selalu pilih **B**.

Nuralabs moat yang harus terus dibangun:
1. Workflow Graph — goal → context → steps → agents/tools → evidence → artifacts → outcome.
2. Trusted Context Layer — provenance dan isolation sebagai first-class data.
3. Execution Reliability Layer — checkpoints, retry, idempotency, timeout, recovery.
4. Domain Evaluation Dataset — real, ambiguous, failure, injection, tool-error, and rejection cases.
5. Execution Memory — reusable successful workflows, bukan sekadar chat history.
6. Portable Workflows — export/import dan provider-independent workflow definitions.

Jangan mengejar feature parity seperti 100+ skills, massive connector catalog, unrestricted browser automation, complex swarm, atau visual cloning sebelum core execution loop terbukti menghasilkan outcome berulang.

## 1. Mission

Build a working Nuralabs MVP: an AI execution workspace that turns a natural-language goal into a controlled, observable workflow and produces a verified artifact or execution result.

The MVP must prioritize **reliable execution over feature count**.

Primary loop:

`User Goal → Task Schema → Plan → Model → Tool → Execution → Validation → Artifact/Result → Audit`

## 2. Product Principles

1. Nuralabs is not a generic chatbot.
2. Nuralabs is not a Genspark clone.
3. Every meaningful task has a persistent task record and execution state.
4. The system must expose progress and failures clearly.
5. LLM output is untrusted until validated.
6. Evidence/provenance should be attached to claims or outputs where applicable.
7. External side effects require explicit permission and approval.
8. Secrets must never appear in prompts, logs, database records, or generated artifacts.
9. Tenant/user data must remain isolated.
10. Every tool has a typed contract and least-privilege scope.
11. Long-running execution must support timeout, cancellation, retry, and checkpointing.
12. Keep provider abstractions replaceable.
13. Prefer observable state over hidden agent activity.
14. Do not add billing, marketplace, or large tool catalogs before the core execution loop works.
15. Prefer the smallest production-capable architecture that can later expand.

## 3. MVP Scope

### Must have

- Web workspace UI
- Natural-language task input
- Task creation and status tracking
- Minimal planner
- Model gateway with at least two provider adapters where practical
- One real execution tool: sandboxed code execution
- Retry loop for execution failures
- Task step persistence
- Execution logs
- Artifact/result display
- Basic validation
- Basic audit trail
- Clear prototype/safety warnings
- Real-time or refreshable execution state

### Explicitly out of MVP

- Public marketplace
- Complex multi-agent swarm
- Enterprise SSO
- Autonomous financial actions
- Unrestricted browser automation
- Automatic external writes without approval
- Full subscription/billing implementation
- Large connector catalog
- Cross-tenant memory
- Feature-parity implementation against Genspark

## 4. Preferred Architecture

```text
Nuralabs Web UI
      |
      v
API / Task Service
      |
      +--> Auth / Tenant Context
      |
      +--> Policy + Risk Guard
      |
      v
Task Orchestrator
      |
      +--> Planner
      +--> Model Gateway
      +--> Tool Registry
      |
      v
Execution Runtime
      |
      +--> Sandbox Provider Adapter
      |
      v
Validator / Evidence Layer
      |
      +--> Artifact Store
      +--> Audit Log
      |
      v
Workspace Result
```

Keep these concerns modular so providers can be replaced without rewriting orchestration logic.

## 5. Runtime and Infrastructure Rules

Use the repository's current Cloudflare-oriented architecture as the default direction.

- Frontend/API: Cloudflare-compatible application architecture.
- Database: choose ONE relational source of truth for the MVP; do not introduce a needless D1 + Neon split unless a concrete requirement exists.
- Sandbox: use E2B if its available API and current plan are suitable. Create a provider interface so another sandbox provider can replace it later.
- Model providers: use provider adapters rather than embedding provider-specific calls throughout business logic.
- File/artifact storage: use an abstraction with metadata and provenance.

### Sandbox requirement

The sandbox is not a mock terminal. The MVP must execute code in a real isolated runtime through the sandbox provider adapter.

For the first implementation, implement an **E2B adapter** when the current E2B API/SDK can be verified. The adapter must expose a Nuralabs-owned interface such as:

```text
SandboxProvider
  createSession()
  writeFiles()
  execute()
  readFiles()
  getLogs()
  kill()
  destroy()
```

The orchestrator must depend on `SandboxProvider`, not directly on E2B SDK calls.

The E2B adapter must:
- create an isolated execution environment
- run generated code/commands inside that environment
- capture stdout/stderr and exit status
- enforce timeout/resource boundaries where supported
- support cleanup/destroy
- normalize provider errors into Nuralabs execution errors
- never expose E2B credentials to the browser

If E2B cannot be verified/configured, do **not** fake successful execution. Keep the provider interface, provide a clearly marked local/test adapter only for automated tests, and mark E2B integration as pending configuration.

If a proposed technology is unavailable, deprecated, requires paid infrastructure unexpectedly, or conflicts with the current repository, STOP and explain the trade-off before silently changing the architecture.

## 6. Core Data Model

At minimum implement:

### users/tenants
- id
- email or external identity reference
- created_at

### tasks
- id
- tenant/user id
- original request
- status
- autonomy level
- created_at
- started_at
- completed_at
- failure summary

### task_steps
- id
- task_id
- sequence
- step type
- status
- tool/model used
- input reference
- output reference
- retry_count
- started_at
- completed_at
- error

### artifacts
- id
- task_id
- type
- storage reference
- provenance
- created_at

### audit_events
- id
- task_id
- actor
- event type
- metadata
- timestamp

For sandbox execution, store normalized execution metadata, not secrets or unrestricted raw provider payloads.

Do not store raw secrets. Redact sensitive values in logs.

## 7. Task State Machine

Use explicit states, for example:

`pending → planning → awaiting_approval → running → validating → completed`

Failure/cancellation paths:

`running → failed`

`running → cancelled`

`validating → failed`

Do not rely on a single boolean such as `is_running`.

Long-running tasks must have a recoverable checkpoint/state boundary so a process interruption does not require silently starting from zero.

## 8. Tool Contract

Every tool must expose a typed contract similar to:

```json
{
  "name": "code_exec",
  "description": "Execute code in an isolated sandbox",
  "risk_level": "low",
  "required_scopes": ["sandbox.execute"],
  "input_schema": {},
  "output_schema": {},
  "supports_dry_run": true,
  "idempotency_required": true,
  "timeout_seconds": 120
}
```

The orchestrator must never pass arbitrary model-generated text directly into an unsafe tool API. Validate and normalize inputs first.

## 9. Model Gateway

Create a single internal interface such as:

`generate(task_context, model_policy) -> structured model result`

The orchestration layer should not know provider-specific SDK details.

The gateway should support:

- provider selection
- model selection
- timeout
- structured output where supported
- error normalization
- fallback policy
- usage metadata

Never expose provider API keys to the browser.

## 10. Planner

For the MVP, the planner can be simple.

Given a user request, produce a structured plan:

```json
{
  "goal": "...",
  "steps": [
    {
      "id": "step-1",
      "type": "generate_code",
      "tool": "code_exec",
      "requires_approval": false
    }
  ]
}
```

Persist the plan before execution.

The planner must reject or flag requests that exceed MVP capability rather than pretending to support them.

## 11. Execution Loop

Implement this exact conceptual loop:

1. Receive user goal.
2. Create task.
3. Load tenant/policy context.
4. Classify risk and autonomy level.
5. Generate plan.
6. Persist plan.
7. Request approval if required.
8. Execute each step through a registered tool/provider adapter.
9. Persist step result.
10. On recoverable failure, retry within a strict limit.
11. Feed normalized error/result back to the model only when useful.
12. Validate final result.
13. Store artifact/result.
14. Mark task completed or failed.
15. Show an auditable execution summary to the user.

Never mark a task `completed` solely because a model returned text. Completion requires the applicable validation/evidence checks to pass.

## 12. Coding Use Case for Dogfood

The first end-to-end workflow is:

> User describes a small coding/script task → Nuralabs generates code → code runs in an isolated sandbox → errors are returned to the model for bounded correction → final code + execution output are shown.

Example:

"Buat script Python untuk mengubah nama file berdasarkan pola tanggal."

The system must return:

- generated code
- execution status
- stdout/stderr where safe
- retry count
- final result
- artifact/download reference when applicable
- sandbox execution metadata suitable for audit
- warning that generated code should be reviewed before production use

This coding workflow is **dogfood for the execution engine**, not Nuralabs' final market positioning.

## 13. Safety and Trust

Implement these from the first working version:

- server-side secret handling
- input validation
- output validation
- timeout
- cancellation where feasible
- retry cap
- sandbox resource limits
- audit events
- tenant scoping
- prompt-injection-aware separation between instructions and untrusted content
- no automatic external side effects
- provenance for important generated artifacts/results

Autonomy defaults to Level 1 (draft/prepare). Any future write action must require explicit permission and appropriate scope.

## 14. UI Requirements

The workspace should communicate execution, not imitate a chatbot-only interface.

Minimum screens/components:

1. Workspace/task input
2. Current task status
3. Execution step timeline
4. Tool/model/sandbox activity
5. Error/retry visibility
6. Final result/artifact viewer
7. Basic task history
8. Audit/execution summary
9. Validation/evidence status where applicable

Avoid fake progress. Every displayed step should correspond to real backend state.

## 15. Validation and Acceptance Criteria

The MVP is accepted only when all are true:

- A user can submit a real task from the UI.
- A task record is created.
- A plan is persisted.
- At least one model provider successfully generates a structured step.
- Code execution happens in an isolated runtime.
- Execution output is persisted.
- A controlled retry occurs after a deliberately introduced recoverable error.
- The final result is validated before completion.
- The UI displays actual task progress.
- A failed task ends in a clear failed state rather than hanging.
- Secrets are not exposed in client code or logs.
- Two users/tenants cannot access each other's task records.
- Generated code is clearly labeled as AI-generated and requiring review for production use.
- The sandbox provider is behind a Nuralabs-owned adapter interface.
- No fake E2B/sandbox success path is used in production.

## 16. Engineering Quality Gates

Before declaring the MVP complete, run:

- type checking
- linting
- unit tests for task state transitions
- tool contract tests
- planner output validation tests
- retry tests
- timeout/failure tests
- sandbox adapter tests
- authorization/tenant-isolation tests
- build test
- deployment/preview test

Do not claim a test passed unless it actually ran.

## 17. Build Strategy for AI Builder

Work in phases and keep each phase independently testable.

### Phase A — Foundation

- inspect repository
- identify existing files and preserve useful documentation
- establish app structure
- configure environment contract
- implement health endpoint
- implement database connection
- define provider interfaces

### Phase B — Task Core

- task schema
- task API
- task state machine
- workspace UI
- task history

### Phase C — Model Gateway + Planner

- provider adapter
- structured model response
- planner
- persisted execution plan

### Phase D — Real Sandbox Execution

- tool registry
- `SandboxProvider` interface
- E2B adapter
- code execution
- timeout
- retry
- normalized errors
- cleanup/destroy

### Phase E — Validation + Artifacts

- validator
- evidence/provenance metadata
- artifact metadata
- result viewer
- audit events

### Phase F — Hardening

- tests
- authorization
- tenant isolation
- secret redaction
- failure-path testing
- deployment verification
- checkpoint/recovery verification

Do not jump to marketplace, billing, or advanced agents before Phase F passes.

## 18. Repository Discipline

- Do not delete existing blueprint documents unless explicitly instructed.
- Prefer clean new folders and descriptive filenames.
- Keep implementation decisions documented.
- If an existing decision is obsolete, document the replacement and reason.
- Do not hard-code credentials.
- Do not commit `.env` files containing secrets.
- Keep provider-specific code behind adapters.
- Keep the application deployable after each major phase.
- Do not add feature parity work merely because Genspark has that feature.
- Every new feature must state which measurable outcome it improves: completion, acceptance, evidence, intervention, cost, reuse, safety, or portability.

## 19. Output Required From the Builder

At the end of each implementation phase, report:

1. files created/changed
2. architecture decisions made
3. environment variables required
4. commands/tests executed
5. test results
6. known limitations
7. exact next phase
8. which Nuralabs moat/reliability property was strengthened

Do not fabricate integrations. If an external API cannot be verified, create a clean adapter boundary and mark it as pending configuration.

## 20. Final Instruction

Build Nuralabs as an original, reliable AI execution product inspired by general agentic-workspace patterns, not as a proprietary Genspark clone.

Genspark is an implementation environment/reference only. It is **not** the Nuralabs product specification.

Optimize for:

**real execution → verifiable output → auditability → reliability → reuse → portability → domain advantage → scale.**

When there is a conflict between adding a feature and making the execution loop reliable, choose reliability.
