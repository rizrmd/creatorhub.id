# Page: Dashboard — Project Dashboard (`dashboardView`)

**View ID:** `dashboardView`
**Tema:** Light
**Akses:** Sidebar → Dashboard (menu pertama, default landing page)

---

## Deskripsi Halaman

Halaman **Project Dashboard** adalah tampilan utama aplikasi CreatorHub.id yang berfungsi sebagai pusat analitik visual dan monitoring platform. Halaman ini ditujukan bagi pengelola platform (admin/brand) untuk memantau distribusi geografis kreator/KOL, status proyek pengembangan, aktivitas media sosial, serta aliran kejadian sistem secara real-time.

Berbeda dari halaman Marketplace (daftar kreator), halaman ini bersifat **read-only analitik** — tidak ada aksi penambahan kreator atau pengelolaan kampanye secara langsung. Fokusnya pada observabilitas dan monitoring.

---

## Layout Keseluruhan

Halaman disusun secara vertikal (single-column flow) dalam area konten utama, dengan beberapa kartu chart yang mengisi lebar penuh atau setengah lebar:

```
┌──────────────────────────────────────────────────────────────┐
│                    PAGE TITLE SECTION                        │
│  "Project Dashboard"                                         │
│  subtitle: "Visual analytics of development tasks..."        │
├──────────────────────────────────────────────────────────────┤
│         KOL GEOGRAPHIC DISTRIBUTION MAP  (full-width)        │
│  [Peta Leaflet Indonesia]           [Legend: Top 5 Cities]   │
├────────────────┬────────────────┬────────────────┬───────────┤
│ Project Status │Milestones Met  │ Bundler Build  │Bundle Wgt │
│   100% Done    │  5 / 5 Tasks   │    303 ms      │ 45.7 kB   │
├────────────────┴────────────────┴────────────────┴───────────┤
│  Social Media Posts This Month   │  (half-width card)        │
│  Creator Activity │ Amplifier Activity                       │
├──────────────────────────────────────────────────────────────┤
│              ACTIVITY LOGS & EVENT STREAM  (full-width)      │
│  [Refresh Stream]                                            │
│  [log entry 1 — newest]                                      │
│  [log entry 2]                                               │
│  ...                                                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Section 1: Page Title

Terletak di paling atas halaman, sebelum semua kartu konten.

| Elemen | Nilai |
|--------|-------|
| Judul (`<h1>`) | **Project Dashboard** |
| Subtitle (`<p class="subtitle">`) | *Visual analytics of development tasks and application statistics* |

---

## Section 2: Peta Distribusi Geografis KOL

**Komponen:** `<div class="dashboard-chart-card full-width">`

Kartu berlebar penuh yang menampilkan peta interaktif distribusi kreator/KOL di seluruh Indonesia.

### Header Kartu

| Elemen | Detail |
|--------|--------|
| Judul kartu | **KOL Geographic Distribution (Indonesia)** |
| Badge total kreator | `id="mapTotalCreators"` — menampilkan **1,000 Creators** |

### Komponen Peta

- **Library:** [Leaflet.js](https://leafletjs.com/)
- **Tile Layer:** CartoDB Light (basemap abu-abu/putih minimalis)
- **ID elemen peta:** `id="indonesiaMap"`
- **Wilayah cakupan:** Seluruh kepulauan Indonesia

### Data Marker (11 Kota)

Setiap marker mewakili satu kota dengan jumlah kreator dan status warna tertentu:

| Kota | Warna Marker | Status | Ikon Marker |
|------|-------------|--------|-------------|
| Jakarta | Merah (`red`) | Demand tinggi / warning | `alert-triangle` |
| Makassar | Merah (`red`) | Demand tinggi / warning | `alert-triangle` |
| Manado | Merah (`red`) | Demand tinggi / warning | `alert-triangle` |
| Bandung | Oranye (`orange`) | Aktif | `user` |
| Semarang | Oranye (`orange`) | Aktif | `user` |
| Surabaya | Hijau (`green`) | Aktif | `user` |
| Yogyakarta | Hijau (`green`) | Aktif | `user` |
| Bali | Hijau (`green`) | Aktif | `user` |
| Medan | Hijau (`green`) | Aktif | `user` |
| Balikpapan | Hijau (`green`) | Aktif | `user` |
| Palembang | Hijau (`green`) | Aktif | `user` |

**Keterangan warna:**
- **Merah** — kota dengan demand kreator tinggi atau memerlukan perhatian (warning state).
- **Oranye** — kota dengan aktivitas moderat, status waspada.
- **Hijau** — kota aktif normal.

### Tooltip Marker

Saat kursor diarahkan ke atas marker, tooltip muncul menampilkan:
```
[Nama Kota]
[Jumlah Kreator] creators
```
Contoh: `Jakarta — 214 creators`

### Interaksi: Klik Marker

Klik pada marker kota akan memicu navigasi ke halaman **Marketplace** dengan filter lokasi otomatis diisi sesuai kota yang diklik.

```
Klik marker "Bandung"
  → Navigasi ke halaman Marketplace
  → Filter Lokasi diset: "Bandung"
  → Grid kreator menampilkan kreator dari Bandung
```

### Sidebar Legend (Top 5 Kota)

Di dalam kartu peta terdapat sidebar legend dengan ID `id="mapLegendList"` yang menampilkan daftar **5 kota teratas** berdasarkan jumlah kreator terbanyak. Legend berfungsi sebagai referensi visual cepat tanpa harus melihat peta secara langsung.

Format setiap entry legend:
```
● [Nama Kota]    [Jumlah Kreator]
```

---

## Section 3: Stats Grid

**Komponen:** `<section class="stats-grid">`

Empat kartu statistik berjajar horizontal, masing-masing menampilkan satu metrik kunci. Metrik ini mencerminkan status proyek pengembangan aplikasi, bukan statistik kreator.

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│ Project Status│Milestones Met │ Bundler Build │ Bundle Weight │
│               │               │               │               │
│  100% Done    │   5 / 5 Tasks │    303 ms     │   45.7 kB     │
└───────────────┴───────────────┴───────────────┴───────────────┘
```

| # | Label Kartu | Nilai | Deskripsi |
|---|------------|-------|-----------|
| 1 | **Project Status** | `100% Done` | Persentase penyelesaian keseluruhan proyek pengembangan |
| 2 | **Milestones Met** | `5 / 5 Tasks` | Jumlah milestone yang telah tercapai dari total milestone yang direncanakan |
| 3 | **Bundler Build** | `303 ms` | Durasi proses build bundler (webpack/vite) terakhir |
| 4 | **Bundle Weight** | `45.7 kB` | Ukuran total bundle JavaScript aplikasi setelah dikompresi |

---

## Section 4: Social Media Posts This Month

**Komponen:** `<div class="dashboard-chart-card">` (setengah lebar / bersanding dengan kartu lain)

Kartu infografis yang merangkum aktivitas konten media sosial dalam satu bulan berjalan, dibagi menjadi dua kelompok aktor:

### Creator Activity (Aktivitas Kreator)

Data yang dihasilkan dari konten yang diproduksi oleh para kreator/KOL:

| Metrik | Nilai |
|--------|-------|
| Total Content Produced | **432** postingan |
| Avg ER (Average Engagement Rate) | **3.4%** |
| Estimated Reach | **1.5M** akun unik |

### Amplifier Activity (Aktivitas Amplifier)

Data yang dihasilkan dari interaksi dan amplifikasi konten tersebut:

| Metrik | Nilai |
|--------|-------|
| Total Engagement | **15.7K** |
| Total Comments | **3.2K** |
| Estimated Reach | **5.2M** akun unik |

> **Catatan:** Reach Amplifier (5.2M) lebih besar dari Reach Creator (1.5M) karena memperhitungkan efek viral dan distribusi sekunder konten.

---

## Section 5: Activity Logs & Event Stream

**Komponen:** `<div class="dashboard-chart-card full-width">`

Kartu berlebar penuh yang menampilkan aliran log kejadian sistem secara real-time. Berfungsi sebagai audit trail ringan untuk memantau operasi platform.

### Header Kartu

| Elemen | Detail |
|--------|--------|
| Judul | **Activity Logs & Event Stream** |
| Tombol aksi | `id="btnRefreshLogs"` — label: **"Refresh Stream"** |

### Tampilan Log Entries

Log ditampilkan di dalam container `id="activityStream"`. Setiap entry log memiliki:

```
[ikon tipe]  [timestamp]  [pesan log]
```

Contoh tampilan:
```
●  12:04:33  Database synced: 1,000 KOL profiles          [biru/info]
●  12:03:11  System initialized under Arif Budiman         [biru/info]
●  12:02:47  Campaign brief loaded: Summer Getaway 2025    [hijau/success]
```

### Entry Log Awal (Mock Data)

Saat halaman pertama kali dimuat, terdapat 3 entry log default:

| Urutan | Pesan | Tipe |
|--------|-------|------|
| 1 (terbaru) | `Database synced: 1,000 KOL profiles` | `info` |
| 2 | `System initialized under Arif Budiman` | `info` |
| 3 (terlama) | `Campaign brief loaded: Summer Getaway 2025` | `success` / `info` |

### Tipe Log & Warna

| Tipe | Warna Indikator | Contoh Penggunaan |
|------|----------------|-------------------|
| `info` | Biru | Sinkronisasi data, inisialisasi sistem |
| `success` | Hijau | Brief berhasil dimuat, operasi berhasil |
| `warning` | Kuning | Peringatan ambang batas, potensi masalah |
| `danger` | Merah | Error kritis, kegagalan sistem |

### Aturan Tampilan Log

- **Urutan:** Entry terbaru muncul di **paling atas** (newest on top).
- **Batas maksimum:** Hanya **10 entry** yang ditampilkan sekaligus. Entry ke-11 dan seterusnya akan mendorong entry terlama keluar dari daftar.
- **Konten dinamis:** Stream bersifat dinamis — entry baru diinjeksi ke DOM tanpa reload halaman.

### Interaksi: Tombol "Refresh Stream"

Klik tombol `btnRefreshLogs` akan memunculkan **satu entry log acak baru** di bagian atas stream. Pesan log dipilih secara acak dari kumpulan template yang sudah didefinisikan, dengan tipe log (`info`, `success`, `warning`, `danger`) juga bervariasi secara acak.

```
Klik "Refresh Stream"
  → Buat satu log entry baru dengan pesan & tipe acak
  → Sisipkan entry di posisi paling atas #activityStream
  → Jika total entry > 10, hapus entry paling bawah
```

---

## Ringkasan Interaksi Halaman

| Aksi Pengguna | Komponen | Hasil |
|---------------|----------|-------|
| Klik marker kota di peta | Marker Leaflet | Navigasi ke halaman Marketplace dengan filter lokasi kota tersebut |
| Hover marker kota | Marker Leaflet | Tooltip muncul: nama kota + jumlah kreator |
| Klik tombol **Refresh Stream** | `#btnRefreshLogs` | Entry log acak baru ditambahkan ke bagian atas activity stream |
| Halaman pertama kali dimuat | `#activityStream` | 3 entry log mock default ditampilkan |
| Lihat legend peta | `#mapLegendList` | Top 5 kota dengan kreator terbanyak ditampilkan di sidebar legend |

---

## Navigasi Keluar dari Halaman Ini

| Tujuan | Cara |
|--------|------|
| Marketplace (dengan filter kota) | Klik marker pada peta Indonesia |
| Halaman lain (Campaigns, Analytics, dll.) | Klik menu di Sidebar navigasi |

---

## Dependensi Teknis

| Library / Aset | Kegunaan |
|---------------|----------|
| [Leaflet.js](https://leafletjs.com/) | Rendering peta interaktif Indonesia |
| CartoDB Light Tile Layer | Basemap minimalis untuk peta |
| Lucide Icons / Feather Icons | Ikon `alert-triangle` dan `user` pada marker peta |
| JavaScript (vanilla) | Logic activity log (mock data, random entries, DOM injection) |

---

## Catatan Pengembangan

- Nilai pada **Stats Grid** (Project Status, Milestones Met, Bundler Build, Bundle Weight) bersifat statis/hardcoded dan mencerminkan kondisi build terakhir proyek, bukan data live.
- Nilai pada **Social Media Posts This Month** bersifat mock/contoh dan belum terhubung ke API kreator aktif.
- **Activity Log** sepenuhnya dijalankan di sisi client (front-end only) — tidak ada koneksi ke backend/websocket pada versi saat ini.
- Total kreator pada badge peta (`1,000 Creators`) dan jumlah per kota adalah data statis yang diinisialisasi saat halaman dimuat.
