# NuraHub — Product Blueprint

**Status:** LOCKED STRATEGIC DEFINITION  

## 1. Definition

NuraHub adalah platform utama/entry point ekosistem Nura.

Fungsinya menghubungkan:

`User Need → NuraHub → NuraDigital / NuraVertical → Nuralabs Core → Verified Outcome`

NuraHub bukan sekadar landing page, dashboard, chatbot, atau website builder.

## 2. Role

NuraHub menjadi:
- front door ekosistem Nura
- workspace untuk menemukan/menjalankan pekerjaan
- routing surface menuju lini yang relevan
- tempat pengalaman lintas Digital dan Vertical dapat disatukan
- surface untuk melihat status pekerjaan dan hasil

## 3. Relationship to Core

NuraHub tidak memiliki execution engine yang terpisah.

Ia menggunakan Nuralabs Core melalui stable contracts:
- ModelProvider
- SandboxProvider
- ToolRegistry
- ArtifactStore
- StateStore
- PolicyEngine
- Validator
- Audit/EventStore

Core tetap menjadi source of execution truth.

## 4. User Experience

Pengguna tidak perlu memahami struktur internal Nuralabs.

UI idealnya dimulai dari kebutuhan:

`Apa yang ingin kamu selesaikan?`

Kemudian sistem menentukan apakah pekerjaan termasuk:
- Digital
- Vertical
- Cross-domain

Setelah itu workflow diarahkan ke capability yang sesuai.

## 5. Navigation Model

Konsep awal:

- Home / Workspace
- Digital
- Vertical
- Tasks / Work
- Artifacts / Results
- Activity / Evidence

Struktur final boleh berkembang berdasarkan penggunaan nyata.

## 6. Multi-Deployment

NuraHub dapat menjadi deployment tersendiri meskipun berbagi codebase dengan NuraDigital dan NuraVertical.

Contoh:

`hub.nura...` → NuraHub  
`digital.nura...` → NuraDigital  
`vertical.nura...` → NuraVertical

Domain aktual diputuskan kemudian.

## 7. MVP Boundary

NuraHub MVP harus fokus pada:
1. identity/session boundary
2. workspace
3. create task
4. task status
5. routing/entry to Digital or Vertical capability
6. execution visibility
7. verified artifact/result

Jangan membangun katalog besar sebelum workflow nyata terbukti.

## 8. Principle

**Hub menghubungkan. Core mengeksekusi. Digital dan Vertical menyelesaikan kebutuhan.**
