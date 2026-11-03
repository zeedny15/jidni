// STORYBOARD — Fisiologi Vaskular (berdasarkan "physiology vascular. 2026.pptx.pdf")
// Setiap scene: id, ch (bab), v (komponen visual), p (props), src (halaman PPT),
// lines: narasi per kalimat. Baris berupa {s, x:1} = klarifikasi tambahan (BUKAN dari PPT).
// notes: [{at, text}] = kartu peringatan bila slide ambigu / kurang tepat.

import { fun } from './narration_fun.mjs';
const X = (s) => ({ s, x: 1 });

export const chapters = [
  { n: 0, title: 'Pendahuluan' },
  { n: 1, title: 'Sistem Sirkulasi & Pembuluh Darah' },
  { n: 2, title: 'Arteri & Arteriol' },
  { n: 3, title: 'Kapiler, Difusi & Bulk Flow' },
  { n: 4, title: 'Venula, Vena & Aliran Balik Vena' },
  { n: 5, title: 'Hemodinamika & Tekanan Darah' },
  { n: 6, title: 'Regulasi Aliran & Tekanan Darah' },
  { n: 7, title: 'Ringkasan & Latihan Soal' },
];

const baseScenes = [
  // ───────────────────────── PENDAHULUAN ─────────────────────────
  { id: 'intro', ch: 0, v: 'Cover', src: '1', lines: [
    'Selamat datang. Kita akan belajar fisiologi vaskular: bagaimana pembuluh darah bekerja.',
    'Materinya mengikuti slide kuliah dokter Dian Aristia Rachmayanti.',
    'Tujuannya memahami, bukan menghafal.',
  ]},
  { id: 'objectives', ch: 0, v: 'Objectives', src: '2', lines: [
    'Ada lima tujuan belajar.',
    'Struktur dan fungsi pembuluh darah.',
    'Hemodinamika: hubungan tekanan, aliran, dan resistensi.',
    'Komponen tekanan darah: sistolik, diastolik, tekanan nadi, dan MAP.',
    'Mekanisme aliran balik vena.',
    'Serta kontrol lokal, saraf, dan hormon yang mengatur aliran dan tekanan darah.',
  ]},
  { id: 'three', ch: 0, v: 'ThreeComponents', src: '3', lines: [
    'Sistem sirkulasi menjaga homeostasis dengan menjadi sistem transportasi tubuh.',
    'Komponennya tiga: jantung sebagai pompa, pembuluh sebagai jalur, dan darah sebagai media angkut.',
    'Ketiganya mengantar oksigen, nutrien, dan hormon, serta mengangkut sisa metabolisme.',
    'Seperti kota: jantung stasiun pompa, pembuluh jalan raya, darah truk pengantar.',
  ]},

  // ───────────────────────── BAB 1 ─────────────────────────
  { id: 'ch1', ch: 1, v: 'ChapterTitle', p: { img: 'body-vessels.png' }, src: '4', lines: [
    'Bab satu. Sistem sirkulasi dan pembuluh darah.',
  ]},
  { id: 'loop', ch: 1, v: 'Circulation', p: { mode: 'overview' }, src: '5', lines: [
    'Darah beredar dalam sistem tertutup, atau closed loop: terus berputar tanpa keluar dari pembuluh.',
    'Ada dua sirkuit: pulmonal menuju paru, dan sistemik menuju seluruh tubuh.',
    'Pembuluhnya membentuk pohon vaskular: arteri, arteriol, kapiler, venula, dan vena.',
  ]},
  { id: 'pulm', ch: 1, v: 'Circulation', p: { mode: 'pulmonary' }, src: '6', lines: [
    'Sirkulasi pulmonal: darah miskin oksigen, warna biru, keluar dari ventrikel kanan.',
    'Lewat trunkus dan arteri pulmonalis menuju paru.',
    'Di kapiler paru, O₂ masuk ke darah dan CO₂ keluar.',
    'Darah kaya oksigen, warna merah, kembali lewat vena pulmonalis ke atrium kiri.',
    X('Ingat: arteri adalah pembuluh yang menjauhi jantung, bukan pembuluh yang kaya oksigen.'),
  ]},
  { id: 'sys', ch: 1, v: 'Circulation', p: { mode: 'systemic' }, src: '7', lines: [
    'Sirkulasi sistemik: ventrikel kiri memompa darah kaya oksigen ke aorta.',
    'Lalu ke arteri, arteriol, dan kapiler jaringan.',
    'Di kapiler terjadi pertukaran gas, nutrien, dan sisa metabolisme.',
    'Darah miskin oksigen kembali lewat venula, vena, dan vena kava ke atrium kanan.',
  ]},
  { id: 'full', ch: 1, v: 'Circulation', p: { mode: 'full' }, src: '8', lines: [
    'Digabung, inilah lingkaran lengkapnya.',
    'Ventrikel kiri, aorta, arteri, arteriol, kapiler, venula, vena, vena kava, atrium kanan.',
    'Lalu ventrikel kanan, arteri pulmonalis, kapiler paru, vena pulmonalis, atrium kiri, dan kembali ke ventrikel kiri.',
    'Trik mengingat: kiri ke tubuh, kanan ke paru.',
  ]},
  { id: 'classes', ch: 1, v: 'VesselCompare', src: '9–10', lines: [
    'Ada lima jenis pembuluh, masing-masing dengan tugas khusus.',
    'Arteri: pembuluh penghantar dan penampung tekanan. Dindingnya tebal dan elastis, membawa darah bertekanan tinggi menjauhi jantung.',
    'Arteriol: pembuluh resistensi. Otot polosnya menyempit atau melebar, mengatur resistensi perifer total dan tekanan arteri.',
    'Kapiler: pembuluh pertukaran, dindingnya hanya selapis endotel.',
    'Venula: pembuluh pengumpul, memulai perjalanan pulang.',
    'Vena: pembuluh kapasitans. Lumen besar, dinding tipis, berkatup, menyimpan lebih dari 60% volume darah saat istirahat.',
  ]},
  { id: 'recap1', ch: 1, v: 'Recap', p: { qa: [
      ['Pembuluh apa yang membawa darah miskin oksigen namun disebut arteri?', 'Arteri pulmonalis — arahnya menjauhi jantung.'],
      ['Pembuluh mana yang menjadi reservoir darah?', 'Vena (>60% volume darah saat istirahat).'],
    ] }, lines: [
    'Uji pemahaman bab satu.',
    'Pembuluh apa yang membawa darah miskin oksigen namun disebut arteri? Jawabannya arteri pulmonalis, karena arahnya menjauhi jantung.',
    'Pembuluh mana yang menjadi reservoir darah? Jawabannya vena.',
  ]},

  // ───────────────────────── BAB 2 ─────────────────────────
  { id: 'ch2', ch: 2, v: 'ChapterTitle', p: { img: 'cover.png' }, src: '11, 20', lines: [
    'Bab dua. Arteri dan arteriol.',
  ]},
  { id: 'arterywall', ch: 2, v: 'ArteryWall', src: '12–13', lines: [
    'Dinding arteri dirancang tahan tekanan tinggi, elastis, dan beresistensi rendah.',
    'Radius besar menurunkan resistensi.',
    'Endotel yang licin meminimalkan gesekan.',
    'Otot polos tebal menjaga lumen tetap terbuka di bawah tekanan tinggi.',
    'Kolagen memberi kekuatan tarik agar tidak robek; elastin membuatnya bisa meregang lalu kembali.',
    'Hasilnya aliran mulus, tanpa turbulensi.',
  ]},
  { id: 'rapid', ch: 2, v: 'RapidTransit', src: '14–16', lines: [
    'Fungsi pertama arteri: jalur transit cepat.',
    'Saat sistol, darah dipompa kuat; karena resistensi rendah, tekanan diteruskan efisien ke semua organ.',
    'Oksigen terdistribusi cepat, tekanan terjaga, dan arteriol di hilir bisa mengatur aliran tiap organ.',
    'Arteri tidak ikut pertukaran zat; dindingnya terlalu tebal. Ibarat jalan tol: untuk melaju, bukan bongkar muat.',
  ]},
  { id: 'windkessel', ch: 2, v: 'Windkessel', src: '17–19',
    notes: [{ at: 4, text: 'Slide hlm 19 menulis "During Diastole (Heart Contraction)". Seharusnya: relaksasi jantung.' }],
    lines: [
    'Fungsi kedua: reservoir tekanan.',
    'Jantung memompa berdenyut, tapi aliran ke jaringan tetap kontinu. Bagaimana bisa?',
    'Saat sistol, darah yang masuk arteri lebih banyak daripada yang keluar, karena arteriol beresistensi tinggi.',
    'Dinding arteri meregang dan menyimpan energi, seperti balon yang ditiup.',
    'Saat diastol, jantung mengisi kembali. Dinding arteri melenting, atau recoil, mendorong darah ke depan.',
    'Recoil elastis inilah pendorong aliran selama diastol.',
    X('Klinis: arteri kaku pada lansia membuat sistolik naik dan tekanan nadi melebar.'),
  ]},
  { id: 'arteriole', ch: 2, v: 'ArterioleStructure', src: '21', lines: [
    'Arteriol punya otot polos tebal yang tersusun melingkar.',
    'Ia dipersarafi simpatis, peka zat kimia lokal, dan dipengaruhi hormon.',
    'Kontraksinya menyebabkan vasokonstriksi; relaksasinya vasodilatasi.',
    'Jaringan elastisnya sedikit, jadi recoil-nya minimal.',
  ]},
  { id: 'pdrop', ch: 2, v: 'PressureProfile', src: '22–23', lines: [
    'Arteriol adalah pembuluh resistensi utama karena radiusnya kecil.',
    'Kapiler lebih kecil, tapi jumlahnya sangat banyak, sehingga total resistensinya lebih rendah.',
    'Darah masuk arteriol sekitar 93 mmHg, dan keluar sekitar 37 mmHg.',
    'Turun 56 mmHg: penurunan terbesar di pohon vaskular.',
    'Ini menciptakan gradien yang mendorong darah ke kapiler dan vena.',
    'Ayunan sistolik dan diastolik juga diredam, sehingga aliran kapiler stabil untuk pertukaran.',
  ]},
  { id: 'tone', ch: 2, v: 'VascularTone', src: '24', lines: [
    'Otot polos arteriol selalu sedikit berkontraksi: inilah tonus vaskular.',
    'Dari titik awal ini, arteriol bisa menyempit atau melebar.',
    'Penyebab intrinsik: aktivitas miogenik. Kanal Ca²⁺ bergerbang voltase sedikit terbuka saat istirahat.',
    'Penyebab ekstrinsik: saraf simpatis yang terus melepaskan norepinefrin.',
    'Seperti keran setengah terbuka, siap diputar ke dua arah.',
  ]},
  { id: 'vcvd', ch: 2, v: 'ConstrictDilate', src: '25', lines: [
    'Vasokonstriksi: otot polos berkontraksi.',
    'Radius turun, resistensi naik, aliran darah turun.',
    'Vasodilatasi: otot polos relaksasi.',
    'Radius naik, resistensi turun, aliran darah naik.',
  ]},
  { id: 'distrib', ch: 2, v: 'OrganDistribution', src: '26', lines: [
    'Arteriol tiap organ mengatur radiusnya sendiri, untuk dua tujuan.',
    'Membagi curah jantung sesuai kebutuhan; saat olahraga otot mendapat lebih banyak.',
    'Dan mengatur tekanan arteri lewat resistensi perifer total, atau TPR.',
    'Mekanismenya: kontrol lokal dan kontrol ekstrinsik.',
  ]},
  { id: 'local', ch: 2, v: 'LocalControl', src: '27–28', lines: [
    'Kontrol lokal berasal dari organ itu sendiri.',
    'Kimia: perubahan metabolik. O₂ turun; CO₂, H⁺, K⁺, dan adenosin naik.',
    'Endotel melepas parakrin, arteriol melebar. Saat naik tangga, otot yang bekerja mendapat aliran lebih.',
    'Histamin dari sel mast: vasodilatasi dan kapiler bocor. Itu sebabnya gigitan nyamuk merah dan bengkak.',
    'Fisik: regangan. Dinding teregang, kanal kation mekanis terbuka, Ca²⁺ masuk, arteriol berkonstriksi. Ini respons miogenik.',
    'Shear stress, gesekan aliran pada endotel, memicu nitrat oksida dan vasodilatasi.',
    'Suhu: panas melebarkan, dingin menyempitkan.',
  ]},
  { id: 'extrinsic', ch: 2, v: 'ExtrinsicControl', src: '29', lines: [
    'Kontrol ekstrinsik datang dari luar organ: saraf simpatis dan hormon.',
    'Fokusnya MAP dan TPR, bukan kebutuhan satu organ.',
    'Tujuannya menjaga perfusi organ vital, terutama otak.',
  ]},
  { id: 'recap2', ch: 2, v: 'Recap', p: { qa: [
      ['Mengapa aliran ke jaringan tetap kontinu walau jantung berdenyut?', 'Recoil elastis arteri saat diastol (reservoir tekanan).'],
      ['Di mana penurunan tekanan terbesar?', 'Arteriol: ~93 → ~37 mmHg.'],
    ] }, lines: [
    'Uji pemahaman bab dua.',
    'Mengapa aliran tetap kontinu walau jantung berdenyut? Karena recoil elastis arteri saat diastol.',
    'Penurunan tekanan terbesar? Di arteriol.',
  ]},

  // ───────────────────────── BAB 3 ─────────────────────────
  { id: 'ch3', ch: 3, v: 'ChapterTitle', p: { img: 'capillary-3d.png' }, src: '30', lines: [
    'Bab tiga. Kapiler, difusi, dan bulk flow.',
  ]},
  { id: 'capwall', ch: 3, v: 'CapillaryWall', src: '31', lines: [
    'Dinding kapiler hanya selapis sel endotel pipih.',
    'Pori di antara sel dilewati air dan zat kecil larut air.',
    'Kebocorannya tergantung rapatnya sambungan antarsel dan ada tidaknya fenestrasi.',
    'Seperti saringan: ada yang rapat, ada yang berlubang besar.',
  ]},
  { id: 'captypes', ch: 3, v: 'CapillaryTypes', src: '31', lines: [
    'Tiap organ punya endotel sesuai fungsinya.',
    'Otak: paling rapat.',
    'Otot dan paru: cukup bocor.',
    'Ginjal dan usus: berfenestrasi, lebih bocor.',
    'Hati: diskontinu, paling bocor.',
    X('Kapiler otak membentuk sawar darah otak; kapiler hati membiarkan protein buatan hati masuk darah.'),
  ]},
  { id: 'capbed', ch: 3, v: 'CapillaryBed', src: '32', lines: [
    'Kapiler bercabang dari arteriol atau metarteriol, saluran pintas ke venula.',
    'Di pintu masuknya ada sfingter prekapiler, cincin otot polos seperti katup kecil.',
    'Tidak dipersarafi, tetapi peka perubahan metabolik lokal.',
    'Jaringan aktif: sfingter relaksasi, banyak kapiler terisi.',
    'Istirahat: sfingter kontraksi, darah melintas lewat metarteriol.',
  ]},
  { id: 'diffusion', ch: 3, v: 'Diffusion', src: '33', lines: [
    'Pertukaran zat terjadi lewat difusi, dari konsentrasi tinggi ke rendah.',
    'Sel memakai O₂ dan glukosa, menghasilkan CO₂ dan sisa.',
    'Maka O₂ dan glukosa masuk ke sel; CO₂ dan sisa masuk ke darah.',
    'Gradien dijaga organ rekondisi: paru, saluran cerna, ginjal, dan kulit.',
  ]},
  { id: 'fick', ch: 3, v: 'Fick', src: '34–35', lines: [
    'Menurut hukum Fick, kapiler mengoptimalkan tiga faktor difusi.',
    'Jarak difusi minimal: hanya endotel dan membran basal.',
    'Diameter sekitar 7 µm, sel darah merah lewat satu per satu, dan sel jaringan berjarak kurang dari 0,1 mm.',
    'Luas permukaan maksimal: 10 sampai 40 miliar kapiler, sekitar 600 m².',
    'Waktu cukup: total penampang sangat besar, aliran sangat lambat.',
    'Seperti sungai yang melebar menjadi danau: arusnya melambat.',
  ]},
  { id: 'bulk', ch: 3, v: 'BulkFlow', src: '36', lines: [
    'Bulk flow adalah perpindahan cairan melintasi dinding kapiler.',
    'Tujuannya membagi cairan ekstraseluler antara plasma dan interstisial.',
    'Tekanan keluar lebih besar: ultrafiltrasi.',
    'Tekanan masuk lebih besar: reabsorpsi.',
  ]},
  { id: 'starling', ch: 3, v: 'Starling', src: '37', lines: [
    'Arahnya ditentukan empat gaya Starling.',
    'Tekanan darah kapiler, Pc, ke luar: 37 mmHg di ujung arteriol, 17 di ujung venula.',
    'Tekanan osmotik koloid plasma, πp, 25 mmHg ke dalam.',
    'Tekanan hidrostatik interstisial, Pif, 1 mmHg ke dalam.',
    'Tekanan osmotik koloid interstisial, πif, sekitar 0, ke luar.',
    'Ujung arteriol: 37 dikurangi 26, sama dengan 11 mmHg ke luar.',
    'Ujung venula: 17 dikurangi 26, sama dengan 9 mmHg ke dalam.',
    X('Bila Pc naik, misalnya gagal jantung, atau protein plasma turun, terjadi edema.'),
  ]},
  { id: 'lymph', ch: 3, v: 'Lymphatic', src: '38', lines: [
    'Normalnya, filtrasi sedikit lebih banyak daripada reabsorpsi.',
    'Sisa cairan ini dialirkan oleh sistem limfatik, agar tidak menjadi edema.',
    'Limfatik menjaga keseimbangan cairan, volume plasma, dan tekanan darah.',
    'Juga jalur sel imun, menyerap lemak lewat lakteal, dan mengembalikan protein.',
  ]},
  { id: 'recap3', ch: 3, v: 'Recap', p: { qa: [
      ['Apa beda difusi dan bulk flow?', 'Difusi: zat terlarut, ikut gradien konsentrasi. Bulk flow: volume cairan, ikut gradien tekanan.'],
      ['Mengapa di ujung venula terjadi reabsorpsi?', 'Pc turun ke 17 mmHg < πp 25 mmHg.'],
    ] }, lines: [
    'Uji pemahaman bab tiga.',
    'Beda difusi dan bulk flow? Difusi: zat terlarut, gradien konsentrasi. Bulk flow: cairan, gradien tekanan.',
    'Mengapa reabsorpsi di ujung venula? Karena Pc turun di bawah πp.',
  ]},

  // ───────────────────────── BAB 4 ─────────────────────────
  { id: 'ch4', ch: 4, v: 'ChapterTitle', p: { img: 'veins-body.png' }, src: '39', lines: [
    'Bab empat. Venula, vena, dan aliran balik vena.',
  ]},
  { id: 'veinres', ch: 4, v: 'VeinReservoir', src: '10, 40', lines: [
    'Venula menyatu menjadi vena.',
    'Vena menyimpan lebih dari 60% volume darah: pembuluh kapasitans.',
    'Otot polos dan elastinnya sedikit, kolagennya banyak.',
    'Jadi vena mudah teregang dan menampung banyak darah tanpa kenaikan tekanan besar.',
    'Seperti kantong plastik lentur, bukan balon karet.',
  ]},
  { id: 'vrintro', ch: 4, v: 'VenousGradient', src: '41', lines: [
    'Aliran balik vena: darah yang kembali ke atrium per menit, harus sama dengan curah jantung.',
    'Tekanan pendorongnya dari 17 mmHg ke 0 mmHg.',
    'Kecil, tapi cukup karena resistensi vena rendah.',
    'Lima faktor membantunya: simpatis, pompa otot, katup vena, pompa respirasi, dan isapan jantung.',
  ]},
  { id: 'symp', ch: 4, v: 'SympVeno', src: '42', lines: [
    'Pertama, simpatis.',
    'Venokonstriksi menaikkan tekanan vena dan mendorong darah simpanan ke atrium kanan.',
    'Simpatis juga menaikkan denyut jantung lewat nodus SA dan kontraktilitas lewat Ca²⁺.',
    'Saat olahraga, curah jantung naik tajam.',
  ]},
  { id: 'muscle', ch: 4, v: 'MusclePump', src: '43–44', lines: [
    'Kedua dan ketiga: pompa otot rangka dan katup vena satu arah.',
    'Otot berkontraksi: vena tertekan, katup atas membuka, katup bawah menutup.',
    'Otot relaksasi: katup atas menutup, katup bawah membuka, vena terisi dari bawah.',
    'Seperti pintu satu arah, atau lift yang hanya naik.',
    'Saat berdiri, katup memecah kolom darah menjadi segmen setiap 2 sampai 4 cm.',
    X('Klinis: katup rusak menyebabkan varises.'),
  ]},
  { id: 'resp', ch: 4, v: 'RespPump', src: '45', lines: [
    'Keempat: pompa respirasi.',
    'Saat inspirasi, tekanan intratoraks turun.',
    'Diafragma turun, tekanan abdomen naik.',
    'Darah terdorong dari vena abdomen ke dada dan atrium kanan.',
    'Saat olahraga, ketiga pompa bekerja sinergis.',
  ]},
  { id: 'suction', ch: 4, v: 'CardiacSuction', src: '46', lines: [
    'Kelima: isapan jantung.',
    'Saat sistol, katup AV tertarik ke bawah, atrium membesar, tekanan turun di bawah 0 mmHg.',
    'Darah tertarik dari vena.',
    'Saat diastol, ventrikel mengembang cepat dan menyedot darah.',
  ]},
  { id: 'vrsum', ch: 4, v: 'VenousSummary', src: '47, 65', lines: [
    'Rangkuman faktor aliran balik vena, ditambah volume darah.',
    'Volume darah efektif menentukan berapa darah yang bisa kembali.',
    'Jangka pendek: pergeseran cairan bulk flow.',
    'Jangka panjang: garam dan air, lewat RAAS dan ADH.',
  ]},
  { id: 'recap4', ch: 4, v: 'Recap', p: { qa: [
      ['Saat otot betis berkontraksi, katup mana yang membuka?', 'Katup atas membuka, katup bawah menutup.'],
      ['Apa yang terjadi pada tekanan intratoraks saat inspirasi?', 'Turun → darah tertarik ke vena dada.'],
    ] }, lines: [
    'Uji pemahaman bab empat.',
    'Otot betis berkontraksi: katup atas membuka.',
    'Inspirasi: tekanan intratoraks turun.',
  ]},

  // ───────────────────────── BAB 5 ─────────────────────────
  { id: 'ch5', ch: 5, v: 'ChapterTitle', p: { img: 'bp-measure.png' }, src: '48, 54', lines: [
    'Bab lima. Hemodinamika dan tekanan darah.',
  ]},
  { id: 'pipe', ch: 5, v: 'PipeFlow', src: '50, 53', lines: [
    X('Hemodinamika: ilmu aliran darah dan gaya yang mengaturnya.'),
    'Aliran ditentukan gradien tekanan dan resistensi.',
    'Gradien tekanan adalah selisih tekanan awal dan akhir pembuluh.',
    'Yang menentukan selisihnya, bukan nilai absolutnya.',
    'Resistensi: hambatan akibat gesekan darah dan dinding.',
    'F sama dengan ΔP dibagi R. Seperti selang: keran dibuka makin deras, selang dijepit makin kecil.',
  ]},
  { id: 'poiseuille', ch: 5, v: 'Poiseuille', src: '49, 53', lines: [
    'Hukum Poiseuille merinci faktornya.',
    'Aliran sama dengan π kali ΔP kali r⁴, dibagi 8 kali η kali L.',
    'ΔP: gradien tekanan.',
    'r⁴: radius pangkat empat, penentu terkuat.',
    'η viskositas, L panjang, π per 8 konstanta.',
    'Resistensi sebanding viskositas dan panjang, berbanding terbalik r⁴.',
  ]},
  { id: 'radius', ch: 5, v: 'RadiusDemo', src: '52', lines: [
    'Buktikan kekuatan radius.',
    'Radius setengah: r⁴ menjadi 1/16.',
    'Resistensi naik 16 kali, aliran 1/16.',
    'Radius ganda: aliran naik 16 kali.',
    'Radius kecil berarti lebih banyak darah menyentuh dinding.',
    'Itulah sebabnya arteriol pengatur utama aliran.',
  ]},
  { id: 'visc', ch: 5, v: 'Viscosity', src: '51–52', lines: [
    'Viskositas adalah gesekan internal cairan; sirup lebih kental daripada air.',
    'Viskositas darah terutama ditentukan jumlah sel darah merah.',
    'Jarang berubah mendadak.',
    'Tapi pada polisitemia dan dehidrasi, TPR, MAP, dan beban jantung naik.',
    'Panjang pembuluh relatif konstan.',
  ]},
  { id: 'bpmeasure', ch: 5, v: 'BPMeasure', src: '54–56', lines: [
    'Tekanan darah: gaya darah pada dinding, tergantung volume darah dan komplians dinding.',
    'Diukur langsung dengan kateter, atau tidak langsung dengan sfigmomanometer dan stetoskop.',
    X('Manset dipompa, lalu dikempiskan perlahan.'),
    'Bunyi Korotkoff pertama: tekanan sistolik, 120 mmHg.',
    'Bunyi menghilang: tekanan diastolik, 80 mmHg.',
    'Ditulis 120/80 mmHg.',
  ]},
  { id: 'bpwave', ch: 5, v: 'BPWave', src: '56, 59', lines: [
    'Sistolik: tekanan maksimum saat ventrikel berkontraksi, sekitar 120 mmHg.',
    'Diastolik: tekanan minimum saat jantung relaksasi, sekitar 80 mmHg.',
    'Tekanan nadi: selisih keduanya, 40 mmHg.',
    'Rendah bila kurang dari 30, tinggi bila lebih dari 60.',
  ]},
  { id: 'factors', ch: 5, v: 'SbpDbpFactors', src: '57', lines: [
    'Faktor yang memengaruhinya.',
    'Volume sekuncup dan kontraktilitas menaikkan sistolik; efek pada diastolik bervariasi.',
    'TPR, denyut jantung, dan volume darah menaikkan keduanya.',
    'Komplians turun: sistolik naik, diastolik berubah lebih sedikit.',
    'Diastolik terutama dipengaruhi resistensi perifer, durasi diastol, dan komplians.',
  ]},
  { id: 'map', ch: 5, v: 'MAPCalc', src: '61',
    notes: [{ at: 4, text: 'Slide hlm 61 menulis "MAP = 120 + (2x80) / 3". Penulisan yang benar: (120 + 2×80) / 3 = 93 mmHg.' }],
    lines: [
    'MAP, tekanan arteri rata-rata, adalah pendorong utama aliran ke jaringan.',
    'MAP bukan nilai tengah, karena dua pertiga siklus adalah diastol.',
    'MAP sama dengan diastolik ditambah sepertiga tekanan nadi.',
    'Contoh: 80 ditambah 13, sama dengan 93 mmHg.',
    'Atau sistolik ditambah dua kali diastolik, dibagi tiga: juga 93.',
    'Bukan 100. Dan 93 adalah tekanan saat darah masuk arteriol.',
  ]},
  { id: 'mappurpose', ch: 5, v: 'MAPPurpose', src: '61–62', lines: [
    'MAP-lah yang dipantau dan diatur tubuh.',
    'Cukup tinggi untuk perfusi otak dan jantung.',
    'Tidak terlalu tinggi agar jantung dan pembuluh tidak rusak.',
    'Jika satu organ berdilatasi, organ lain sedikit berkonstriksi agar MAP tetap stabil.',
  ]},
  { id: 'maptree', ch: 5, v: 'MAPTree', src: '63–65', lines: [
    'MAP sama dengan curah jantung, CO, kali TPR.',
    'CO sama dengan denyut jantung kali volume sekuncup.',
    'Denyut jantung: turun oleh parasimpatis, naik oleh simpatis dan epinefrin.',
    'Volume sekuncup: naik oleh simpatis, dan oleh aliran balik vena sesuai hukum Frank Starling.',
    'TPR ditentukan radius arteriol dan viskositas.',
    'Radius arteriol diatur kontrol lokal, simpatis, dan hormon seperti vasopresin dan angiotensin II.',
  ]},
  { id: 'recap5', ch: 5, v: 'Recap', p: { qa: [
      ['Radius arteriol menjadi setengah. Resistensi naik berapa kali?', '16 kali (R ∝ 1/r⁴).'],
      ['Hitung MAP dari 150/90 mmHg.', 'PP = 60 → ⅓ × 60 = 20 → MAP = 90 + 20 = 110 mmHg.'],
    ] }, lines: [
    'Uji pemahaman bab lima.',
    'Radius setengah: resistensi naik 16 kali.',
    'MAP dari 150/90: 90 ditambah 20, sama dengan 110 mmHg.',
  ]},

  // ───────────────────────── BAB 6 ─────────────────────────
  { id: 'ch6', ch: 6, v: 'ChapterTitle', p: { img: 'regulation-cover.png' }, src: '67', lines: [
    'Bab enam. Regulasi aliran darah dan tekanan darah.',
  ]},
  { id: 'levels', ch: 6, v: 'ThreeLevels', src: '68', lines: [
    'Ada tiga tingkat kontrol.',
    'Lokal: intrinsik, seketika, sesuai kebutuhan metabolik.',
    'Saraf: ekstrinsik lewat simpatis, dalam hitungan detik.',
    'Hormonal: endokrin, menit hingga jam, untuk tekanan dan volume jangka panjang.',
  ]},
  { id: 'autoreg', ch: 6, v: 'Autoregulation', src: '69–70',
    notes: [{ at: 4, text: 'Slide menyebut otot rangka & kulit autoregulasinya buruk. Banyak buku (mis. Guyton) menyebut otot rangka masih cukup baik; yang jelas lemah adalah kulit. Konfirmasi dengan dosen.' }],
    lines: [
    'Autoregulasi: jaringan mengatur alirannya sendiri lewat mekanisme miogenik dan kimia.',
    'Aliran tetap konstan walau MAP berubah.',
    'Tekanan naik, aliran sempat melonjak, lalu kembali normal.',
    'Seperti termostat yang kembali ke titik setel.',
    'Otak paling baik, ginjal baik, otot rangka dan kulit kurang, menurut slide.',
    'Saat bangun mendadak, arteriol otak berdilatasi sehingga kita tidak pingsan.',
  ]},
  { id: 'edvp', ch: 6, v: 'EDVP', src: '71', lines: [
    'Parakrin vasoaktif dari endotel.',
    'Saat O₂ turun atau shear stress naik, endotel melepas parakrin ke otot polos.',
    'NO: vasodilator kuat.',
    'Endotelin: vasokonstriktor poten.',
    'PGH₂ vasokonstriktor, prostasiklin vasodilator.',
    'Histamin, bradikinin, dan prostaglandin juga vasodilator.',
    X('Klinis: nitrogliserin bekerja lewat NO.'),
  ]},
  { id: 'hyperemia', ch: 6, v: 'ReactiveHyperemia', src: '72', lines: [
    'Hiperemia reaktif: lonjakan aliran sesudah oklusi.',
    'Metabolit menumpuk saat oklusi, lalu aliran melonjak saat dilepas.',
    'Dipicu kimia lokal, diperantarai parakrin endotel.',
    'Angiogenesis: pembuluh baru akibat hipoksia kronis.',
    'Contohnya pada atlet, dan pembuluh pintas koroner.',
  ]},
  { id: 'cvc', ch: 6, v: 'CVCenter', src: '73', lines: [
    'Kontrol saraf berpusat di medula oblongata.',
    'Tiga refleks: baroreflex, kemoreflex, dan iskemik medula.',
    'Keluarannya simpatis dan parasimpatis ke jantung, arteriol, dan vena.',
    'Ia juga mengatur tonus vaskular.',
  ]},
  { id: 'baro', ch: 6, v: 'Baroreflex', src: '74–75', lines: [
    'Baroreflex: kontrol cepat MAP lewat umpan balik negatif.',
    'Baroreseptor merasakan regangan dinding arteri.',
    'Letaknya di sinus karotis dan arkus aorta.',
    'Aferen: sinus karotis lewat CN IX, arkus aorta lewat CN X.',
    'Medula mengintegrasikan sinyal.',
    'Eferen: simpatis dan parasimpatis.',
    'Ingat: sembilan sinus, sepuluh arkus.',
  ]},
  { id: 'baroloop', ch: 6, v: 'BaroLoop', src: '76–77', lines: [
    'Tekanan darah naik.',
    'Impuls baroreseptor meningkat.',
    'Parasimpatis naik, simpatis turun.',
    'CO dan TPR turun, tekanan kembali normal.',
    'Tekanan turun, misalnya berdiri mendadak.',
    'Simpatis naik: jantung lebih cepat dan kuat, pembuluh berkonstriksi, tekanan pulih.',
    'Termostat tubuh: sensor, pusat, efektor.',
  ]},
  { id: 'chemo', ch: 6, v: 'Chemoreflex', src: '78', lines: [
    'Kemoreflex merespons kimia darah.',
    'Hipoksemia, hiperkapnia, dan asidosis.',
    'Reseptornya di badan karotis dan aorta.',
    'Peran utama: menambah laju napas.',
    'Peran sekunder: vasokonstriksi luas, tekanan naik.',
  ]},
  { id: 'ischemic', ch: 6, v: 'MedullaryIschemic', src: '79', lines: [
    'Refleks iskemik medula: respons darurat saat tekanan di bawah 60 mmHg.',
    'Medula mendeteksi CO₂ naik dan pH turun.',
    'Simpatis diaktifkan kuat, tekanan naik, perfusi otak pulih.',
  ]},
  { id: 'raas', ch: 6, v: 'RAAS', src: '80–81',
    notes: [{ at: 4, text: 'Slide hlm 80: "Angiotensin II acts on the hypothalamus to increase aldosterone production". Aldosteron dibuat korteks adrenal; Ang II merangsangnya langsung di sana (sesuai gambar slide hlm 81).' }],
    lines: [
    'Kontrol hormonal: jangka panjang.',
    X('Ginjal melepas renin; angiotensinogen dari hati menjadi angiotensin I.'),
    'ACE di paru membentuk angiotensin II.',
    'Angiotensin II: vasokonstriktor kuat dan pemicu haus.',
    'Ia juga menaikkan aldosteron, yang menahan Na⁺ dan air.',
  ]},
  { id: 'hormones', ch: 6, v: 'Hormones', src: '80–81', lines: [
    'ANP dan BNP berlawanan: membuang Na⁺ dan air, vasodilatasi, tekanan turun.',
    'Juga menekan renin dan aldosteron.',
    'ADH menahan air; kadar tinggi menyebabkan vasokonstriksi.',
    'Epinefrin dan norepinefrin lewat reseptor alfa: vasokonstriksi.',
    X('Penghambat ACE dan diuretik bekerja di sistem ini.'),
  ]},
  { id: 'integration', ch: 6, v: 'Integration', src: '63–65', lines: [
    'Integrasi: MAP sama dengan CO kali TPR.',
    'CO bergantung pada denyut, volume sekuncup, dan aliran balik vena. TPR pada radius dan viskositas.',
    X('Perdarahan: volume turun, CO turun, MAP turun.'),
    X('Detik: baroreflex menaikkan simpatis.'),
    X('Jam: angiotensin II, aldosteron, dan ADH memulihkan volume.'),
    'Autoregulasi menjaga otak dan jantung.',
  ]},
  { id: 'recap6', ch: 6, v: 'Recap', p: { qa: [
      ['Saraf apa yang membawa sinyal dari sinus karotis?', 'Glosofaringeus (CN IX).'],
      ['Hormon apa yang menurunkan tekanan darah?', 'ANP & BNP (peptida natriuretik).'],
    ] }, lines: [
    'Uji pemahaman bab enam.',
    'Saraf dari sinus karotis? CN IX.',
    'Hormon penurun tekanan? ANP dan BNP.',
  ]},

  // ───────────────────────── RINGKASAN & KUIS ─────────────────────────
  { id: 'ch7', ch: 7, v: 'ChapterTitle', p: { img: 'cover.png' }, lines: [
    'Bagian akhir. Ringkasan dan latihan soal.',
  ]},
  { id: 'cmap', ch: 7, v: 'ConceptMap', lines: [
    'Ini peta konsep fisiologi vaskular.',
    'Jantung menciptakan tekanan, arteri menyimpannya, arteriol mengatur resistensi.',
    'Kapiler bertukar zat, limfatik mengalirkan sisa cairan.',
    'Vena menyimpan dan mengembalikan darah.',
    'Semua diatur agar MAP stabil.',
  ]},
  { id: 'formulas', ch: 7, v: 'Formulas', lines: [
    'Rumus penting.',
    'Aliran sama dengan ΔP dibagi R.',
    'Resistensi berbanding terbalik r⁴.',
    'Tekanan nadi dan MAP.',
    'CO dan MAP.',
    'Dan tekanan filtrasi bersih Starling.',
  ]},
  { id: 'table', ch: 7, v: 'VesselTable', lines: [
    'Tabel perbandingan lima jenis pembuluh darah.',
    'Arteri: elastis, reservoir tekanan.',
    'Arteriol: resistensi.',
    'Kapiler: pertukaran.',
    'Venula mengumpulkan, vena menyimpan.',
  ]},
  { id: 'regsum', ch: 7, v: 'RegSummary', lines: [
    'Ringkasan regulasi tekanan darah.',
    'Seketika: kontrol lokal.',
    'Detik: refleks saraf.',
    'Menit hingga jam: hormon.',
  ]},
  { id: 'quizintro', ch: 7, v: 'QuizIntro', lines: [
    'Sepuluh soal klinis. Jawab sebelum waktu habis.',
  ]},
  ...[
    ['Pria 70 tahun dengan aterosklerosis bertekanan darah 170/80 mmHg. Apa penyebab utama tekanan nadinya yang lebar?',
      ['Komplians arteri meningkat', 'Komplians arteri menurun', 'Volume sekuncup menurun', 'Vasodilatasi arteriol'], 1,
      'Arteri yang kaku kehilangan fungsi reservoir tekanan, sehingga sistolik naik. Tekanan nadinya 90 mmHg, tergolong tinggi.'],
    ['Tekanan darah seorang pasien 120/80 mmHg. Berapa MAP-nya?',
      ['100 mmHg', '93 mmHg', '87 mmHg', '110 mmHg'], 1,
      'MAP sama dengan 80 ditambah sepertiga dari 40, yaitu sekitar 93 mmHg, bukan nilai tengah 100.'],
    ['Vasokonstriksi membuat radius arteriol menjadi setengahnya, dengan gradien tekanan tetap. Aliran menjadi berapa?',
      ['1/2', '1/4', '1/8', '1/16'], 3,
      'Menurut hukum Poiseuille, resistensi naik enam belas kali, sehingga aliran turun menjadi seperenam belas.'],
    ['Pasien sirosis dengan albumin rendah mengalami edema. Gaya Starling apa yang paling berubah?',
      ['Pc meningkat', 'πp menurun', 'Pif meningkat', 'πif menurun'], 1,
      'Albumin rendah menurunkan tekanan osmotik koloid plasma, reabsorpsi berkurang, dan cairan menumpuk di interstisial.'],
    ['Seseorang berdiri mendadak dan merasa pusing sesaat. Respons baroreflex yang tepat adalah?',
      ['Aktivitas simpatis turun', 'Impuls baroreseptor meningkat', 'Simpatis naik, denyut jantung naik, vasokonstriksi', 'Parasimpatis naik'], 2,
      'Tekanan turun, impuls baroreseptor berkurang, sehingga simpatis naik dan parasimpatis turun untuk memulihkan tekanan.'],
    ['Serat aferen dari baroreseptor sinus karotis berjalan melalui saraf apa?',
      ['CN X (vagus)', 'CN IX (glosofaringeus)', 'CN VII (fasialis)', 'CN XII (hipoglosus)'], 1,
      'Sinus karotis lewat saraf sembilan, glosofaringeus. Arkus aorta lewat saraf sepuluh, vagus.'],
    ['Pasien syok hemoragik dengan tekanan darah di bawah 60 mmHg. Refleks darurat apa yang aktif kuat?',
      ['Refleks iskemik medula', 'Pelepasan ANP', 'Vasodilatasi simpatis', 'Penurunan ADH'], 0,
      'Perfusi otak yang rendah dideteksi medula, lalu simpatis diaktifkan kuat untuk menaikkan tekanan darah.'],
    ['Pada gagal jantung, atrium teregang dan melepaskan hormon yang menimbulkan natriuresis dan vasodilatasi. Hormon apa?',
      ['Aldosteron', 'Angiotensin II', 'ANP', 'ADH'], 2,
      'ANP meningkatkan ekskresi natrium dan air serta vasodilatasi, sehingga tekanan darah turun.'],
    ['Pasien tirah baring lama mengalami penurunan aliran balik vena dari tungkai. Mekanisme apa yang paling berkurang?',
      ['Pompa otot rangka', 'Isapan jantung', 'Pompa respirasi', 'Venokonstriksi simpatis'], 0,
      'Tanpa kontraksi otot tungkai, vena tidak tertekan, sehingga darah lebih mudah menggenang.'],
    ['Kapiler organ mana yang paling bocor, bersifat diskontinu?',
      ['Otak', 'Otot rangka', 'Ginjal', 'Hati'], 3,
      'Kapiler hati diskontinu dan paling permeabel; kapiler otak paling rapat.'],
  ].map(([q, opts, ans, why], i) => ({
    id: `quiz${i + 1}`, ch: 7, v: 'Quiz', p: { n: i + 1, q, opts, ans, why }, lines: [
      `Soal ${i + 1}. ${q}`,
      { s: '', silent: 5 },
      `Yap, jawabannya ${'ABCD'[ans]}! ${why}`,
    ],
  })),
  { id: 'outro', ch: 7, v: 'Outro', lines: [
    'Selamat, kamu sudah menyelesaikan seluruh materi fisiologi vaskular.',
    'Tekanan mendorong aliran, radius mengatur resistensi, dan tubuh menjaga MAP.',
    'Semoga sukses belajar!',
  ]},
];

// Terapkan gaya narasi santai (narration_fun.mjs); jumlah kalimat harus sama agar animasi tetap sinkron.
export const scenes = baseScenes.map((sc) => {
  const f = fun[sc.id];
  if (!f) return sc;
  if (f.length !== sc.lines.length) throw new Error(`narration_fun: ${sc.id} punya ${f.length} kalimat, harus ${sc.lines.length}`);
  return { ...sc, lines: sc.lines.map((ln, i) => (typeof ln === 'string' ? f[i] : { ...ln, s: f[i] })) };
});
