# Riset Genspark.ai — Referensi untuk Pembangunan Nuralabs

Dokumen ini merangkum seluruh riset tentang Genspark.ai sebagai referensi, dan memetakan tiap temuan ke keputusan konkret yang sudah/akan diambil untuk Nuralabs.

## 1. Latar Belakang Genspark

- Didirikan 2023 di Palo Alto oleh Eric Jing (CEO, eks-Microsoft Bing), Kay Zhu (CTO, eks-Google), Wen Sang (COO, PhD MIT).
- Awalnya mesin pencari AI ("Sparkpage"), pivot total April 2025 ke agentic AI ("Super Agent").
- Funding total $360 juta (3 putaran), valuasi $1,6 miliar (unicorn), investor termasuk Sequoia Capital China, Temasek.

**Relevansi untuk Nuralabs**: kita tidak punya funding sebesar ini — makanya seluruh keputusan stack diarahkan ke opsi gratis/murah dulu (lihat `roadmap.md` Fase 0-1), bukan meniru skala investasi mereka.

## 2. Model Bisnis

- Harga: $30/user/bulan untuk tim, model freemium untuk akuisisi awal.
- ARR $150-200 juta dalam setahun sejak pivot, dengan tim di bawah 30 orang — didorong efisiensi tinggi (80%+ kode dihasilkan AI) dan efek viral (fitur "Remix").
- Target pasar: enterprise (CBRE, lembaga pemerintah) + individual knowledge worker.

**Relevansi untuk Nuralabs**: model freemium + kredit per tugas adalah pola yang masuk akal ditiru (lihat `data-schema.md` tabel `subscriptions` dengan `credit_balance`). Skala tim kita jauh lebih kecil (solo), jadi target realistis bukan ARR ratusan juta dolar, tapi validasi use case dogfood dulu.

## 3. Arsitektur Teknis — Mixture of Agents

- 9+ model bahasa (GPT, Claude, Gemini, DeepSeek) dirutekan sesuai kompleksitas tugas, bukan satu model tunggal.
- 80+ tool terintegrasi (browsing, code exec, file gen, dst).
- Orkestrasi: model koordinator memecah permintaan jadi sub-tugas dan merutekan ke tool/model yang sesuai.

**Relevansi untuk Nuralabs**: ini persis pola 6-layer di `architecture.md` kita (Client → Auth → Orchestration → Tool → Model → Data/Infra). Bedanya, kita mulai dengan 2 model (Groq + Gemini) dan 1 tool (`code-exec`) dulu, bukan 9 model dan 80 tool sekaligus — filosofinya sama, skalanya jauh lebih kecil di awal.

## 4. Vendor & Infrastruktur

| Kategori | Vendor Genspark | Padanan Nuralabs |
|---|---|---|
| Sandbox eksekusi | E2B | E2B (sama) |
| Model AI | Anthropic, OpenAI, Fireworks, Fal | Groq, Gemini (gratis dulu) |
| Cloud | AWS + Azure + GCP (multi-cloud) | Cloudflare Pages (satu provider dulu) |
| Payment | Stripe | Duitku |
| Compliance | Vanta (SOC 2, ISO 27001/42001) | Belum relevan di tahap awal |

**Relevansi untuk Nuralabs**: pola "jangan bangun infra sendiri, pakai vendor pihak ketiga" sudah kita ikuti sepenuhnya (E2B untuk sandbox, model API pihak ketiga). Bedanya cuma skala — Genspark pakai 3 cloud sekaligus untuk redundansi skala enterprise, kita cukup 1 (Cloudflare) sampai ada alasan kuat untuk lebih.

## 5. Fitur Coding/Full-Stack (Genspark Code)

- Level otonomi L4 (merencanakan, coding, testing, deploy sendiri tanpa bimbingan tiap langkah).
- Stack default: Hono di Node.js, dioptimalkan untuk Cloudflare Pages.
- Bisa gonta-ganti model coding di tengah sesi kalau satu model gagal.
- Tetap butuh review manusia untuk keamanan, otorisasi, integritas data.

**Relevansi untuk Nuralabs**: sudah dipetakan penuh di `execution-engine.md` — kita mulai dari L3 (lebih terkontrol) dan naik ke L4 bertahap, bukan langsung klaim otonomi penuh sejak awal.

## 6. Perbandingan Kompetitif

- **Perplexity**: unggul untuk jawaban cepat & riset ringan, harga lebih murah ($20 vs Genspark $24,99). Genspark unggul untuk tugas yang jadi proyek (output jadi, bukan cuma jawaban).
- **ChatGPT Agent / Manus AI**: paling mirip Genspark Code dari sisi otonomi penuh.
- **Microsoft 365 Copilot**: ancaman kompetitif terbesar karena harga identik ($30/user/bulan) dengan distribusi bawaan di ekosistem Office.
- **Kelemahan Genspark**: tidak ada API publik untuk developer pihak ketiga.

**Relevansi untuk Nuralabs**: karena kita solo/kecil, tidak perlu bersaing head-to-head di fitur — justru celah "tidak ada API publik" milik Genspark bisa jadi arah diferensiasi jangka panjang (lihat `roadmap.md` Fase 5).

## 7. Estimasi Biaya (Referensi Internal)

Ringkasan dari perhitungan sebelumnya, sebagai acuan kalau nanti Nuralabs mulai scale:

- Skala 1.000 user, 10 tugas/bulan: ~$5.600-6.000/bulan (dominan biaya model API, ~70%).
- Skala solo/development: mendekati $0 (memanfaatkan tier gratis Groq, Gemini, E2B, Neon).

## 8. Identitas Brand

- Nama final: **Nuralabs** (dari eksplorasi nama "Ignis" → sudah terpakai kelas 35 → dialihkan ke turunan "Nurul" → "Nura" → "Nura" juga sudah dipakai CV lain → final "Nura Labs" / "Nuralabs").
- Repo: `github.com/Sparkmind-obp-off/Nuralabs`

---

## Dokumen Lain yang Bisa Dibuat Selanjutnya

Beberapa dokumen tambahan yang relevan untuk melengkapi fondasi ini:

1. **`competitive-positioning.md`** — versi lebih tajam dari bagian 6 di atas, khusus membahas di mana Nuralabs bisa berbeda dari Genspark/Perplexity/Manus (bukan cuma tiru, tapi cari sudut unik).
2. **`pricing-strategy.md`** — rencana harga & struktur kredit Nuralabs sendiri, disesuaikan pasar Indonesia (bisa lebih murah dari $24,99 Genspark karena biaya operasional lebih rendah).
3. **`security-notes.md`** — checklist keamanan dasar (validasi input, isolasi sandbox per user, penyimpanan API key) — penting sebelum ada pengguna nyata, meski belum perlu sertifikasi formal seperti SOC 2.
4. **`api-reference.md`** — begitu endpoint pertama (Fase 1) mulai dibangun, dokumentasi kontrak API (request/response format) supaya konsisten.
5. **`decision-log.md`** — catatan keputusan penting beserta alasannya (misalnya kenapa pilih E2B bukan Daytona, kenapa nama akhir Nuralabs) — berguna kalau nanti ada kontributor lain gabung dan bertanya "kenapa dulu begini?".

Dokumen mana yang mau dibuat duluan?
