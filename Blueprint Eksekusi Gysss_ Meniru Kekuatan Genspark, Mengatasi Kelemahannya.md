# Blueprint Eksekusi Gysss: Meniru Kekuatan Genspark, Mengatasi Kelemahannya

**Tanggal:** 13 September 2026  
**Status:** Blueprint eksekusi awal  
**Prinsip:** Tiru mekanisme yang terbukti bernilai, bukan menyalin merek atau implementasi proprietary.

## 1. Keputusan Strategis

Gysss sebaiknya dibangun sebagai **AI Execution Workspace**. Pengguna tidak hanya bertanya kepada Gysss. Pengguna memberikan tujuan, data, dan batasan; Gysss merencanakan pekerjaan, menjalankan tool, menghasilkan artefak, memvalidasi hasil, dan meminta persetujuan ketika risikonya tinggi.

Posisi Gysss yang disarankan:

> **Gysss adalah workspace agentic yang menyelesaikan workflow bisnis secara dapat diaudit, bukan chatbot serbaguna yang hanya menghasilkan teks.**

Kita meniru arsitektur horizontal Genspark pada fondasinya, tetapi memenangkan pasar melalui **domain depth, trust, auditability, dan workflow yang spesifik untuk pengguna Gysss**.

## 2. Bagian Genspark yang Langsung Ditiru

| Kekuatan Genspark | Implementasi langsung di Gysss | Prioritas |
|---|---|---:|
| Satu chat untuk banyak pekerjaan | Satu command center untuk membuat task, melihat status, dan menerima hasil | P0 |
| Planner dan multi-agent | Task dipecah menjadi langkah dan dikerjakan oleh agent spesialis | P0 |
| Multi-model routing | Model murah untuk klasifikasi, model kuat untuk reasoning, model khusus untuk media | P0 |
| Tool execution | Agent dapat membaca database/file, menjalankan kode, browsing, dan memanggil API | P0 |
| Sandbox | Setiap task mendapat workspace terisolasi dan filesystem sementara | P0 |
| Parallel execution | Langkah independen berjalan paralel lalu disintesis | P1 |
| Reusable Skills | Workflow yang berhasil dapat disimpan sebagai Skill | P1 |
| Custom Agents | Pengguna dapat membuat agent domain dari instruksi dan template | P1 |
| Artefact-first output | Hasil utama berupa report, sheet, dashboard, deck, file, atau API result | P0 |
| Workspace memory | Project context, file, keputusan, dan preferensi disimpan dalam ruang tenant | P0 |
| Self-check | Setiap output melewati pemeriksaan struktur, sumber, angka, dan file | P0 |
| Credit/cost awareness | Setiap task menampilkan estimasi dan penggunaan compute | P1 |
| MCP/integration registry | Tool eksternal dipasang melalui kontrak integrasi yang konsisten | P2 |

Yang ditiru adalah **pola produk dan arsitektur umum**. Nama, desain visual, instruksi internal, data, dan kode proprietary Genspark tidak disalin.

## 3. Moat Gysss yang Harus Dibangun

### 3.1 Moat utama: Workflow Graph

Setiap task Gysss harus menghasilkan graph yang menghubungkan:

- tujuan pengguna;
- input data;
- langkah eksekusi;
- agent yang digunakan;
- tool yang dipanggil;
- keputusan manusia;
- bukti dan sumber;
- artefak akhir;
- metrik hasil.

Graph ini menjadi memori operasional Gysss. Semakin sering pengguna menjalankan pekerjaan, semakin baik sistem memahami pola kerja, pengecualian, dan standar hasil.

### 3.2 Moat kedua: Trusted Context

Gysss harus memiliki context yang lebih dapat dipercaya daripada AI workspace umum. Setiap data harus memiliki tenant, pemilik, sumber, timestamp, hak akses, dan status validitas.

Gysss tidak boleh mencampurkan:

- data antar organisasi;
- data publik dan privat tanpa label;
- fakta terverifikasi dan asumsi;
- instruksi pengguna dan instruksi dari dokumen yang tidak tepercaya.

### 3.3 Moat ketiga: Execution Reliability

Genspark menonjol karena agent melakukan pekerjaan nyata. Gysss harus mengambil aspek ini lebih serius dengan:

- idempotent tool call;
- retry yang aman;
- checkpoint setiap langkah;
- rollback untuk perubahan data;
- approval gate untuk tindakan berisiko;
- audit log yang tidak dapat diedit pengguna biasa;
- fallback ketika provider model atau API gagal.

### 3.4 Moat keempat: Domain Evaluation Set

Gysss harus membangun kumpulan evaluasi dari kasus nyata pengguna. Setiap perubahan model, prompt, atau tool diuji terhadap dataset evaluasi tersebut.

Evaluation set harus mencakup:

- tugas normal;
- tugas ambigu;
- data tidak lengkap;
- instruksi berbahaya;
- prompt injection;
- konflik antar sumber;
- hasil yang harus meminta approval;
- kegagalan tool;
- output yang harus ditolak.

Ini menghasilkan moat yang tidak terlihat tetapi sangat bernilai: **data evaluasi dan pengetahuan tentang failure mode domain Gysss**.

### 3.5 Moat kelima: Skill Marketplace yang Terkurasi

Skill bukan sekadar prompt yang disimpan. Skill Gysss harus memiliki:

- schema input;
- schema output;
- daftar tool yang boleh digunakan;
- level risiko;
- permission scope;
- versi;
- evaluation score;
- owner;
- changelog;
- tombol rollback.

Marketplace harus memprioritaskan skill yang teruji, bukan hanya skill yang paling banyak diklik.

## 4. Kelemahan Genspark yang Harus Langsung Kita Atasi

| Kelemahan umum | Solusi desain Gysss |
|---|---|
| Output agent kadang meyakinkan tetapi salah | Citation, evidence panel, confidence label, dan reviewer agent |
| Task panjang sulit diprediksi | Task graph, progress log, checkpoint, dan estimasi biaya/waktu |
| Credit usage dapat membingungkan | Cost preview sebelum eksekusi, breakdown per langkah, dan hard budget |
| Tool call berisiko | Permission scopes, dry run, approval gate, dan rollback |
| Integrasi eksternal rapuh | Contract test, health check, timeout, retry, circuit breaker |
| Prompt injection dari web/file | Untrusted-content boundary dan instruction hierarchy |
| Data privat berisiko bocor | Tenant isolation, encryption, secret vault, redaction, retention policy |
| Kualitas output tidak konsisten | Schema validation, deterministic templates, regression evaluation |
| Terlalu horizontal | Gysss memilih satu wedge domain dan membangun vertical workflow |
| Ketergantungan pada model tertentu | Provider abstraction dan model fallback |
| Vendor lock-in | Export data, export workflow, dan API terbuka |
| Agent terlalu otonom | Autonomy level per task: suggest, draft, execute with approval, execute automatically |

## 5. Arsitektur Target Gysss

```text
                    GYSSS WORKSPACE
  Chat | Task Board | Evidence Panel | Artifact Viewer
                           |
                           v
          Intent Parser + Tenant Context Loader
                           |
                           v
          Policy Engine + Risk Classifier + Budget Guard
                           |
                           v
              Planner / Router / Workflow Graph
                 |             |              |
                 v             v              v
          Domain Agents   Model Gateway    Tool Registry
                 |             |              |
                 +-------------+--------------+
                               v
                    Isolated Execution Runtime
             Browser | Code | Files | APIs | Connectors
                               |
                               v
                State Store + Memory + Artifact Store
                               |
                               v
              Validator + Evidence + Human Approval
                               |
                               v
             Delivery: Report | Sheet | Dashboard | API
```

### 5.1 Komponen wajib

| Komponen | Fungsi | Aturan desain |
|---|---|---|
| Workspace UI | Tempat pengguna memberi tujuan dan menerima hasil | Tampilkan status, bukan hanya chat bubble |
| Intent parser | Mengubah bahasa bebas menjadi task schema | Minta klarifikasi hanya jika berdampak material |
| Policy engine | Menentukan apa yang boleh dilakukan | Policy harus berjalan sebelum tool call |
| Risk classifier | Mengelompokkan risiko tindakan | Risiko tinggi selalu membutuhkan approval |
| Planner | Membuat langkah kerja | Simpan plan agar dapat diaudit dan diulang |
| Model gateway | Menyatukan banyak provider model | Provider dapat diganti tanpa mengubah workflow |
| Tool registry | Menyediakan tool dengan schema jelas | Least privilege dan typed input/output |
| Runtime | Menjalankan kode, browser, dan file | Isolasi per task dan batas resource |
| State store | Menyimpan status workflow | Checkpoint dan idempotency key |
| Memory layer | Menyimpan context yang sah | Tenant-scoped dan dapat diekspor |
| Validator | Memeriksa hasil | Tidak boleh menganggap output LLM benar secara default |
| Approval service | Menunggu keputusan manusia | Payload approval harus terlihat lengkap |
| Artifact store | Menyimpan hasil | Versioned, downloadable, dan memiliki provenance |

## 6. Model Otonomi Gysss

Jangan membuat semua agent langsung bebas bertindak. Gunakan empat level:

| Level | Nama | Contoh | Approval |
|---:|---|---|---|
| 0 | Observe | Membaca data dan memberi ringkasan | Tidak perlu |
| 1 | Draft | Membuat draft email atau laporan | Tidak perlu untuk menyimpan draft |
| 2 | Execute with approval | Mengirim email, memperbarui CRM, membuat perubahan bisnis | Wajib |
| 3 | Controlled autonomy | Menjalankan workflow rutin dengan batas nominal dan scope | Approval awal + policy guard |

Default Gysss harus berada pada Level 1. Kenaikan level membutuhkan izin eksplisit per workflow, bukan izin global yang terlalu luas.

## 7. Kontrak Tool

Semua tool harus mengikuti kontrak yang seragam:

```json
{
  "name": "update_customer_record",
  "description": "Memperbarui satu record pelanggan",
  "risk_level": "medium",
  "required_scopes": ["crm.customer.write"],
  "input_schema": {},
  "output_schema": {},
  "supports_dry_run": true,
  "idempotency_required": true,
  "audit_fields": ["actor", "tenant", "reason", "source_task"]
}
```

Tool tidak boleh menerima instruksi mentah tanpa schema. Tool juga harus mengembalikan status, bukti perubahan, dan error yang dapat dipahami agent.

## 8. Workflow Prioritas untuk MVP

Karena domain Gysss belum dinyatakan secara spesifik, MVP sebaiknya memilih workflow yang memenuhi empat syarat: berulang, memiliki nilai bisnis jelas, datanya tersedia, dan output-nya dapat diverifikasi.

### Tahap P0: Fondasi execution

1. Workspace dan project.
2. Chat-to-task.
3. Planner sederhana.
4. Model gateway.
5. File upload dan document extraction.
6. Tool registry.
7. Sandboxed code execution.
8. Artifact delivery.
9. Evidence dan audit log.
10. Approval gate.

### Tahap P1: Reusability

1. Save workflow as Skill.
2. Input/output schema Skill.
3. Versioning dan rollback.
4. Custom Agent berbasis template.
5. Parallel task execution.
6. Cost estimate dan budget cap.
7. Evaluation runner.

### Tahap P2: Ekosistem

1. Connector marketplace.
2. MCP-compatible adapter.
3. Skill marketplace terkurasi.
4. Team roles dan governance.
5. API publik.
6. Workflow export/import.
7. Usage analytics dan expansion billing.

## 9. KPI yang Harus Dipakai

Jangan hanya mengukur jumlah chat. Ukur keberhasilan kerja:

| KPI | Definisi |
|---|---|
| Task completion rate | Persentase task yang menghasilkan output valid |
| First-pass acceptance | Persentase output yang diterima tanpa revisi besar |
| Human intervention rate | Persentase task yang membutuhkan campur tangan manual |
| Time saved | Waktu manual yang dihemat per workflow |
| Evidence coverage | Persentase klaim penting yang memiliki bukti |
| Tool success rate | Persentase pemanggilan tool yang berhasil |
| Cost per completed task | Total biaya model/tool per task berhasil |
| Reuse rate | Persentase task yang menggunakan Skill tersimpan |
| Retention | Pengguna atau organisasi yang kembali menjalankan workflow |
| Expansion | Penambahan user, task, atau workflow dalam tenant |

North Star Metric yang disarankan:

> **Verified Business Outcomes per Active Tenant per Month.**

Artinya, bukan berapa banyak jawaban yang dibuat, tetapi berapa banyak hasil bisnis yang selesai dan lolos verifikasi.

## 10. Model Monetisasi Gysss

Gysss dapat meniru pola subscription + metering Genspark, tetapi harus lebih transparan:

| Paket | Target | Batas |
|---|---|---|
| Free/Trial | Eksplorasi | Task ringan, data terbatas, tanpa autonomous write |
| Pro | Individu profesional | Workflow rutin, credit pool, artifact storage |
| Team | Tim kecil | Shared skills, role, approval, audit |
| Business | Organisasi | SSO, tenant policy, retention, private connectors |
| Enterprise | Organisasi besar | SLA, private deployment option, procurement, compliance |

Setiap task harus menampilkan:

- estimasi credit sebelum mulai;
- provider/model yang mungkin dipakai;
- tool yang akan dipanggil;
- batas biaya maksimum;
- penggunaan aktual;
- alasan jika terjadi pembengkakan.

## 11. Aturan Build yang Tidak Boleh Dilanggar

1. Jangan mengizinkan agent menulis ke sistem eksternal tanpa scope dan approval.
2. Jangan menganggap keluaran LLM sebagai fakta tanpa evidence.
3. Jangan menyimpan secret di prompt, log, atau artifact.
4. Jangan membiarkan konten web mengubah system policy.
5. Jangan menggabungkan memory antar tenant.
6. Jangan membuat workflow tanpa timeout dan cancellation.
7. Jangan mengunci pengguna pada format proprietary.
8. Jangan merilis Skill tanpa regression test.
9. Jangan menjadikan jumlah fitur sebagai pengganti reliability.
10. Jangan membangun marketplace sebelum satu workflow inti memiliki retention.

## 12. Rencana Eksekusi 90 Hari

### Hari 1–14: Scope lock

Pilih satu domain dan satu workflow inti. Tetapkan input, output, data source, approval point, KPI, dan batas risiko. Buat 30–50 contoh kasus nyata sebagai evaluation set.

### Hari 15–35: Execution core

Bangun workspace, task schema, planner, model gateway, tool registry, artifact store, sandbox, dan audit log. Pada akhir tahap ini, satu workflow harus dapat berjalan dari input sampai artefak.

### Hari 36–55: Trust layer

Tambahkan evidence panel, citation, risk classifier, approval gate, cost preview, retry, checkpoint, dan tenant isolation. Jangan menunda lapisan ini sampai setelah pengguna bertambah.

### Hari 56–70: Reusability

Tambahkan Save as Skill, schema input/output, versioning, evaluation runner, dan template Custom Agent. Uji apakah workflow kedua dapat dibuat tanpa mengubah core engine.

### Hari 71–90: Pilot dan hardening

Jalankan pilot terbatas pada pengguna nyata. Ukur completion rate, first-pass acceptance, intervention rate, cost per task, dan time saved. Perbaiki failure mode sebelum menambah fitur baru.

## 13. Keputusan Akhir

Kita **langsung meniru** Genspark pada enam prinsip: satu workspace, agent orchestration, multi-model routing, tool execution, reusable workflow, dan artifact-first delivery.

Kita **tidak meniru** kelemahan yang mungkin muncul dari pendekatan horizontal: output tanpa bukti, otonomi tanpa batas, billing yang tidak transparan, memory tanpa governance, integrasi tanpa rollback, dan terlalu banyak fitur sebelum ada workflow yang benar-benar dipakai.

Moat Gysss harus dibangun di atas empat aset:

1. **Workflow Graph** yang merekam cara kerja nyata.
2. **Trusted Context** yang aman dan memiliki provenance.
3. **Execution Reliability** yang dapat diprediksi dan dipulihkan.
4. **Domain Evaluation Set** yang membuat kualitas meningkat dari waktu ke waktu.

Dengan pendekatan ini, Genspark menjadi benchmark untuk fondasi horizontal, sedangkan Gysss menjadi sistem yang lebih dalam, lebih aman, dan lebih dapat dipercaya untuk domain yang dipilih.

## Referensi

[1]: https://openai.com/index/genspark/ "Genspark ships no-code personal agents with GPT-4.1 and OpenAI Realtime API"

[2]: https://www.genspark.ai/helpcenter/super-agent "Super Agent — Genspark Help Center"

[3]: https://www.genspark.ai/helpcenter/custom-super-agent "Custom Agent — Genspark Help Center"

[4]: https://www.genspark.ai/helpcenter/membership-plans "Membership Plans — Genspark Help Center"

[5]: https://www.reuters.com/technology/artificial-intelligence/ai-startup-genspark-raises-100-million-compete-with-google-source-says-2025-02-21/ "AI startup Genspark raises $100 million to compete with Google, source says"

> **Catatan:** Blueprint ini sengaja tidak menyalin kode, prompt internal, data, merek, atau implementasi proprietary Genspark. Yang diadaptasi adalah pola produk dan prinsip arsitektur yang terlihat dari dokumentasi publik.

> **Asumsi Gysss:** Domain bisnis Gysss belum dijelaskan secara eksplisit. Karena itu, fondasi platform dibuat domain-agnostic dengan titik masuk untuk domain agents, data connectors, policies, dan workflows khusus Gysss.
