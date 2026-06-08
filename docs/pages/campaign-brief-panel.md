# Komponen: Campaign Brief Panel — CreatorHub.id

**Tipe:** Panel samping (Aside / Right Panel)
**Posisi:** Kanan layar, berdampingan dengan konten utama
**Visibilitas:** Hanya tampil di halaman **Marketplace** dan **Campaigns**
**ID Elemen:** `<aside class="right-panel">`
**Bahasa UI:** Indonesia / English (mixed)

---

## Deskripsi Komponen

Campaign Brief Panel adalah panel samping vertikal yang muncul di sisi kanan layar pada halaman Marketplace dan Campaigns. Panel ini berfungsi sebagai **pusat kendali pemilihan kreator** untuk kampanye aktif yang sedang dikerjakan.

Tujuan utama panel ini adalah:
- Memberikan konteks kampanye aktif kepada pengguna selagi mereka menjelajahi kreator
- Menampilkan daftar kreator yang sudah dipilih secara real-time
- Menghitung estimasi total biaya secara otomatis berdasarkan kreator yang dipilih
- Menjadi titik akhir (CTA) untuk mengirimkan undangan kampanye ke kreator terpilih

---

## Visibilitas dan Aturan Tampil

Panel ini mengikuti aturan tampil yang ketat berdasarkan halaman aktif.

| Halaman | Status Panel |
|---------|-------------|
| **Marketplace** | `display: flex` — panel tampil |
| **Campaigns** | `display: flex` — panel tampil |
| Dashboard | `display: none` — panel disembunyikan |
| Analytics | `display: none` — panel disembunyikan |
| Messages | `display: none` — panel disembunyikan |
| Creator List | `display: none` — panel disembunyikan |
| Media Monitoring | `display: none` — panel disembunyikan |
| Halaman lainnya | `display: none` — panel disembunyikan |

Panel hanya relevan saat pengguna aktif memilih kreator, sehingga pada halaman non-seleksi panel dikembalikan ke `display: none` agar tidak mengganggu tampilan layout halaman tersebut.

---

## Layout Keseluruhan

Panel terdiri dari **3 section vertikal** yang tersusun dari atas ke bawah di dalam satu elemen `<aside>`:

```
┌──────────────────────────────────┐
│  [Section 1: Campaign Brief Card]│
│  ─── Header (collapsible) ────── │
│  Nama Kampanye    [Status Badge] │
│  Tag Kategori                    │
│  Budget | Period                 │
│  [===========] 2 / 5 creators   │  ← progress bar
├──────────────────────────────────┤
│  [Section 2: Selected Creators]  │
│  Selected Creators (2) [Clear]   │
│  ──────────────────────────────  │
│  [Avatar] Nama ✓  532K • 4.21%  │
│           Rp 8.000.000       [×] │
│  [Avatar] Nama ✓  742K • 5.67%  │
│           Rp 12.000.000      [×] │
│  ──────────────────────────────  │
│  [+ Add more creators]           │
├──────────────────────────────────┤
│  [Section 3: Pricing & Action]   │
│  Estimated Total  Rp 20.000.000  │
│  [Review & Invite (2)  →]        │
└──────────────────────────────────┘
```

---

## Section 1: Campaign Brief Card

**Class:** `.panel-section.campaign-brief-card`

Section ini menampilkan ringkasan kampanye yang sedang aktif. Pengguna dapat melihat detail kampanye secara sekilas tanpa harus berpindah halaman.

### 1.1 Header Panel

**ID:** `toggleBrief`
**Class:** `.panel-header`

Header berisi dua area:

| Area | Elemen | Keterangan |
|------|--------|-----------|
| Kiri (`.header-left`) | `<h3>Campaign Brief</h3>` | Label judul section |
| Kiri (`.header-left`) | `<i data-lucide="info">` | Ikon info (Lucide Icons) sebagai penanda konteks |
| Kanan | `<button class="collapse-brief-btn">` | Tombol toggle collapse/expand |
| Kanan (dalam tombol) | `<i data-lucide="chevron-up" id="briefChevron">` | Ikon chevron yang berubah arah sesuai state |

Seluruh area header berfungsi sebagai trigger collapse. Klik pada `#toggleBrief` akan menyembunyikan atau menampilkan konten brief di bawahnya.

### 1.2 Brief Body

**ID:** `briefBody`
**Class:** `.brief-body`

Konten utama section 1 yang dapat di-collapse. Terdiri dari beberapa sub-elemen:

#### Baris Judul Kampanye

**Class:** `.campaign-title-row`

| Elemen | Konten Default |
|--------|---------------|
| `<h4 class="campaign-title">` | **Summer Getaway 2025** |
| `<span class="status-badge draft">` | **Draft** |

Badge status menampilkan kondisi kampanye. Status yang mungkin ditampilkan mengikuti status kampanye aktif yang dipilih (contoh default: `Draft`).

#### Tag Kategori

**Class:** `.campaign-tag`

Menampilkan jenis/kategori kampanye. Nilai default: **Travel Campaign**.

#### Detail Kampanye

**Class:** `.brief-details`

Dua baris informasi ringkas kampanye:

| Label | Nilai Default |
|-------|--------------|
| **Budget** | `Rp 150.000.000` |
| **Period** | `1 Jun - 30 Jun 2025` |

#### Progress Bar Pemilihan Kreator

**Class:** `.selection-progress-container`

Komponen visual yang menunjukkan seberapa banyak slot kreator telah terisi dari total maksimum yang diperbolehkan.

| Elemen | ID | Deskripsi |
|--------|-----|-----------|
| Track bar (kontainer) | `.progress-bar-track` | Latar belakang progress bar, lebar penuh |
| Fill bar (isian) | `#progressFill` | Elemen dalam yang lebarnya berubah secara dinamis |
| Teks keterangan | `#progressText` | Teks di bawah bar, format: `X / 5 creators selected` |

**Formula lebar progress bar:**

```
width = (jumlahKreatorTerpilih / 5) * 100 + "%"
```

**Contoh state:**

| Jumlah Dipilih | Lebar Bar | Teks |
|---------------|-----------|------|
| 0 | `0%` | `0 / 5 creators selected` |
| 1 | `20%` | `1 / 5 creators selected` |
| 2 | `40%` | `2 / 5 creators selected` ← default |
| 3 | `60%` | `3 / 5 creators selected` |
| 4 | `80%` | `4 / 5 creators selected` |
| 5 | `100%` | `5 / 5 creators selected` |

---

## Section 2: Selected Creators List

**Class:** `.panel-section.selected-creators-card`

Section ini menampilkan daftar kreator yang sudah dipilih untuk diundang ke kampanye. Merupakan section paling dinamis karena berubah setiap kali pengguna menambah atau menghapus kreator.

### 2.1 Header Section

**Class:** `.selected-creators-header`

| Elemen | ID | Konten Default | Deskripsi |
|--------|-----|---------------|-----------|
| `<h3>` | — | `Selected Creators (2)` | Judul dengan hitungan kreator terpilih di dalam `<span id="selectedCount">` |
| Tombol Clear All | `clearAllSelected` | `Clear All` | Hapus semua kreator dari daftar sekaligus |

Angka dalam tanda kurung pada judul section diperbarui secara otomatis setiap kali kreator ditambahkan atau dihapus. Nilai ini dibaca dari `<span id="selectedCount">`.

### 2.2 Daftar Kreator Terpilih

**ID:** `selectedListContainer`
**Class:** `.selected-list`

Kontainer yang menampung semua baris kreator terpilih secara dinamis. Setiap baris kreator memiliki struktur elemen yang konsisten.

#### Struktur Satu Baris Kreator

```
┌────────────────────────────────────────────────────┐
│ [Avatar 28px] Nama Kreator ✓  followers • ER%       │
│               Rp X.XXX.XXX                    [×]  │
└────────────────────────────────────────────────────┘
```

| Elemen | Ukuran / Keterangan |
|--------|---------------------|
| **Avatar foto** | Gambar bulat (border-radius penuh), ukuran 28×28px, foto profil kreator |
| **Nama kreator** | Teks nama lengkap kreator dalam huruf tebal |
| **Ikon verified** | Ikon centang kecil di samping nama, menandai akun terverifikasi |
| **followers • ER%** | Format: `[followersText] • [engagementRate]%` — contoh: `742K • 5.67%` |
| **Harga** | Format Rupiah: `Rp X.XXX.XXX` — harga kolaborasi kreator tersebut |
| **Tombol hapus (×)** | Tombol kecil berwarna merah/danger untuk menghapus kreator dari daftar |

#### Data Kreator Default (Pre-selected)

Dua kreator berikut sudah dipilih sejak panel pertama kali dimuat:

| # | Nama | Followers | Engagement Rate | Harga |
|---|------|-----------|----------------|-------|
| 1 | **Reza Alvaro** | 742K | 5,67% | Rp 12.000.000 |
| 2 | **Nadia Aurel** | 532K | 4,21% | Rp 8.000.000 |

### 2.3 Tombol Add More Creators

**ID:** `addMoreBtn`
**Class:** `.btn-add-more`

| Elemen | Konten |
|--------|--------|
| Ikon | `<i data-lucide="plus">` (Lucide Icons) |
| Teks | `Add more creators` |

Tombol ini berada di bawah daftar kreator terpilih. Fungsinya mengarahkan pengguna kembali ke area pencarian.

---

## Section 3: Cost Calculator & Action

**Class:** `.panel-section.pricing-action-card`

Section paling bawah yang merangkum total biaya dan menyediakan tombol aksi utama untuk mengirim undangan kampanye.

### 3.1 Baris Estimasi Total

**Class:** `.pricing-row`

| Elemen | ID | Konten Default |
|--------|-----|---------------|
| Label | — | `Estimated Total` |
| Nilai | `estimatedTotal` | `Rp 20.000.000` |

Nilai estimasi dihitung secara otomatis dari jumlah harga semua kreator yang sedang ada di daftar terpilih.

### 3.2 Tombol Review & Invite

**ID:** `btnReviewInvite`
**Class:** `.btn-action-primary`

Tombol CTA utama yang memicu pengiriman undangan kampanye.

| Elemen | ID | Konten Default |
|--------|-----|---------------|
| Teks | `actionBtnCount` (dalam `<span>`) | `Review & Invite (2)` |
| Ikon | — | `<i data-lucide="arrow-right">` |

Angka dalam tanda kurung pada teks tombol selalu sinkron dengan jumlah kreator yang sedang terpilih.

---

## Interaksi dan Perilaku Dinamis

### 4.1 Collapse / Expand Campaign Brief

**Trigger:** Klik pada elemen `#toggleBrief` (area header Campaign Brief)

**Mekanisme:**
1. Klik memicu toggle class `collapsed` pada elemen `#briefBody`
2. Saat `collapsed` aktif: `briefBody` tersembunyi (tinggi 0 atau `display: none`)
3. Saat `collapsed` tidak aktif: `briefBody` tampil penuh
4. Ikon chevron (`#briefChevron`) berubah arah:
   - **State terbuka (default):** `chevron-up` (mengarah ke atas)
   - **State tertutup:** `chevron-down` (mengarah ke bawah)

**State Transitions:**

```
State: EXPANDED (default)
  → Klik header
State: COLLAPSED
  → Klik header
State: EXPANDED
```

### 4.2 Menambahkan Kreator ke Daftar

**Trigger:** Klik tombol "Invite to Campaign" pada kartu kreator di halaman Marketplace

**Alur:**
1. Sistem mengecek jumlah kreator yang sudah terpilih
2. **Jika jumlah < 5:** kreator ditambahkan ke `#selectedListContainer` dengan baris baru
3. **Jika jumlah sudah = 5:** sistem menolak penambahan dan menampilkan toast peringatan

**Batas Maksimum Kreator:**

| Kondisi | Aksi |
|---------|------|
| Kreator terpilih < 5 | Tambahkan kreator baru, perbarui semua komponen terkait |
| Kreator terpilih = 5 | Tampilkan toast: *"Maximum of 5 creators can be selected"* |

**Komponen yang diperbarui setelah penambahan:**

| Komponen | Perubahan |
|----------|-----------|
| `#selectedListContainer` | Baris kreator baru ditambahkan |
| `#selectedCount` | Nilai angka bertambah 1 |
| `#progressFill` | Lebar bar diperbarui sesuai formula |
| `#progressText` | Teks `X / 5 creators selected` diperbarui |
| `#estimatedTotal` | Total harga dihitung ulang |
| `#actionBtnCount` | Angka dalam tombol Review & Invite diperbarui |

### 4.3 Menghapus Satu Kreator (Tombol ×)

**Trigger:** Klik tombol hapus (×) pada baris kreator di dalam `#selectedListContainer`

**Alur:**
1. Baris kreator yang bersangkutan dihapus dari DOM
2. Semua komponen terkait diperbarui (lihat tabel di 4.2)
3. Tidak ada toast/notifikasi — penghapusan satu kreator dianggap aksi kecil

**Efek pada kartu kreator di grid:**
- Jika halaman Marketplace aktif, kartu kreator yang dihapus kembali ke state semula (tombol berubah kembali ke "Invite to Campaign" atau state awal)

### 4.4 Clear All (Hapus Semua Kreator)

**Trigger:** Klik tombol `#clearAllSelected` ("Clear All")

**Alur:**
1. Semua baris kreator di `#selectedListContainer` dihapus sekaligus
2. Semua komponen terkait direset ke state kosong:

| Komponen | Nilai Setelah Reset |
|----------|---------------------|
| `#selectedListContainer` | Kosong (tidak ada baris) |
| `#selectedCount` | `0` |
| `#progressFill` | `width: 0%` |
| `#progressText` | `0 / 5 creators selected` |
| `#estimatedTotal` | `Rp 0` |
| `#actionBtnCount` | `0` |

3. Tampilkan toast info: `"Cleared all selected creators"`

### 4.5 Tombol Add More Creators

**Trigger:** Klik tombol `#addMoreBtn`

**Alur:**
1. Fokus diarahkan secara programatik ke elemen search bar di halaman Marketplace
2. Tampilkan toast info: `"Use the search bar or filters to find more creators!"`

Tujuan: mengingatkan pengguna bahwa cara menambah lebih banyak kreator adalah melalui pencarian dan filter di halaman utama.

### 4.6 Tombol Review & Invite

**Trigger:** Klik tombol `#btnReviewInvite`

**Kondisi dan Respons:**

| Kondisi | Aksi Sistem |
|---------|------------|
| **0 kreator terpilih** | Tampilkan toast warning: `"Please select at least one creator"` |
| **1–5 kreator terpilih** | Tampilkan toast success: `"Invitation brief sent to: [nama1, nama2, ...]!"` |

Teks toast success menyebut nama-nama semua kreator terpilih secara eksplisit, dipisahkan koma. Contoh untuk 2 kreator default:

```
Invitation brief sent to: Reza Alvaro, Nadia Aurel!
```

---

## Kalkulasi Harga (Estimated Total)

Nilai `#estimatedTotal` dihitung secara otomatis dan real-time setiap kali ada perubahan pada daftar kreator terpilih.

**Formula:**

```
estimatedTotal = jumlah(harga semua kreator dalam selectedListContainer)
```

**Contoh kalkulasi dengan data default:**

| Kreator | Harga |
|---------|-------|
| Reza Alvaro | Rp 12.000.000 |
| Nadia Aurel | Rp 8.000.000 |
| **Total** | **Rp 20.000.000** |

**Contoh kalkulasi dengan 5 kreator (kapasitas penuh):**

Jika pengguna menambahkan 3 kreator lagi masing-masing seharga Rp 7.500.000, Rp 9.000.000, dan Rp 15.000.000:

| Kreator | Harga |
|---------|-------|
| Reza Alvaro | Rp 12.000.000 |
| Nadia Aurel | Rp 8.000.000 |
| Kreator 3 | Rp 7.500.000 |
| Kreator 4 | Rp 9.000.000 |
| Kreator 5 | Rp 15.000.000 |
| **Total** | **Rp 51.500.000** |

Format tampilan: selalu menggunakan format Rupiah dengan pemisah titik ribuan (`Rp X.XXX.XXX`).

---

## State Lengkap Panel

### State Default (saat halaman pertama dimuat)

| Komponen | Nilai |
|----------|-------|
| Brief Body | Terbuka (tidak collapsed) |
| Chevron | `chevron-up` (mengarah ke atas) |
| Nama kampanye | `Summer Getaway 2025` |
| Status badge | `Draft` |
| Campaign tag | `Travel Campaign` |
| Budget | `Rp 150.000.000` |
| Period | `1 Jun - 30 Jun 2025` |
| Progress fill | `40%` |
| Progress text | `2 / 5 creators selected` |
| Kreator terpilih | Reza Alvaro + Nadia Aurel |
| Selected count | `2` |
| Estimated Total | `Rp 20.000.000` |
| Action btn count | `2` |

### State Kosong (setelah Clear All)

| Komponen | Nilai |
|----------|-------|
| `#selectedListContainer` | Kosong |
| `#selectedCount` | `0` |
| `#progressFill` | `width: 0%` |
| `#progressText` | `0 / 5 creators selected` |
| `#estimatedTotal` | `Rp 0` |
| `#actionBtnCount` | `0` |

### State Penuh (5 kreator terpilih)

| Komponen | Nilai |
|----------|-------|
| `#selectedCount` | `5` |
| `#progressFill` | `width: 100%` |
| `#progressText` | `5 / 5 creators selected` |
| `#estimatedTotal` | Jumlah harga 5 kreator |
| `#actionBtnCount` | `5` |
| Penambahan kreator baru | Diblokir — toast warning ditampilkan |

---

## Tabel Semua Toast Notification

| Aksi | Tipe Toast | Pesan |
|------|-----------|-------|
| Tambah kreator saat sudah 5 | Warning | `Maximum of 5 creators can be selected` |
| Klik "Clear All" | Info | `Cleared all selected creators` |
| Klik "Add more creators" | Info | `Use the search bar or filters to find more creators!` |
| Klik "Review & Invite" tanpa kreator | Warning | `Please select at least one creator` |
| Klik "Review & Invite" dengan kreator | Success | `Invitation brief sent to: [nama1, nama2, ...]!` |

---

## Referensi Elemen HTML dan ID

| Elemen | Selector | Deskripsi |
|--------|---------|-----------|
| Panel utama | `aside.right-panel` | Kontainer seluruh panel |
| Header brief | `#toggleBrief` | Trigger collapse/expand brief |
| Ikon chevron | `#briefChevron` | Ikon arah chevron pada tombol collapse |
| Body brief | `#briefBody` | Konten detail kampanye (collapsible) |
| Progress fill | `#progressFill` | Batang isian progress bar, style width dinamis |
| Progress text | `#progressText` | Teks `X / 5 creators selected` |
| Hitungan kreator | `#selectedCount` | Angka kreator terpilih di judul section 2 |
| Kontainer list | `#selectedListContainer` | Wrapper baris-baris kreator terpilih |
| Tombol clear all | `#clearAllSelected` | Hapus semua kreator sekaligus |
| Tombol add more | `#addMoreBtn` | Fokus ke search bar + tampilkan petunjuk |
| Total estimasi | `#estimatedTotal` | Nilai total harga semua kreator terpilih |
| Tombol aksi utama | `#btnReviewInvite` | CTA kirim undangan kampanye |
| Hitungan tombol aksi | `#actionBtnCount` | Angka dalam teks tombol Review & Invite |

---

## Ringkasan Interaksi

| Aksi Pengguna | Respons Sistem |
|---------------|----------------|
| Klik header "Campaign Brief" | Toggle collapse/expand brief body; chevron berubah arah |
| Klik "Invite to Campaign" di grid (kreator < 5) | Kreator ditambah ke panel; progress bar, total, dan hitungan diperbarui |
| Klik "Invite to Campaign" di grid (kreator = 5) | Toast warning: batas 5 kreator tercapai |
| Klik tombol × pada baris kreator | Kreator dihapus dari daftar; semua komponen diperbarui |
| Klik "Clear All" | Semua kreator dihapus; panel direset ke state kosong; toast info ditampilkan |
| Klik "Add more creators" | Fokus ke search bar; toast petunjuk ditampilkan |
| Klik "Review & Invite" (0 kreator) | Toast warning: minimal 1 kreator harus dipilih |
| Klik "Review & Invite" (1–5 kreator) | Toast success dengan nama-nama kreator terpilih |
| Berpindah ke halaman selain Marketplace/Campaigns | Panel disembunyikan (`display: none`) |
| Kembali ke halaman Marketplace atau Campaigns | Panel tampil kembali (`display: flex`) |

---

> **Lihat juga:**
> - `docs/pages/marketplace.md` — halaman Marketplace tempat kreator dipilih
> - `docs/pages/campaigns.md` — halaman Campaigns yang juga menampilkan panel ini
