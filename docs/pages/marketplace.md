# Page: Marketplace — CreatorHub.id

**View ID:** `marketplaceView`
**Route / Akses:** Halaman default setelah login (landing view utama)
**Tema:** Light
**Bahasa UI:** Indonesia / English (mixed)

---

## Deskripsi Halaman

Marketplace adalah halaman utama CreatorHub.id yang tampil pertama kali setelah pengguna berhasil login. Halaman ini berfungsi sebagai pusat pencarian dan penemuan kreator/KOL (Key Opinion Leader) yang terdaftar di platform.

Pengguna (brand, agency, atau marketing manager) dapat:
- Menelusuri ribuan kreator berdasarkan berbagai kriteria filter
- Melihat statistik ringkas performa platform secara keseluruhan
- Memilih kreator untuk diundang ke kampanye aktif
- Menyimpan kreator favorit ke daftar shortlist

---

## Layout Keseluruhan

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Page Title Section]                                                │
│   Creator Marketplace                                                │
│   Find the right creators for your campaign                          │
├──────────────────────────────────────────────────────────────────────┤
│  [Stats Grid — 4 kartu ringkasan]                                    │
│   Total Creators | Active Campaigns | Avg. Engagement | Budget      │
├──────────────────────────────────────────────────────────────────────┤
│  [Filters Section]                                                   │
│   [Category▼] [Platform▼] [Location▼] [Followers▼]                 │
│   [Engagement▼] [Price Range▼] [Verified▼] [Reset Filters]         │
│   ──────────────────────────────────────────────────────            │
│   Sort by: [Relevance▼]          [Grid | List] toggle               │
├──────────────────────────────────────────────────────────────────────┤
│  [Creator Grid — id="creatorGrid"]                                   │
│   [Kartu 1] [Kartu 2] [Kartu 3] [Kartu 4] [Kartu 5] [Kartu 6]     │
│   [Kartu 7] [Kartu 8] ...                                           │
├──────────────────────────────────────────────────────────────────────┤
│  [Pagination]                                                        │
│   ← Previous   Halaman X dari Y • Menampilkan A–B dari N KOL   Next →│
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Page Title Section

Bagian header halaman yang memberikan konteks singkat.

| Elemen | Konten |
|--------|--------|
| Judul (`<h1>`) | **Creator Marketplace** |
| Subjudul (`<p>`) | *Find the right creators for your campaign* |

---

## 2. Stats Grid — Kartu Ringkasan Platform

Empat kartu statistik yang ditampilkan dalam satu baris (grid 4 kolom), memberikan gambaran performa platform secara real-time.

| # | Label | Nilai | Perubahan |
|---|-------|-------|-----------|
| 1 | **Total Creators** | 12.842 | +18,6% vs bulan lalu |
| 2 | **Active Campaigns** | 156 | +12,4% |
| 3 | **Avg. Engagement Rate** | 3,87% | +0,6% |
| 4 | **Budget Managed** | Rp 8,42 Miliar | +24,7% |

Semua perubahan ditampilkan dalam format delta positif dengan warna hijau, mengindikasikan pertumbuhan platform.

---

## 3. Filters Section

Bagian filter adalah komponen sentral halaman Marketplace. Pengguna dapat mempersempit hasil pencarian menggunakan kombinasi filter dropdown dan quick filter toggle.

### 3.1 Dropdown Filter

Tujuh dropdown filter tersedia dalam satu baris:

#### Category
Kategori konten kreator.

| Nilai | Keterangan |
|-------|-----------|
| All | Semua kategori (default) |
| Lifestyle | Gaya hidup sehari-hari |
| Travel | Perjalanan dan wisata |
| Beauty | Kecantikan dan perawatan |
| Tech | Teknologi dan gadget |
| Food | Kuliner dan makanan |
| Sports | Olahraga dan kebugaran |

#### Platform
Platform media sosial utama kreator.

| Nilai | Keterangan |
|-------|-----------|
| All | Semua platform (default) |
| Instagram | Kreator aktif di Instagram |
| TikTok | Kreator aktif di TikTok |
| YouTube | Kreator aktif di YouTube |

#### Location
Kota domisili kreator.

| Nilai |
|-------|
| All (default) |
| Jakarta |
| Bandung |
| Surabaya |
| Yogyakarta |
| Bali |
| Medan |
| Makassar |
| Balikpapan |
| Semarang |
| Palembang |

Total 10 pilihan kota + opsi "All", mencakup 11 kota besar di Indonesia.

#### Followers
Rentang jumlah pengikut kreator (gabungan seluruh platform).

| Nilai | Keterangan |
|-------|-----------|
| Any | Semua jumlah (default) |
| < 300K | Di bawah 300.000 followers |
| 300K – 500K | Antara 300.000 hingga 500.000 |
| 500K – 700K | Antara 500.000 hingga 700.000 |
| 700K+ | Di atas 700.000 followers |

#### Engagement Rate
Tingkat keterlibatan audiens terhadap konten kreator.

| Nilai | Keterangan |
|-------|-----------|
| Any | Semua tingkat (default) |
| < 3% | Engagement rendah |
| 3% – 4% | Engagement rata-rata |
| 4% – 5% | Engagement baik |
| 5%+ | Engagement sangat tinggi |

#### Price Range
Rentang harga kolaborasi per kreator.

| Nilai | Keterangan |
|-------|-----------|
| Any | Semua harga (default) |
| < Rp 7 Juta | Di bawah Rp 7.000.000 |
| Rp 7 Juta – 10 Juta | Antara Rp 7.000.000 – Rp 10.000.000 |
| Rp 10 Juta – 13 Juta | Antara Rp 10.000.000 – Rp 13.000.000 |
| Rp 13 Juta+ | Di atas Rp 13.000.000 |

#### Verified
Status verifikasi akun kreator.

| Nilai | Keterangan |
|-------|-----------|
| Any | Semua status (default) |
| Verified | Hanya kreator terverifikasi |
| Unverified | Hanya kreator belum terverifikasi |

### 3.2 Tombol Reset Filters

Tombol **"Reset Filters"** mengembalikan semua dropdown ke nilai default (`All` / `Any`) sekaligus. Muncul di ujung kanan baris filter.

### 3.3 Quick Filter Toggles (Topbar)

Tiga toggle cepat yang dapat diaktifkan/dinonaktifkan secara independen:

| Toggle | Ikon | Status Default | Fungsi |
|--------|------|----------------|--------|
| **Top Rated** | 🔥 | Nonaktif | Tampilkan hanya kreator dengan rating tertinggi |
| **Fast Response** | ⚡ | Nonaktif | Tampilkan hanya kreator yang cepat merespons |
| **Verified Only** | ✓ | **Aktif** | Tampilkan hanya kreator terverifikasi |

> Catatan: "Verified Only" aktif secara default, sehingga hasil awal hanya menampilkan kreator terverifikasi.

### 3.4 Sort & Layout Row

Baris kedua di bawah filter utama berisi kontrol pengurutan dan tampilan.

#### Sort By (Dropdown)

| Nilai | Keterangan |
|-------|-----------|
| Relevance | Urutan berdasarkan relevansi (default) |
| Followers High–Low | Pengikut terbanyak di atas |
| Followers Low–High | Pengikut tersedikit di atas |
| Engagement Rate | Urutan berdasarkan engagement rate tertinggi |
| Price Low–High | Harga termurah di atas |
| Price High–Low | Harga termahal di atas |

#### Layout Toggle

Dua opsi tampilan kartu kreator:

| Opsi | Keterangan |
|------|-----------|
| **Grid** | Tampilan kartu kotak, beberapa kolom per baris |
| **List** | Tampilan baris horizontal, satu kreator per baris |

---

## 4. Creator Grid

Bagian utama halaman yang menampilkan daftar kreator hasil filter. Dirender secara dinamis oleh JavaScript ke dalam elemen `<div id="creatorGrid">`.

### 4.1 Struktur Kartu Kreator (Grid View)

```
┌──────────────────────────────┐
│ [Verified]    ♡ (favorit)    │  ← overlay di atas foto
│                              │
│     [Foto Profil Kreator]    │  ← gambar persegi
│          ✓ (dipilih)         │  ← check badge jika sudah dipilih
│                              │
├──────────────────────────────┤
│  Nama Kreator   ✓ (verified) │  ← nama + ikon verifikasi
│  [IG] [TT] [YT]              │  ← ikon platform sosial media
│  📍 Kota        [Kategori]   │  ← lokasi + tag kategori berwarna
├──────────────────────────────┤
│  👥 532K         📈 4.21%    │  ← Followers | Engagement Rate
├──────────────────────────────┤
│  Starting from               │
│  Rp 8.000.000                │
├──────────────────────────────┤
│  [View Profile]              │  ← jika belum dipilih
│  [Invite to Campaign]        │  ← jika sudah dipilih
└──────────────────────────────┘
```

### 4.2 Detail Elemen Kartu

#### Foto Profil
- Gambar persegi, mengisi lebar atas kartu
- Sumber: URL profil kreator atau placeholder avatar
- Klik foto (atau area kartu di luar tombol) → membuka **Profile Modal**

#### Badge "Verified" (overlay foto)
- Muncul di **pojok kiri atas** area foto sebagai label overlay
- Hanya tampil pada kreator dengan status `verified: true`
- Warna: biasanya biru atau teal

#### Ikon Favorit / Heart
- Posisi: **pojok kanan atas** area foto
- Klik untuk menambahkan/menghapus kreator dari daftar favorit
- Status aktif (merah/terisi) jika sudah difavoritkan

#### Check Badge (dipilih untuk kampanye)
- Muncul di atas foto saat kreator **sudah ditambahkan ke kampanye**
- Mengindikasikan kreator ini sudah ada dalam daftar undangan kampanye aktif

#### Nama + Ikon Verifikasi
- **Nama lengkap** kreator dalam teks tebal
- **Ikon check-circle** di samping nama — tanda akun resmi terverifikasi

#### Ikon Platform Sosial Media
- Baris ikon kecil menunjukkan platform tempat kreator aktif
- Kombinasi dari: Instagram (📷), TikTok (♪), YouTube (▶)
- Kreator bisa aktif di satu, dua, atau ketiga platform

#### Lokasi + Tag Kategori
- **Ikon map-pin** diikuti nama kota (contoh: `📍 Jakarta`)
- **Tag kategori** dengan warna berbeda per jenis:

| Kategori | Contoh Warna Tag |
|----------|-----------------|
| Lifestyle | Ungu / Lavender |
| Travel | Biru |
| Beauty | Pink / Rose |
| Tech | Abu-abu / Slate |
| Food | Oranye |
| Sports | Hijau |

#### Statistik Kreator

| Metrik | Format | Contoh |
|--------|--------|--------|
| **Followers** | Angka disingkat (K = ribuan) | `532K`, `1.2M` |
| **Engagement Rate** | Persentase dua desimal | `4.21%` |

#### Harga

- Label: **"Starting from"**
- Format: `Rp X.XXX.XXX` (Rupiah dengan pemisah titik)
- Menunjukkan harga minimum kolaborasi satu konten

#### Tombol Aksi

| Kondisi Kreator | Tombol Ditampilkan |
|-----------------|-------------------|
| Belum dipilih untuk kampanye | **"View Profile"** (outline / abu-abu) |
| Sudah dipilih untuk kampanye | **"Invite to Campaign"** (biru solid) |

- **View Profile** → membuka halaman detail profil kreator
- **Invite to Campaign** → menambahkan kreator ke daftar kampanye yang sedang aktif

#### Interaksi Klik Kartu

- Klik area kartu (selain tombol dan ikon favorit) → membuka **Profile Modal** (popup detail kreator)
- Klik tombol aksi → fungsi masing-masing tombol seperti di atas
- Klik ikon heart → toggle favorit, tidak membuka modal

### 4.3 Empty State

Jika tidak ada kreator yang sesuai dengan filter aktif, area grid menampilkan pesan kosong:
- Teks informatif bahwa tidak ada hasil ditemukan
- Saran untuk mengubah atau mereset filter

---

## 5. Data Kreator

### 5.1 Seed Data (8 Kreator Awal)

Delapan kreator berikut adalah data awal yang didefinisikan langsung di JavaScript sebagai data seed:

| Nama | Kota | Kategori | Platform | Followers | Eng. Rate | Harga |
|------|------|----------|----------|-----------|-----------|-------|
| **Nadia Aurel** | Jakarta | Lifestyle | IG / TT / YT | 532K | 4,21% | Rp 8.000.000 |
| **Reza Alvaro** | Bandung | Travel | IG / TT / YT | 742K | 5,67% | Rp 12.000.000 |
| **Clara Devina** | Surabaya | Beauty | IG / TT | 318K | 3,12% | Rp 6.500.000 |
| **Fahmi Ramadhan** | Yogyakarta | Tech | TT / YT | 410K | 2,89% | Rp 7.500.000 |
| **Adinda Putri** | Jakarta | Food | IG / TT / YT | 620K | 4,85% | Rp 9.000.000 |
| **Kevin Sanjaya** | Bandung | Sports | IG / TT | 850K | 6,12% | Rp 15.000.000 |
| **Larasati Dewi** | Bali | Travel | IG / TT | 490K | 3,98% | Rp 8.500.000 |
| **Andi Pratama** | Medan | Tech | IG / YT | 280K | 2,45% | Rp 5.000.000 |

### 5.2 Data Generate Otomatis

Selain 8 kreator seed, JavaScript secara otomatis men-generate **992 kreator tambahan** menggunakan nama-nama Indonesia, sehingga total dataset mencapai **1.000 kreator**.

Karakteristik data generate:
- Nama: kombinasi nama depan dan nama belakang Indonesia
- Kota: tersebar acak di 11 kota (Jakarta, Bandung, Surabaya, Yogyakarta, Bali, Medan, Makassar, Balikpapan, Semarang, Palembang, dan satu kota tambahan)
- Kategori: distribusi acak dari 6 kategori (Lifestyle, Travel, Beauty, Tech, Food, Sports)
- Platform: kombinasi acak dari Instagram, TikTok, YouTube
- Followers: nilai acak dalam rentang yang realistis
- Engagement Rate: nilai acak yang bervariasi per kreator
- Harga: nilai acak dalam rentang Rp 5.000.000 – Rp 15.000.000+
- Verified: status acak (`true` / `false`)

---

## 6. Pagination

Kreator ditampilkan dengan sistem paginasi berbasis halaman (bukan infinite scroll).

### Konfigurasi

| Parameter | Nilai |
|-----------|-------|
| Jumlah kreator per halaman | **50** |
| Total kreator dalam dataset | **1.000** |
| Total halaman (dari 1.000 kreator) | **20 halaman** |

### Tampilan Pagination

```
← Previous    Halaman 1 dari 20 • Menampilkan 1–50 dari 1.000 KOL    Next →
```

Format label:
- `Halaman [X] dari [Y]` — nomor halaman saat ini dan total halaman
- `Menampilkan [A]–[B] dari [N] KOL` — rentang indeks kreator yang ditampilkan

### Tombol Navigasi

| Tombol | Kondisi Aktif | Kondisi Nonaktif |
|--------|---------------|-----------------|
| **← Previous** | Halaman 2 ke atas | Halaman pertama (disabled) |
| **Next →** | Halaman sebelum terakhir | Halaman terakhir (disabled) |

### Perilaku Saat Filter Berubah

Saat pengguna mengubah filter atau sort, pagination otomatis **kembali ke halaman 1** dan menghitung ulang total halaman berdasarkan jumlah kreator yang lolos filter.

---

## 7. Shortcut Keyboard

| Tombol | Fungsi |
|--------|--------|
| `/` | Fokus langsung ke kolom pencarian (search bar) |

Shortcut ini memungkinkan pengguna langsung mengetik nama kreator tanpa harus mengklik field pencarian terlebih dahulu.

---

## 8. Ringkasan Interaksi

| Aksi Pengguna | Respons Sistem |
|---------------|----------------|
| Buka halaman setelah login | `marketplaceView` tampil sebagai halaman default |
| Pilih nilai di dropdown filter | Grid diperbarui sesuai filter aktif, pagination reset ke halaman 1 |
| Klik "Reset Filters" | Semua filter kembali ke default, grid menampilkan semua kreator |
| Klik toggle "Verified Only" | Filter verified diaktifkan/dinonaktifkan secara realtime |
| Ubah Sort By | Urutan kreator di grid berubah sesuai kriteria sort |
| Klik Grid / List toggle | Tampilan kartu berubah antara grid (kotak) dan list (baris) |
| Tekan `/` | Fokus pindah ke search bar |
| Klik ikon ♡ (favorit) | Kreator ditambah/dihapus dari daftar favorit |
| Klik "View Profile" | Buka halaman profil detail kreator |
| Klik "Invite to Campaign" | Kreator ditambahkan ke daftar kampanye aktif; tombol berubah state |
| Klik area kartu (bukan tombol) | Buka Profile Modal (popup detail kreator) |
| Klik ← Previous / Next → | Berpindah ke halaman kreator sebelum/sesudah |
| Filter menghasilkan 0 kreator | Tampilkan empty state dengan saran reset filter |

---

## 9. Referensi Teknis

| Properti | Nilai |
|----------|-------|
| View ID | `marketplaceView` |
| Grid container ID | `creatorGrid` |
| Total dataset kreator | 1.000 (8 seed + 992 generated) |
| Kreator per halaman | 50 |
| Quick filter default aktif | Verified Only |
| Default sort | Relevance |
| Default layout | Grid |
| Keyboard shortcut | `/` → fokus search bar |

---

> **Lihat juga:**
> - `docs/pages/dashboard.md` — layout sidebar dan navigasi utama
> - `docs/pages/boost-ads-launch.md` — halaman Boost Ads & Launch Campaign
