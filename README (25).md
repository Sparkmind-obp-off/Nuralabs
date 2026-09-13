# Nuralabs

Platform AI agent yang mengeksekusi tugas kompleks secara otonom — mulai dari riset, pembuatan dokumen, hingga eksekusi kode — dalam satu antarmuka, tanpa pengguna perlu mengelola tiap langkah secara manual.

## Konsep Produk

Nuralabs bukan chatbot biasa. Alih-alih hanya menjawab pertanyaan, sistem memecah permintaan pengguna menjadi rangkaian sub-tugas, memilih model AI dan tool yang paling sesuai untuk tiap sub-tugas, lalu mengeksekusinya hingga menghasilkan output siap pakai (dokumen, slide, kode, analisis data, dll).

## Arsitektur (Layered)

```
┌─────────────────────────────────────┐
│   Client Interface Layer             │  Web app, dashboard
├─────────────────────────────────────┤
│   Auth & Billing Layer               │  Multi-tenancy, kuota
├─────────────────────────────────────┤
│   Orchestration Layer                │  Task planning & routing
├─────────────────────────────────────┤
│   Tool / Skill Layer                 │  Web search, code exec, file gen
├─────────────────────────────────────┤
│   Model Layer                        │  Multi-LLM routing
├─────────────────────────────────────┤
│   Data & Infra Layer                 │  Vector DB, sandbox, storage
└─────────────────────────────────────┘
```

## Tech Stack

| Layer | Komponen | Keterangan |
|---|---|---|
| Model (dev/testing) | Groq, Google Gemini | Free tier untuk tahap awal |
| Model (produksi, nanti) | Claude / GPT | Diaktifkan setelah ada revenue |
| Sandbox eksekusi | E2B | Isolasi microVM per sesi agent |
| Hosting | Cloudflare Pages | Frontend + edge functions |
| Database relasional | Cloudflare D1 | Data user, task, transaksi |
| Vector database | Neon (pgvector) atau Cloudflare Vectorize | Memori/konteks agent, semantic search |
| Payment gateway | Duitku | Langganan & pembayaran (IDR) |

## Struktur Proyek (rencana)

```
nuralabs/
├── apps/
│   └── web/              # Frontend + API routes (Cloudflare Pages)
├── packages/
│   ├── orchestrator/     # Logika task planning & routing
│   ├── tools/            # Modul tool: search, code-exec, file-gen, dst
│   └── db/               # Schema & query database
├── docs/
│   ├── architecture.md
│   └── roadmap.md
└── README.md
```

## Status Proyek

🚧 Tahap awal — setup fondasi (hosting, database, koneksi model & sandbox) sebelum membangun orchestration layer.

## Roadmap Setup Awal

- [ ] Setup repo & deploy placeholder ke Cloudflare Pages
- [ ] Setup database Neon + tabel dasar (users, tasks)
- [ ] Koneksi API key Groq & Gemini
- [ ] Setup E2B, uji sandbox pertama
- [ ] Bangun orchestration layer versi minimal
- [ ] Integrasi Duitku untuk pembayaran

## Lisensi

Belum ditentukan.
