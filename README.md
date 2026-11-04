# KardioBelajar — Buku Fisiologi Interaktif

Website belajar fisiologi jantung & vaskular dengan pola:
**Penjelasan singkat → Visual/animasi → Sebab-akibat → Interaksi → Cek pemahaman**.

Online: https://zeedny15.github.io/jidni/

## Cara membuka
- **Online:** buka link di atas (GitHub Pages dari branch `gh-pages`).
- **Offline:** buka `index.html` langsung di browser (klik dua kali). Tidak perlu instalasi.
- **Server lokal (opsional):** `python3 -m http.server 8000` lalu buka http://localhost:8000

Progres belajar tersimpan di browser (localStorage) perangkat masing-masing.

## Materi (30 topik, mengikuti urutan kuliah blok CVS)
**D. Dasar** — D1 Embriologi · D2 Anatomi · D3 Histologi

**A. Fisiologi Jantung** — A1 Sirkulasi sistemik & pulmonal · A2 Koroner · A3 ATP · A4 Sel otot jantung · A5 Sistem hantaran ·
A6 Pacemaker potential · A7 Potensial aksi · A8 EKG · A9 Bunyi jantung · A10 Siklus jantung & Wiggers · A11 Cardiac output ·
A12 Pengaturan denyut jantung · A13 Stroke volume & Frank-Starling

**B. Fisiologi Vaskular** — B1 Jenis pembuluh · B2 Karakteristik pembuluh · B3 Tekanan darah · B4 Resistensi perifer ·
B5 Venous return · B6 Regulasi lokal, neural, hormonal

**C. Klinis & Farmakologi** — C1 Kelainan kongenital (VSD, ASD, PDA, ToF) · C2 Hipertensi · C3 PJK (SKA & SKK) ·
C4 Farmakoterapi hipertensi & antiangina · C5 Endokarditis, miokarditis, perikarditis & PJR · C6 Kelainan katup ·
C7 Kardiomiopati & kor pulmonale · C8 Statin, antiplatelet & trombolitik

Setiap topik: Gambaran Besar → Langkah demi Langkah (visual animasi) → Sebab-Akibat → Interaksi → (Hafalan: jembatan keledai +
flashcard) → Hubungan/Kasus Klinis → Cek Pemahaman.

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
