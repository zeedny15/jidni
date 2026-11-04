# KardioBelajar — Buku Fisiologi Interaktif

Website belajar fisiologi jantung & vaskular dengan pola:
**Penjelasan singkat → Visual/animasi → Sebab-akibat → Interaksi → Cek pemahaman**.

Online: https://zeedny15.github.io/jidni/

## Cara membuka
- **Online:** buka link di atas (GitHub Pages dari branch `gh-pages`).
- **Offline:** buka `index.html` langsung di browser (klik dua kali). Tidak perlu instalasi.
- **Server lokal (opsional):** `python3 -m http.server 8000` lalu buka http://localhost:8000

Progres belajar tersimpan di browser (localStorage) perangkat masing-masing.

## Materi (19 topik, semua tersedia)
**A. Fisiologi Jantung** — A1 Sirkulasi sistemik & pulmonal · A2 Sirkulasi koroner · A3 Produksi ATP ·
A4 Sel otot jantung · A5 Sistem hantaran · A6 Pacemaker potential · A7 Potensial aksi sel kontraktil ·
A8 EKG · A9 Bunyi jantung & auskultasi · A10 Siklus jantung & Diagram Wiggers · A11 Cardiac output & reserve ·
A12 Pengaturan denyut jantung · A13 Stroke volume & Frank-Starling

**B. Fisiologi Vaskular** — B1 Jenis pembuluh · B2 Karakteristik pembuluh (+ gaya Starling) · B3 Tekanan darah (+ simulasi Korotkoff) ·
B4 Resistensi perifer (Poiseuille) · B5 Venous return · B6 Regulasi lokal, neural, hormonal

Setiap topik berisi 6 bagian: Gambaran Besar, Langkah demi Langkah (visual animasi + tombol Sebelumnya/Selanjutnya/Putar),
Sebab-Akibat, Interaksi (slider, simulator, game), Hubungan Klinis, dan Cek Pemahaman (5 soal + pembahasan).

## Struktur
```
index.html                   Halaman utama + daftar topik + progres
modul/*.html                 Satu file per topik (A1 berupa HTML lengkap; lainnya kerangka ringan)
assets/css/style.css         Gaya global (terang/gelap, responsif)
assets/js/app.js             Daftar modul, progres, sidebar, mesin langkah & kuis
assets/js/engine.js          Mesin modul: registerModule(), explorer, rantai sebab-akibat, game, ilustrasi jantung
assets/js/modules/*.js       Isi & visual tiap topik
```

## Menambah / mengubah modul
Isi topik ada di `assets/js/modules/<id>.js` dan memanggil `registerModule({ id, sections: [...] })`.
Jenis kartu yang tersedia: HTML bebas, `explorer` (langkah + visual), `chain`, `clinic`, `order`, `match`, dan bagian `quiz`.
