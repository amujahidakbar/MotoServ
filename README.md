# MotoServ - Pengingat Servis Motor Pintar

MotoServ adalah aplikasi web responsif berbasis Single Page Application (SPA) yang dirancang untuk melacak dan mengingatkan jadwal servis suku cadang sepeda motor berdasarkan jarak tempuh (odometer). Aplikasi ini menggunakan estetika *premium dark mode* dengan aksen warna HSL neon yang modern, *glassmorphism*, dan transisi antarmuka yang mulus.

## Fitur Utama

1. **Dashboard Pemantauan**:
   - Persentase kesehatan motor keseluruhan yang dihitung secara real-time.
   - Status visual suku cadang dengan kartu warna-warni yang berubah sesuai sisa umur (Hijau = Baik, Kuning = Perlu Perhatian, Merah = Kritis/Wajib Servis).
   - Tombol cepat untuk memperbarui odometer dan mencatat servis suku cadang secara langsung.

2. **Dinamis Berdasarkan Jenis Motor (Garasi)**:
   - Mendukung banyak motor (Multi-Motorcycle).
   - Penyesuaian otomatis komponen tergantung jenis transmisi:
      - **Matic**: Dilengkapi pemantauan **Oli Mesin**, **Oli Transmisi**, dan **Drive Belt**.
      - **Manual / Kopling**: Dilengkapi pemantauan **Oli Mesin** dan **Rantai** (tanpa Oli Transmisi).

3. **Pencatatan Riwayat Servis Lengkap**:
   - Mencatat tanggal servis, odometer saat servis, komponen yang diganti, total biaya, dan catatan tambahan.
   - Fitur filter riwayat servis per komponen.
   - Opsi untuk menghapus riwayat servis dengan penyesuaian otomatis status odometer servis terakhir komponen.

4. **Pengaturan Interval Kustom**:
   - Pengguna dapat mengubah interval jarak tempuh (KM) per komponen sesuai rekomendasi bengkel atau preferensi pribadi.
   - Tombol reset untuk mengembalikan ke rekomendasi interval pabrikan default.

5. **Penyimpanan Lokal (Local Storage)**:
   - Data otomatis disimpan di dalam peramban (browser) pengguna sehingga tidak hilang ketika halaman dimuat ulang.
   - Dilengkapi data demo (mock data) awal untuk langsung mendemonstrasikan fitur aplikasi tanpa pengisian manual dari nol.

## Struktur Proyek

```
MotoServ/
├── index.html     # Struktur HTML5 semantik & template modal dialog
├── styles.css     # Desain CSS Kustom (Dark Mode, Glassmorphism, Responsive UI)
├── app.js         # Logika State, Kalkulasi Odometer, & Manipulasi DOM
└── README.md      # Dokumentasi Petunjuk Penggunaan
```

## Cara Menjalankan Aplikasi

Aplikasi ini dibuat dengan HTML, CSS, dan JavaScript murni (Vanilla JS) tanpa membutuhkan pustaka atau dependensi eksternal tambahan. Anda dapat membukanya langsung di browser:

### Metode 1: Buka Berkas Langsung
Cukup klik dua kali berkas `index.html` untuk membukanya langsung di peramban web pilihan Anda (Chrome, Safari, Firefox, dll.).

### Metode 2: Menggunakan Local Server (Sangat Direkomendasikan)
Jika Anda menggunakan Visual Studio Code, gunakan ekstensi **Live Server**, atau jalankan server lokal sederhana melalui terminal di dalam folder proyek ini:

```bash
# Menggunakan python 3
python -m http.server 8000

# Menggunakan Node.js (npx)
npx serve
```
Kemudian buka browser dan akses `http://localhost:8000`.

## Formula Perhitungan Umur Komponen

Setiap suku cadang memiliki:
* **Interval Maksimal ($I$)** - Misal: Busi default 8.000 KM.
* **Odometer Servis Terakhir ($O_{last}$)** - Kilometer motor saat terakhir kali suku cadang diganti.
* **Odometer Saat Ini ($O_{current}$)** - Kilometer motor saat ini.

Rumus jarak yang telah ditempuh suku cadang tersebut ($D_{run}$):
$$D_{run} = O_{current} - O_{last}$$

Sisa kilometer sebelum servis berikutnya ($D_{remaining}$):
$$D_{remaining} = I - D_{run}$$

Persentase sisa umur suku cadang ($P_{remaining}$):
$$P_{remaining} = \max\left(0, \min\left(100, \frac{I - D_{run}}{I} \times 100\right)\right)$$

* Jika $D_{remaining} \le 0$ $\rightarrow$ Status **Kritis (Merah)**
* Jika $D_{remaining} \le I \times 0.2$ (Sisa kurang dari 20%) $\rightarrow$ Status **Perlu Perhatian (Kuning)**
* Lainnya $\rightarrow$ Status **Baik (Hijau)**
