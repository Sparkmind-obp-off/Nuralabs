# Nuralabs Production & Enterprise Readiness Contract

**Status:** Strategic implementation contract
**Scope:** Production-grade and enterprise-readiness boundaries for Nuralabs Core and future Nura Products.

## 1. Purpose

Nuralabs must be designed so the same core can move from MVP/dogfood to production and, when justified by real customers, to enterprise environments without rewriting the execution architecture.

This document does **not** require enterprise features in the MVP. It defines the quality gates and architectural boundaries that prevent MVP shortcuts from becoming production blockers.

## 2. Readiness Levels

### Level A — MVP / Dogfood

Goal: prove that Nuralabs can perform real work.

Required:
- real execution runtime, not simulated execution;
- provider abstraction for models and sandbox/runtime;
- task and step state persistence;
- bounded retries and failure handling;
- validation before completion;
- artifact storage/reference;
- execution evidence and basic audit trail;
- tenant/user boundary in application logic;
- server-side secrets only;
- cancellation and timeout for long-running work;
- basic health/error visibility.

Not required yet:
- enterprise SSO;
- advanced RBAC;
- multi-region deployment;
- formal compliance programs;
- complex billing;
- large connector marketplace.

### Level B — Production Grade

Goal: safely serve real paying users and real business workloads.

Required:
- strong authentication and authorization;
- explicit tenant isolation;
- durable task state and checkpoint/recovery behavior;
- idempotent tool execution where possible;
- provider timeout, retry, and fallback policies;
- structured logs with secret/PII redaction;
- metrics and actionable alerts;
- traceable task → step → tool/model → artifact lineage;
- safe file handling and malware/content-risk controls where applicable;
- rate limits and abuse protection;
- budget/credit guards;
- data retention and deletion policy;
- backup and restore strategy for durable data;
- migration/versioning discipline;
- CI tests and regression evaluation;
- deployment rollback strategy;
- documented incident and recovery procedures.

Production completion means the system can fail safely, recover predictably, and explain what happened.

### Level C — Enterprise Ready

Goal: support organizations with stronger governance, security, procurement, and operational requirements.

Add only when customer demand justifies the cost.

Expected capabilities may include:
- SSO/SAML/OIDC;
- enterprise RBAC and scoped permissions;
- organization/workspace hierarchy;
- audit-log export and retention controls;
- configurable data retention/deletion;
- customer-controlled access policies;
- IP/network restrictions where required;
- dedicated or isolated execution environments where required;
- stronger secret/key management integration;
- compliance evidence and security documentation;
- SLA/SLO definitions;
- incident communication process;
- data residency/regional deployment options where required;
- administrative controls and usage analytics;
- contractual data-processing/security controls.

Enterprise readiness is a customer-driven stage, not an MVP prerequisite.

## 3. Architecture Rule

The core must be **production-capable by architecture, not production-complete by feature count**.

The MVP must therefore establish stable interfaces for:

- `ModelProvider`
- `SandboxProvider`
- `ToolRegistry`
- `ArtifactStore`
- `StateStore`
- `PolicyEngine`
- `Identity/Auth`
- `Audit/EventStore`
- `Validator`

Concrete providers can remain simple during MVP, but the orchestration layer must depend on these contracts rather than vendor-specific implementations.

## 4. Environment Separation

Nuralabs must conceptually separate:

- local development;
- test/CI;
- preview/staging;
- production.

Rules:
- production secrets are never committed;
- production credentials are never exposed to the browser;
- test data must not silently become production data;
- destructive production actions require explicit policy/approval;
- deployments must be identifiable by version/commit;
- rollback must be possible for application releases.

## 5. Security Baseline

Security is part of the execution engine, not a later UI feature.

Minimum baseline:
- least-privilege credentials;
- server-side secret storage;
- tenant isolation;
- authorization on every protected resource;
- untrusted-content boundaries for web/files/tool output;
- prompt-injection resistance through policy and tool boundaries;
- no secrets in prompts, logs, artifacts, or model-visible context unless explicitly required and controlled;
- sensitive-data redaction where appropriate;
- safe tool scopes;
- approval gates for high-risk external writes;
- dependency and vulnerability monitoring.

## 6. Reliability Baseline

A production task is not successful merely because a model returned an answer.

The execution lifecycle remains:

`Goal → Plan → Persist → Execute → Observe → Retry/Recover → Validate → Artifact → Deliver`

Required reliability properties:
- explicit task/step states;
- timeout;
- cancellation;
- bounded retry;
- normalized provider errors;
- checkpoint/recovery where task duration warrants it;
- idempotency or duplicate-action protection for external writes;
- deterministic validation where possible;
- failure state that preserves evidence.

## 7. Observability Baseline

Every meaningful execution should be explainable through:

`tenant → task → step → provider/tool → input reference → execution result → validation → artifact → delivery`

Observability must support:
- debugging;
- cost analysis;
- reliability measurement;
- security investigation;
- customer support;
- incident analysis.

Do not log raw secrets or unnecessary sensitive content.

## 8. Data & Artifact Rules

Nuralabs treats generated work as an artifact with provenance.

Artifacts should carry, where applicable:
- task ID;
- step ID;
- owner/tenant;
- creation time;
- source/input references;
- model/provider metadata;
- tool/runtime metadata;
- validation status;
- version/reference;
- delivery status.

Data architecture must support isolation, retention, deletion, and export without coupling the product to one infrastructure vendor.

## 9. Production Gate

A release may be called **Production Ready** only when all of the following are true:

- real execution works in the intended runtime;
- critical paths have automated tests;
- failures are observable;
- retries are bounded;
- timeout/cancellation works;
- secrets are protected;
- tenant boundaries are tested;
- artifacts are traceable;
- validation prevents false completion on critical workflows;
- deployment and rollback are documented;
- production configuration is separated from development/test configuration;
- known critical security/reliability defects are resolved or explicitly accepted.

## 10. Enterprise Gate

A release may be called **Enterprise Ready** only after a real customer/use case requires enterprise controls and the relevant controls have been implemented and tested.

Enterprise readiness is evaluated per requirement, not by claiming generic "enterprise-grade" status.

Example:
- Customer requires SSO → implement and test SSO.
- Customer requires audit export → implement and test audit export.
- Customer requires dedicated runtime → implement and test isolation.
- Customer requires data residency → implement and verify regional data handling.

Do not build expensive enterprise infrastructure without a validated requirement.

## 11. Nura Products Rule

Every Nura Product inherits the Nuralabs Core readiness model.

A product such as Nura Web, Nura Project, Nura Lead, Nura Code, Nura Design, Nura Images, or Nura Slides should not independently reinvent execution, security, artifact, validation, or audit infrastructure.

Product-specific logic belongs above the Core.

## 12. What Must Not Happen

- Do not call a mock terminal a production sandbox.
- Do not claim production readiness because a demo works.
- Do not claim enterprise readiness because enterprise UI exists.
- Do not expose provider credentials client-side.
- Do not mark work complete without validation where validation is required.
- Do not add enterprise features merely to increase feature count.
- Do not couple business logic directly to one model/runtime vendor.
- Do not sacrifice tenant isolation for MVP speed.
- Do not allow external writes without appropriate scope and approval.

## 13. Strategic Principle

**Build the Core so production is a hardening path, not an architectural rewrite. Build enterprise capabilities only when real demand pulls them into the roadmap.**

This preserves the Nuralabs philosophy:

> **Demand menentukan produk. Nuralabs menyediakan mesinnya. Nura Products menyelesaikan pekerjaannya.**

And the quality principle:

> **Real work → verified work → reliable work → production work → enterprise work when demanded.**
