# Page: Media Monitoring — Brand Mention Tracker (`mediaMonitoringView`)

**View ID:** `mediaMonitoringView`
**Tema:** Light
**Akses:** Sidebar → Media Monitoring

---

## Deskripsi Halaman

Halaman **Media Monitoring** adalah fitur pemantauan brand secara terpusat yang memungkinkan pengelola platform (admin/brand) untuk melacak sebutan (*mention*) brand di berbagai platform media sosial secara real-time. Halaman ini menampilkan metrik sentimen, jangkauan viral, dan indeks kesehatan brand secara agregat, serta feed langsung berisi konten dari para kreator yang menyebut atau menggunakan tagar terkait brand.

Berbeda dari halaman **Campaigns** yang bersifat manajerial, halaman ini bersifat **observasi dan analitik** — fokus pada persepsi publik, distribusi konten organik, dan dampak kampanye yang sedang berjalan terhadap reputasi brand.

---

## Layout Keseluruhan

Halaman disusun secara vertikal dalam area konten utama, diawali judul halaman, diikuti empat kartu statistik ringkasan, lalu satu kartu feed mention berlebar penuh:

```
┌──────────────────────────────────────────────────────────────────┐
│                      PAGE TITLE SECTION                          │
│  "Media Monitoring"                                              │
│  subtitle: "Track real-time social media mentions, brand         │
│             sentiment analysis, and campaign coverage"           │
├──────────────────┬───────────────┬───────────────┬──────────────┤
│  Total Mentions  │ Net Sentiment │  Viral Reach  │ Brand Health │
│     4,218        │  84% Positive │   2.4M Views  │   92 / 100   │
│   +14.2% week    │  +2.1% week   │  +18.6% growth│   Excellent  │
├──────────────────┴───────────────┴───────────────┴──────────────┤
│              RECENT BRAND MENTIONS FEED  (full-width)            │
│  [Live Tracking]                                                 │
│  [Feed Item 1 — Instagram @charlie_travels]                      │
│  [Feed Item 2 — TikTok @gadget_master]                           │
│  [Feed Item 3 — YouTube ReviewCorner ID]                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## Section 1: Page Title

Terletak di bagian paling atas halaman, sebelum semua kartu konten.

| Elemen | Nilai |
|--------|-------|
| Judul (`<h1>`) | **Media Monitoring** |
| Subtitle (`<p>`) | *Track real-time social media mentions, brand sentiment analysis, and campaign coverage* |

---

## Section 2: Stats Grid

**Komponen:** `<section class="stats-grid">` (4 kartu berjajar horizontal)

Empat kartu statistik ringkasan yang memberikan gambaran kondisi brand secara sekilas. Setiap kartu memiliki nilai utama, label kategori, dan indikator perubahan (delta) terhadap periode sebelumnya.

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│Total Mentions│ Net Sentiment│  Viral Reach │Brand Health  │
│    4,218     │  84% Positive│   2.4M Views │   92 / 100   │
│ +14.2% week  │ +2.1% vs lw  │ +18.6% growth│  Excellent   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Kartu 1: Total Mentions

| Field | Detail |
|-------|--------|
| Label | **Total Mentions** |
| Nilai utama | **4,218** |
| Delta | `+14.2% this week` |
| Interpretasi | Total seluruh sebutan brand yang terdeteksi di semua platform pada periode berjalan. Kenaikan 14,2% menunjukkan peningkatan signifikan visibilitas brand dalam satu minggu terakhir. |

### Kartu 2: Net Sentiment

| Field | Detail |
|-------|--------|
| Label | **Net Sentiment** |
| Nilai utama | **84% Positive** |
| Delta | `+2.1% vs last week` |
| Interpretasi | Persentase mention dengan sentimen positif dari total mention yang berhasil diklasifikasikan. Nilai 84% tergolong tinggi dan mengindikasikan reputasi brand dalam kondisi baik. Kenaikan 2,1% menunjukkan tren persepsi positif yang membaik. |

### Kartu 3: Viral Reach

| Field | Detail |
|-------|--------|
| Label | **Viral Reach** |
| Nilai utama | **2.4M Views** |
| Delta | `+18.6% growth` |
| Interpretasi | Total estimasi pengguna unik yang terpapar konten yang menyebut brand, termasuk efek redistribusi dan share konten. Angka 2,4 juta dengan pertumbuhan 18,6% menunjukkan konten brand menjangkau audiens yang jauh lebih luas dari minggu sebelumnya. |

### Kartu 4: Brand Health Index

| Field | Detail |
|-------|--------|
| Label | **Brand Health Index** |
| Nilai utama | **92 / 100** |
| Rating | `Excellent` |
| Interpretasi | Skor komposit kesehatan brand yang menggabungkan berbagai faktor: volume mention, rasio sentimen positif, tingkat engagement, dan pertumbuhan reach. Skor 92 dari 100 masuk dalam kategori **Excellent** — kondisi brand sangat baik. |

---

## Section 3: Recent Brand Mentions Feed

**Komponen:** `<div class="dashboard-chart-card full-width">`

Kartu berlebar penuh yang menampilkan feed konten dari kreator dan pengguna media sosial yang menyebut brand, menggunakan tagar terkait, atau berkolaborasi dalam kampanye aktif.

### Header Kartu

| Elemen | Detail |
|--------|--------|
| Judul kartu | **Recent Brand Mentions** |
| Badge status | `Live Tracking` — berwarna **oranye** |

#### Badge "Live Tracking"

Badge berwarna oranye (`badge-orange`) ditampilkan di sebelah judul kartu sebagai indikator bahwa feed berjalan dalam mode pemantauan langsung. Warna oranye digunakan untuk membedakan status **aktif-monitoring** dari status biasa atau selesai.

> **Catatan Prototipe:** Pada versi prototipe saat ini, data feed bersifat statis (hardcoded). Badge "Live Tracking" merepresentasikan desain akhir yang akan menggunakan koneksi real-time (misalnya WebSocket atau polling API) ke layanan pemantauan media sosial.

---

## Struktur Feed Item

Setiap entry pada feed mention memiliki layout baris horizontal (`<div class="feed-item-row">`) yang terdiri dari komponen-komponen berikut:

```
┌─────────────────────────────────────────────────────────────────┐
│  [Ikon Platform]  [Username]  [Sentiment Badge]                 │
│                   [Teks Konten / Caption]                       │
│                   [Likes/Views]  •  [Comments]  •  [Waktu]      │
└─────────────────────────────────────────────────────────────────┘
```

### Komponen Feed Item

| Komponen | Elemen HTML | Deskripsi |
|----------|------------|-----------|
| Ikon Platform | `<div class="platform-icon [nama-platform]-bg">` | Ikon berwarna mewakili platform media sosial asal konten |
| Username / Handle | `<span>` | Nama akun atau handle kreator yang memposting konten |
| Sentiment Badge | `<span class="badge-[warna]">` | Label klasifikasi sentimen konten (Positive/Neutral/Negative) |
| Teks Konten | `<p>` | Kutipan atau ringkasan caption/deskripsi konten asli |
| Stats Engagement | `<span>` | Statistik performa konten: jumlah like/view, komentar, dan waktu posting |

---

## Warna Ikon Platform

Setiap platform media sosial direpresentasikan dengan ikon berlatar belakang warna khas platformnya. Warna ini diterapkan melalui class CSS pada elemen `<div class="platform-icon">`.

| Platform | Class CSS | Warna Latar | Keterangan |
|----------|-----------|-------------|------------|
| Instagram | `instagram-bg` | **Pink / Magenta** | Mengacu pada warna brand Instagram |
| TikTok | `tiktok-bg` | **Hitam / Abu Gelap** | Mengacu pada warna brand TikTok |
| YouTube | `youtube-bg` | **Merah** | Mengacu pada warna brand YouTube |
| Twitter/X | *(belum ada contoh)* | Hitam / Biru | Belum tampil di prototipe |
| Facebook | *(belum ada contoh)* | Biru | Belum tampil di prototipe |

---

## Indikator Sentimen

Sentimen setiap mention diklasifikasikan secara otomatis dan ditampilkan sebagai badge berwarna di sebelah username.

| Sentimen | Class Badge | Warna | Kondisi |
|----------|-------------|-------|---------|
| Positive | `badge-green` | **Hijau** | Konten bersifat pujian, rekomendasi, atau ekspresi kepuasan terhadap brand |
| Neutral | `badge-neutral` | **Abu-abu** | Konten bersifat informatif atau deskriptif tanpa kecenderungan emosi positif/negatif |
| Negative | `badge-red` | **Merah** | Konten bersifat keluhan, kritik, atau ekspresi ketidakpuasan — belum ada contoh di prototipe |

> **Catatan:** Pada prototipe saat ini hanya menampilkan contoh sentimen Positive dan Neutral. Sentimen Negative (badge merah) ada dalam sistem desain namun belum memiliki data feed contoh.

---

## Data Feed Item

### Feed Item 1: Instagram — @charlie_travels

| Field | Detail |
|-------|--------|
| Platform | **Instagram** |
| Warna ikon | Pink / Magenta (`instagram-bg`) |
| Handle | **@charlie_travels** |
| Sentimen | **Positive** (badge hijau) |
| Konten | *"Just checked in at the beach villa recommended by #creatorhub and the experience is absolutely unreal. Highly recommend it! 😍🌴"* |
| Engagement | **12.4K Likes** • **482 Comments** |
| Waktu posting | **2 hours ago** |
| Kampanye terkait | **Summer Getaway 2025** |

**Analisis konten:** Posting ini merupakan *user-generated content* organik dari seorang traveler yang menerima rekomendasi dari platform CreatorHub. Tagar `#creatorhub` digunakan secara eksplisit. Tone positif yang kuat dengan emosi tinggi (penggunaan kata "absolutely unreal", emoji antusias) berkontribusi pada klasifikasi sentimen Positive.

---

### Feed Item 2: TikTok — @gadget_master

| Field | Detail |
|-------|--------|
| Platform | **TikTok** |
| Warna ikon | Hitam / Abu Gelap (`tiktok-bg`) |
| Handle | **@gadget_master** |
| Sentimen | **Positive** (badge hijau) |
| Konten | *"Unboxing the next-gen mechanical keyboard. Keycaps sound incredibly thocky and the layout is 10/10. Great review campaign collab with CreatorHub. #keyboard #unboxing"* |
| Engagement | **42.1K Likes** • **1.2K Comments** |
| Waktu posting | **5 hours ago** |
| Kampanye terkait | **Next-Gen Tech Launch** |

**Analisis konten:** Posting ini berasal dari konten kolaborasi resmi kampanye (*campaign collab*) antara kreator `@gadget_master` dan CreatorHub untuk kampanye **Next-Gen Tech Launch**. Kreator menyebut CreatorHub secara eksplisit dalam caption. Angka engagement yang tinggi (42,1K likes) menunjukkan konten ini berperforma sangat baik di platform TikTok. Sentimen Positive didukung oleh penggunaan frasa penilaian tinggi ("incredibly thocky", "10/10", "Great").

---

### Feed Item 3: YouTube — ReviewCorner ID

| Field | Detail |
|-------|--------|
| Platform | **YouTube** |
| Warna ikon | Merah (`youtube-bg`) |
| Handle / Nama Kanal | **ReviewCorner ID** |
| Sentimen | **Neutral** (badge abu-abu) |
| Konten | *"Testing out the organic skin radiance serum launch package. Product details look good, waiting to see long-term effects. Full setup is detailed in the description."* |
| Engagement | **150K Views** • **890 Comments** |
| Waktu posting | **Yesterday** |
| Kampanye terkait | *(tidak disebutkan secara eksplisit, kemungkinan bagian dari kampanye product launch)* |

**Analisis konten:** Video ini merupakan konten review produk dari kanal YouTube `ReviewCorner ID`. Sentimen diklasifikasikan sebagai **Neutral** karena kreator belum memberikan penilaian akhir — mereka masih dalam fase pengujian dan menyatakan perlu menunggu efek jangka panjang ("waiting to see long-term effects"). Tidak ada ekspresi pujian atau kritik yang kuat. Meski sentimen netral, jangkauan 150K views sangat signifikan untuk visibilitas brand.

---

## Ringkasan Engagement Feed

| # | Platform | Handle | Sentimen | Likes / Views | Komentar | Waktu |
|---|----------|--------|----------|--------------|----------|-------|
| 1 | Instagram | @charlie_travels | Positive | 12.4K Likes | 482 | 2 jam lalu |
| 2 | TikTok | @gadget_master | Positive | 42.1K Likes | 1.2K | 5 jam lalu |
| 3 | YouTube | ReviewCorner ID | Neutral | 150K Views | 890 | Kemarin |

---

## Hubungan dengan Kampanye Aktif

Konten yang muncul di feed Media Monitoring berasosiasi dengan kampanye aktif yang sedang berjalan di platform CreatorHub.id. Berikut pemetaannya:

### Kampanye: Summer Getaway 2025

| Atribut | Detail |
|---------|--------|
| Nama kampanye | **Summer Getaway 2025** |
| Kategori | Travel & Hospitality |
| Feed item terkait | Feed Item 1 — @charlie_travels (Instagram) |
| Tagar yang digunakan | `#creatorhub` |
| Tipe konten | Check-in / Ulasan pengalaman wisata |
| Catatan | Konten muncul organik dari pengguna yang terinspirasi dari rekomendasi platform |

### Kampanye: Next-Gen Tech Launch

| Atribut | Detail |
|---------|--------|
| Nama kampanye | **Next-Gen Tech Launch** |
| Kategori | Teknologi / Gadget |
| Feed item terkait | Feed Item 2 — @gadget_master (TikTok) |
| Tagar yang digunakan | `#keyboard`, `#unboxing` |
| Tipe konten | Unboxing video / Review produk kolaborasi |
| Catatan | Konten merupakan kolaborasi resmi (*paid partnership / campaign collab*) dengan label eksplisit "CreatorHub" dalam caption |

---

## Ringkasan Interaksi Halaman

Pada prototipe saat ini, halaman Media Monitoring bersifat **read-only**. Semua data ditampilkan secara visual tanpa aksi yang mengubah state atau memicu navigasi.

| Elemen | Interaksi | Hasil |
|--------|-----------|-------|
| Stats card | Tampilan statis | Tidak ada aksi — hanya tampil data |
| Badge "Live Tracking" | Tampilan statis | Tidak ada aksi |
| Feed item | Tampilan statis | Tidak ada aksi — hanya tampil konten |

> **Pengembangan Lanjutan:** Versi produksi direncanakan akan memiliki kemampuan: filter feed berdasarkan platform/sentimen/kampanye, klik item untuk melihat post asli, tandai/arsip mention tertentu, dan ekspor laporan monitoring.

---

## Navigasi Keluar dari Halaman Ini

| Tujuan | Cara |
|--------|------|
| Dashboard | Klik menu Dashboard di Sidebar |
| Campaigns | Klik menu Campaigns di Sidebar untuk melihat detail kampanye yang mention-nya muncul di sini |
| Creator List | Klik menu Creator List / Marketplace di Sidebar |
| Halaman lain | Klik menu di Sidebar navigasi |

---

## Catatan Pengembangan

- Seluruh data pada halaman ini (stats grid dan feed item) bersifat **statis/hardcoded** pada versi prototipe. Belum ada koneksi ke API media monitoring eksternal (misalnya Brandwatch, Mention.com, atau API native Twitter/Instagram).
- Badge **"Live Tracking"** berwarna oranye secara visual sudah mencerminkan desain sistem akhir, namun pada prototipe tidak ada mekanisme polling atau WebSocket yang aktif.
- Sentimen **Negative** (badge merah) sudah tersedia dalam sistem desain (`badge-red`) namun belum ada contoh data feed dengan sentimen negatif pada prototipe.
- Metrik engagement di setiap feed item (likes, views, comments) bersifat mock data dan belum mencerminkan data kreator aktual dari platform.
- **Brand Health Index** (skor 92/100) adalah nilai komposit yang dalam versi produksi akan dihitung dari kombinasi beberapa faktor: rasio sentimen positif, volume mention, tren pertumbuhan, dan tingkat respons.
- Feed item ditampilkan dalam urutan kronologis terbaru ke terlama (newest on top), sesuai konvensi feed media sosial pada umumnya.
