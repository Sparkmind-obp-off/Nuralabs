# Nura Ecosystem — Master Boundary

**Status:** LOCKED STRATEGIC BOUNDARY  
**Date:** 2026-09-14  

## 1. Purpose

Nura adalah master brand. Nuralabs bukan nama untuk satu aplikasi sempit, melainkan execution platform/core yang memungkinkan seluruh lini Nura membangun dan menjalankan pekerjaan nyata.

The ecosystem follows:

`Nura → NuraHub / NuraDigital / NuraVertical → Nuralabs Core → Execution`

## 2. Three Business Surfaces

### NuraHub

Platform utama dan entry point ekosistem Nura. Hub menghubungkan kebutuhan pengguna dengan kapabilitas Nura Digital dan Nura Vertical, serta menjadi tempat orkestrasi pengalaman lintas lini bila dibutuhkan.

NuraHub bukan pengganti Nuralabs Core. Hub adalah product surface; Core adalah execution engine.

### NuraDigital

Lini untuk kebutuhan digital yang dapat dijual, dibangun, dijalankan, diverifikasi, dan dikirim sebagai pekerjaan digital.

Contoh awal:
- Website dan web application
- Business system
- Automation
- Code/software work
- Design/content/digital assets
- Integrations/API
- Digital operations

Produk turunan tidak dikunci dari awal. Produk muncul berdasarkan demand yang tervalidasi.

### NuraVertical

Lini untuk kebutuhan yang berakar pada vertical bisnis atau aktivitas nyata di dunia nyata.

Contoh vertical awal yang dapat menjadi domain nyata:
- Barber
- Cafe
- Property
- Education
- Other real businesses/organizations validated by demand

NuraVertical bukan sekadar template industri. Setiap vertical harus memiliki masalah, workflow, pengguna, dan bukti kebutuhan yang nyata.

## 3. The Core

Nuralabs Core menyediakan kemampuan bersama:

`Understand → Plan → Execute → Observe → Validate → Artifact → Deliver`

Core mencakup workflow/state management, model gateway, tool execution, sandbox execution, policy/risk controls, validation, evidence, artifacts, audit, retry/recovery, dan delivery.

Implementasi teknis saat ini tetap mengikuti `NURALABS_MASTER_BUILD_PROMPT.md` dan readiness contract yang sudah ada.

## 4. Demand Model

Nura tidak membangun vertical hanya karena terlihat menarik.

Urutan keputusan:

`Real Demand → Opportunity → Validation → Product Surface → Nuralabs Execution → Outcome → Learning`

Demand dapat datang dari:
- direct activity
- real businesses
- customer conversations
- marketplaces
- communities
- social platforms
- web signals
- operational usage

Threads adalah salah satu source, bukan satu-satunya sumber kebenaran.

## 5. Product Boundary

- **Nura** = master brand.
- **NuraHub** = primary ecosystem/product surface.
- **NuraDigital** = digital-work business line.
- **NuraVertical** = real-world vertical business line.
- **Nuralabs Core** = shared AI work & execution engine.

Jangan menggabungkan nama-nama tersebut menjadi satu produk yang membingungkan.

## 6. Deployment Principle

Satu codebase/monorepo boleh melayani beberapa deployment selama boundary aplikasi, konfigurasi, routing, secrets, data access, dan deployment target tetap jelas.

Target deployment minimum dapat berupa:
- NuraHub
- NuraDigital
- NuraVertical

Pemecahan menjadi repository terpisah hanya dilakukan bila ada alasan teknis/operasional yang nyata. Multi-deployment tidak otomatis berarti multi-repository.

## 7. Non-Goals

Jangan:
- menghidupkan kembali NuraWeb sebagai master product
- membangun semua vertical sekaligus
- membuat marketplace sebelum core terbukti
- menganggap semua ide sebagai product
- membuat UI terpisah tanpa execution path
- memalsukan demand atau execution
- mengorbankan tenant/security boundary demi kecepatan

## 8. North Star

**Verified Business Outcomes per Active Tenant per Month.**

Nura menang ketika kebutuhan nyata berubah menjadi pekerjaan yang benar-benar selesai dan menghasilkan outcome terverifikasi.

## 9. Naming Decision

Nama **NuraWeb/NuraWebs** tidak lagi menjadi platform utama. Nama yang dikunci untuk platform utama adalah **NuraHub**.

Domain brand utama dapat menggunakan domain Nura yang tersedia dan layak secara legal/komersial; keputusan domain bukan definisi arsitektur.
