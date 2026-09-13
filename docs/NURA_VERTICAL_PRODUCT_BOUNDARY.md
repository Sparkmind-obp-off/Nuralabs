# NuraVertical — Product Boundary

**Status:** LOCKED STRATEGIC BOUNDARY

## 1. Definition

NuraVertical adalah lini Nura untuk kebutuhan bisnis/operasi yang berasal dari vertical nyata di dunia nyata.

Vertical berarti konteks bisnis atau domain tertentu, bukan sekadar kategori software.

## 2. Initial Real-World Domains

Contoh domain awal:
- Nura Barber
- Nura Cafe

Keduanya diperlakukan sebagai contoh domain nyata untuk dogfooding dan validasi, bukan alasan untuk langsung membangun dua platform besar.

Vertical lain dapat muncul dari bukti demand.

## 3. What Makes a Vertical Real

Sebuah vertical layak menjadi NuraVertical bila memiliki:
- pengguna nyata
- aktivitas nyata
- masalah berulang
- workflow yang dapat diamati
- willingness to use/pay atau bukti nilai yang kuat
- kebutuhan yang dapat dieksekusi/diukur

## 4. Product Pattern

NuraVertical mengubah kebutuhan operasional vertical menjadi workflow digital dan execution:

`Real Activity → Problem → Workflow → Product Surface → Nuralabs Execution → Verified Outcome`

Contoh Barber:
- customer/booking
- staff schedule
- service catalog
- customer history
- daily operations
- reporting

Contoh Cafe:
- menu
- order flow
- inventory
- staff operations
- promotions
- reporting

Daftar ini adalah contoh discovery, bukan scope final.

## 5. Digital vs Vertical Boundary

Jika masalahnya generik dan dapat digunakan lintas bisnis tanpa domain-specific behavior, pertimbangkan NuraDigital.

Jika masalahnya bergantung pada workflow, terminology, data, rules, dan operasi sebuah domain nyata, pertimbangkan NuraVertical.

Contoh:
- generic website → Digital
- barber appointment workflow → Vertical
- generic CRM automation → Digital
- cafe inventory workflow → Vertical

Keduanya tetap dapat memakai capability Digital yang sama.

## 6. Relationship to NuraHub

NuraHub menjadi pintu masuk. Intent dan konteks dapat mengarahkan user ke vertical yang sesuai.

## 7. Relationship to Nuralabs Core

NuraVertical tidak membuat execution engine sendiri. Semua vertical menggunakan Core untuk workflow execution, validation, evidence, artifacts, audit, policy, retry/recovery, dan delivery.

## 8. Vertical Creation Rule

Jangan membuat NuraVertical baru karena asumsi pasar saja.

Gunakan:

`Signal → Observation → Interview/Usage → Validation → Pilot → Repeatability → Productization`

## 9. Non-Goals

Jangan:
- membangun banyak vertical sekaligus
- membuat template generik lalu menyebutnya vertical
- mengunci roadmap hanya pada Barber/Cafe
- mengorbankan reusable Core demi satu vertical
- mengklaim demand tanpa evidence
