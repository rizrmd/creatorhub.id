# Page: Creator List — Content Creator Hub

**Referensi:** `docs/reference/Content Creator Hub.jpg`, `Content Creator Hub 2.jpg`, `Content Creator Hub 3.jpg`
**Tema:** Light
**Akses:** Bagian utama dari halaman Dashboard, atau halaman tersendiri via navigasi

---

## Deskripsi Halaman

Halaman yang menampilkan seluruh daftar kreator yang terdaftar di platform dalam format grid kartu. Pengguna dapat menelusuri, memfilter, dan memilih kreator untuk diundang ke kampanye. Halaman ini adalah tampilan yang muncul saat scrolling di area konten utama Dashboard, atau bisa menjadi halaman full-page tersendiri.

---

## Layout

```
┌───────────────────────────────────────────────────────────────┐
│  [Kartu 1]  [Kartu 2]  [Kartu 3]  [Kartu 4]  [Kartu 5] ...  │
│  [Kartu 6]  [Kartu 7]  [Kartu 8]  ...                        │
│  [Load more / Pagination]                                      │
└───────────────────────────────────────────────────────────────┘
```

Grid responsif, menampilkan ~7 kartu per baris pada desktop lebar.

---

## Struktur Kartu Kreator

```
┌─────────────────────┐
│ [Star Creator]      │  ← badge label kuning (opsional)
│                     │
│   [Foto Profil]     │  ← gambar persegi, full-width kartu
│                     │
├─────────────────────┤
│ Nama ♀/♂   🔖       │  ← nama + ikon gender + ikon bookmark
│ @handle             │  ← username media sosial
│ 📍 Kota, Provinsi   │  ← lokasi
├─────────────────────┤
│   [Lihat Detail]    │  ← tombol outline abu-abu
├─────────────────────┤
│ Followers  Eng.Rate │
│  11.3K      4.8%    │
├─────────────────────┤
│  Mulai dari (Rp)    │
│     675.300         │
├─────────────────────┤
│ [✈ UNDANG KE PROYEK]│  ← tombol biru solid
├─────────────────────┤
│ Terakhir online     │  ← status keaktifan
│ beberapa hari lalu  │
└─────────────────────┘
```

---

## Detail Setiap Elemen Kartu

### Badge "Star Creator"
- Label kuning/emas di pojok kiri atas foto
- Hanya muncul pada kreator terseleksi / berkualitas tinggi
- Semua kreator di halaman referensi memiliki badge ini

### Foto Profil
- Gambar persegi yang mengisi seluruh lebar kartu
- Bagian atas kartu (aspect ratio ~1:1 atau lebih tinggi)

### Identitas Kreator
- **Nama lengkap** — teks tebal
- **Ikon gender** — ♀ (perempuan) atau ♂ (laki-laki), kecil di samping nama
- **Ikon bookmark** 🔖 — di pojok kanan, untuk menyimpan ke shortlist
- **Handle sosial** — diawali @, platform utama kreator
- **Lokasi** — ikon pin + nama kota + nama provinsi (contoh: *Bandung, Jawa Barat*)

### Tombol "Lihat Detail"
- Style: outline / border abu-abu
- Fungsi: navigasi ke halaman profil lengkap kreator

### Statistik
| Kolom | Deskripsi |
|-------|-----------|
| **Followers** | Jumlah pengikut di platform utama (format: 1.2K, 45.6K, 1.2M) |
| **Engagement Rate** | Persentase interaksi audiens terhadap konten (likes, comments, shares / followers) |

### Harga
- **"Mulai dari (Rp)"** — harga minimum kerjasama untuk satu kali promosi
- Format: angka Rupiah dengan titik sebagai pemisah ribuan

### Tombol "Undang ke Proyek"
- Style: biru solid, full-width kartu
- Ikon ✈ di depan teks
- Fungsi: menambahkan kreator ke Campaign Brief (panel kanan Dashboard)

### Status Online
- Teks kecil di bawah tombol utama
- Format: *"Terakhir online beberapa hari/minggu/bulan yang lalu"*
- Mengindikasikan tingkat responsivitas kreator

---

## Data Kreator (Sampel dari Referensi)

### Halaman 1 — Content Creator Hub.jpg

| Nama | Handle | Lokasi | Followers | Eng. Rate | Mulai dari (Rp) |
|------|--------|--------|-----------|-----------|-----------------|
| Dewi Nurhayati | @dewii_n09 | Bandung, Jawa Barat | 11.3K | 4.8% | 675,300 |
| Dini Primarini | @diniprmr | Depok, Jawa Barat | 5.1K | 1.9% | 315,575 |
| Desi novita | @desnovit812 | Bogor, Jawa Barat | 179.3K | 2.5% | 4,836,040 |
| Gina Shintia | @gizotter | Bandung, Jawa Barat | 6.1K | 1.3% | 107,693 |
| Perdemunta M... | @melokamit_ | Kab. Sogeri, Jawa Barat | 4.8K | 3.6% | 215,385 |
| Vivis Octaviani | @vivov.tt | Bogor, Jawa Barat | 43.1K | 5.3% | 215,385 |
| Rani Aryani | @ranyaomi | Kab. Malang, Jawa Timur | 80.5K | 0.1% | 215,385 |

### Halaman 2 — Content Creator Hub 2.jpg

| Nama | Handle | Lokasi | Followers | Eng. Rate | Mulai dari (Rp) |
|------|--------|--------|-----------|-----------|-----------------|
| Mega afrianita | @megaafrianita | Depok, Jawa Barat | 91.1K | 1.3% | 3,862,578 |
| Diajeng Karunia | @diajenGkarunis... | Bandung, Jawa Barat | 4.7K | 1.5% | 281,724 |
| Pentika astini | @pentika... | Kab. Selawi, Jawa Barat | 8.4K | 7% | 71,795 |
| Rismawati | @rismara_ | Makassar, Sulawesi Selatan | 36.5K | 4.6% | 287,180 |
| Meta lutfiani | @metalutfiani | Selawi, Jawa Barat | 10.3K | 0.1% | 71,795 |
| Selviana Helvi | @helvsalvi... | Kab. Mojokerto, Jawa Timur | 5.8K | 3.5% | 355,036 |
| Fion Henry | @lionhenry | Kab. Sleman, Yogyakarta | 11.6K | 1.3% | 215,385 |

### Halaman 3 — Content Creator Hub 3.jpg

| Nama | Handle | Lokasi | Followers | Eng. Rate | Mulai dari (Rp) |
|------|--------|--------|-----------|-----------|-----------------|
| Maulana Mahe... | @maulana_rs | Depok, Jawa Barat | 4K | **55.6%** | 215,385 |
| Mayang Rizka | @mayangmaulida_ | Selawi, Jawa Barat | 11.5K | 2.8% | 215,385 |
| Afife Fauziya | @affausiya | Kab. Selawi, Jawa Barat | 2.7K | 8.6% | 143,590 |
| Jessica Juliswati | @jejuyss_ | Kab. Bandung, Jawa Barat | 5.3K | 8.8% | 319,814 |
| Yuwana Husada | @yuwanaroherjo | Bogor, Jawa Barat | 3.5K | **164.1%** | 214,740 |
| Julien rio | @julienrioo | Kab. Selawi, Jawa Barat | 2K | 9.8% | 287,180 |
| Farah Difa | @fafarras | Kab. Batang, Jawa Tengah | 92.4K | 1% | 358,975 |

> **Catatan:** Beberapa kreator memiliki Engagement Rate di atas 100% (Yuwana Husada: 164.1%, Maulana Mahe: 55.6%). Ini mengindikasikan konten yang sangat viral atau metrik dihitung berbeda dari rata-rata (misalnya berdasarkan total interaksi terhadap rata-rata reach, bukan total followers).

---

## Interaksi & Navigasi

| Aksi Pengguna | Hasil |
|---------------|-------|
| Klik "Lihat Detail" | Buka halaman profil lengkap kreator |
| Klik "Undang ke Proyek" | Kreator masuk ke daftar Campaign Brief |
| Klik ikon bookmark 🔖 | Kreator disimpan ke shortlist pribadi |
| Scroll ke bawah | Muat lebih banyak kreator (infinite scroll / pagination) |
| Klik badge "Star Creator" | Kemungkinan filter hanya kreator Star Creator |
