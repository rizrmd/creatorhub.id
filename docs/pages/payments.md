# Page: Payments & Escrow — Creator Marketplace

**Referensi:** Source HTML `#paymentsView`
**Tema:** Light
**Akses:** Sidebar → Payments

---

## Deskripsi Halaman

Halaman **Payments & Escrow** adalah pusat manajemen keuangan kampanye influencer marketing di CreatorHub.id. Di sini pengguna (brand/advertiser) dapat memantau total pengeluaran kepada KOL, melihat saldo yang sedang ditahan dalam sistem escrow, memeriksa riwayat invoice, menyetujui pembayaran yang masih menunggu persetujuan, serta mengunduh laporan invoice per transaksi. Halaman ini juga menampilkan metode pembayaran korporat (kartu kredit) yang tersimpan di workspace.

Tagline halaman: *"Securely approve payouts, monitor budgets, and download campaign invoices"*

---

## Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Header: Judul "Payments & Escrow" + Deskripsi                       │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │  Total Disbursed│  │    In Escrow    │  │  Outstanding    │      │
│  │  Rp 1.12B       │  │  Rp 120.000.000 │  │  Rp 45.000.000  │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐  ┌──────────────────────┐  │
│  │       Payment History (Tabel)       │  │  Saved Wallet        │  │
│  │  Invoice | Creator | Campaign | ... │  │  Methods (Kartu)     │  │
│  │  ...                                │  │                      │  │
│  └─────────────────────────────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Header Halaman

Bagian paling atas halaman menampilkan judul dan deskripsi singkat:

| Elemen | Isi |
|--------|-----|
| Judul (H1) | **"Payments & Escrow"** |
| Deskripsi | *"Securely approve payouts, monitor budgets, and download campaign invoices"* |

---

## Stats Grid (Kartu Ringkasan Keuangan)

Tiga kartu statistik yang ditampilkan secara horizontal di bawah header. Masing-masing menyajikan indikator keuangan utama secara sekilas.

### Kartu 1 — Total Disbursed

| Atribut | Detail |
|---------|--------|
| **Label** | Total Disbursed |
| **Nilai** | Rp 1.12B |
| **Keterangan** | "All payouts approved" |
| **Fungsi** | Menampilkan akumulasi total pembayaran yang sudah disetujui dan dicairkan kepada seluruh KOL di semua kampanye |

### Kartu 2 — In Escrow

| Atribut | Detail |
|---------|--------|
| **Label** | In Escrow |
| **Nilai** | Rp 120.000.000 |
| **Keterangan** | "Protected by Escrow" + ikon gembok (lock) |
| **Fungsi** | Menampilkan total dana yang saat ini sedang ditahan dalam sistem escrow — dana sudah dikunci namun belum dicairkan ke KOL sampai kondisi kampanye terpenuhi |

> **Catatan Escrow:** Ikon gembok (lock icon, Lucide Icons) ditampilkan di samping label keterangan sebagai simbol visual bahwa dana sedang diamankan oleh sistem, bukan berada di rekening bebas brand atau KOL.

### Kartu 3 — Outstanding Invoices

| Atribut | Detail |
|---------|--------|
| **Label** | Outstanding Invoices |
| **Nilai** | Rp 45.000.000 |
| **Keterangan** | "Due in 14 days" |
| **Fungsi** | Menampilkan total nilai invoice yang belum dibayar dan mendekati jatuh tempo (14 hari ke depan) |

---

## Layout Konten Utama — `payments-content-grid`

Di bawah stats grid, halaman terbagi menjadi dua panel berdampingan dalam container `payments-content-grid`:

| Panel | Posisi | Isi |
|-------|--------|-----|
| **Payment History** | Kiri (lebih lebar) | Tabel riwayat invoice dan pembayaran |
| **Saved Wallet Methods** | Kanan (lebih sempit) | Kartu kredit korporat yang tersimpan |

---

## Panel Kiri — Payment History

### Deskripsi

Panel ini menggunakan class `dashboard-chart-card payments-table-panel` dan menampilkan tabel riwayat seluruh transaksi pembayaran kepada KOL. Setiap baris mewakili satu invoice untuk satu KOL dalam satu kampanye.

### Struktur Tabel Invoice

Tabel memiliki tujuh kolom:

| Kolom | Deskripsi |
|-------|-----------|
| **Invoice ID** | Nomor unik invoice dengan format `#INV-XXXX` |
| **Creator** | Nama lengkap KOL yang menerima pembayaran |
| **Campaign** | Nama kampanye tempat KOL dipekerjakan |
| **Amount** | Nominal pembayaran dalam Rupiah |
| **Status** | Status pembayaran saat ini (lihat bagian Status Badge) |
| **Date** | Tanggal invoice dibuat atau diproses |
| **Action** | Tombol unduh laporan invoice (ikon download) |

### Data Invoice (Sampel)

| Invoice ID | Creator | Campaign | Amount | Status | Date | Action |
|-----------|---------|----------|--------|--------|------|--------|
| #INV-9281 | Reza Alvaro | Summer Getaway 2025 | Rp 6.000.000 | Paid | Jun 5, 2025 | [download] |
| #INV-9214 | Nadia Aurel | Summer Getaway 2025 | Rp 8.000.000 | Paid | Jun 4, 2025 | [download] |
| #INV-8951 | Clara Devina | Beauty Fest Autumn | Rp 6.500.000 | Paid | May 20, 2025 | [download] |
| #INV-9304 | Fahmi Ramadhan | Next-Gen Tech Launch | Rp 7.500.000 | Pending Approval | Jun 7, 2025 | [download] |

### Detail Per Invoice

#### Invoice #INV-9281

- **Creator:** Reza Alvaro
- **Kampanye:** Summer Getaway 2025
- **Nominal:** Rp 6.000.000
- **Status:** Paid (lunas)
- **Tanggal:** 5 Juni 2025

#### Invoice #INV-9214

- **Creator:** Nadia Aurel
- **Kampanye:** Summer Getaway 2025
- **Nominal:** Rp 8.000.000
- **Status:** Paid (lunas)
- **Tanggal:** 4 Juni 2025

#### Invoice #INV-8951

- **Creator:** Clara Devina
- **Kampanye:** Beauty Fest Autumn
- **Nominal:** Rp 6.500.000
- **Status:** Paid (lunas)
- **Tanggal:** 20 Mei 2025

#### Invoice #INV-9304

- **Creator:** Fahmi Ramadhan
- **Kampanye:** Next-Gen Tech Launch
- **Nominal:** Rp 7.500.000
- **Status:** Pending Approval (menunggu persetujuan)
- **Tanggal:** 7 Juni 2025

---

## Status Badge Invoice

Setiap baris invoice memiliki badge status yang ditampilkan dengan warna berbeda sesuai kondisi pembayaran.

| Status | Class CSS | Warna | Keterangan |
|--------|-----------|-------|-----------|
| **Paid** | `status-paid` | Hijau | Pembayaran telah diproses dan dana sudah diterima oleh KOL |
| **Pending Approval** | `status-pending` | Oranye / Kuning | Invoice sudah dikirim oleh KOL namun masih menunggu persetujuan dari pihak brand/advertiser sebelum dana dapat dicairkan |

> **Catatan:** Status `status-paid` menggunakan warna hijau untuk memberikan indikasi visual yang jelas bahwa transaksi sudah selesai dan tidak memerlukan tindakan lebih lanjut. Status `status-pending` menggunakan warna oranye/kuning sebagai peringatan bahwa ada invoice yang memerlukan tindakan segera dari pengguna.

---

## Panel Kanan — Saved Wallet Methods

### Deskripsi

Panel ini menggunakan class `dashboard-chart-card wallet-panel` dan menampilkan metode pembayaran korporat yang tersimpan di workspace. Tujuan panel ini adalah memberikan visibilitas kepada pengelola keuangan mengenai sumber dana yang digunakan untuk mencairkan pembayaran kepada KOL.

### Kartu Kredit Visual (Corporate Spend Card)

Kartu kredit ditampilkan dalam bentuk mockup visual bergaya fisik dengan class `payment-method-card-mockup visa-theme`. Informasi yang ditampilkan:

| Elemen | Detail |
|--------|--------|
| **Nama Kartu** | Corporate Spend Card |
| **Jaringan** | VISA |
| **Nomor Kartu** | •••• •••• •••• 5683 (tersamarkan, hanya 4 digit terakhir yang terlihat) |
| **Pemegang Kartu** | Arif Budiman |
| **Masa Berlaku** | 12/28 |

> **Catatan Keamanan:** Nomor kartu secara sengaja disembunyikan menggunakan karakter bullet (•) kecuali empat digit terakhir. Ini adalah praktik standar keamanan untuk melindungi informasi kartu dari akses yang tidak sah atau tangkapan layar yang tidak disengaja.

### Tombol — Link New Corporate Card

| Atribut | Detail |
|---------|--------|
| **ID Elemen** | `btnAddCardMock` |
| **Label** | `+ Link New Corporate Card` |
| **Fungsi** | Menambahkan kartu kredit korporat baru ke workspace |
| **Akses** | Dibatasi hanya untuk **Workspace Admin** |

---

## Interaksi & Behavior

### 1. Tombol Download Invoice

Setiap baris dalam tabel Payment History memiliki tombol aksi berupa ikon download di kolom **Action**.

| Properti | Detail |
|----------|--------|
| **Elemen** | Ikon download (Lucide Icons) per baris tabel |
| **Trigger** | Klik ikon download pada baris invoice manapun |
| **Behavior** | Menampilkan toast notification |
| **Pesan Toast** | `"Downloading invoice report #INV-XXXX..."` (nomor invoice disesuaikan dinamis dengan baris yang diklik) |

**Contoh pesan toast per invoice:**

| Invoice Diklik | Pesan Toast |
|---------------|-------------|
| #INV-9281 | `"Downloading invoice report #INV-9281..."` |
| #INV-9214 | `"Downloading invoice report #INV-9214..."` |
| #INV-8951 | `"Downloading invoice report #INV-8951..."` |
| #INV-9304 | `"Downloading invoice report #INV-9304..."` |

> **Catatan Prototype:** Pada tahap prototype saat ini, tombol download hanya memicu toast notification. Tidak ada file invoice yang benar-benar diunduh. Fungsionalitas unduh sesungguhnya (generate PDF/CSV invoice) akan diimplementasikan pada versi produksi.

---

### 2. Tombol Link New Corporate Card

| Properti | Detail |
|----------|--------|
| **Elemen** | `<button id="btnAddCardMock">` |
| **Trigger** | Klik tombol `+ Link New Corporate Card` |
| **Behavior** | Menampilkan toast notification pembatasan akses |
| **Pesan Toast** | `"Card management restricted to workspace admins."` |

> **Catatan Akses:** Pengelolaan kartu kredit (menambah, menghapus, atau mengedit metode pembayaran) hanya dapat dilakukan oleh pengguna dengan peran **Workspace Admin**. Pengguna biasa (member, campaign manager, dll.) yang mencoba mengklik tombol ini akan mendapatkan pesan toast yang menginformasikan bahwa tindakan tersebut memerlukan hak akses admin. Pembatasan ini mencegah perubahan tidak sah pada sumber dana pembayaran kampanye.

---

## Ringkasan Status Badge

| Status | Class CSS | Warna | Aksi yang Diperlukan |
|--------|-----------|-------|---------------------|
| **Paid** | `status-paid` | Hijau | Tidak ada — transaksi selesai |
| **Pending Approval** | `status-pending` | Oranye | Persetujuan dari brand/advertiser diperlukan sebelum dana dicairkan |

---

## Ringkasan Interaksi

| Elemen | Trigger | Pesan Toast | Akses |
|--------|---------|-------------|-------|
| Ikon Download (setiap baris tabel) | Klik | `"Downloading invoice report #INV-XXXX..."` | Semua pengguna |
| Tombol `+ Link New Corporate Card` | Klik | `"Card management restricted to workspace admins."` | Workspace Admin saja |

---

## Catatan Umum

- **Sistem Escrow:** Dana KOL ditahan terlebih dahulu oleh sistem sebelum dicairkan. Hal ini melindungi brand dari pembayaran untuk deliverables yang belum terpenuhi, sekaligus menjamin KOL akan menerima pembayaran setelah deliverables disetujui.
- **Approval Flow:** Invoice dengan status `Pending Approval` memerlukan tindakan eksplisit dari pengguna berwenang (brand/advertiser) sebelum dana dapat dilepaskan dari escrow ke rekening KOL.
- **Keamanan Data Kartu:** Nomor kartu kredit hanya menampilkan 4 digit terakhir (`•••• •••• •••• 5683`) untuk menjaga keamanan informasi sensitif.
- **Pembatasan Admin:** Manajemen kartu kredit korporat sepenuhnya dibatasi untuk peran Workspace Admin guna menjaga integritas metode pembayaran workspace.
