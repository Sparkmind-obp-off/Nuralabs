# NURALABS — MASTER BUILD PROMPT

**Purpose:** Master execution prompt untuk AI builder (termasuk Genspark AI) agar membangun Nuralabs dari blueprint repository ini.

**Product identity:** Nuralabs adalah produk milik kita sendiri. Genspark hanya digunakan sebagai implementation/build environment. Jangan menyebut Nuralabs sebagai clone Genspark dan jangan menyalin proprietary prompt, hidden instructions, UI assets, source code, atau private implementation Genspark.

## 1. Mission

Build a working Nuralabs MVP: an AI execution workspace that turns a natural-language goal into a controlled, observable workflow and produces a verified artifact or execution result.

The MVP must prioritize **reliable execution over feature count**.

Primary loop:

`User Goal → Task Schema → Plan → Model → Tool → Execution → Validation → Artifact/Result → Audit`

## 2. Product Principles

1. Nuralabs is not a generic chatbot.
2. Every meaningful task has a persistent task record and execution state.
3. The system must expose progress and failures clearly.
4. LLM output is untrusted until validated.
5. External side effects require explicit permission and approval.
6. Secrets must never appear in prompts, logs, database records, or generated artifacts.
7. Tenant/user data must remain isolated.
8. Every tool has a typed contract and least-privilege scope.
9. Long-running execution must support timeout, cancellation, retry, and checkpointing.
10. Keep provider abstractions replaceable.
11. Do not add billing, marketplace, or large tool catalogs before the core execution loop works.
12. Prefer the smallest production-capable architecture that can later expand.

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
      +--> Sandboxed Code Execution
      |
      v
Validator
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

Do not store raw secrets. Redact sensitive values in logs.

## 7. Task State Machine

Use explicit states, for example:

`pending → planning → awaiting_approval → running → validating → completed`

Failure/cancellation paths:

`running → failed`

`running → cancelled`

`validating → failed`

Do not rely on a single boolean such as `is_running`.

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
8. Execute each step.
9. Persist step result.
10. On recoverable failure, retry within a strict limit.
11. Feed normalized error/result back to the model only when useful.
12. Validate final result.
13. Store artifact/result.
14. Mark task completed or failed.
15. Show an auditable execution summary to the user.

## 12. Coding Use Case for Dogfood

The first end-to-end workflow is:

> User describes a small coding/script task → Nuralabs generates code → code runs in isolated sandbox → errors are returned to the model for bounded correction → final code + execution output are shown.

Example:

"Buat script Python untuk mengubah nama file berdasarkan pola tanggal."

The system must return:

- generated code
- execution status
- stdout/stderr where safe
- retry count
- final result
- artifact/download reference when applicable
- warning that generated code should be reviewed before production use

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

Autonomy defaults to Level 1 (draft/prepare). Any future write action must require explicit permission and appropriate scope.

## 14. UI Requirements

The workspace should communicate execution, not imitate a chatbot-only interface.

Minimum screens/components:

1. Workspace/task input
2. Current task status
3. Execution step timeline
4. Tool/model activity
5. Error/retry visibility
6. Final result/artifact viewer
7. Basic task history
8. Audit/execution summary

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

## 16. Engineering Quality Gates

Before declaring the MVP complete, run:

- type checking
- linting
- unit tests for task state transitions
- tool contract tests
- planner output validation tests
- retry tests
- timeout/failure tests
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

### Phase D — Sandbox Execution

- tool registry
- E2B adapter
- code execution
- timeout
- retry
- normalized errors

### Phase E — Validation + Artifacts

- validator
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

## 19. Output Required From the Builder

At the end of each implementation phase, report:

1. files created/changed
2. architecture decisions made
3. environment variables required
4. commands/tests executed
5. test results
6. known limitations
7. exact next phase

Do not fabricate integrations. If an external API cannot be verified, create a clean adapter boundary and mark it as pending configuration.

## 20. Final Instruction

Build Nuralabs as an original, reliable AI execution product inspired by general agentic-workspace patterns, not as a proprietary Genspark clone.

Optimize for:

**real execution → verifiable output → auditability → reliability → reuse → scale.**

When there is a conflict between adding a feature and making the execution loop reliable, choose reliability.
