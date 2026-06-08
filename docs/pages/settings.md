# Page: Settings — Workspace Settings (`settingsView`)

**View ID:** `settingsView`
**Tema:** Light
**Akses:** Sidebar → Settings (ikon gear / pengaturan)

---

## Deskripsi Halaman

Halaman **Workspace Settings** adalah pusat pengaturan akun dan preferensi pengguna di aplikasi CreatorHub.id. Halaman ini memungkinkan pengguna (brand manager / admin agency) untuk mengelola informasi profil perusahaan, mengatur preferensi notifikasi, serta mengonfigurasi keamanan akun termasuk kata sandi dan autentikasi dua faktor.

Halaman ini mencakup tiga area pengaturan utama yang diakses melalui tab sidebar vertikal di sisi kiri:

1. **My Profile** — Edit data profil dan preferensi currency
2. **Notifications** — Atur channel dan jenis alert yang diterima
3. **Security & Password** — Ubah kata sandi dan aktifkan 2FA

---

## Layout Keseluruhan

Halaman menggunakan **2-kolom flex layout**: sidebar tab di kiri (sempit) dan panel konten di kanan (lebar). Keseluruhan area dibungkus dalam satu kartu konten (`.settings-content-card`).

```
┌─────────────────────────────────────────────────────────────────┐
│  PAGE HEADER                                                     │
│  "Workspace Settings"                                            │
│  "Modify user roles, notification alerts, default payment        │
│   criteria, and account preferences"                             │
├───────────────────┬─────────────────────────────────────────────┤
│  SIDEBAR TABS     │  PANEL KONTEN (aktif sesuai tab)             │
│                   │                                              │
│  [●] My Profile   │  ┌─────────────────────────────────────┐    │
│  [ ] Notifications│  │  Konten Tab Yang Sedang Aktif        │    │
│  [ ] Security &   │  │  (Profile / Notifications / Security)│    │
│      Password     │  └─────────────────────────────────────┘    │
│                   │                                              │
└───────────────────┴─────────────────────────────────────────────┘
```

---

## Header Halaman

Bagian paling atas halaman (di luar kartu konten) menampilkan:

| Elemen | Detail |
|--------|--------|
| Judul | **"Workspace Settings"** (H1) |
| Subtitle | *"Modify user roles, notification alerts, default payment criteria, and account preferences"* |

---

## Struktur Layout: `.settings-content-card`

Kartu utama menggunakan `display: flex` dengan dua anak langsung:

| Komponen | Selector | Sifat |
|----------|----------|-------|
| Sidebar Tab | `.settings-sidebar-tabs` | Kolom kiri, lebar sempit, daftar tombol navigasi vertikal |
| Panel Konten | `.settings-fields-pane` | Kolom kanan, lebar lebih besar, menampilkan konten tab aktif |

---

## Sidebar Tabs (Kolom Kiri)

Sidebar berisi tiga tombol navigasi tab yang disusun secara vertikal. Setiap tombol memiliki atribut `data-settings-tab` sebagai identifier tab target.

| Urutan | Label | `data-settings-tab` | Ikon (Lucide) | Status Awal |
|--------|-------|---------------------|---------------|-------------|
| 1 | My Profile | `profile` | `user` | Aktif (class `active`) |
| 2 | Notifications | `notifications` | `bell` | Tidak aktif |
| 3 | Security & Password | `security` | `shield` | Tidak aktif |

**Perilaku Tab:**
- Hanya satu tab yang aktif dalam satu waktu.
- Klik tombol tab → class `active` dipindahkan ke tombol yang diklik.
- Panel konten yang terkait ditampilkan; panel lainnya disembunyikan (`display: none`).
- Tab aktif secara visual dibedakan dari tab lainnya (biasanya dengan warna latar atau teks yang berbeda).

---

## Panel Konten: Tab 1 — My Profile

**ID Panel:** `settings-pane-profile`
**Data Tab:** `data-settings-tab="profile"`
**Status Awal:** Tampil (default aktif)

### Deskripsi

Tab ini memungkinkan pengguna mengedit informasi profil korporat mereka, termasuk nama, peran profesional, email bisnis, nama agency, dan preferensi mata uang.

### Avatar / Foto Profil

Di bagian atas form terdapat komponen upload foto profil:

| Elemen | Detail |
|--------|--------|
| Preview | Gambar avatar bulat (foto profil saat ini) |
| Tombol | **"Upload Photo"** |
| Format yang Diterima | PNG, JPG |
| Ukuran Maksimal | 2 MB |
| Status Implementasi | **Belum diimplementasi** di prototype — tombol ada namun belum berfungsi |

### Form: `profileSettingsForm`

Form disusun dalam beberapa baris (`form-row`), masing-masing memuat dua field secara horizontal (kecuali baris terakhir yang hanya memuat satu field):

#### Baris 1 — Identitas Pengguna

| Field | ID | Tipe | Label | Nilai Default |
|-------|----|------|-------|---------------|
| Nama Lengkap | `settingsName` | `text` | Full Name | `Arif Budiman` |
| Peran Profesional | `settingsRole` | `text` | Professional Role | `Brand Manager` |

#### Baris 2 — Kontak & Organisasi

| Field | ID | Tipe | Label | Nilai Default |
|-------|----|------|-------|---------------|
| Email Bisnis | `settingsEmail` | `email` | Business Email | `arif.budiman@agency.id` |
| Nama Agency | `settingsAgency` | `text` | Agency Name | `CreatorHub agency.id` |

#### Baris 3 — Preferensi Mata Uang

| Field | ID | Tipe | Label |
|-------|----|------|-------|
| Mata Uang | `settingsCurrency` | `select` (dropdown) | Preferred Currency |

**Opsi Dropdown `settingsCurrency`:**

| Nilai Opsi | Keterangan |
|------------|------------|
| `IDR (Rp) - Indonesian Rupiah` | Rupiah Indonesia (default / pertama) |
| `USD ($) - United States Dollar` | Dolar Amerika Serikat |
| `SGD ($) - Singapore Dollar` | Dolar Singapura |

#### Tombol Aksi

| Tombol | ID | Tipe | Label |
|--------|----|------|-------|
| Simpan | `btnSaveProfileSettings` | `button` | **Save Changes** |

### Interaksi: Tombol "Save Changes"

Alur validasi dan penyimpanan berjalan sebagai berikut:

1. **Validasi Field Wajib:**
   - Semua field form diperiksa — apabila ada field yang kosong, sistem menampilkan peringatan (`alert`) dan proses berhenti.
   - Field yang wajib diisi: Full Name, Professional Role, Business Email, Agency Name.

2. **Jika Semua Field Valid:**
   - Nama dan peran pengguna di **topbar** (area header aplikasi, bagian info pengguna) diperbarui secara langsung / live update tanpa reload halaman.
   - Toast notifikasi ditampilkan: **"Workspace profile settings saved!"**

**Ringkasan Alur:**

```
Klik "Save Changes"
       │
       ▼
  Ada field kosong?
  ┌─── Ya ──► alert("...") → berhenti
  │
  └─── Tidak ──► Update nama + role di topbar (live)
                         │
                         ▼
               showToast("Workspace profile settings saved!")
```

---

## Panel Konten: Tab 2 — Notifications

**ID Panel:** `settings-pane-notifications`
**Data Tab:** `data-settings-tab="notifications"`
**Status Awal:** Tersembunyi (`display: none`)

### Deskripsi

Tab ini memungkinkan pengguna mengelola cara mereka menerima alert dan notifikasi terkait aktivitas kampanye, kreator, dan laporan performa.

Header panel:
- **Judul:** "Notification Preferences" (H3)
- **Deskripsi:** *"Manage how you receive alerts about creator invites and brief approvals."*

### Daftar Toggle Notifikasi

Setiap item notifikasi ditampilkan sebagai satu baris dengan **switch control** (toggle on/off). Terdapat tiga item notifikasi:

---

#### Toggle 1: Creator Brief Acceptance

| Properti | Nilai |
|----------|-------|
| Label | **Creator Brief Acceptance** |
| Deskripsi | *"Receive email alerts when a creator accepts your invite."* |
| Status Default | **ON** (aktif) |
| Tipe Kontrol | Switch toggle |

**Fungsi:** Mengirimkan notifikasi email kepada pengguna setiap kali seorang kreator menerima undangan brief yang dikirimkan.

---

#### Toggle 2: Weekly Reports & KPI Digest

| Properti | Nilai |
|----------|-------|
| Label | **Weekly Reports & KPI Digest** |
| Deskripsi | *"Get a summary email of your campaign impressions every Monday."* |
| Status Default | **ON** (aktif) |
| Tipe Kontrol | Switch toggle |

**Fungsi:** Mengirimkan ringkasan mingguan performa kampanye (impressi, dll.) via email setiap hari Senin.

---

#### Toggle 3: Direct Messages Inbox

| Properti | Nilai |
|----------|-------|
| Label | **Direct Messages Inbox** |
| Deskripsi | *"Receive immediate alerts for new messages from hired KOLs."* |
| Status Default | **ON** (aktif) |
| Tipe Kontrol | Switch toggle |

**Fungsi:** Mengirimkan notifikasi segera (real-time) ketika ada pesan masuk baru dari KOL yang sudah dipekerjakan (hired).

---

### Catatan Implementasi Notifikasi

- Semua toggle diatur **ON** secara default pada prototype.
- Tidak ada tombol "Save" terpisah untuk tab ini — perubahan toggle diasumsikan langsung tersimpan (atau akan diimplementasi lebih lanjut).

---

## Panel Konten: Tab 3 — Security & Password

**ID Panel:** `settings-pane-security`
**Data Tab:** `data-settings-tab="security"`
**Status Awal:** Tersembunyi (`display: none`)

### Deskripsi

Tab ini memungkinkan pengguna mengubah kata sandi akun dan mengaktifkan / menonaktifkan Two-Factor Authentication (2FA) untuk lapisan keamanan tambahan.

**Judul Panel:** "Security & Access Control" (H3)

### Form: `securitySettingsForm`

#### Field Kata Sandi

| Field | ID | Tipe | Label | Placeholder |
|-------|----|------|-------|-------------|
| Kata Sandi Saat Ini | `currentPassword` | `password` | Current Password | `••••••••` |
| Kata Sandi Baru | `newPassword` | `password` | New Password | `Min. 8 characters` |
| Konfirmasi Kata Sandi | `confirmPassword` | `password` | Confirm New Password | `Re-type password` |

**Catatan Field:**
- Input `currentPassword` — pengguna harus memasukkan kata sandi lama terlebih dahulu sebagai verifikasi.
- Input `newPassword` — kata sandi baru minimal 8 karakter (ditunjukkan oleh placeholder).
- Input `confirmPassword` — pengulangan kata sandi baru untuk konfirmasi konsistensi.

#### Kotak 2FA: `.two-factor-auth-box`

Di dalam form terdapat kotak informasi 2FA yang terpisah secara visual:

| Elemen | Detail |
|--------|--------|
| Ikon | `shield` (Lucide), warna biru |
| Judul | **"Two-Factor Authentication (2FA)"** (H4) |
| Deskripsi | *"Secure your brand account with an extra verification code upon logging in."* |
| Tombol | `btnToggle2FA` — label dan style berubah berdasarkan status 2FA |

**Status Tombol 2FA:**

| Status 2FA | Label Tombol | Style Tombol |
|------------|-------------|--------------|
| Belum aktif | **"Enable 2FA"** | Outline biru |
| Sudah aktif | **"Disable 2FA"** | Outline oranye |

#### Tombol Aksi Utama

| Tombol | ID | Label |
|--------|----|-------|
| Simpan Keamanan | `btnSaveSecuritySettings` | **Update Security Settings** |

---

### Interaksi: Toggle 2FA (`btnToggle2FA`)

Tombol 2FA berfungsi sebagai toggle dua arah:

**Skenario A — Mengaktifkan 2FA:**

```
Klik "Enable 2FA"
       │
       ▼
  Label tombol berubah → "Disable 2FA"
  Style tombol berubah → outline-orange
       │
       ▼
  showToast("Two-Factor Authentication is active!")
```

**Skenario B — Menonaktifkan 2FA:**

```
Klik "Disable 2FA"
       │
       ▼
  Label tombol berubah → "Enable 2FA"
  Style tombol berubah → outline-blue
       │
       ▼
  showToast("Two-Factor Authentication disabled.")
```

---

### Interaksi: Tombol "Update Security Settings"

```
Klik "Update Security Settings"
       │
       ▼
  showToast("Security credentials updated!")
```

**Catatan:** Pada prototype, tidak ada validasi tambahan (pencocokan kata sandi, panjang minimum, dll.) yang diimplementasi secara eksplisit — tombol langsung memicu toast konfirmasi.

---

## Ringkasan Semua Interaksi

| Aksi | Trigger | Hasil |
|------|---------|-------|
| Klik tab sidebar | Klik tombol `.settings-tab-link` | Pindah class `active`, tampilkan panel terkait, sembunyikan panel lain |
| Simpan profil (valid) | Klik `btnSaveProfileSettings` | Update topbar live + toast "Workspace profile settings saved!" |
| Simpan profil (tidak valid) | Klik `btnSaveProfileSettings` saat ada field kosong | `alert` muncul, proses berhenti |
| Upload foto | Klik "Upload Photo" | Belum diimplementasi di prototype |
| Toggle notifikasi | Klik switch on/off | Ubah status toggle (belum ada penyimpanan eksplisit di prototype) |
| Aktifkan 2FA | Klik "Enable 2FA" | Tombol jadi "Disable 2FA" (orange) + toast "Two-Factor Authentication is active!" |
| Nonaktifkan 2FA | Klik "Disable 2FA" | Tombol jadi "Enable 2FA" (blue) + toast "Two-Factor Authentication disabled." |
| Simpan keamanan | Klik `btnSaveSecuritySettings` | Toast "Security credentials updated!" |

---

## Komponen UI yang Digunakan

| Komponen | Keterangan |
|----------|------------|
| Tab Sidebar Vertikal | Navigasi antar panel pengaturan |
| Form Input Text / Email | Input data profil dan kata sandi |
| Input Password | Field tersembunyi untuk kata sandi (current, new, confirm) |
| Dropdown Select | Pilihan mata uang (`settingsCurrency`) |
| Switch Toggle | Kontrol on/off untuk preferensi notifikasi |
| Avatar Upload | Komponen foto profil (belum aktif di prototype) |
| Toast Notification | Feedback aksi berhasil (muncul sementara, lalu hilang) |
| Alert Dialog | Feedback validasi form (field kosong) |
| 2FA Box | Kotak informasi + tombol toggle khusus autentikasi dua faktor |

---

## Catatan Prototype

- **Upload Photo** belum diimplementasi — tombol tersedia secara visual namun tidak melakukan aksi apapun.
- **Validasi Kata Sandi** (panjang minimal, kecocokan `newPassword` vs `confirmPassword`) belum diimplementasi di prototype — hanya toast yang ditampilkan.
- **Penyimpanan Toggle Notifikasi** tidak secara eksplisit memanggil fungsi save — perubahan state toggle diasumsikan bersifat langsung (tanpa konfirmasi eksplisit).
- **Live Update Topbar** pada simpan profil merujuk pada elemen header/navbar aplikasi yang menampilkan nama dan peran pengguna yang sedang login.
