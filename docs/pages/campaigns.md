# Page: Campaigns — Creator Marketplace

**Referensi:** Source HTML `#campaignsView`
**Tema:** Light
**Akses:** Sidebar → Campaigns

---

## Deskripsi Halaman

Halaman **Campaigns** adalah pusat pengelolaan kampanye influencer marketing milik brand/advertiser. Di sini pengguna dapat melihat seluruh kampanye yang pernah dibuat, memantau progres deliverables, membedakan status kampanye (Active, Draft, Completed), serta membuat kampanye baru. Halaman ini dirancang untuk memberikan gambaran menyeluruh atas portofolio kampanye yang sedang berjalan maupun yang sudah selesai.

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Judul "Campaigns" + Deskripsi   [Create Campaign]      │
├─────────────────────────────────────────────────────────────────┤
│  Tab Filter: [All Campaigns] [Active] [Drafts] [Completed]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Campaign Card│  │ Campaign Card│  │ Campaign Card│          │
│  │  (Active)    │  │ (Completed)  │  │   (Draft)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Header Halaman

Bagian paling atas halaman terdiri dari dua kolom yang diatur secara horizontal (`justify-content: space-between`):

| Kolom | Elemen |
|-------|--------|
| Kiri | Judul **"Campaigns"** (H1) + teks deskripsi: *"Manage and track your active, draft, and completed campaigns"* |
| Kanan | Tombol **"Create Campaign"** dengan ikon `plus` (Lucide Icons) |

---

## Tab Filter

Baris tab di bawah header untuk memfilter kartu kampanye berdasarkan status. Hanya satu tab yang aktif pada satu waktu.

| Tab | `data-filter` | Deskripsi |
|-----|--------------|-----------|
| **All Campaigns** | `all` | Menampilkan semua kampanye tanpa filter (default aktif) |
| **Active** | `active` | Hanya menampilkan kampanye yang sedang berjalan |
| **Drafts** | `draft` | Hanya menampilkan kampanye yang masih dalam tahap draft |
| **Completed** | `completed` | Hanya menampilkan kampanye yang telah selesai |

Tab dengan class `active` menandai tab yang sedang dipilih. Secara default, tab "All Campaigns" memiliki class `active` saat halaman pertama dimuat.

---

## Campaigns Grid

Container dengan ID `campaignsGrid` menampung semua kartu kampanye dalam tata letak grid. Setiap kartu menggunakan class `campaign-card` disertai atribut `data-status` yang nilainya sesuai dengan status kampanye (`active`, `completed`, atau `draft`).

### Struktur Satu Campaign Card

```
┌──────────────────────────────────────────────────┐
│  [Category Badge]                [Status Badge]  │  ← Header kartu
├──────────────────────────────────────────────────┤
│  Judul Kampanye (H3)                             │
│  Deskripsi singkat kampanye                      │
├──────────────────────────────────────────────────┤
│  Budget: Rp X.XXX.XXX   Hired KOLs: X / X       │  ← Meta info
├──────────────────────────────────────────────────┤
│  Deliverables Progress              XX%          │
│  [████████████░░░░░░░░░░░░░░░░░░░░░]             │  ← Progress bar
├──────────────────────────────────────────────────┤
│  📅 Tanggal Mulai - Tanggal Selesai   [Tombol]   │  ← Footer kartu
└──────────────────────────────────────────────────┘
```

---

## Detail Elemen Campaign Card

### 1. Campaign Card Header

Berisi dua badge yang ditampilkan sejajar (kiri dan kanan):

**Category Badge** — menampilkan kategori industri kampanye.

| Kategori | Class CSS |
|----------|-----------|
| Travel | `category-travel` |
| Beauty | `category-beauty` |
| Tech | `category-tech` |

**Status Badge** — menampilkan status saat ini kampanye.

| Status | Class CSS | Warna Indikasi |
|--------|-----------|----------------|
| Active | `status-active` | Hijau (aktif berjalan) |
| Completed | `status-completed` | Abu-abu/biru tua (selesai) |
| Draft | `status-draft` | Kuning/oranye (belum dipublikasikan) |

---

### 2. Judul dan Deskripsi Kampanye

- **Judul** — elemen `<h3>`, nama kampanye yang ditetapkan brand.
- **Deskripsi** — paragraf singkat berisi ringkasan tujuan atau aktivitas kampanye.

---

### 3. Meta Info

Baris informasi ringkas dalam satu baris, dua kolom:

| Kolom | Format | Keterangan |
|-------|--------|-----------|
| **Budget** | `Budget: Rp X.XXX.XXX` | Total anggaran kampanye dalam Rupiah |
| **Hired KOLs** | `Hired KOLs: X / Y` | Jumlah KOL yang sudah direkrut dibanding target total slot KOL |

---

### 4. Progress Bar Deliverables

Menampilkan persentase kemajuan deliverables kampanye.

- **Label kiri:** teks "Deliverables Progress"
- **Label kanan:** persentase dalam angka (contoh: `40%`, `100%`, `0%`)
- **Bar visual:** elemen `<div class="progress-bar">` dengan `style="width: XX%"` untuk mengisi proporsi sesuai persentase

Pada kampanye **Completed** (progres 100%), progress bar menggunakan class tambahan `success-fill` untuk memberi warna berbeda (biasanya hijau penuh) sebagai penanda bahwa semua deliverables telah terpenuhi.

---

### 5. Footer Kartu

Berisi dua elemen yang diposisikan di kiri dan kanan:

| Posisi | Elemen | Detail |
|--------|--------|--------|
| Kiri | Rentang tanggal | Ikon kalender Lucide + format `D Mon - D Mon YYYY` |
| Kanan | Tombol aksi | Berbeda-beda tergantung status kampanye (lihat bagian berikutnya) |

---

## Tombol Aksi per Status Kampanye

Setiap status kampanye menampilkan tombol yang berbeda di footer kartu:

| Status | Label Tombol | Fungsi (Prototype) |
|--------|-------------|-------------------|
| **Active** | `Manage` | Belum diimplementasi — reserved untuk halaman manajemen kampanye |
| **Completed** | `View Report` | Belum diimplementasi — reserved untuk halaman laporan kampanye |
| **Draft** | `Edit Brief` | Belum diimplementasi — reserved untuk halaman editor brief kampanye |

> **Catatan Prototype:** Ketiga tombol aksi tersebut (`Manage`, `View Report`, `Edit Brief`) belum memiliki handler pada tahap prototype saat ini. Klik pada tombol-tombol ini tidak menghasilkan aksi apapun.

---

## Data Kampanye (Sampel)

### Tabel Perbandingan Tiga Kampanye

| Atribut | Summer Getaway 2025 | Beauty Fest Autumn | Next-Gen Tech Launch |
|---------|--------------------|--------------------|----------------------|
| **Status** | Active | Completed | Draft |
| **Kategori** | Travel | Beauty | Tech |
| **Deskripsi** | Promoting luxury beach villas and sustainable travel options across Bali | Launch campaign for the organic skin radiance serum series with micro KOLs | Unboxing and reviews for the premium mechanical keyboard lineup and gadgets |
| **Budget** | Rp 150.000.000 | Rp 80.000.000 | Rp 200.000.000 |
| **Hired KOLs** | 2 / 5 | 4 / 4 | 0 / 8 |
| **Progress Deliverables** | 40% | 100% | 0% |
| **Periode** | 1 Jun – 30 Jun 2025 | 15 Apr – 15 May 2025 | 1 Sep – 30 Sep 2025 |
| **Tombol Aksi** | Manage | View Report | Edit Brief |

---

## Detail per Campaign Card

### Campaign Card 1: Summer Getaway 2025

- **Status:** Active (`data-status="active"`)
- **Kategori:** Travel
- **Deskripsi:** Promoting luxury beach villas and sustainable travel options across Bali.
- **Budget:** Rp 150.000.000
- **Hired KOLs:** 2 dari 5 slot terisi
- **Progress:** 40% (bar terisi 2/5 dari total lebar)
- **Periode:** 1 Juni – 30 Juni 2025
- **Tombol:** `Manage`

---

### Campaign Card 2: Beauty Fest Autumn

- **Status:** Completed (`data-status="completed"`)
- **Kategori:** Beauty
- **Deskripsi:** Launch campaign for the organic skin radiance serum series with micro KOLs.
- **Budget:** Rp 80.000.000
- **Hired KOLs:** 4 dari 4 slot terisi (penuh)
- **Progress:** 100% (bar penuh, menggunakan class `success-fill`)
- **Periode:** 15 April – 15 Mei 2025
- **Tombol:** `View Report`

---

### Campaign Card 3: Next-Gen Tech Launch

- **Status:** Draft (`data-status="draft"`)
- **Kategori:** Tech
- **Deskripsi:** Unboxing and reviews for the premium mechanical keyboard lineup and gadgets.
- **Budget:** Rp 200.000.000
- **Hired KOLs:** 0 dari 8 slot (belum ada KOL yang direkrut)
- **Progress:** 0% (bar kosong)
- **Periode:** 1 September – 30 September 2025
- **Tombol:** `Edit Brief`

---

## Interaksi & Behavior

### Tab Filter

Mekanisme filter berbasis JavaScript yang menyembunyikan/menampilkan kartu berdasarkan nilai `data-status` pada elemen `.campaign-card`:

| Tab Dipilih | Kartu yang Ditampilkan |
|-------------|----------------------|
| All Campaigns | Semua kartu (`active`, `completed`, `draft`) |
| Active | Hanya kartu dengan `data-status="active"` |
| Drafts | Hanya kartu dengan `data-status="draft"` |
| Completed | Hanya kartu dengan `data-status="completed"` |

Tab yang aktif mendapatkan class `active` pada elemen button-nya. Saat tab baru diklik, class `active` berpindah ke tab yang baru dipilih.

---

### Tombol Create Campaign

- **Elemen:** `<button id="btnCreateCampaign">`
- **Ikon:** `plus` (Lucide Icons)
- **Behavior:** Menampilkan toast notification dengan pesan:

  > *"Campaign creation wizard available in standard plans."*

- **Keterangan:** Fitur ini merupakan fitur berbayar (standard plan). Pada versi prototype/free, tombol hanya menampilkan notifikasi toast tanpa membuka wizard/form pembuatan kampanye.

---

### Tombol Aksi Kartu (Manage / View Report / Edit Brief)

Ketiga tombol ini **belum diimplementasi** pada tahap prototype. Tidak ada handler JavaScript yang terpasang, sehingga klik pada tombol-tombol tersebut tidak menghasilkan respons apapun di prototype saat ini.

---

## Ringkasan Status Badge

| Status | Badge Label | Warna Badge | Warna Progress Bar | Tombol Aksi |
|--------|-------------|-------------|-------------------|-------------|
| **Active** | Active | Hijau | Default (biru/ungu) | Manage |
| **Completed** | Completed | Abu-abu / Biru tua | Hijau (`success-fill`) | View Report |
| **Draft** | Draft | Kuning / Oranye | Default (kosong/abu) | Edit Brief |
