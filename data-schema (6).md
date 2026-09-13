# Data Schema

Dokumen ini mendefinisikan struktur data awal Nuralabs. Skema ini akan berkembang seiring fitur bertambah — anggap sebagai starting point, bukan final.

## Ringkasan Tabel

| Tabel | Fungsi | Lokasi |
|---|---|---|
| `users` | Data akun pengguna | D1 atau Neon |
| `tasks` | Riwayat & status tugas agent | D1 atau Neon |
| `task_steps` | Sub-tugas per task (jejak eksekusi orchestrator) | D1 atau Neon |
| `embeddings` | Vector untuk memori/semantic search | Neon (pgvector) / Vectorize |
| `subscriptions` | Status langganan & kuota | D1 atau Neon |
| `transactions` | Riwayat pembayaran (dari Duitku) | D1 atau Neon |

## Detail Skema

### `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | |
| email | text, unique | |
| name | text | |
| created_at | timestamp | |
| plan | text | `free` / `paid` — merujuk ke `subscriptions` |

### `tasks`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK → users.id) | |
| prompt | text | Permintaan asli dari pengguna |
| status | text | `pending`, `running`, `done`, `failed` |
| output | text/json | Hasil akhir (bisa berupa link file, teks, dsb) |
| created_at | timestamp | |
| completed_at | timestamp, nullable | |

### `task_steps`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | |
| task_id | UUID (FK → tasks.id) | |
| step_order | integer | Urutan eksekusi |
| tool_used | text | Contoh: `web-search`, `code-exec`, `file-gen` |
| model_used | text | Contoh: `groq-llama3`, `gemini-flash` |
| status | text | `pending`, `running`, `done`, `failed` |
| result | text/json | Output dari sub-tugas ini |
| retry_count | integer, default 0 | |

### `embeddings`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK → users.id) | Untuk isolasi memori per user |
| source_type | text | Contoh: `task_output`, `uploaded_file` |
| source_id | UUID | Referensi ke record asal |
| vector | vector(1536) | Ukuran menyesuaikan model embedding yang dipakai |
| content_preview | text | Potongan teks asli untuk keperluan debug |
| created_at | timestamp | |

### `subscriptions`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK → users.id) | |
| plan_name | text | |
| credit_balance | integer | Sisa kuota/kredit tugas |
| renewed_at | timestamp | |
| expires_at | timestamp | |

### `transactions`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK → users.id) | |
| duitku_reference | text | ID referensi dari Duitku |
| amount | integer | Dalam rupiah |
| status | text | `pending`, `success`, `failed` |
| created_at | timestamp | |

## Keputusan Desain

1. **UUID sebagai primary key** di semua tabel — memudahkan kalau nanti perlu sinkronisasi data lintas layanan (D1 ↔ Neon) tanpa risiko bentrok ID.
2. **`task_steps` terpisah dari `tasks`** — supaya orchestrator bisa melacak progres tiap sub-tugas secara independen, penting untuk fitur retry dan transparansi eksekusi ke pengguna (lihat `execution-engine.md`).
3. **`embeddings` diisolasi per `user_id`** — mencegah kebocoran konteks antar pengguna saat melakukan semantic search.
4. **Pemisahan `subscriptions` dan `transactions`** — `subscriptions` mencerminkan status kuota saat ini, `transactions` adalah log historis pembayaran; keduanya punya siklus hidup berbeda.

## Belum Diputuskan (perlu keputusan sebelum implementasi)

- Apakah data relasional sepenuhnya di D1, sepenuhnya di Neon, atau split (misalnya `users`/`subscriptions` di D1, `embeddings` di Neon)?
- Ukuran dimensi vector menyesuaikan model embedding mana yang dipakai — perlu ditentukan begitu model embedding dipilih.
