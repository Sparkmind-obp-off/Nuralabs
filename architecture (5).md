# Arsitektur Nuralabs

Dokumen ini menjelaskan alur data dan tanggung jawab tiap layer secara lebih rinci dari yang ada di README.

## Alur Permintaan (Request Flow)

```
Pengguna mengirim permintaan
        │
        ▼
[1] Client Interface Layer
        │  (validasi input dasar, kirim ke API)
        ▼
[2] Auth & Billing Layer
        │  (cek identitas user, cek sisa kuota/kredit)
        ▼
[3] Orchestration Layer
        │  (pecah permintaan jadi sub-tugas)
        │
        ├──► [4] Tool/Skill Layer ──► (browsing, code exec, file gen)
        │
        ├──► [5] Model Layer ──► (pilih model sesuai kompleksitas sub-tugas)
        │
        └──► [6] Data & Infra Layer ──► (simpan konteks, jalankan sandbox)
        │
        ▼
Hasil digabung oleh Orchestration Layer
        │
        ▼
Dikirim balik ke Client Interface Layer sebagai output jadi
```

## Detail Tiap Layer

### 1. Client Interface Layer
- Menerima input pengguna (teks, file, atau kombinasi).
- Menampilkan progres eksekusi agent secara transparan (bukan cuma loading spinner) — penting supaya pengguna percaya proses berjalan, bukan hasil instan.
- Menampilkan output akhir dalam format sesuai jenis tugas (dokumen, slide, tabel, dsb).

### 2. Auth & Billing Layer
- Autentikasi user (email/OAuth).
- Cek sisa kuota berdasarkan paket langganan.
- Mencatat pemakaian per tugas untuk keperluan metering dan tagihan.
- Terhubung ke Duitku untuk proses pembayaran/langganan.

### 3. Orchestration Layer
- Komponen inti yang membedakan produk ini dari sekadar wrapper chatbot.
- Menerima permintaan, menyusun rencana eksekusi (task plan).
- Memutuskan tool dan model mana yang dipanggil untuk tiap sub-tugas.
- Menangani retry jika satu langkah gagal, tanpa harus mengulang dari awal.
- Menggabungkan hasil dari berbagai sub-tugas jadi satu output koheren.

### 4. Tool / Skill Layer
Modul yang bisa dipanggil orchestrator, contoh awal yang direncanakan:
- `web-search`: mencari informasi terkini dari internet.
- `code-exec`: menjalankan kode di sandbox E2B.
- `file-gen`: menghasilkan dokumen/slide/spreadsheet dari data terstruktur.

Setiap tool sebaiknya dibuat modular (interface seragam) supaya gampang menambah tool baru tanpa mengubah orchestrator.

### 5. Model Layer
- Tahap awal: Groq (model open-source, gratis/cepat) untuk sub-tugas ringan seperti klasifikasi atau ekstraksi. Google Gemini sebagai cadangan/pelengkap di tier gratis.
- Tahap lanjut (setelah ada revenue): tambahkan Claude/GPT untuk sub-tugas yang butuh reasoning kompleks.
- Prinsip routing: sub-tugas sederhana ke model murah, sub-tugas kompleks ke model lebih mahal.

### 6. Data & Infra Layer
- **E2B**: sandbox microVM terisolasi untuk eksekusi kode per sesi agent.
- **Neon (pgvector) / Cloudflare Vectorize**: menyimpan embedding untuk memori jangka panjang dan semantic search.
- **Cloudflare D1**: menyimpan data relasional (user, riwayat tugas, log transaksi).

## Prinsip Desain

1. **Modular per layer** — tiap layer bisa diganti komponennya tanpa merombak layer lain (contoh: ganti Groq ke model lain tanpa mengubah orchestrator).
2. **Cost-aware routing** — orchestrator selalu mempertimbangkan biaya, bukan cuma kemampuan model, saat memilih model untuk sub-tugas.
3. **Transparent execution** — proses agent ditampilkan ke pengguna, bukan black box.

## Catatan

Dokumen ini akan diperbarui seiring implementasi berjalan — terutama bagian skema database dan interface tool begitu mulai coding.
