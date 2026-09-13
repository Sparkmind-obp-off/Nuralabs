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

- [ ] Bangun endpoint yang menerima permintaan pengguna
- [ ] Orchestrator versi minimal: kirim permintaan ke Groq/Gemini untuk memutuskan langkah
- [ ] Integrasi tool pertama: `code-exec` lewat E2B
- [ ] Simpan riwayat tugas ke database (Neon/D1)
- [ ] Uji manual end-to-end: input → proses → output

**Target keluaran fase ini**: satu use case sederhana bisa jalan penuh (misalnya "analisis dataset CSV lalu buat ringkasan").

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
