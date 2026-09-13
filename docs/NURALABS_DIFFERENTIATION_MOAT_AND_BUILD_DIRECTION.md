# NURALABS — DIFFERENTIATION, MOAT & BUILD DIRECTION

## 0. Purpose

Dokumen ini mengunci prinsip strategis Nuralabs setelah mempelajari pola produk agentic seperti Genspark.

**Tujuan kita bukan membuat "Genspark versi kecil".**

Genspark dipakai sebagai reference point untuk memahami kategori produk dan mekanisme yang terbukti bernilai. Nuralabs harus mengambil prinsip yang terbukti, memperbaiki kelemahan yang relevan, lalu membangun identitas, arsitektur, data model, workflow, dan moat milik sendiri.

> **Nuralabs = AI Execution Workspace yang menghasilkan pekerjaan nyata yang dapat diverifikasi, diaudit, dikontrol, dan digunakan ulang.**

Genspark adalah pembanding kategori, bukan blueprint implementasi proprietary.

---

## 1. Prinsip Awal yang Tidak Boleh Berubah

### 1.1 Jangan clone Genspark

Kita boleh meniru **mekanisme produk yang bersifat umum dan dapat dipahami publik**, seperti:

- task decomposition
- agentic execution
- tool use
- model routing
- sandbox execution
- reusable workflow/skill
- artifact-first output
- progress visibility
- iterative execution

Kita tidak boleh menyalin:

- proprietary prompts
- hidden system instructions
- source code
- private implementation
- private datasets
- private UI assets
- brand identity
- internal orchestration logic yang tidak diketahui publik

### 1.2 Jangan mengejar feature parity

Target Nuralabs bukan:

> "Semua yang Genspark punya harus kita punya."

Targetnya:

> "Untuk workflow yang kita pilih, Nuralabs harus lebih dapat dipercaya dan lebih berguna daripada chatbot biasa maupun generic agent workspace."

### 1.3 Execution > conversation

Chat hanyalah interface.

Nilai produk berada pada:

`Intent → Plan → Execute → Verify → Artifact → Evidence → Audit → Reuse`

### 1.4 Reliability > autonomy

Autonomy bukan tujuan akhir.

Autonomy harus tumbuh berdasarkan reliability.

Level:

- L0 Observe
- L1 Draft / Prepare
- L2 Execute with Approval
- L3 Controlled Autonomy
- L4 Higher Autonomy setelah evaluation membuktikan aman

Default awal: **L1**.

### 1.5 Evidence > confidence

LLM boleh menghasilkan jawaban, tetapi Nuralabs tidak boleh memperlakukan output model sebagai fakta hanya karena model terdengar yakin.

Setiap workflow yang membutuhkan factual correctness harus dapat membedakan:

- source/evidence
- model inference
- assumption
- user-provided information
- verified execution result

---

## 2. Apa yang Genspark Buktikan kepada Kita

Genspark saat ini menunjukkan bahwa kategori **agentic workspace** mempunyai nilai ketika AI tidak berhenti pada jawaban teks, tetapi memecah pekerjaan, memilih tools, menjalankan pekerjaan, dan menghasilkan artefak. Dokumentasi resminya menyebut Super Agent dapat merencanakan, memilih tools, menjalankan workflow, menggunakan connected apps/data, menyimpan workflow sebagai Skill, bekerja paralel, dan menggunakan sandbox/execution environment. citeturn0search2

AI Slides juga menunjukkan pentingnya workspace yang benar-benar menjadi tempat kerja: proses dapat dibangun live, diedit secara iteratif, memakai Skills, menjalankan kode untuk perhitungan, dan menghasilkan artefak yang dapat diekspor. citeturn0search3turn0search0

**Kesimpulan untuk Nuralabs:**

Kita harus mengambil pelajaran dari mekanisme tersebut, bukan mengejar tampilan atau feature list-nya.

---

## 3. Capability Benchmark: Yang Perlu Kita Ambil

| Mekanisme kategori | Mengapa bernilai | Nuralabs mengambil? | Cara Nuralabs membedakan |
|---|---|---:|---|
| One workspace | Mengurangi context switching | Ya | Workspace berbasis execution state, bukan chat-only |
| Planner | Mengubah goal menjadi pekerjaan | Ya | Plan harus persisted dan dapat diaudit |
| Multi-model routing | Mengoptimalkan kualitas/biaya | Ya | Model Gateway + policy + cost awareness |
| Tool execution | Membuat AI benar-benar bekerja | Ya | Typed Tool Contract + scopes + risk |
| Sandbox | Menjalankan code dengan aman | Ya | Provider abstraction + limits + validation |
| Parallel execution | Mempercepat workflow kompleks | Nanti | Hanya setelah state/checkpoint stabil |
| Reusable Skill | Membuat workflow dapat diulang | Ya, setelah core stabil | Skill harus punya schema + version + evaluation |
| Artifact output | Memberi hasil nyata | Ya | Provenance + validation + export |
| Workspace memory | Mempertahankan konteks | Ya, terbatas | Tenant-scoped + source-aware + retention |
| Connected tools/MCP | Memperluas kemampuan | Ya, bertahap | Least privilege + health/contract checks |
| Self-check | Mengurangi error | Ya | Validator + evaluation, bukan sekadar model critique |
| Cost visibility | Mengontrol biaya | Ya | Budget guard + cost estimate + usage ledger |

---

## 4. Weakness Pattern yang Harus Kita Jadikan Design Constraint

Kita tidak boleh mengklaim kelemahan produk kompetitor sebagai fakta absolut tanpa evidence. Namun secara kategori, agentic systems menghadapi failure modes yang harus Nuralabs desain sejak awal.

### 4.1 Long-running tasks dapat gagal atau kehilangan state

**Nuralabs response:**

- explicit task state machine
- checkpoints
- resumability
- timeout
- cancellation
- bounded retry
- idempotency
- execution timeline

### 4.2 Output agent dapat terlihat selesai padahal belum tervalidasi

**Nuralabs response:**

`completed` hanya boleh diberikan setelah validator menyatakan output memenuhi acceptance criteria.

UI tidak boleh memakai fake progress.

### 4.3 Agent dapat melakukan tool action yang terlalu luas

**Nuralabs response:**

Setiap tool memiliki:

- risk level
- required scopes
- input schema
- output schema
- timeout
- idempotency policy
- dry-run capability
- approval requirement

### 4.4 Prompt injection dan untrusted content

Web page, file, email, dokumen, dan tool output adalah **data**, bukan system instruction.

Nuralabs wajib memisahkan:

`trusted instruction → policy → user intent → untrusted content → tool output`

### 4.5 Model switching dapat menghasilkan behavior yang tidak konsisten

**Nuralabs response:**

Model Gateway harus menormalisasi:

- structured output
- errors
- usage
- latency
- provider/model identity
- fallback reason

Planner dan business logic tidak boleh bergantung pada SDK provider tertentu.

### 4.6 Credit/cost dapat menjadi sulit diprediksi pada task agentic

**Nuralabs response:**

Bangun:

- estimated cost
- budget ceiling
- usage tracking
- per-step cost metadata
- stop condition
- hard budget guard

### 4.7 Generic agent terlalu horizontal

**Nuralabs response:**

Nuralabs tidak boleh langsung mencoba menyelesaikan "semua pekerjaan untuk semua orang".

Kita memilih workflow wedge yang bisa dievaluasi dengan jelas.

---

## 5. Nuralabs Moat — Bukan Feature Count

Moat Nuralabs harus berada pada **execution infrastructure + trusted workflow data + evaluation**, bukan pada jumlah model yang didukung.

### Moat #1 — Workflow Graph

Representasikan pekerjaan sebagai graph:

`Goal → Context → Plan → Steps → Agents → Tools → Decisions → Evidence → Artifacts → Metrics`

Dengan demikian Nuralabs menyimpan struktur bagaimana pekerjaan diselesaikan, bukan hanya transcript chat.

### Moat #2 — Trusted Context Layer

Setiap context item memiliki metadata:

- tenant
- owner
- source
- timestamp
- validity
- sensitivity
- provenance
- confidence/status

Nuralabs harus dapat menjawab:

> "Dari mana informasi ini berasal dan mengapa agent boleh menggunakannya?"

### Moat #3 — Execution Reliability Layer

Bangun reliability primitives yang reusable:

- idempotent execution
- retry policy
- timeout
- checkpoint
- rollback where possible
- approval gate
- audit log
- provider fallback
- circuit breaker
- contract validation

Ini lebih sulit ditiru daripada sekadar membuat chat UI.

### Moat #4 — Domain Evaluation Dataset

Setiap workflow yang menjadi Skill harus mempunyai evaluation set.

Evaluation harus mencakup:

- normal case
- ambiguous request
- incomplete input
- conflicting sources
- tool failure
- malformed output
- prompt injection
- unsafe action
- user rejection
- regression case

Skill tanpa evaluation tidak boleh dipromosikan sebagai reliable Skill.

### Moat #5 — Execution Memory

Memory bukan sekadar "chat history".

Nuralabs menyimpan:

- workflow outcomes
- accepted/rejected artifacts
- failed steps
- successful tool/model combinations
- user corrections
- evaluation results

Tujuannya adalah meningkatkan execution quality, bukan memperpanjang context window.

### Moat #6 — Portable Workflows

User harus dapat:

- export workflow
- export artifacts
- export execution history sesuai permission
- import Skill/workflow
- replace model provider
- replace tool provider

**No lock-in by design.**

Ironisnya, portability dapat menjadi moat karena trust meningkat: user tahu sistem tidak mengunci data mereka.

---

## 6. Nuralabs Advantage Matrix

### Genspark / generic agent strength → Nuralabs response

| Strength yang perlu dipelajari | Risiko jika hanya ditiru | Nuralabs version |
|---|---|---|
| Autonomous execution | Bisa sulit diaudit | Controlled execution + audit |
| Banyak tools | Attack surface membesar | Typed registry + least privilege |
| Banyak model | Routing menjadi opaque | Explicit Model Gateway |
| Long tasks | State bisa kompleks | Persistent workflow graph |
| Skills | Skill bisa jadi black box | Version + schema + eval |
| Rich workspace | UI bisa menjadi dekorasi | UI berasal dari backend execution state |
| File/context handling | Data leakage risk | Provenance + tenant isolation |
| Browser/automation | External side effects | Approval + scope + dry-run |
| Parallel agents | Failure diagnosis sulit | Checkpoints + per-step observability |
| Generated artifacts | Bisa tidak terverifikasi | Validator + evidence + acceptance criteria |

---

## 7. Posisi Produk Nuralabs

### Jangan mengatakan

> "Nuralabs adalah Genspark clone."

### Jangan mengatakan

> "Nuralabs adalah Genspark versi open-source/kecil."

### Positioning yang diinginkan

> **Nuralabs adalah AI Execution Workspace untuk menjalankan workflow bisnis yang dapat diverifikasi dan diaudit.**

Alternative short positioning:

> **From AI answers to verified work.**

Internal product thesis:

> **AI tidak cukup pintar untuk dipercaya hanya karena bisa menjawab. AI menjadi valuable ketika pekerjaannya dapat dieksekusi, diverifikasi, diaudit, dan digunakan ulang.**

---

## 8. First Wedge

Kita tidak membangun generic Super Agent terlebih dahulu.

First wedge harus memiliki:

1. input jelas
2. execution jelas
3. output jelas
4. validation jelas
5. measurable success
6. repeatability tinggi

Untuk MVP, coding/script execution tetap menjadi **dogfood workflow**, bukan positioning final produk.

Dogfood:

`Natural language coding request → plan → generate → sandbox → error → bounded retry → validate → artifact → audit`

Setelah execution core terbukti, workflow domain dapat dipilih berdasarkan demand validation.

---

## 9. Strategic Sequence

### Stage 1 — Execution Core

Bangun:

- task model
- planner
- model gateway
- tool registry
- sandbox
- validator
- artifacts
- audit
- state machine

### Stage 2 — Trust Layer

Bangun:

- tenant isolation
- permissions
- provenance
- risk classification
- approval gates
- secret redaction
- budget guard

### Stage 3 — Reusability

Bangun:

- workflow save
- Skill schema
- versioning
- evaluation runner
- workflow cloning
- workflow import/export

### Stage 4 — Connectors

Bangun:

- MCP adapter
- API connector layer
- health checks
- contract tests
- OAuth/credential abstraction
- scoped actions

### Stage 5 — Domain Intelligence

Baru setelah execution infrastructure stabil:

`Demand Intelligence → Opportunity Database → Scoring → Action`

Nuralabs kemudian menjadi execution layer yang dapat mengubah opportunity menjadi real work.

### Stage 6 — Marketplace / Platform

Hanya setelah ada workflow yang benar-benar digunakan berulang.

Jangan membangun marketplace hanya karena terlihat seperti fitur kompetitor.

---

## 10. What We Should NOT Build Yet

Jangan implementasikan semua ini pada MVP hanya untuk mengejar Genspark:

- 100+ Skills
- massive connector marketplace
- unrestricted browser agent
- autonomous email sending
- autonomous financial transactions
- complex multi-agent swarm
- enterprise SSO
- full billing/credits marketplace
- cross-tenant global memory
- giant model catalog
- polished visual cloning of competitor UI

Semua itu boleh menjadi future capability setelah core evidence tersedia.

---

## 11. Build Decision Rule

Setiap feature baru harus menjawab minimal satu pertanyaan:

1. Apakah ini meningkatkan task completion?
2. Apakah ini meningkatkan first-pass acceptance?
3. Apakah ini meningkatkan evidence coverage?
4. Apakah ini menurunkan human intervention?
5. Apakah ini menurunkan cost per completed task?
6. Apakah ini meningkatkan workflow reuse?
7. Apakah ini meningkatkan safety/trust?

Jika jawabannya tidak, feature ditunda.

---

## 12. North Star

Jangan memakai jumlah fitur atau jumlah model sebagai North Star.

### North Star Metric

> **Verified Business Outcomes per Active Tenant per Month**

Supporting metrics:

- task completion rate
- first-pass acceptance
- human intervention rate
- time saved
- evidence coverage
- tool success rate
- cost per completed task
- workflow reuse rate
- retained active workflows
- expansion from one workflow to multiple workflows

---

## 13. Implementation Directive for AI Builder

AI builder seperti Genspark boleh digunakan untuk menulis implementasi Nuralabs.

Tetapi builder wajib memahami:

> **Genspark adalah execution environment untuk membangun Nuralabs, bukan product specification Nuralabs.**

Ketika ada dua pilihan:

- pilihan A: membuat Nuralabs terlihat seperti Genspark
- pilihan B: membuat Nuralabs lebih reliable, observable, verifiable, dan portable

**Selalu pilih B.**

AI builder harus:

1. membaca seluruh blueprint repository sebelum coding
2. membaca dokumen ini dan `NURALABS_MASTER_BUILD_PROMPT.md`
3. mempertahankan prinsip non-cloning
4. tidak menghapus blueprint lama
5. membuat implementation decision log bila keputusan berubah
6. tidak menambahkan feature hanya untuk feature parity
7. menulis tests untuk reliability primitives
8. membuktikan integration nyata sebelum mengklaim selesai
9. melaporkan limitation secara eksplisit
10. berhenti dan meminta keputusan manusia bila perubahan arsitektur besar diperlukan

---

## 14. Final Product Thesis

Genspark memberi kita bukti bahwa AI workspace yang dapat melakukan pekerjaan nyata adalah kategori yang masuk akal.

Tetapi Nuralabs tidak perlu menang dengan menjadi Genspark yang lebih besar.

Nuralabs harus menang dengan menjadi **lebih dapat dipercaya untuk workflow tertentu**.

Moat kita dibangun dari:

`Workflow Graph + Trusted Context + Reliable Execution + Evaluation Data + Reusable Skills + Portability`

Bukan dari:

`More Models + More Buttons + More Agents`.

### Final principle

> **Tiru mekanisme yang terbukti bernilai. Jangan tiru produk. Perbaiki failure modes. Bangun execution infrastructure dan evaluation data yang menjadi milik kita sendiri.**
