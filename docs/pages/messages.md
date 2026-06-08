# Page: Messages — Real-Time Chat antara Brand dan Kreator

**View ID:** `messagesView`
**Tema:** Light
**Akses:** Sidebar → Messages (dengan badge unread count)

---

## Deskripsi Halaman

Halaman **Messages** adalah fitur komunikasi real-time di CreatorHub.id yang memungkinkan brand/pengelola kampanye untuk berkomunikasi langsung dengan kreator/KOL yang terdaftar di platform. Halaman ini menggantikan kebutuhan komunikasi via email atau platform chat eksternal, sehingga seluruh pembicaraan seputar kampanye, brief, timeline, dan negosiasi dapat terpusat di satu tempat.

Halaman ini berfungsi sebagai **inbox + chat window** sekaligus — bagian kiri menampilkan daftar percakapan (sidebar), sedangkan bagian kanan menampilkan isi percakapan yang sedang aktif (chat window).

---

## Layout Keseluruhan

Halaman menggunakan **layout 2 kolom horizontal** (`display: flex`) yang membagi area konten menjadi dua panel berdampingan:

```
┌─────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (kiri)                │  CHAT WINDOW (kanan)               │
│  .messages-sidebar             │  .chat-window                      │
│                                │                                    │
│  ┌────────────────────────┐    │  ┌──────────────────────────────┐  │
│  │ Conversations   12 Unread│   │  │  [Empty State]               │  │
│  ├────────────────────────┤    │  │                              │  │
│  │ 🔍 Search creators...  │    │  │  [ikon message-circle]       │  │
│  ├────────────────────────┤    │  │  "Select a conversation"     │  │
│  │ [Chat Row 1]           │    │  │  "Pick a creator from the    │  │
│  │ [Chat Row 2]           │    │  │   left side panel..."        │  │
│  │ [Chat Row 3]           │    │  └──────────────────────────────┘  │
│  │ [Chat Row 4]           │    │                                    │
│  └────────────────────────┘    │  [Setelah chat dipilih:]           │
│                                │  ┌──────────────────────────────┐  │
│                                │  │  CHAT HEADER                 │  │
│                                │  │  [Avatar] ● Nama  [Subtext]  │  │
│                                │  │                 [View Profile]│  │
│                                │  ├──────────────────────────────┤  │
│                                │  │  CHAT MESSAGES BODY          │  │
│                                │  │  [bubble incoming]           │  │
│                                │  │          [bubble outgoing]   │  │
│                                │  │  [bubble incoming]           │  │
│                                │  ├──────────────────────────────┤  │
│                                │  │  [📎] [input pesan...]  [➤]  │  │
│                                │  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Panel Kiri: Sidebar Daftar Percakapan

**Komponen:** `<div class="messages-sidebar">`

Sidebar ini menampilkan seluruh daftar percakapan yang dimiliki brand. Tersusun secara vertikal dari atas ke bawah: header → search → daftar chat.

### Header Sidebar

**Komponen:** `<div class="messages-sidebar-header">`

| Elemen | ID / Class | Konten |
|--------|-----------|--------|
| Judul | `<h3>` | **Conversations** |
| Badge unread | `id="messagesChatCount"`, `class="badge badge-orange"` | **12 Unread** (jumlah total pesan belum dibaca saat pertama kali dimuat) |

Badge `badge-orange` berwarna oranye dan berfungsi sebagai indikator visual cepat berapa banyak percakapan yang memiliki pesan baru yang belum dibaca. Nilai ini diperbarui secara dinamis setiap kali pengguna membuka sebuah chat thread (dikurangi sejumlah unread di thread tersebut).

### Search Bar

**Komponen:** `<div class="chat-search">`

| Elemen | ID | Fungsi |
|--------|-----|--------|
| Ikon cari | `data-lucide="search"` | Ikon dekoratif di sebelah kiri input |
| Input teks | `id="chatSearchInput"` | Field pencarian dengan placeholder: *"Search creators..."* |

Search bar memungkinkan pengguna memfilter daftar percakapan secara **real-time (client-side)** berdasarkan nama kreator. Tidak ada tombol submit — filtering terjadi saat pengguna mengetik (event `input` atau `keyup`).

**Logika filter:**
```
Pengguna mengetik di #chatSearchInput
  → Loop setiap chat row di #chatList
  → Bandingkan teks input dengan nama kreator (case-insensitive)
  → Tampilkan row yang cocok, sembunyikan row yang tidak cocok
```

### Daftar Chat (Chat List)

**Komponen:** `<div class="chat-list" id="chatList">`

Container yang memuat seluruh baris percakapan (chat rows). Setiap chat row merepresentasikan satu thread percakapan dengan satu kreator.

#### Struktur Satu Chat Row

Setiap baris percakapan berisi elemen-elemen berikut yang disusun horizontal:

```
┌─────────────────────────────────────────────────────┐
│  [Avatar]●  Nama Kreator              Waktu          │
│             Preview pesan terakhir    [Unread Badge] │
└─────────────────────────────────────────────────────┘
```

| Elemen | Keterangan |
|--------|-----------|
| **Avatar** | Foto profil kreator berbentuk lingkaran |
| **Status dot** (`●`) | Titik hijau kecil di pojok kanan bawah avatar, menandakan kreator sedang online |
| **Nama kreator** | Nama lengkap kreator, ditampilkan dengan font lebih tebal |
| **Waktu pesan terakhir** | Timestamp pesan terakhir, ditampilkan di sisi kanan (contoh: "9:35 AM", "Yesterday") |
| **Preview pesan** | Cuplikan singkat teks dari pesan terakhir dalam thread |
| **Unread badge** | Badge bulat kecil berwarna oranye/merah di sisi kanan bawah yang menampilkan jumlah pesan belum dibaca. Tersembunyi jika unread = 0. |

#### Data 4 Percakapan Awal

Berikut adalah 4 chat thread yang tersedia saat halaman pertama kali dimuat:

---

**Thread 1 — Nadia Aurel**

| Properti | Nilai |
|----------|-------|
| Nama | Nadia Aurel |
| Status | Online |
| Unread count | **3** |
| `fastResponse` | `true` → subtext: *"Online • Responds within minutes"* |

Riwayat pesan (urutan kronologis):

| Waktu | Pengirim | Isi Pesan |
|-------|----------|-----------|
| Yesterday 3:00 PM | Brand (outgoing) | *"Hi Nadia! We'd love to invite you to our Summer Getaway campaign."* |
| Today 9:30 AM | Kreator (incoming) | *"I looked over the campaign details and budget. It sounds like a perfect fit!"* |
| Today 9:31 AM | Kreator (incoming) | *"Do you have the brand guidelines ready? I can start drafting the Instagram reel concepts."* |
| Today 9:35 AM | Kreator (incoming) | *"Let me know when we can hop on a quick briefing call."* |

---

**Thread 2 — Reza Alvaro**

| Properti | Nilai |
|----------|-------|
| Nama | Reza Alvaro |
| Status | Online |
| Unread count | **2** |
| `fastResponse` | `true` → subtext: *"Online • Responds within minutes"* |

Riwayat pesan (urutan kronologis):

| Waktu | Pengirim | Isi Pesan |
|-------|----------|-----------|
| Yesterday 10:00 AM | Brand (outgoing) | *"Hey Reza! Let's talk about the Bali travel series."* |
| Today 8:15 AM | Kreator (incoming) | *"Hi Arif, sounds exciting! Bali is always beautiful."* |
| Today 8:16 AM | Kreator (incoming) | *"Can we adjust the timeline slightly? Starting on the 8th would be ideal."* |

---

**Thread 3 — Clara Devina**

| Properti | Nilai |
|----------|-------|
| Nama | Clara Devina |
| Status | Online |
| Unread count | **4** |
| `fastResponse` | `false` → subtext: *"Online"* |

Riwayat pesan (urutan kronologis):

| Waktu | Pengirim | Isi Pesan |
|-------|----------|-----------|
| Today 10:10 AM | Kreator (incoming) | *"I've uploaded the draft video to the drive."* |
| Today 10:15 AM | Kreator (incoming) | *"I've listed the pricing for an extra TikTok post if you're interested."* |

---

**Thread 4 — Fahmi Ramadhan**

| Properti | Nilai |
|----------|-------|
| Nama | Fahmi Ramadhan |
| Status | Online |
| Unread count | **3** |
| `fastResponse` | `false` → subtext: *"Online"* |

Riwayat pesan (urutan kronologis):

| Waktu | Pengirim | Isi Pesan |
|-------|----------|-----------|
| Today 11:00 AM | Kreator (incoming) | *"Do you want the tech unboxing to focus more on gaming features or office productivity?"* |
| Today 11:02 AM | Kreator (incoming) | *"I find that gaming content gets slightly higher engagement on TikTok."* |

---

## Panel Kanan: Chat Window

**Komponen:** `<div class="chat-window" id="chatWindow">`

Panel ini menampilkan dua kondisi yang bergantian: **Empty State** (sebelum ada chat yang dipilih) dan **Active Chat Pane** (setelah pengguna memilih satu percakapan).

---

### Kondisi A: Empty State

**Komponen:** `<div class="chat-empty-state" id="chatEmptyState">`

Ditampilkan saat halaman pertama kali dimuat, sebelum pengguna mengklik chat row mana pun di sidebar.

| Elemen | Konten |
|--------|--------|
| Ikon | `data-lucide="message-circle"` — ikon lingkaran chat berukuran besar, di tengah |
| Judul (`<h3>`) | **Select a conversation** |
| Deskripsi (`<p>`) | *"Pick a creator from the left side panel to start messaging in real-time."* |

Empty state ini memberikan petunjuk visual kepada pengguna baru bahwa mereka harus memilih percakapan terlebih dahulu dari sidebar kiri.

**Kondisi tampil/sembunyi:**
- `#chatEmptyState` → **ditampilkan** (`display: block` atau setara) saat tidak ada chat aktif
- `#chatActivePane` → **disembunyikan** (`display: none`) saat tidak ada chat aktif

---

### Kondisi B: Active Chat Pane

**Komponen:** `<div class="chat-active-pane" id="chatActivePane" style="display:none;">`

Aktif setelah pengguna mengklik salah satu chat row di sidebar. Terdiri dari tiga sub-section yang disusun vertikal: chat header, area pesan, dan panel input.

#### Sub-section 1: Chat Header

**Komponen:** `<div class="chat-header">`

Header yang menampilkan identitas kreator yang sedang diajak bicara.

```
┌─────────────────────────────────────────────────────────────┐
│  [Avatar] ●  Nama Kreator                   [View Profile]  │
│              Online • Responds within minutes               │
└─────────────────────────────────────────────────────────────┘
```

| Elemen | ID | Deskripsi |
|--------|-----|-----------|
| Avatar | `id="chatHeaderAvatar"` | Foto profil kreator yang sedang aktif, berbentuk lingkaran |
| Status dot | `class="status-dot online"` | Titik hijau di samping avatar, menunjukkan kreator online |
| Nama kreator | `id="chatHeaderName"` | Nama lengkap kreator, diperbarui saat chat row diklik |
| Subtext status | `id="chatHeaderSubtext"` | Teks status detail di bawah nama (lihat logika di bawah) |
| Tombol profil | `id="btnChatViewProfile"` | Tombol **"View Profile"** — membuka Profile Modal kreator yang bersangkutan |

**Logika subtext (`chatHeaderSubtext`):**

| Kondisi `fastResponse` | Teks yang Ditampilkan |
|------------------------|----------------------|
| `true` | `"Online • Responds within minutes"` |
| `false` | `"Online"` |

#### Sub-section 2: Chat Messages Body

**Komponen:** `<div class="chat-messages-body" id="chatMessagesBody">`

Area utama yang menampilkan seluruh riwayat percakapan dalam bentuk gelembung pesan (chat bubbles). Area ini dapat di-scroll secara vertikal untuk melihat riwayat pesan yang panjang.

##### Tipe Chat Bubble

Terdapat dua jenis gelembung pesan dengan tampilan visual yang berbeda:

**1. Bubble Incoming (Pesan dari Kreator)**

```
[Avatar kecil]  ┌──────────────────────────────────┐
                │  Teks pesan dari kreator...        │
                └──────────────────────────────────┘
                  9:30 AM
```

- Posisi: rata kiri (align-left)
- Warna latar: abu-abu muda / warna netral
- Dilengkapi avatar kecil kreator di sebelah kiri bubble
- Timestamp ditampilkan di bawah bubble

**2. Bubble Outgoing (Pesan dari Brand)**

```
                ┌──────────────────────────────────┐
                │  Teks pesan dari brand...          │
                └──────────────────────────────────┘  [Avatar brand]
                                          3:00 PM
```

- Posisi: rata kanan (align-right)
- Warna latar: biru atau warna aksen brand
- Teks berwarna putih
- Avatar brand (jika ada) di sebelah kanan bubble
- Timestamp ditampilkan di bawah bubble

##### Tampilan Timestamp

Setiap bubble memiliki timestamp di bawahnya. Format timestamp mengikuti data pesan:
- Pesan hari ini: format jam — contoh: `9:30 AM`, `11:02 AM`
- Pesan kemarin: `Yesterday 3:00 PM`, `Yesterday 10:00 AM`

#### Sub-section 3: Chat Input Panel

**Komponen:** `<div class="chat-input-panel">`

Panel input di bagian paling bawah chat window untuk mengirim pesan baru.

```
┌──────────────────────────────────────────────────────┐
│  [📎]  [ Type a message to discuss your campaign... ] [➤] │
└──────────────────────────────────────────────────────┘
```

| Elemen | ID | Fungsi |
|--------|-----|--------|
| Tombol attach | `id="chatAttachBtn"`, ikon `data-lucide="paperclip"` | Tombol lampiran file — **belum diimplementasi** pada versi prototype ini. Klik tidak memiliki efek fungsional. |
| Input teks | `id="chatInputMessage"` | Field teks untuk mengetik pesan. Placeholder: *"Type a message to discuss your campaign brief..."* |
| Tombol kirim | `id="btnSendChatMessage"`, ikon `data-lucide="send"` | Tombol kirim pesan. Juga dapat dipicu dengan menekan tombol **Enter** pada keyboard. |

---

## Alur Interaksi Lengkap

### 1. Membuka Percakapan (Klik Chat Row)

```
Pengguna klik chat row di sidebar (contoh: Nadia Aurel)
  │
  ├─→ Sembunyikan #chatEmptyState
  ├─→ Tampilkan #chatActivePane
  ├─→ Isi #chatHeaderAvatar dengan foto Nadia Aurel
  ├─→ Isi #chatHeaderName dengan "Nadia Aurel"
  ├─→ Isi #chatHeaderSubtext sesuai fastResponse Nadia
  │       (fastResponse=true → "Online • Responds within minutes")
  ├─→ Muat riwayat pesan Nadia ke #chatMessagesBody
  │       (render semua bubble incoming/outgoing secara kronologis)
  ├─→ Reset unread count thread Nadia → 0
  │       (sembunyikan unread badge di chat row Nadia)
  └─→ Kurangi nilai total di #messagesChatCount sebesar 3
          (12 Unread → 9 Unread)
```

### 2. Mengirim Pesan Baru

```
Pengguna mengetik teks di #chatInputMessage
  │
  ├─→ Tekan tombol #btnSendChatMessage  ATAU  tekan Enter
  │
  ├─→ Ambil teks dari #chatInputMessage
  ├─→ Render bubble OUTGOING baru di #chatMessagesBody
  │       (posisi kanan, warna biru, timestamp = waktu sekarang)
  ├─→ Kosongkan #chatInputMessage
  ├─→ Scroll #chatMessagesBody ke paling bawah (scroll to bottom)
  │
  └─→ Tunggu 1.500 ms (1,5 detik)
        │
        └─→ Pilih satu pesan acak dari auto-reply pool (5 pilihan)
              → Render bubble INCOMING baru di #chatMessagesBody
              → Scroll ke paling bawah lagi
```

**Catatan:** Pesan tidak boleh kosong — jika input field kosong saat tombol kirim diklik atau Enter ditekan, tidak ada aksi yang dilakukan.

### 3. Auto-Reply dari Kreator

Setelah pengguna mengirim pesan, sistem secara otomatis membuat reply dari kreator dalam **1,5 detik**. Reply dipilih secara acak dari pool 5 pesan berikut:

| # | Teks Auto-Reply |
|---|----------------|
| 1 | *"Thanks for messaging, Arif! Let me review the brief and I'll send you a custom draft proposal."* |
| 2 | *"Awesome. I'm checking my content calendar for June and I definitely have slot availability."* |
| 3 | *"Sounds good. I can structure the Instagram reel exactly how you suggested."* |
| 4 | *"Got it, Arif! I'll make sure the tech unboxing highlights the key features you mentioned."* |
| 5 | *"I've noted that down. Talk to you soon!"* |

Auto-reply selalu muncul sebagai **bubble incoming** (dari kreator, posisi kiri) tanpa menambah unread count karena pengguna sedang aktif berada di thread tersebut.

### 4. Pencarian Percakapan (Search Filter)

```
Pengguna mengetik di #chatSearchInput (contoh: "Clara")
  │
  └─→ Secara real-time (setiap keystroke):
        → Loop semua chat row di #chatList
        → Bandingkan input (lowercase) dengan nama kreator (lowercase)
        → Chat row yang cocok: tampilkan (display: flex / block)
        → Chat row yang tidak cocok: sembunyikan (display: none)
```

Filter bersifat **client-side** dan **real-time** tanpa request ke server. Tidak case-sensitive. Saat input dikosongkan, semua chat row kembali ditampilkan.

### 5. Membuka Profile Modal dari Chat Header

```
Pengguna klik tombol "View Profile" (#btnChatViewProfile)
  │
  └─→ Buka Profile Modal
        → Tampilkan data profil kreator yang sedang aktif di chat
        → (Di dalam modal, tersedia tombol "Chat" untuk kembali)
```

### 6. Alur Masuk ke Chat dari Profile Modal

Fitur ini memungkinkan alur navigasi dari halaman/modal lain langsung ke percakapan spesifik:

```
Pengguna sedang melihat Profile Modal kreator X
  │
  └─→ Klik tombol "Chat" di dalam Profile Modal
        │
        ├─→ Tutup Profile Modal
        ├─→ Navigasi ke view "Messages" (tampilkan #messagesView)
        └─→ Otomatis buka thread percakapan kreator X
              (seolah-olah pengguna mengklik chat row kreator X)
```

---

## Badge Unread di Sidebar Navigasi

Di sidebar navigasi utama aplikasi, menu item "Messages" memiliki badge oranye yang menampilkan total jumlah pesan belum dibaca di seluruh thread. Nilai awal adalah **12** (3 + 2 + 4 + 3 dari keempat thread).

| Kondisi | Badge Navigasi |
|---------|---------------|
| Awal aplikasi dimuat | **12** |
| Setelah buka thread Nadia Aurel (3 unread) | **9** |
| Setelah buka thread Reza Alvaro (2 unread) | **7** |
| Setelah buka thread Clara Devina (4 unread) | **3** |
| Setelah buka thread Fahmi Ramadhan (3 unread) | **0** (badge tersembunyi) |

---

## Ringkasan Semua Elemen Interaktif

| Elemen | ID | Aksi | Hasil |
|--------|-----|------|-------|
| Chat row di sidebar | (dinamis per thread) | Klik | Buka percakapan, reset unread, perbarui header |
| Search input | `#chatSearchInput` | Ketik | Filter chat list real-time |
| Tombol kirim | `#btnSendChatMessage` | Klik | Kirim pesan, tampilkan bubble outgoing, trigger auto-reply |
| Input pesan | `#chatInputMessage` | Tekan Enter | Sama dengan klik tombol kirim |
| Tombol attach | `#chatAttachBtn` | Klik | Tidak ada aksi (belum diimplementasi) |
| Tombol View Profile | `#btnChatViewProfile` | Klik | Buka Profile Modal kreator aktif |
| Tombol Chat (di Profile Modal) | — | Klik | Switch ke Messages + buka thread kreator |

---

## Navigasi Masuk dan Keluar

### Masuk ke Halaman Messages

| Sumber | Cara |
|--------|------|
| Sidebar navigasi utama | Klik menu item **Messages** (dengan badge unread) |
| Profile Modal kreator | Klik tombol **Chat** di dalam modal profil |

### Keluar dari Halaman Messages

| Tujuan | Cara |
|--------|------|
| Profile Modal kreator | Klik tombol **View Profile** di chat header |
| Halaman lain (Dashboard, Marketplace, dll.) | Klik menu item lain di sidebar navigasi utama |

---

## Catatan Pengembangan

- Seluruh data percakapan (4 thread awal, riwayat pesan, unread count) bersifat **mock/statis** yang diinisialisasi saat halaman dimuat — belum terhubung ke backend atau WebSocket.
- **Auto-reply** sepenuhnya dijalankan di sisi client menggunakan `setTimeout` selama 1.500 ms, bukan respons dari server nyata.
- **Fungsi attachment** (`#chatAttachBtn`) belum diimplementasi pada versi prototype ini. Tombol ada di UI namun tidak memiliki handler event yang aktif.
- **Status online** semua kreator bersifat statis (selalu online) pada versi prototype — belum ada mekanisme presence/status real-time.
- Pesan baru yang dikirim pengguna dan auto-reply hanya tersimpan di memori sesi browser (DOM) — tidak dipersistensikan ke database, sehingga akan hilang saat halaman di-refresh.
- Filter pencarian bersifat **case-insensitive** dan hanya membandingkan nama kreator, bukan isi pesan.
- Scroll otomatis ke bawah (`scrollTop = scrollHeight`) terjadi setelah setiap pesan baru dikirim maupun saat auto-reply masuk.
