import json
D = {
 'Cover':'Gambar sampul asli PPT dengan Ken Burns + judul', 'Objectives':'5 kartu tujuan belajar muncul bergiliran',
 'ThreeComponents':'Lingkar sirkulasi dengan sel darah mengalir; muatan O₂/nutrien/hormon/sisa berjalan; analogi kota',
 'ChapterTitle':'Judul bab di atas gambar asli PPT (zoom perlahan)',
 'Circulation':'Diagram sirkulasi tertutup animasi (merah = kaya O₂, biru = miskin O₂), jalur disorot sesuai narasi, panel urutan jalur',
 'VesselCompare':'5 penampang melintang pembuluh; tiap pembuluh membesar & diberi analogi saat dibahas',
 'Recap':'Kartu pertanyaan; jawaban muncul setelah jeda', 'ArteryWall':'Penampang arteri berlapis (adventisia/kolagen, media/otot polos+elastin, intima/endotel), lapisan disorot',
 'RapidTransit':'Jantung → arteri lebar → organ; gelombang tekanan berjalan; tanda ✕ = tidak ada pertukaran',
 'Windkessel':'Arteri elastis menggembung saat sistol & recoil saat diastol, balon analogi, grafik ejeksi berdenyut vs aliran kontinu, mode arteri kaku',
 'ArterioleStructure':'Arteriol dengan cincin otot polos, serat simpatis melepas NE, zat kimia & hormon; diameter berubah',
 'PressureProfile':'Grafik tekanan sepanjang pohon vaskular (dibuat ulang dari hlm 23), titik 93 & 37, Δ56 mmHg',
 'VascularTone':'Penampang arteriol tonus parsial, kanal Ca²⁺, saraf simpatis, keran setengah terbuka',
 'ConstrictDilate':'Dua panel: konstriksi vs dilatasi dengan meter radius/resistensi/aliran',
 'OrganDistribution':'Curah jantung terbagi ke 6 organ lewat "keran" arteriol; saat olahraga porsi otot membesar',
 'LocalControl':'Kartu pengaruh kimia & fisik; arteriol di kanan melebar/menyempit sesuai faktor',
 'ExtrinsicControl':'Medula → saraf simpatis & kelenjar → hormon → arteriol; gauge MAP',
 'CapillaryWall':'Zoom dinding kapiler: sel endotel, celah, fenestrasi, partikel air menembus; analogi saringan',
 'CapillaryTypes':'4 tipe kapiler (otak, otot/paru, ginjal/usus, hati) dengan laju kebocoran partikel',
 'CapillaryBed':'Arteriol–metarteriol–venula, kapiler dengan sfingter prekapiler membuka (aktif) / menutup (istirahat)',
 'Diffusion':'O₂ & glukosa berdifusi dari kapiler ke sel; CO₂ & sisa sebaliknya; organ rekondisi',
 'Fick':'3 panel: jarak (≈7 µm, <0,1 mm), luas (10–40 miliar, ~600 m²), waktu (kecepatan vs penampang)',
 'BulkFlow':'Partikel air keluar (ultrafiltrasi) dan masuk (reabsorpsi) dengan panah arah',
 'Starling':'4 gaya Starling sebagai panah berlawanan dengan nilai PPT, perhitungan +11 / −9 mmHg',
 'Lymphatic':'Kelebihan cairan interstisial dikumpulkan kapiler limfe → vena; 6 fungsi limfatik',
 'VeinReservoir':'Venula menyatu menjadi vena yang menggembung; diagram lingkaran >60% volume darah',
 'VenousGradient':'Vena dengan gradien 17 → 0 mmHg menuju jantung; 5 faktor',
 'SympVeno':'Saraf simpatis → venokonstriksi → darah terdorong ke atrium; HR & kontraktilitas naik',
 'MusclePump':'Vena tungkai dengan dua katup; otot berkontraksi/relaksasi, katup atas/bawah buka-tutup; analogi lift satu arah',
 'RespPump':'Toraks mengembang, diafragma turun, tekanan intratoraks ↓ & abdomen ↑, darah naik ke atrium',
 'CardiacSuction':'Bidang katup AV turun saat sistol, tekanan atrium < 0; ventrikel mengembang saat diastol',
 'VenousSummary':'Diagram hub faktor aliran balik vena + regulasi volume darah jangka pendek/panjang',
 'PipeFlow':'Analogi tangki & pipa air: ΔP, penjepitan selang (R), F = ΔP/R',
 'Poiseuille':'Persamaan Poiseuille, tiap suku disorot sesuai narasi',
 'RadiusDemo':'Pembuluh yang radiusnya menyusut ½ lalu membesar 2×; angka R & aliran (×16, 1/16) berubah langsung',
 'Viscosity':'Dua tabung: hematokrit normal vs tinggi (aliran lamban), air vs sirup',
 'BPMeasure':'Lengan dengan manset, gauge turun 160 → 74, bunyi Korotkoff muncul antara 120 dan 80',
 'BPWave':'Gelombang tekanan arteri dengan garis SBP 120, DBP 80, PP 40; tabel PP',
 'SbpDbpFactors':'Tabel faktor SBP/DBP disorot baris demi baris',
 'MAPCalc':'Gelombang dengan pembagian ⅓ sistol & ⅔ diastol; perhitungan MAP bertahap; garis 93 vs 100',
 'MAPPurpose':'Gauge MAP dengan zona rendah/normal/tinggi; tujuan regulasi',
 'MAPTree':'Pohon MAP = CO × TPR dan semua faktornya',
 'ThreeLevels':'3 kolom kontrol lokal/saraf/hormonal dengan skala waktu',
 'Autoregulation':'Grafik tekanan naik mendadak → aliran melonjak lalu kembali; termostat; peringkat autoregulasi organ',
 'EDVP':'Endotel melepas NO/endotelin/PGH₂/PGI₂; pembuluh melebar/menyempit sesuai zat',
 'ReactiveHyperemia':'Grafik aliran saat oklusi & lonjakan; pertumbuhan pembuluh baru (angiogenesis)',
 'CVCenter':'Otak dengan medula berdenyut, keluaran simpatis & parasimpatis ke jantung, arteriol, vena',
 'Baroreflex':'Skema leher–jantung: sinus karotis (CN IX), arkus aorta (CN X), sinyal ke medula; tabel komponen',
 'BaroLoop':'Lingkar umpan balik negatif animasi untuk tekanan naik lalu turun; termostat',
 'Chemoreflex':'Skema badan karotis/aorta, pemicu kimia, respons napas & vasokonstriksi',
 'MedullaryIschemic':'Gauge tekanan jatuh di bawah 60, medula alarm, respons simpatis kuat',
 'RAAS':'Rantai ginjal → renin → angiotensinogen (hati) → Ang I → ACE (paru) → Ang II → efek',
 'Hormones':'Kartu ANP/BNP (↓BP), ADH, epinefrin/NE (↑BP); gambar ANP asli',
 'Integration':'Gauge MAP dengan CO, TPR, volume darah; skenario perdarahan dan kompensasi detik/jam',
 'ConceptMap':'Peta konsep seluruh fisiologi vaskular', 'Formulas':'Ringkasan 6 rumus', 'VesselTable':'Tabel perbandingan 5 pembuluh',
 'RegSummary':'Ringkasan regulasi per skala waktu', 'QuizIntro':'Pembuka kuis', 'Quiz':'Soal + 4 pilihan, hitung mundur 5 detik, jawaban & penjelasan', 'Outro':'Penutup 3 pesan inti',
}
t = json.load(open('public/timeline.json'))
ch = {c['n']: c['title'] for c in t['chapters']}
fmt = lambda f: f"{int(f/30//60):02}:{int(f/30%60):02}"
out = ['# Fase 2 — Storyboard Lengkap\n', f"Total durasi: **{fmt(t['total'])}** (1920×1080, 30 fps). Waktu dihitung otomatis dari durasi narasi.\n"]
cur = None
for s in t['scenes']:
    if s['ch'] != cur:
        cur = s['ch']; out.append(f"\n## Bab {cur}: {ch[cur]}\n")
    out.append(f"### `{s['id']}` · {fmt(s['from'])}–{fmt(s['from']+s['dur'])} ({s['dur']/30:.0f} dtk)" + (f" · PPT hlm {s['src']}" if s['src'] else ''))
    out.append(f"**Visual:** {D.get(s['v'], s['v'])}\n")
    for l in s['lines']:
        if l.get('silent'): out.append('- _(jeda hitung mundur)_'); continue
        out.append(f"- `{fmt(s['from']+l['from'])}` " + ('**[Klarifikasi]** ' if l['x'] else '') + l['s'])
    for n in s['notes']: out.append(f"- ⚠ Catatan slide: {n['text']}")
    out.append('')
open('docs/02_storyboard.md', 'w').write('\n'.join(out))
print('ok')
