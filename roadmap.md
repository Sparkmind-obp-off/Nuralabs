# Roadmap Nuralabs

## Fase 0 — Setup Fondasi (biaya ~$0)

Tahap membangun kerangka dasar sebelum ada logika agent apapun.

- [ ] Setup repo GitHub + deploy placeholder ke Cloudflare Pages
- [ ] Setup database Neon, aktifkan pgvector, buat tabel dasar (`users`, `tasks`)
- [ ] Daftar API key gratis: Groq, Google Gemini (Google AI Studio)
- [ ] Daftar E2B (tier Hobby gratis), uji jalankan satu sandbox sederhana
- [ ] Daftar akun Duitku (sudah selesai)

## Fase 1 — MVP Orchestration (masih gratis, testing)

Fokus: satu jenis tugas berjalan end-to-end, belum perlu banyak tool.

**Strategi dogfooding**: use case pertama dipilih dari kebutuhan nyata pembuatnya sendiri (bukan tugas hipotetis), supaya validasi kegunaan langsung terasa selama development.

**Use case pertama (dogfood)**: **otomasi coding/script kecil** — Nuralabs menerima instruksi bahasa natural (misal "buatkan script Python untuk rename semua file di folder ini sesuai pola tanggal"), lalu menghasilkan dan menjalankan script tersebut di sandbox E2B, mengembalikan hasil + kode yang bisa dipakai ulang.

- [ ] Bangun endpoint yang menerima permintaan pengguna
- [ ] Orchestrator versi minimal: kirim permintaan ke Groq/Gemini untuk generate kode
- [ ] Integrasi tool pertama: `code-exec` lewat E2B — jalankan script yang digenerate, tangkap output/error
- [ ] Kalau error, kirim balik error ke model untuk revisi otomatis (retry loop sederhana)
- [ ] Simpan riwayat tugas + kode yang dihasilkan ke database (Neon/D1) — supaya bisa dipakai ulang nanti
- [ ] Uji manual end-to-end pakai kebutuhan script asli sehari-hari milik sendiri

**Target keluaran fase ini**: bisa minta script kecil lewat bahasa natural, dieksekusi otomatis, dan hasilnya langsung terpakai — bukan cuma demo.

## Fase 2 — Perluasan Tool & Model

- [ ] Tambah tool kedua: `web-search`
- [ ] Tambah tool ketiga: `file-gen` (output dokumen/slide sederhana)
- [ ] Tambah logic routing: sub-tugas ringan → Groq, sub-tugas kompleks → siap-siap pindah ke model premium
- [ ] Tambah retry logic kalau satu langkah gagal

## Fase 3 — Siap Pengguna Pertama

- [ ] Bangun halaman auth (login/register)
- [ ] Bangun sistem kuota/kredit dasar per user
- [ ] Integrasi Duitku untuk pembayaran langganan
- [ ] Undang beberapa pengguna awal (beta tertutup) untuk feedback

## Fase 4 — Monetisasi & Model Premium

- [ ] Aktifkan Claude/GPT untuk sub-tugas kompleks (setelah ada revenue awal)
- [ ] Optimasi biaya: evaluasi mana sub-tugas yang benar-benar butuh model premium vs cukup model gratis
- [ ] Perbaikan UX berdasarkan feedback beta

## Fase 5 — Skala & Enterprise (jangka panjang)

- [ ] Pertimbangkan multi-cloud/redundansi kalau traffic naik signifikan
- [ ] Sertifikasi keamanan dasar (kalau mulai ada klien bisnis/enterprise)
- [ ] Buka API publik untuk developer pihak ketiga (celah yang belum digarap kompetitor)

## Prinsip Prioritas

1. Jangan bangun fitur sebelum use case inti (Fase 1) benar-benar jalan.
2. Jangan aktifkan model berbayar sebelum ada kebutuhan nyata dari pengguna.
3. Payment gateway baru relevan setelah ada produk yang layak dibayar (Fase 3), bukan lebih awal.

---

*Roadmap ini akan direvisi seiring berjalannya development — anggap sebagai arah, bukan jadwal kaku.*
