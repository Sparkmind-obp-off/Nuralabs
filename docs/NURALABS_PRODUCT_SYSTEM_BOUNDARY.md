# Nuralabs Product System Boundary

**Status:** LOCKED STRATEGIC CONCEPT  
**Date:** 2026-09-13  
**Repository:** `Sparkmind-obp-off/Nuralabs`

## 1. Purpose

This document locks the strategic product boundary of Nuralabs without replacing or rewriting the existing implementation blueprints.

Nuralabs is the **core AI Work & Execution platform**. It is not a single narrow application and it is not a visual clone of another AI product.

The implementation documents already in this repository should be interpreted under this boundary.

## 2. Core Definition

> **Nuralabs adalah AI Work & Execution Core yang memungkinkan lahirnya produk-produk Nura berdasarkan kebutuhan nyata, lalu mengubah kebutuhan tersebut menjadi pekerjaan digital yang benar-benar dibuat, dijalankan, diverifikasi, dan dikirimkan.**

Short form:

> **Demand menentukan produk. Nuralabs menyediakan mesinnya. Nura Products menyelesaikan pekerjaannya.**

## 3. The Three-Layer Business Model

### Layer A — Demand Intelligence

Nuralabs continuously identifies real needs from sources such as:

- Threads
- marketplaces
- communities
- web
- social platforms
- direct requests
- other legitimate demand signals

The objective is not to collect noise. The objective is to detect repeated, credible problems and opportunities.

Flow:

`Sources → Demand Intelligence → Opportunity Database → Demand Scoring → Validated Opportunity`

### Layer B — Nuralabs Core

Nuralabs is the shared execution infrastructure that turns a validated need or direct user request into real work.

Core capabilities include:

- intent understanding
- planning and decomposition
- model/provider routing
- tool execution
- sandboxed execution
- workflow/state management
- validation
- evidence and provenance
- artifact handling
- approvals and policy controls
- retries and recovery
- delivery

Nuralabs must **BUILD, RUN, VERIFY, and DELIVER**. It must not define success as merely producing an AI response.

### Layer C — Nura Products

Nura Products are focused product experiences built on top of Nuralabs Core to solve validated categories of demand.

Examples may include:

- Nura Web
- Nura Project
- Nura Lead
- Nura Code
- Nura Design
- Nura Images
- Nura Slides
- Nura System
- other future Nura products

These are examples, not a fixed product roadmap.

## 4. Product Creation Rule

Future Nura products should **not** be invented simply because a feature sounds useful.

The default rule is:

`Real demand → repeated problem → validation → product opportunity → Nura Product → Nuralabs execution`

Therefore, the product portfolio is intentionally open-ended.

If real demand repeatedly appears for portfolio websites, Nura Web can be created or expanded.

If demand repeatedly appears for software development, Nura Code or another focused product can emerge.

If demand repeatedly appears for visual production, Nura Design or Nura Images can emerge.

If another problem becomes more valuable, Nuralabs can create another product around that problem.

## 5. Execution Flywheel

```text
Threads / Communities / Marketplaces / Web / Other Signals
                         ↓
                 Demand Intelligence
                         ↓
                 Opportunity Database
                         ↓
                   Demand Scoring
                         ↓
              Repeated Validated Need
                         ↓
                  Nura Product
                         ↓
                  Nuralabs Core
                         ↓
              BUILD → RUN → VERIFY
                         ↓
                     DELIVER
                         ↓
              Adoption / Payment
                         ↓
                Usage & Outcome Data
                         ↓
                 Better Intelligence
                         ↺
```

This is the central business loop.

## 6. What Nuralabs Is Not

Nuralabs is not:

- merely a chatbot
- merely an AI portal/dashboard
- merely a marketplace of AI tools
- merely a collection of Skills
- merely a wrapper around a model provider
- a requirement to build every possible Nura product upfront
- a requirement to clone Genspark or any other competitor

Genspark and other products may be studied for useful agentic mechanisms, but they do not define the Nuralabs product boundary.

## 7. Architecture Implication

The existing execution architecture remains valid, but its role is now explicit:

```text
                    NURALABS CORE
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
 Demand Intelligence   Execution Core   Shared Trust
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                 Nura Product Layer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     Nura Web        Nura Code       Nura Slides
        │                │                │
        └────────────────┼────────────────┘
                         ↓
               Real User Outcomes
```

The shared core should be reusable. Product-specific UX, workflows, policies, schemas, and domain logic can sit above it.

## 8. Relationship to the Existing Build Prompt

This document does **not** replace `docs/NURALABS_MASTER_BUILD_PROMPT.md`.

The Master Build Prompt remains the implementation authority for the current execution-core build.

This document is the strategic boundary above that implementation prompt.

The current MVP dogfood use case—coding/script execution—is an **execution-engine proving ground**, not a declaration that Nuralabs is permanently a coding product.

Likewise, E2B, Groq, Cloudflare, D1, or other infrastructure choices are implementation decisions, not the definition of the Nuralabs business itself.

## 9. Decision Rules

1. **Demand before product expansion.**
2. **Execution before conversation polish.**
3. **Real execution before simulated execution.**
4. **Verification before claiming completion.**
5. **Evidence before unsupported confidence.**
6. **Reusable core before duplicated product infrastructure.**
7. **Validate demand before building a new Nura Product.**
8. **Do not let competitor feature parity define the roadmap.**
9. **Do not expose provider secrets to users or browsers.**
10. **Keep provider and runtime abstractions portable.**

## 10. Strategic North Star

The ultimate measure is not the number of models, Skills, connectors, or product pages.

The North Star remains:

> **Verified Business Outcomes per Active Tenant per Month.**

Nuralabs wins when real needs become real, verified outcomes with less human effort, predictable cost, and trustworthy execution.

## 11. Final Lock

**Nuralabs = Core.**

**Nura Products = demand-driven products built on the Core.**

**Demand Intelligence = radar that discovers what should be built or solved next.**

**Execution Core = machine that turns intent into verified work.**

The system should therefore be built as an extensible engine capable of producing future Nura products, rather than as a collection of predetermined products.
