# Page: Analytics Insights — Creator Marketplace

**Referensi:** `docs/reference/Analytics.png`
**Tema:** Light
**Akses:** Sidebar → Analytics (menu ketiga)

---

## Deskripsi Halaman

Halaman analitik terpusat untuk brand/advertiser guna memantau performa kampanye secara menyeluruh. Menyediakan data impresi, engagement, demografi audiens, dan return on investment (ROI) dari seluruh kampanye yang pernah dijalankan. Layout terdiri dari empat metric card di bagian atas, dua chart visualisasi di tengah, dan tabel performa kreator di bagian bawah.

---

## Layout

```
┌─────────────┬────────────────────────────────────────────────────┐
│   Sidebar   │  Header: "Analytics Insights"                      │
│  Navigasi   │  Subjudul deskripsi                                │
│             ├────────────┬────────────┬────────────┬────────────┤
│             │  Card 1    │  Card 2    │  Card 3    │  Card 4    │
│             │ Impressions│ Campaign   │ Avg. Eng.  │ Cost Per   │
│             │            │ ROI        │ Rate       │ Engagement │
│             ├────────────┴────────┬───┴────────────┴────────────┤
│             │  Line Chart         │  Donut Chart                │
│             │  Views & Engagement │  Engagement Share by Niche  │
│             ├─────────────────────┴─────────────────────────────┤
│             │  Tabel: Top Performing Creators (full width)       │
└─────────────┴────────────────────────────────────────────────────┘
```

---

## Header Halaman

| Elemen | Konten |
|--------|--------|
| Judul utama (H1) | **Analytics Insights** |
| Subjudul / deskripsi | *"Analyze performance, views, demographics, and ROI across all campaigns"* |

---

## Metric Cards (Stats Grid)

Empat kartu metrik yang tersusun dalam satu baris horizontal di bagian atas konten utama. Setiap kartu menampilkan nilai utama beserta indikator tren dibandingkan periode atau target sebelumnya.

### Card 1 — Total Impressions

| Atribut | Nilai |
|---------|-------|
| Label | Total Impressions |
| Nilai | **4.2M** |
| Tren | +15.2% vs last month |
| Arah tren | Naik (positif) |
| Warna indikator | Hijau (positif) |

Menampilkan total akumulasi impresi dari seluruh konten kreator yang aktif dalam kampanye. Kenaikan 15.2% dibanding bulan sebelumnya menandakan pertumbuhan jangkauan yang signifikan.

---

### Card 2 — Campaign ROI

| Atribut | Nilai |
|---------|-------|
| Label | Campaign ROI |
| Nilai | **3.8x** |
| Tren | +0.4x vs target |
| Arah tren | Melampaui target (positif) |
| Warna indikator | Hijau (positif) |

Return on Investment rata-rata dari seluruh kampanye aktif. Nilai 3.8x berarti setiap Rp 1 yang diinvestasikan menghasilkan Rp 3,80 kembali. Angka ini 0.4x di atas target yang telah ditetapkan.

---

### Card 3 — Avg. Engagement Rate

| Atribut | Nilai |
|---------|-------|
| Label | Avg. Engagement Rate |
| Nilai | **4.62%** |
| Tren | +0.75% vs benchmark |
| Arah tren | Di atas benchmark (positif) |
| Warna indikator | Hijau (positif) |

Rata-rata tingkat keterlibatan audiens (likes, komentar, share, dan simpan) terhadap konten yang dipublikasikan kreator dalam kampanye. Angka 4.62% berada 0.75 poin persentase di atas benchmark industri.

---

### Card 4 — Cost Per Engagement

| Atribut | Nilai |
|---------|-------|
| Label | Cost Per Engagement |
| Nilai | **Rp 12.400** |
| Tren | -8.2% lower cost |
| Arah tren | Turun (positif — efisiensi biaya) |
| Warna indikator | Hijau (positif) |

Biaya rata-rata yang dikeluarkan per satu interaksi audiens. Meskipun nilai ini turun (-8.2%), tren diarahkan sebagai **positif** karena penurunan biaya berarti peningkatan efisiensi pengeluaran kampanye. Label tren menegaskan konteks: *"lower cost"*.

---

## Charts Section

Dua chart visualisasi yang ditempatkan berdampingan (side by side) dalam satu baris. Keduanya dirender menggunakan **SVG inline** tanpa dependensi library charting eksternal.

---

### Chart 1 — Views & Engagement Growth (Line Chart)

**Jenis:** Line chart dua garis (multi-series)
**Teknologi:** SVG inline
**Wadah:** `.dashboard-chart-card`

#### Konfigurasi Sumbu

| Sumbu | Keterangan |
|-------|-----------|
| Sumbu X (horizontal) | Bulan: Jan, Feb, Mar, Apr, May, Jun, Jul |
| Sumbu Y (vertikal) | Nilai: 0 – 100K (dalam ribuan) |

#### Data Series

| Bulan | Views | Engagements |
|-------|-------|-------------|
| Jan | ~10K | lebih rendah dari Views |
| Feb | ~30K | lebih rendah dari Views |
| Mar | ~80K | lebih rendah dari Views |
| Apr | ~60K | lebih rendah dari Views |
| May | ~140K | lebih rendah dari Views (puncak) |
| Jun | ~110K | lebih rendah dari Views |
| Jul | ~150K | lebih rendah dari Views |

#### Visual & Warna

| Elemen | Warna | Keterangan |
|--------|-------|-----------|
| Garis Views | Biru | Series utama impresi/tayangan |
| Garis Engagements | Oranye | Series interaksi audiens |
| Titik sorot (highlighted dot) | Warna kontras / lebih besar | Ditampilkan pada titik puncak di bulan May |

#### Legenda

Legenda ditampilkan di bagian atas atau bawah chart:
- **Views** — representasi warna biru
- **Engagements** — representasi warna oranye

#### Pola Data

Kedua garis menunjukkan tren kenaikan umum (upward trend) dari Januari hingga Juli, dengan koreksi turun pada April (setelah lonjakan Maret) dan Juni (setelah puncak Mei). Bulan **May** menjadi titik puncak tertinggi yang ditandai secara visual dengan *highlighted dot* pada kedua series.

---

### Chart 2 — Engagement Share by Niche (Donut Chart)

**Jenis:** Donut chart (pie chart berlubang)
**Teknologi:** SVG inline dengan `stroke-dasharray` untuk merender setiap segmen
**Wadah:** `.dashboard-chart-card`

#### Informasi Tengah (Center Label)

| Elemen | Nilai |
|--------|-------|
| Angka | **4.2M** |
| Label | Reach |

Teks ringkasan ditempatkan di tengah lubang donut, menampilkan total keseluruhan reach.

#### Segmen Donut

| Niche | Persentase | Warna |
|-------|-----------|-------|
| Lifestyle | 45% | Biru |
| Tech | 25% | Hijau |
| Beauty | 20% | Oranye |
| Other | 10% | Cyan |

#### Legenda

Legenda ditampilkan di sisi chart (kanan atau bawah) dengan format: kotak warna + nama niche + persentase.

```
■ Lifestyle   45%
■ Tech        25%
■ Beauty      20%
■ Other       10%
```

#### Implementasi Teknis SVG

Setiap segmen donut dirender menggunakan elemen `<circle>` dengan properti:
- `stroke-dasharray` — menentukan panjang busur segmen berdasarkan persentase
- `stroke-dashoffset` — menentukan titik awal rotasi setiap segmen
- `stroke` — menentukan warna segmen
- `fill: none` — agar lingkaran tidak terisi, hanya garis stroke yang tampak

---

## Top Performing Creators Table

**Jenis:** Tabel HTML standar
**Lebar:** Full-width (`.dashboard-chart-card.full-width`)
**Judul:** "Top Performing Creators"

Tabel menampilkan kreator dengan performa terbaik berdasarkan akumulasi data dari seluruh kampanye yang diikuti.

### Struktur Kolom

| Kolom | Tipe Data | Keterangan |
|-------|-----------|-----------|
| **Creator** | Teks | Nama lengkap kreator |
| **Category** | Teks (badge/label) | Kategori/niche konten kreator |
| **Impressions** | Numerik | Total tayangan konten dalam kampanye |
| **Engagement** | Persentase | Tingkat keterlibatan audiens (%) |
| **Conversions** | Numerik | Jumlah konversi yang dihasilkan |
| **ROI** | Multiplier (x) | Return on investment kampanye kreator tersebut |

### Warna Kolom ROI

Nilai pada kolom **ROI** ditampilkan dengan **warna hijau** (success color) karena seluruh nilai bersifat positif (melampaui breakeven). Ini memberikan sinyal visual cepat bahwa kreator-kreator ini menghasilkan return yang menguntungkan.

### Data Tabel

| Creator | Category | Impressions | Engagement | Conversions | ROI |
|---------|----------|-------------|------------|-------------|-----|
| Reza Alvaro | travel | 1.2M | 5.67% | 1,240 | 4.8x |
| Nadia Aurel | lifestyle | 890K | 4.21% | 860 | 3.9x |
| Kevin Sanjaya | sports | 750K | 6.12% | 980 | 3.7x |

### Catatan Data

- **Reza Alvaro** memimpin dalam total Impressions (1.2M) dan ROI tertinggi (4.8x), menjadikannya kreator dengan performa terbaik secara keseluruhan.
- **Kevin Sanjaya** memiliki Engagement Rate tertinggi (6.12%), melampaui rata-rata platform (4.62%), meski Impressions-nya terendah di antara tiga kreator ini.
- **Nadia Aurel** menempati posisi tengah di semua metrik dengan ROI 3.9x — masih di atas rata-rata kampanye (3.8x).
- Kolom Category menggunakan label huruf kecil (lowercase): `travel`, `lifestyle`, `sports`.

---

## Interaksi & Navigasi

| Aksi | Hasil |
|------|-------|
| Klik menu "Analytics" di sidebar | Membuka halaman ini (Analytics Insights) |
| Hover pada titik data line chart | Kemungkinan menampilkan tooltip nilai Views / Engagements pada bulan tersebut |
| Hover pada segmen donut chart | Kemungkinan menampilkan tooltip nama niche dan persentase |
| Klik nama kreator di tabel | Kemungkinan navigasi ke halaman profil/detail kreator |
| Klik header kolom tabel | Kemungkinan mengurutkan (sort) data berdasarkan kolom tersebut |

---

## Ringkasan Metrik Performa

| Metrik | Nilai | Status |
|--------|-------|--------|
| Total Impressions | 4.2M | Naik 15.2% MoM |
| Campaign ROI | 3.8x | Melampaui target (+0.4x) |
| Avg. Engagement Rate | 4.62% | Di atas benchmark (+0.75%) |
| Cost Per Engagement | Rp 12.400 | Lebih efisien (-8.2%) |
| Total Reach (Niche Donut) | 4.2M | Mayoritas Lifestyle (45%) |
| Kreator Teratas | Reza Alvaro | ROI 4.8x, 1.2M Impressions |
