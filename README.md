# Nuralabs

Nuralabs adalah workspace eksekusi AI orisinal yang mengubah goal natural-language menjadi workflow yang terkontrol, observable, dan dapat diaudit:

`Goal → Plan → Model Gateway → Tool Contract → E2B Sandbox → Validation → Artifact → Audit`

MVP ini memprioritaskan reliability dan evidence, bukan jumlah fitur. Nuralabs bukan clone produk lain dan tidak memakai proprietary prompt, source code, atau aset pihak lain.

## Status Implementasi

### Selesai

- Workspace UI responsif untuk membuat dan memantau task.
- Signed anonymous tenant session melalui cookie `HttpOnly` + HMAC.
- Tenant-scoped task, artifact, dan audit API.
- State machine eksplisit: `pending → planning → running → validating → completed`, beserta `failed` dan `cancelled`.
- Persisted plan, task steps, checkpoints, normalized errors, cancellation request, dan bounded retry.
- Model gateway dengan adapter OpenAI-compatible dan Anthropic serta fallback terkontrol.
- Typed `code_exec` tool contract dengan scope, input/output validation, command allowlist, timeout, dan idempotency metadata.
- `SandboxProvider` milik Nuralabs dan adapter E2B nyata menggunakan SDK resmi.
- Validation layer yang mensyaratkan exit code sukses dan provenance E2B sebelum task dapat `completed`.
- Source-code artifact di D1 dengan provenance dan portable task JSON export.
- Audit trail dan redaksi secret sebelum error/output dipersist.
- 16 unit tests untuk state transitions, planner, tool contract, retry, timeout, redaction, sandbox boundary, dan validation.
- Local D1 migration, production build, API integration test, tenant-isolation test, dan browser console test.

### Belum dapat diaktifkan di produksi

- **D1 production:** akun Cloudflare telah mencapai batas 10 database. `nuralabs-production` belum dibuat dan `wrangler.jsonc` masih memakai placeholder `LOCAL_DATABASE_ID`.
- **E2B:** environment saat ini tidak memiliki `E2B_API_KEY` valid. Nilai `E2B_SANDBOX` yang tersedia ditolak SDK karena bukan key ber-prefix `e2b_`.
- **Model execution:** OpenAI-compatible credential saat ini mengembalikan respons free-plan non-JSON; Anthropic endpoint yang tersedia mengembalikan HTTP 404. Adapter sudah ada, tetapi kredensial/provider produksi yang berfungsi tetap diperlukan.
- Production Cloudflare Pages deploy ditahan agar tidak menerbitkan aplikasi yang mengklaim execution path palsu.

## Arsitektur dan Data

- **Runtime:** Cloudflare Pages Functions + Hono + TypeScript.
- **Source of truth:** satu Cloudflare D1 database; tidak ada split D1/Neon.
- **Sandbox:** E2B melalui `SandboxProvider` (`createSession`, `writeFiles`, `execute`, `readFiles`, `getLogs`, `kill`, `destroy`).
- **Artifacts:** konten MVP dan provenance disimpan tenant-scoped di D1 melalui metadata `d1://artifacts/<id>`.
- **Identity MVP:** signed anonymous tenant. OAuth/enterprise SSO sengaja di luar scope.
- **Autonomy:** Level 1; tidak ada automatic external write.

Tabel utama: `tenants`, `users`, `tasks`, `task_steps`, `artifacts`, dan `audit_events`. Lihat `migrations/0001_initial.sql`.

## Entry URIs

| Method | Path | Fungsi |
|---|---|---|
| `GET` | `/` | Workspace UI |
| `GET` | `/api/health` | D1 dan provider readiness tanpa membocorkan secret |
| `POST` | `/api/session` | Buat/pulihkan signed tenant session |
| `GET` | `/api/tasks` | Daftar task tenant aktif |
| `POST` | `/api/tasks` | Buat task (`goal`, optional `deliberateFailure`) |
| `GET` | `/api/tasks/:id` | Task, steps, artifacts, dan audit evidence |
| `POST` | `/api/tasks/:id/run` | Jalankan workflow task pending |
| `POST` | `/api/tasks/:id/cancel` | Request cancellation |
| `GET` | `/api/tasks/:id/export` | Ekspor portable workflow JSON |
| `GET` | `/api/tasks/:taskId/artifacts/:artifactId` | Download artifact tenant-scoped |

## Environment Variables

Semua nilai berikut server-side dan tidak boleh dimasukkan ke frontend atau git:

- `APP_SIGNING_SECRET` — wajib, minimal 32 karakter.
- `E2B_API_KEY` — wajib untuk eksekusi produksi, format resmi `e2b_...`.
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` — provider utama opsional.
- `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL` — fallback opsional.
- `MAX_TASK_BUDGET_USD` — default `0.25`.

Salin `.env.example` menjadi `.dev.vars` untuk pengembangan lokal. `.dev.vars` di-ignore oleh git.

## Menjalankan Lokal

```bash
npm install
npm run db:migrate:local
npm run build
pm2 start ecosystem.config.cjs
curl http://localhost:3000/api/health
```

Quality gates:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

Hasil terakhir: typecheck lulus, lint lulus, 7 test files/16 tests lulus, build lulus, production dependency audit menemukan 0 vulnerability, browser console menemukan 0 error setelah perbaikan.

## User Guide

1. Buka workspace dan masukkan task coding/script kecil.
2. Aktifkan **Test bounded retry** untuk memaksa satu failure yang dapat dipulihkan.
3. Klik **Create & execute**.
4. Pantau persisted workflow timeline, model/tool activity, retries, audit events, dan validation status.
5. Download source artifact atau ekspor task JSON setelah validation lulus.
6. Selalu review kode AI sebelum dipakai di produksi.

## Deployment

- **Target:** Cloudflare Pages BYOK, branch `main`.
- **Cloudflare project name:** `nuralabs`.
- **Status:** blocked oleh D1 account limit dan external provider credentials; belum ada URL produksi yang valid.
- **Preview sandbox:** URL bersifat sementara dan hanya untuk review pengembangan.

Langkah deployment berikutnya:

1. Kosongkan satu slot D1 atau setujui database kosong tertentu untuk dipakai Nuralabs.
2. Masukkan database UUID ke `wrangler.jsonc`, lalu jalankan migration remote.
3. Konfigurasikan `APP_SIGNING_SECRET`, model secret, dan `E2B_API_KEY` lewat `wrangler pages secret put`.
4. Verifikasi model generation dan real E2B execution, termasuk deliberate retry.
5. Buat/deploy Pages project dan verifikasi UI, health, tenant isolation, artifact download, serta failed-task path.

## Recommended Next Steps

- Selesaikan tiga blocker provider di atas, lalu jalankan acceptance test end-to-end produksi.
- Tambahkan authenticated identity provider setelah anonymous tenant flow stabil.
- Pindahkan artifact besar ke R2 di fase berikutnya; D1 cukup untuk source script kecil pada MVP.
- Tambahkan scheduled recovery melalui request-driven checkpoint resume, bukan long-running process.
- Bangun domain evaluation set untuk injection, ambiguity, tool failure, timeout, rejection, dan regression cases.

## Moat yang Diperkuat

- **Workflow Graph:** plan dan langkah eksekusi tersimpan sebagai data portable.
- **Trusted Context:** tenant ownership, provenance, dan trusted/untrusted prompt boundary.
- **Execution Reliability:** state machine, checkpoint, retry cap, timeout, cancellation, cleanup.
- **Verification:** completion hanya setelah evidence checks lulus.
- **Model Independence:** provider gateway dengan normalized fallback.
- **Portability:** provider-neutral interfaces dan task JSON export.
