# KardioBelajar — Buku Fisiologi Interaktif

Website belajar fisiologi jantung & vaskular dengan pola:
**Penjelasan singkat → Visual/animasi → Sebab-akibat → Interaksi → Cek pemahaman**.

## Cara membuka
- **Paling mudah:** buka file `index.html` langsung di browser (klik dua kali). Tidak perlu instalasi.
- **Lewat server lokal (opsional):** `python3 -m http.server 8000` lalu buka http://localhost:8000
- **Online:** aktifkan GitHub Pages (Settings → Pages → Deploy from branch → pilih branch & folder `/root`).

Progres belajar tersimpan di browser (localStorage) perangkat masing-masing.

## Struktur
```
index.html                     Halaman utama + daftar 19 topik + progres
modul/a01-sirkulasi.html       Modul A1: Sirkulasi Sistemik & Pulmonal
assets/css/style.css           Gaya global (terang/gelap, responsif)
assets/js/app.js               Daftar modul, progres, sidebar, mesin langkah & kuis
assets/js/modules/a01-sirkulasi.js  Animasi & interaksi khusus modul A1
```

## Menambah modul baru
1. Salin `modul/a01-sirkulasi.html` menjadi file baru, ganti `data-module` dan isinya.
2. Setiap `<section class="lesson-section" data-title="...">` otomatis menjadi satu langkah di stepper.
3. Tambahkan `file` dan `ready: true` pada entri modul di `MODULES` (`assets/js/app.js`).
4. Kuis: panggil `initQuiz("quiz", "<id>", [ {q, options, answer, explain}, ... ])`.

## Status
- [x] Tahap 1 — Struktur & halaman utama
- [x] Tahap 2–3 — Modul A1 lengkap
- [ ] Modul A2–A13, B1–B6
