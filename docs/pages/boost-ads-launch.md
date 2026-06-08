# Page: Boost Ads — Launch Ad Campaign

**Referensi:** `docs/reference/Boost Ads.jpg`
**Tema:** Dark
**Akses:** Menu atau fitur khusus di dalam proyek/kampanye → Boost Ads → tab "Launch Ads"

---

## Deskripsi Halaman

Halaman untuk membuat dan meluncurkan kampanye iklan Meta (Facebook & Instagram) langsung dari platform CreatorHub, terintegrasi dengan sistem yang disebut "Hydra". Pengguna mendefinisikan nama kampanye, tujuan, target views, dan anggaran, lalu lanjut ke pengaturan Ad Set dan konten kreatif.

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Breadcrumb: Projects / BGN          [Budget] [Quota]        │
├──────────────────────────────────────────────────────────────┤
│  Boost Ads                                                    │
│  Manage and launch Meta ad campaigns directly from Hydra.    │
├──────────────────────────────────────────────────────────────┤
│  [Launch Ads] [Create Audience] [Audience Manager] [Campaign]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  🚀 Launch a New Ad Campaign                         │  │
│   │  [Step 1: Campaign] [Step 2: Ad Set] [Step 3: Creative]│ │
│   │                                                      │  │
│   │  Campaign Name: [________________]                   │  │
│   │  Campaign Objective: [Awareness] [Engagement]        │  │
│   │  Total Target Views: [______] Cost (Rp): [_______]   │  │
│   │                                      [    Next    ]  │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Topbar

### Breadcrumb
- Format: **Projects / [Nama Proyek]**
- Contoh: *Projects / BGN*
- Ikon pesan/notifikasi di tengah topbar
- Ikon pengaturan di pojok kanan

### Stats Pojok Kanan Atas
Dua kartu info yang selalu terlihat di seluruh halaman Boost Ads:

| Label | Nilai Contoh | Keterangan |
|-------|-------------|------------|
| **Remaining Budget** | Rp 25,000,000 | Sisa anggaran iklan yang tersedia untuk proyek ini |
| **Remaining Quota** | 125,000 views | Sisa kuota tayang iklan |

---

## Header Halaman

- **Judul:** Boost Ads
- **Subjudul:** *"Manage and launch Meta ad campaigns directly from Hydra."*

---

## Tab Navigasi (Sub-fitur Boost Ads)

| Tab | Status | Deskripsi |
|-----|--------|-----------|
| **Launch Ads** | Aktif (underline) | Buat kampanye iklan baru |
| **Create Audience** | — | Definisikan target audiens (lihat halaman terpisah) |
| **Audience Manager** | — | Kelola audiens yang sudah tersimpan |
| **Campaign Manager** | — | Pantau dan kelola kampanye yang berjalan |

---

## Form: Launch a New Ad Campaign

### Header Form
- Ikon roket 🚀
- Judul: **"Launch a New Ad Campaign"**
- Deskripsi: *"Create a Meta ad campaign in three steps — define your campaign objective, configure your ad set targeting, and attach your creative content."*

### Stepper (3 Langkah)

```
① Campaign  →  ② Ad Set  →  ③ Ads Creative
```

| Step | Label | Status Awal |
|------|-------|-------------|
| 1 | Campaign | Aktif (bold/highlight) |
| 2 | Ad Set | Disabled (belum bisa diakses) |
| 3 | Ads Creative | Disabled (belum bisa diakses) |

---

### Step 1 — Campaign

#### Field: Campaign Name
- **Tipe:** Text input
- **Placeholder:** `e.g. Ramadan Awareness Q2`
- **Validasi:** Wajib diisi sebelum lanjut ke step berikutnya

#### Field: Campaign Objective
- **Tipe:** Toggle/radio button visual (dua opsi)
- **Opsi:**

| Opsi | Ikon | Keterangan |
|------|------|------------|
| **Awareness** | 👁 | Menjangkau sebanyak mungkin orang, meningkatkan brand recall |
| **Engagement** | 👍 | Mendorong interaksi (like, comment, share, klik) |

- Satu opsi dipilih, visual berubah menjadi highlighted/aktif

#### Field: Total Target Views (Quota)
- **Tipe:** Number input
- **Placeholder:** `e.g. 50000`
- **Keterangan:** Jumlah tayangan iklan yang ditargetkan, akan dipotong dari Remaining Quota

#### Field: Cost (Rupiah)
- **Tipe:** Number input
- **Placeholder:** `e.g. 10000000`
- **Keterangan:** Anggaran yang dialokasikan untuk kampanye ini, akan dipotong dari Remaining Budget

#### Tombol Navigasi
- **Next →** — tombol di pojok kanan bawah form, aktif setelah semua field wajib terisi

---

## Alur Lengkap (3 Step)

```
Step 1: Campaign
  → Isi Campaign Name, pilih Objective, isi Target Views & Cost
  → Klik "Next"

Step 2: Ad Set
  → Konfigurasi targeting (lokasi, demografi, minat, audiens)
  → Pilih audiens dari Audience Manager (atau buat baru)
  → Klik "Next"

Step 3: Ads Creative
  → Upload atau pilih materi iklan (gambar/video)
  → Isi teks iklan (headline, body copy, CTA)
  → Review & Launch
```

---

## Interaksi & Validasi

| Kondisi | Perilaku |
|---------|----------|
| Form kosong | Tombol "Next" disabled atau muncul error validasi |
| Anggaran melebihi Remaining Budget | Muncul peringatan / field merah |
| Quota melebihi Remaining Quota | Muncul peringatan / field merah |
| Semua field valid | Tombol "Next" aktif, navigasi ke Step 2 |
