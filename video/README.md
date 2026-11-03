# Fisiologi Vaskular — Video Edukasi (Bahasa Indonesia)

Video animasi ±26 menit (1920×1080, 16:9, 30 fps) yang menjelaskan seluruh isi
`physiology vascular. 2026.pptx.pdf` (84 halaman) dalam 6 bab + ringkasan & 10 soal klinis.

## Isi
| Bagian | Topik |
|---|---|
| Pendahuluan | Tujuan belajar, 3 komponen sirkulasi |
| Bab 1 | Sistem sirkulasi tertutup, pulmonal, sistemik, 5 jenis pembuluh |
| Bab 2 | Dinding arteri, transit cepat, reservoir tekanan, arteriol, 93→37 mmHg, tonus, kontrol lokal/ekstrinsik |
| Bab 3 | Dinding & jenis kapiler, sfingter prekapiler, difusi, Fick, bulk flow, gaya Starling, limfatik |
| Bab 4 | Vena kapasitans, aliran balik vena, 5 mekanisme (simpatis, pompa otot, katup, respirasi, isapan jantung), RAAS/ADH |
| Bab 5 | F = ΔP/R, Poiseuille, radius ×16, viskositas, Korotkoff, SBP/DBP/PP, MAP, MAP = CO × TPR |
| Bab 6 | Autoregulasi, EDVP, hiperemia reaktif, angiogenesis, baroreflex (CN IX/X), kemoreflex, iskemik medula, RAAS, ANP/BNP, ADH, epinefrin, integrasi |
| Akhir | Peta konsep, ringkasan rumus, tabel 5 pembuluh, ringkasan regulasi, 10 soal klinis + pembahasan |

## Dokumen
- `docs/01_checklist_slide.md` — checklist slide-per-slide + **daftar slide yang ambigu/kurang tepat**
- `docs/02_storyboard.md` — storyboard lengkap (waktu, visual, narasi per scene)
- `docs/03_naskah_narasi.md` — naskah narasi lengkap
- `docs/subtitles_id.srt` — subtitle tersinkron (juga tertanam di MP4 sebagai trek subtitle + burned-in)

Narasi yang **bukan isi slide** ditandai lencana biru "Klarifikasi tambahan" di video dan `[Klarifikasi]` di naskah.

## Teknologi
- **Remotion 4 + React + SVG** untuk seluruh animasi (`src/`)
- **Piper TTS** (model neural `id_ID-news_tts-medium`, offline) untuk narasi Bahasa Indonesia; fallback espeak-ng/MBROLA
- Musik latar ambient dibuat secara prosedural (bebas hak cipta), di-*duck* otomatis saat narasi
- ffmpeg untuk penggabungan

## Membangun ulang
```bash
cd video
npm install
pip install piper-tts numpy
# unduh model suara ke build/models/vits-piper-id_ID-news_tts-medium/ (rilis tts-models k2-fsa/sherpa-onnx)
python3 scripts/build_audio.py      # narasi, timeline, subtitle, musik
node scripts/render.mjs             # render per bab -> out/chunks/
scripts/assemble.sh                 # MP4 final -> out/Fisiologi_Vaskular.mp4
```
Ubah narasi di `storyboard.mjs`; timing animasi otomatis mengikuti durasi tiap kalimat.
