# Execution Engine — Code & Full-Stack Building

Dokumen ini menjelaskan bagaimana Nuralabs mengeksekusi tugas coding/full-stack, terinspirasi dari pola yang dipakai Genspark Code namun disesuaikan skala tim kecil.

## Perbandingan Level Otonomi

| Level | Contoh Tool | Karakteristik |
|---|---|---|
| L3 (copilot) | Cursor, Lovable | Manusia membimbing tiap langkah, AI membantu |
| L4 (otonom) | Genspark Code, Claude Code | AI merencanakan, coding, testing, deploy sendiri |

**Target Nuralabs di awal**: mulai dari L3 (aman, mudah dikontrol), baru naik ke L4 bertahap setelah orchestrator cukup matang menangani retry dan validasi hasil.

## Stack Full-Stack Default (rencana)

Mengikuti pola yang sudah terbukti dipakai industri (termasuk Genspark Code):

- **Framework backend**: Hono (ringan, native untuk edge runtime)
- **Hosting**: Cloudflare Pages (sudah jadi keputusan stack kita)
- **Fitur bawaan yang wajib ada di starter**:
  - Autentikasi (auth)
  - Manajemen akun
  - Koneksi database (Neon/D1)
  - Struktur backend logic dasar

## Alur Eksekusi Tugas Coding

```
Permintaan pengguna ("buatkan landing page dengan form kontak")
        │
        ▼
Orchestrator memecah jadi sub-tugas:
  1. Generate struktur project (Hono + starter template)
  2. Generate komponen UI
  3. Generate backend endpoint (form handler)
  4. Hubungkan ke database
        │
        ▼
Tiap sub-tugas dieksekusi di sandbox E2B secara terisolasi
        │
        ▼
Hasil di-assemble jadi satu project utuh
        │
        ▼
Preview ditampilkan ke pengguna sebelum deploy final
```

## Fleksibilitas Model (Model Switching)

Terinspirasi dari fitur Genspark Code yang bisa gonta-ganti model coding di tengah sesi:

- Kalau satu model gagal/mentok di satu bagian kode, orchestrator bisa melempar sub-tugas yang sama ke model lain tanpa mengulang dari awal.
- Implementasi awal: cukup 2 model (Groq untuk percobaan cepat, model cadangan untuk kasus gagal).

## Batasan yang Harus Diakui ke Pengguna

Mengacu pada catatan penting soal Genspark Code — kode hasil generate AI **tetap perlu direview manusia**, khususnya untuk:
- Keamanan (validasi input, auth flow)
- Otorisasi (siapa boleh akses apa)
- Integritas data
- Keandalan untuk produksi

**Keputusan desain**: Nuralabs sebaiknya secara eksplisit memberi label/warning di UI kalau output adalah "prototipe, perlu direview" — bukan mengklaim siap produksi tanpa pengecekan, terutama di tahap awal produk.

## Skala Prioritas Implementasi

1. Dulukan use case sederhana (landing page statis, script analisis data) sebelum full-stack app dengan auth+database.
2. Baru tambah kemampuan generate full-stack lengkap (auth, backend, database) setelah use case sederhana stabil.
3. Fitur "connect ke GitHub repo pengguna" (seperti Claude Code/Genspark Code) masuk roadmap jangka panjang, bukan prioritas MVP.
