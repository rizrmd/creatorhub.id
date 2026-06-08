# Komponen: Creator Profile Modal — CreatorHub.id

**Jenis:** Overlay Modal (Popup)
**ID Elemen:** `profileModal`
**Tema:** Light
**Bahasa UI:** English (label) / Indonesia (nilai data)

---

## Deskripsi Komponen

Creator Profile Modal adalah overlay popup yang muncul di atas halaman Marketplace ketika pengguna mengklik kartu kreator. Modal ini menampilkan profil lengkap seorang kreator — informasi yang lebih detail dibandingkan kartu ringkasan di grid.

Pengguna dapat melihat:
- Foto profil, nama, lokasi, dan kategori konten kreator
- Statistik performa (followers, engagement rate, rating)
- Bio singkat kreator
- Platform media sosial aktif
- Harga paket layanan awal (starting price)
- Tombol aksi: mengundang kreator ke kampanye, membuka chat, atau menutup modal

---

## Cara Memicu Modal

Modal dapat dibuka melalui dua cara:

### 1. Klik Kartu Kreator (Area Umum)
Mengklik di mana saja pada kartu kreator di grid Marketplace akan membuka modal profil kreator tersebut, **kecuali** pada elemen berikut yang memiliki aksi tersendiri:
- Tombol "Invite to Campaign" (menambahkan kreator langsung tanpa membuka modal)
- Ikon favorit / bookmark (menyimpan ke daftar shortlist)

### 2. Tombol "View Profile" (Kreator Terpilih)
Jika kreator sudah berada dalam daftar `selectedCreators` (sudah diundang ke kampanye), kartu kreator akan menampilkan tombol **"View Profile"**. Mengklik tombol ini membuka modal profil kreator yang bersangkutan.

---

## Struktur HTML

```html
<!-- Modal Overlay -->
<div class="modal-overlay" id="profileModal" style="display:none;">
  <div class="modal-content">
    <button class="modal-close" id="closeModal">&times;</button>
    <div class="modal-body" id="modalBody">
      <!-- Konten diinjeksi oleh JavaScript saat modal dibuka -->
    </div>
  </div>
</div>
```

Saat pertama kali dimuat, modal memiliki `style="display:none;"` sehingga tidak terlihat. Konten di dalam `#modalBody` dikosongkan dan diisi ulang setiap kali modal dibuka untuk kreator yang berbeda.

---

## Layout Visual

```
┌─────────────────────────────────────────────────────┐
│  [✕]                                                │  ← tombol tutup
├─────────────────────────────────────────────────────┤
│  [Foto Profil]   Nama Kreator  ✓                    │
│                  Kota, Negara • Kategori             │
├─────────────────────────────────────────────────────┤
│   Followers        Engagement Rate        Rating    │
│   532K             4.21%                  ⭐ 4.8    │
├─────────────────────────────────────────────────────┤
│  About Creator                                      │
│  [Teks bio kreator ...]                             │
├─────────────────────────────────────────────────────┤
│  Active Platforms                                   │
│  [Instagram]  [TikTok]  [YouTube]                   │
├─────────────────────────────────────────────────────┤
│  Starting Price       [💬 Chat]  [Close]            │
│  Rp 8.000.000         [Invite to Campaign]          │
└─────────────────────────────────────────────────────┘
```

---

## Struktur Konten Modal (Diinjeksi JS)

Seluruh konten modal dihasilkan oleh fungsi `openProfileModal(creator)` di JavaScript dan diinjeksikan ke dalam `#modalBody`. Berikut adalah breakdown setiap bagian:

---

### 1. Header Profil

**CSS Class:** `.modal-profile-header`

Berisi identitas utama kreator dalam satu baris horizontal: foto profil di kiri, informasi nama dan lokasi di kanan.

| Elemen | Keterangan |
|--------|------------|
| `<img class="modal-profile-avatar">` | Foto profil kreator. Sumber dari `creator.image`. Ditampilkan dalam bentuk bulat (avatar). |
| `<h2>` Nama | Nama lengkap kreator dari `creator.name`. Jika `creator.verified === true`, ditampilkan ikon centang verifikasi di sebelah nama. |
| `<span>` Lokasi & Kategori | Format: `{creator.city}, {creator.country} • {creator.category}` |

**Contoh render:**
```
Nadia Aurel  ✓
Jakarta, Indonesia • Lifestyle
```

```
Reza Alvaro  ✓
Bandung, Indonesia • Travel
```

---

### 2. Stats Grid

**CSS Class:** `.modal-stats-grid`

Grid dengan 3 kolom yang menampilkan metrik performa utama kreator secara berdampingan.

| Kolom | Label | Sumber Data | Contoh |
|-------|-------|-------------|--------|
| 1 | **Followers** | `creator.followersText` | `532K` |
| 2 | **Engagement** | `creator.engagementRate` + `%` | `4.21%` |
| 3 | **Rating** | ⭐ + `creator.rating` | `⭐ 4.8` |

**Contoh render (Nadia Aurel):**
```
┌──────────────┬────────────────┬──────────────┐
│  Followers   │   Engagement   │    Rating    │
│    532K      │     4.21%      │   ⭐ 4.8    │
└──────────────┴────────────────┴──────────────┘
```

**Contoh render (Reza Alvaro):**
```
┌──────────────┬────────────────┬──────────────┐
│  Followers   │   Engagement   │    Rating    │
│    742K      │     5.67%      │   ⭐ 4.9    │
└──────────────┴────────────────┴──────────────┘
```

---

### 3. About Creator

**Heading:** `<h3>About Creator</h3>`

Menampilkan teks bio kreator yang diambil dari `creator.bio`. Berupa paragraf `<p>` yang merepresentasikan deskripsi singkat tentang kreator, spesialisasi konten, dan pengalaman kolaborasi.

**Contoh bio — Nadia Aurel:**
> "Lifestyle blogger sharing daily routines, fashion tips, and healthy eating guides. Collaborated with 50+ fashion and cosmetics brands nationwide."

**Contoh bio — Reza Alvaro:**
> "Adventure traveler and outdoor photographer exploring hidden gems around Southeast Asia."

---

### 4. Active Platforms

**Heading:** `<h3>Active Platforms</h3>`

**CSS Class:** `.modal-platforms-row`

Menampilkan daftar platform media sosial yang aktif digunakan kreator dalam format badge horizontal. Setiap badge memiliki ikon platform dan nama platform.

Platform yang didukung:

| Platform | Ikon | Warna Badge |
|----------|------|-------------|
| Instagram | Ikon Instagram | Merah muda / gradient |
| TikTok | Ikon TikTok | Hitam |
| YouTube | Ikon YouTube | Merah |

**Contoh render (Nadia Aurel — aktif di IG, TikTok, YouTube):**
```
[📷 Instagram]  [♪ TikTok]  [▶ YouTube]
```

Jumlah badge menyesuaikan platform yang terdaftar pada data `creator.platforms`.

---

### 5. Footer Modal

**CSS Class:** `.modal-footer`

Bagian bawah modal yang menampilkan harga paket dan tombol-tombol aksi.

#### 5a. Price Container

**CSS Class:** `.price-container`

| Elemen | Konten |
|--------|--------|
| Label | `Starting Price` |
| Nilai | `creator.priceText` (contoh: `Rp 8.000.000`, `Rp 12.000.000`) |

#### 5b. Tombol Aksi

Footer memiliki tiga tombol yang tersusun secara horizontal:

| ID Tombol | Label | Ikon | Fungsi |
|-----------|-------|------|--------|
| `#modalMessageBtn` | **Chat** | `message-square` (Lucide) | Membuka chat dengan kreator |
| `#modalCloseBtn` | **Close** | — | Menutup modal |
| `#modalActionBtn` | **Invite to Campaign** atau **Remove from Brief** | — | Aksi utama (lihat bagian State) |

---

## State Tombol Aksi (`#modalActionBtn`)

Tombol `#modalActionBtn` memiliki dua tampilan yang berbeda bergantung pada status kreator dalam daftar `selectedCreators`:

### State 1: Kreator Belum Dipilih

- **Label:** `Invite to Campaign`
- **Tampilan:** Tombol solid (warna primer, biru)
- **Aksi saat diklik:**
  1. Kreator ditambahkan ke array `selectedCreators`
  2. Modal ditutup
  3. Toast notifikasi sukses ditampilkan (contoh: *"Nadia Aurel ditambahkan ke kampanye"*)

### State 2: Kreator Sudah Dipilih

- **Label:** `Remove from Brief`
- **Tampilan:** Tombol outline atau warna berbeda (merah / abu-abu)
- **Aksi saat diklik:**
  1. Kreator dihapus dari array `selectedCreators`
  2. Modal ditutup

**Logika penentuan state:**
```javascript
// Pseudocode
if (selectedCreators.includes(creator.id)) {
  // Tampilkan "Remove from Brief"
} else {
  // Tampilkan "Invite to Campaign"
}
```

---

## Cara Menutup Modal

Modal dapat ditutup melalui empat cara:

| Cara | Elemen | Keterangan |
|------|--------|------------|
| 1 | Tombol `✕` (`#closeModal`) | Tombol silang di sudut kanan atas modal |
| 2 | Klik area overlay | Klik di luar `div.modal-content`, yaitu area gelap di sekitar modal |
| 3 | Tombol "Close" (`#modalCloseBtn`) | Tombol Close di footer modal |
| 4 | Tombol "Chat" (`#modalMessageBtn`) | Menutup modal, lalu berpindah ke halaman Messages |

Semua cara menutup modal (kecuali tombol Chat) hanya menutup modal tanpa navigasi tambahan. Setelah modal tertutup, tampilan kembali ke halaman Marketplace dengan posisi scroll yang sama.

---

## Alur Interaksi Lengkap

### Membuka Modal
```
Pengguna klik kartu kreator
        ↓
openProfileModal(creator) dipanggil
        ↓
modalBody.innerHTML diisi dengan konten kreator
        ↓
Ikon Lucide di-render ulang
        ↓
State tombol aksi ditentukan (selected / not selected)
        ↓
profileModal.style.display = 'flex' (modal tampil)
```

### Menutup Modal (Via ✕ / Overlay / Close)
```
Pengguna klik ✕ / overlay / tombol Close
        ↓
profileModal.style.display = 'none'
        ↓
Kembali ke Marketplace (posisi scroll tetap)
```

### Aksi "Invite to Campaign"
```
Pengguna klik "Invite to Campaign"
        ↓
creator ditambahkan ke selectedCreators[]
        ↓
Modal ditutup
        ↓
showToast("Kreator berhasil ditambahkan ke kampanye")
        ↓
Kartu kreator di grid diperbarui (tombol berubah)
```

### Aksi "Remove from Brief"
```
Pengguna klik "Remove from Brief"
        ↓
creator dihapus dari selectedCreators[]
        ↓
Modal ditutup
        ↓
Kartu kreator di grid diperbarui (tombol kembali ke "Invite")
```

### Aksi "Chat"
```
Pengguna klik "Chat"
        ↓
Modal ditutup
        ↓
Navigasi ke halaman Messages
        ↓
Thread pesan dengan kreator ini dibuka (atau dibuat baru jika belum ada)
```

---

## Contoh Data Kreator

### Nadia Aurel

| Field | Nilai |
|-------|-------|
| `creator.name` | `Nadia Aurel` |
| `creator.verified` | `true` |
| `creator.city` | `Jakarta` |
| `creator.country` | `Indonesia` |
| `creator.category` | `Lifestyle` |
| `creator.followersText` | `532K` |
| `creator.engagementRate` | `4.21` |
| `creator.rating` | `4.8` |
| `creator.platforms` | `["Instagram", "TikTok", "YouTube"]` |
| `creator.priceText` | `Rp 8.000.000` |
| `creator.bio` | `Lifestyle blogger sharing daily routines, fashion tips, and healthy eating guides. Collaborated with 50+ fashion and cosmetics brands nationwide.` |

### Reza Alvaro

| Field | Nilai |
|-------|-------|
| `creator.name` | `Reza Alvaro` |
| `creator.verified` | `true` |
| `creator.city` | `Bandung` |
| `creator.country` | `Indonesia` |
| `creator.category` | `Travel` |
| `creator.followersText` | `742K` |
| `creator.engagementRate` | `5.67` |
| `creator.rating` | `4.9` |
| `creator.platforms` | `["Instagram", "TikTok", "YouTube"]` |
| `creator.priceText` | `Rp 12.000.000` |
| `creator.bio` | `Adventure traveler and outdoor photographer exploring hidden gems around Southeast Asia.` |

---

## CSS Classes Referensi

| Class | Elemen | Fungsi |
|-------|--------|--------|
| `.modal-overlay` | Div pembungkus luar | Layer gelap semi-transparan yang menutupi seluruh layar |
| `.modal-content` | Div konten utama | Kotak putih modal yang berisi semua elemen |
| `.modal-close` | Tombol ✕ | Tombol tutup di sudut kanan atas |
| `.modal-body` | Div konten dinamis | Area tempat konten diinjeksi oleh JavaScript |
| `.modal-profile-header` | Div header | Baris foto + nama + lokasi |
| `.modal-profile-avatar` | `<img>` foto | Foto profil bulat di header |
| `.modal-profile-info` | Div info teks | Wrapper nama dan lokasi di sebelah foto |
| `.modal-stats-grid` | Div grid statistik | Grid 3 kolom: followers, engagement, rating |
| `.modal-platforms-row` | Div daftar platform | Baris badge-badge platform media sosial |
| `.modal-footer` | Div footer | Area harga + tombol aksi |
| `.price-container` | Div harga | Label "Starting Price" + nilai harga |

---

## ID Elemen Referensi

| ID | Elemen | Fungsi |
|----|--------|--------|
| `profileModal` | Div overlay utama | Container modal; diatur `display` untuk buka/tutup |
| `closeModal` | Tombol ✕ | Event listener tutup modal |
| `modalBody` | Div konten | Target `innerHTML` injeksi konten kreator |
| `modalMessageBtn` | Tombol Chat | Aksi buka chat dengan kreator |
| `modalCloseBtn` | Tombol Close | Aksi tutup modal |
| `modalActionBtn` | Tombol Invite/Remove | Aksi utama bergantung state kreator |

---

## Catatan Teknis

- **Render ikon Lucide:** Setelah konten diinjeksi ke `#modalBody`, fungsi `lucide.createIcons()` atau `lucide.replace()` harus dipanggil ulang agar ikon `data-lucide="message-square"` pada tombol Chat ter-render dengan benar.
- **State persisten:** State `selectedCreators` bersifat global di sesi saat ini. Perubahan dari dalam modal (invite/remove) langsung tercermin pada tampilan kartu di grid Marketplace setelah modal ditutup.
- **Satu modal, banyak kreator:** Modal menggunakan satu elemen HTML yang sama (`#profileModal`) untuk semua kreator. Konten diganti setiap kali modal dibuka dengan kreator berbeda, sehingga tidak ada duplikasi elemen DOM.
- **Aksesibilitas:** Klik pada area overlay (`.modal-overlay`) di luar `.modal-content` menutup modal, memberikan cara tutup yang intuitif selain tombol ✕.
