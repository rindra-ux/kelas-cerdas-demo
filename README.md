# KelasCerdas Mobile – Prototipe Web

Prototipe Learning Management System (LMS) berbasis **mobile-first** yang juga berfungsi optimal di desktop/web, sesuai dokumen perencanaan *KelasCerdas Mobile*.

## Cara Menjalankan

### Opsi 1: Langsung buka file
1. Buka file `index.html` di browser (Chrome / Firefox / Edge / Safari).
2. Atau drag & drop `index.html` ke browser.

### Opsi 2: Local server (disarankan)
```bash
# Masuk ke folder
cd kelascerdas-prototype

# Jalankan server sederhana (Python)
python -m http.server 8080

# Atau dengan Node.js
npx serve .
```
Lalu buka: http://localhost:8080

## Akun Demo

| Peran  | Email            | Password |
|--------|------------------|----------|
| Guru   | guru@demo.com    | demo123  |
| Siswa  | siswa@demo.com   | demo123  |

## Fitur yang Tersedia di Prototipe

### Guru
- Dashboard dengan statistik kelas
- Kelola Kelas
- Materi pembelajaran (teks & video)
- Buat & preview kuis
- Absensi QR (simulasi)
- Pengumuman
- Analitik sederhana (soal sulit, rata-rata skor, dll)

### Siswa
- Dashboard gamifikasi (poin, level, streak, badge)
- Kerjakan kuis dengan timer
- Battle Mode (join via kode)
- Leaderboard
- Materi inklusif (simulasi TTS & font disleksia)
- Profil & koleksi badge

### Umum
- Responsive (mobile & desktop)
- Dark mode
- Navigasi bottom bar (mobile) + sidebar (desktop)
- Data tersimpan di localStorage (progress siswa)

## Catatan

Ini adalah **prototipe frontend murni**. Tidak ada backend nyata.  
Semua data bersifat simulasi. Untuk pengembangan selanjutnya, hubungkan ke Firebase / Supabase / Node.js + PostgreSQL sesuai rekomendasi dokumen perencanaan.

## Struktur Folder

```
kelascerdas-prototype/
├── index.html          # Halaman utama
├── js/
│   ├── data.js         # Data sample & konfigurasi
│   └── app.js          # Logika aplikasi
├── css/                # (kosong, menggunakan Tailwind CDN)
├── assets/             # (untuk gambar nanti)
└── README.md
```

## Teknologi
- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript
- Font Awesome
- LocalStorage untuk persistensi

---
**KelasCerdas** – LMS Mobile-First untuk Guru & Siswa
