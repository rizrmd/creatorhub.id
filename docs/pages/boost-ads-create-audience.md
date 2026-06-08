# Page: Boost Ads — Create Audience

**Referensi:** `docs/reference/Create Audience.jpg`
**Tema:** Dark
**Status:** Prototype (belum diimplementasikan di source code utama)
**Akses:** Menu atau fitur khusus di dalam proyek/kampanye → Boost Ads → tab "Create Audience"

---

## Deskripsi Halaman

Halaman untuk membuat dan menyimpan definisi audiens yang akan digunakan sebagai target iklan Meta. Pengguna dapat membangun tiga jenis audiens — Custom, Lookalike, atau Saved — dengan menentukan nama, sumber data, dan kriteria penargetan. Audiens yang tersimpan kemudian dapat dipilih kembali saat mengkonfigurasi Ad Set pada tahap 2 di alur Launch Ads.

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Breadcrumb: Projects / BGN    [💬]  [⚙]  [Budget] [Quota]  │
├──────────────────────────────────────────────────────────────┤
│  Boost Ads                                                    │
│  Manage and launch Meta ad campaigns directly from Hydra.    │
├──────────────────────────────────────────────────────────────┤
│  [Launch Ads] [Create Audience*] [Audience Manager] [Campaign]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  👥 Create a New Audience                            │  │
│   │  Build saved, custom, or lookalike audiences...      │  │
│   │                                                      │  │
│   │  [Custom] [Lookalike]                                │  │
│   │                                                      │  │
│   │  Audience Name: [________________________]           │  │
│   │  Description:   [________________________]           │  │
│   │                 [________________________]           │  │
│   │                                                      │  │
│   │  Custom Audience Source:                             │  │
│   │  [📋 Video List] [📷 Instagram] [📘 Facebook] [🎬 Video]│ │
│   │                                                      │  │
│   │  Upload Customer List                                │  │
│   │  ┌────────────────────────────────────────────────┐  │  │
│   │  │  ↑  Click to upload CSV                        │  │  │
│   │  │     Accepts csv — emails, phone numbers, IDs   │  │  │
│   │  └────────────────────────────────────────────────┘  │  │
│   │                                                      │  │
│   │                        [Reset]  [Save Audience]      │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Topbar

### Breadcrumb
- Format: **Projects / [Nama Proyek]**
- Contoh: *Projects / BGN*
- Ikon pesan/chat (💬) di tengah topbar
- Ikon pengaturan (⚙) di pojok kanan topbar

### Stats Pojok Kanan Atas
Dua kartu info yang selalu tampil di seluruh halaman Boost Ads:

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
| **Launch Ads** | — | Buat dan luncurkan kampanye iklan baru |
| **Create Audience** | Aktif (underline/highlight) | Definisikan target audiens baru |
| **Audience Manager** | — | Kelola daftar audiens yang sudah tersimpan |
| **Campaign Manager** | — | Pantau dan kelola kampanye yang sedang berjalan |

---

## Form: Create a New Audience

### Header Form
- Ikon user-group (👥)
- Judul: **"Create a New Audience"**
- Subjudul: *"Build saved, custom, or lookalike audiences to target your ads more precisely."*

---

## Tipe Audiens

Toggle dua opsi di bagian atas form, menentukan mode pembuatan audiens:

| Tombol | Status Default | Deskripsi |
|--------|---------------|-----------|
| **Custom** | Aktif (putih/highlight) | Audiens dibentuk dari data pelanggan sendiri atau keterlibatan konten |
| **Lookalike** | Tidak aktif (abu-abu) | Audiens baru yang dibuat Meta berdasarkan kemiripan dengan audiens Custom yang sudah ada |

- Saat **Custom** aktif, form menampilkan pilihan sumber data dan opsi upload CSV.
- Saat **Lookalike** aktif, form akan menyesuaikan untuk memilih audiens sumber (source audience) dan persentase kemiripan.

---

## Field Form

### Audience Name
- **Tipe:** Text input (satu baris)
- **Placeholder:** `e.g. Jakarta Female 25-34`
- **Keterangan:** Nama unik untuk menyimpan dan mengidentifikasi audiens ini. Nama yang deskriptif memudahkan pemilihan kembali di Audience Manager dan Ad Set.
- **Validasi:** Wajib diisi sebelum menyimpan audiens.

### Description
- **Tipe:** Textarea (multi-baris)
- **Placeholder:** `Optional description`
- **Keterangan:** Catatan atau keterangan opsional tentang audiens ini, misalnya segmentasi yang digunakan, tanggal dibuat, atau catatan kampanye terkait.
- **Validasi:** Opsional, tidak wajib diisi.

---

## Custom Audience Source

Pengguna memilih satu sumber data yang menjadi dasar pembentukan audiens Custom. Terdapat empat pilihan, ditampilkan sebagai kartu dengan ikon:

| Sumber | Ikon | Deskripsi |
|--------|------|-----------|
| **Video List** | 📋 | Audiens dibentuk dari daftar penonton video tertentu. Cocok untuk retargeting penonton konten video. |
| **Instagram Profile** | 📷 | Audiens dari pengguna yang pernah berinteraksi dengan profil Instagram yang terhubung. |
| **Facebook Pages** | 📘 | Audiens dari pengguna yang pernah berinteraksi dengan halaman Facebook yang terhubung. |
| **Video** | 🎬 | Audiens berdasarkan tingkat keterlibatan (engagement) terhadap konten video tertentu di Meta. |

- Hanya satu sumber yang bisa dipilih pada satu waktu.
- Sumber yang dipilih akan menampilkan panel konfigurasi atau upload yang relevan di bawahnya.

---

## Upload Customer List

Panel ini tampil ketika sumber **Video List** dipilih (atau sebagai panel aktif default saat mode Custom). Digunakan untuk mengunggah daftar data pelanggan dalam format CSV.

### Detail Panel

- **Judul:** Upload Customer List
- **Deskripsi:** *"Upload a CSV file with customer emails, phones, or IDs."*

### Area Drag-and-Drop

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                         ↑                              │
│                  Click to upload CSV                    │
│                                                         │
│      Accepts csv — emails, phone numbers, or user IDs  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Elemen | Keterangan |
|--------|------------|
| Ikon panah ke atas (↑) | Indikator visual area upload |
| Teks utama | "Click to upload CSV" — area dapat diklik untuk membuka dialog file |
| Sub-teks | "Accepts csv — emails, phone numbers, or user IDs" — menjelaskan format data yang diterima |
| Drag-and-drop | File CSV dapat langsung diseret ke area ini |

### Format File yang Diterima

| Kolom Data | Keterangan |
|------------|------------|
| Email | Alamat email pelanggan |
| Phone Number | Nomor telepon (format internasional dianjurkan) |
| User IDs | ID pengguna Meta atau ID internal platform |

- Format file: `.csv`
- Data yang diunggah akan digunakan Meta untuk mencocokkan dengan akun pengguna (customer matching).

---

## Tombol Aksi

Dua tombol terletak di bagian bawah kanan form:

| Tombol | Tipe | Fungsi |
|--------|------|--------|
| **Reset** | Sekunder / Outline | Mengosongkan semua field form dan mengembalikan ke kondisi awal (default) |
| **Save Audience** | Primer / Biru solid | Menyimpan definisi audiens ke sistem; audiens akan muncul di tab Audience Manager |

### Kondisi Tombol Save Audience

| Kondisi | Perilaku |
|---------|----------|
| Audience Name kosong | Tombol disabled atau muncul pesan validasi error |
| Sumber audiens belum dipilih | Tombol disabled atau muncul pesan validasi error |
| File CSV belum diunggah (jika sumber memerlukan upload) | Tombol disabled atau muncul peringatan |
| Semua field wajib terisi | Tombol aktif, audiens dapat disimpan |

### Kondisi Tombol Reset

| Kondisi | Perilaku |
|---------|----------|
| Form sudah diisi sebagian | Semua field dikosongkan, tipe audiens kembali ke Custom, sumber kembali ke default |
| File CSV sudah diunggah | File dihapus dari antrian upload |

---

## Hubungan dengan Fitur Lain

### Audience Manager (Tab)

Setiap audiens yang berhasil disimpan melalui form ini akan otomatis muncul sebagai entri di tab **Audience Manager**. Di sana pengguna dapat:
- Melihat daftar semua audiens tersimpan
- Mengedit atau menghapus audiens yang sudah ada
- Melihat detail konfigurasi masing-masing audiens

### Launch Ads — Step 2: Ad Set (Tab)

Audiens yang tersimpan dapat dipilih saat pengguna mengkonfigurasi Ad Set pada alur **Launch Ads**:

```
Launch Ads
  → Step 1: Campaign   (nama kampanye, objective, budget)
  → Step 2: Ad Set     ← pilih audiens dari Audience Manager di sini
  → Step 3: Ads Creative
```

Pemisahan alur ini memungkinkan pengguna menyiapkan audiens terlebih dahulu secara mandiri, kemudian menggunakannya kembali lintas kampanye tanpa perlu mendefinisikan ulang setiap kali membuat iklan baru.

---

## Catatan Implementasi

- Halaman ini adalah **prototype** — belum ada kode implementasi di source code utama pada saat dokumentasi ini ditulis.
- Integrasi dengan Meta Ads API diperlukan untuk sinkronisasi audiens yang disimpan ke platform Meta.
- Validasi format CSV (kolom, encoding, dan ukuran file) perlu didefinisikan lebih lanjut saat implementasi.
- Mode **Lookalike** memerlukan tambahan field: pemilihan source audience dan persentase kemiripan (1%–10%), yang belum tampak di referensi visual prototype ini.
