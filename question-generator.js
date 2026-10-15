// ============================================================
// QUESTION GENERATOR ENGINE - OMN 2026
// Generate soal tak terbatas dengan solusi langkah demi langkah
// ============================================================

const QuestionGenerator = {
  
  // Helper: Random integer
  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  // Helper: Pilih random dari array
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  
  // Helper: Generate opsi jawaban
  generateOptions(correct, type = 'number', spread = 5) {
    const options = new Set([correct]);
    let attempts = 0;
    
    while (options.size < 4 && attempts < 50) {
      attempts++;
      let wrong;
      
      if (type === 'number') {
        const offset = this.rand(1, spread) * (Math.random() > 0.5 ? 1 : -1);
        wrong = typeof correct === 'number' ? correct + offset : correct;
        if (wrong < 0 && correct >= 0) wrong = correct + this.rand(1, spread);
      } else if (type === 'decimal') {
        const offset = (this.rand(1, 5) / 10) * (Math.random() > 0.5 ? 1 : -1);
        wrong = Math.round((parseFloat(correct) + offset) * 100) / 100;
      } else {
        wrong = correct + this.rand(1, 3);
      }
      
      if (wrong !== correct && wrong >= 0) {
        options.add(typeof correct === 'number' && Number.isInteger(correct) ? Math.round(wrong) : wrong);
      }
    }
    
    // Fallback jika masih kurang
    let filler = typeof correct === 'number' ? correct + 10 : correct + 10;
    while (options.size < 4) {
      options.add(filler);
      filler += 1;
    }
    
    const opts = Array.from(options).slice(0, 4);
    return opts.sort(() => Math.random() - 0.5);
  },
  
  // Helper: Format soal dengan opsi
  buildQuestion(question, correctAnswer, topic, solution, quickTip, optionsType = 'number', spread = 5) {
    let options;
    let correctStr = String(correctAnswer);
    
    if (optionsType === 'custom') {
      // Options sudah termasuk dalam correctAnswer (untuk soal khusus)
      return {
        question,
        options: correctAnswer.options,
        correct_answer: correctAnswer.correctIndex,
        topic,
        solution,
        quick_tip: quickTip
      };
    }
    
    options = this.generateOptions(correctAnswer, optionsType, spread);
    
    // Pastikan correct ada di options
    if (!options.map(String).includes(correctStr)) {
      options[this.rand(0, 3)] = correctAnswer;
    }
    
    return {
      question,
      options: options.map(String),
      correct_answer: options.map(String).indexOf(correctStr),
      topic,
      solution,
      quick_tip: quickTip
    };
  },

  // ============================================================
  // GRADE 1 GENERATORS
  // ============================================================
  grade1: {
    polaBilangan() {
      const start = QuestionGenerator.rand(1, 10);
      const step = QuestionGenerator.pick([1, 2, 3]);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const answer = start + step * 4;
      
      return QuestionGenerator.buildQuestion(
        `Lanjutkan pola: ${seq.join(', ')}, ...?`,
        answer,
        'Pola Bilangan',
        [
          `Perhatikan pola angka: ${seq.join(', ')}`,
          `Hitung selisih: ${seq[1]} - ${seq[0]} = ${step}`,
          `Pola bertambah ${step} setiap langkah`,
          `Jadi: ${seq[3]} + ${step} = ${answer}`
        ],
        `Cari selisih antar angka yang berurutan. Jika selisihnya sama, tinggal tambahkan!`
      );
    },
    
    penjumlahanCerita() {
      const benda = QuestionGenerator.pick(['apel', 'permen', 'kelereng', 'pensil', 'buku']);
      const a = QuestionGenerator.rand(3, 10);
      const b = QuestionGenerator.rand(2, 8);
      const answer = a + b;
      
      return QuestionGenerator.buildQuestion(
        `Ibu punya ${a} ${benda}. Dibelinya lagi ${b} ${benda}. Berapa total ${benda} Ibu?`,
        answer,
        'Penjumlahan',
        [
          `Identifikasi: ${benda} awal = ${a}`,
          `Kata "dibeli lagi" berarti ditambah`,
          `Ditambah: ${b} ${benda}`,
          `Hitung: ${a} + ${b} = ${answer}`,
          `Jadi totalnya ${answer} ${benda}`
        ],
        `Kata kunci: "dibeli lagi", "diberi", "mendapat" = penjumlahan (+)`
      );
    },
    
    penguranganCerita() {
      const benda = QuestionGenerator.pick(['permen', 'kue', 'bola', 'stiker']);
      const a = QuestionGenerator.rand(8, 15);
      const b = QuestionGenerator.rand(2, Math.min(6, a - 1));
      const answer = a - b;
      
      return QuestionGenerator.buildQuestion(
        `Adi punya ${a} ${benda}. Diberikan ${b} kepada teman. Sisa ${benda} Adi?`,
        answer,
        'Pengurangan',
        [
          `Identifikasi: ${benda} awal = ${a}`,
          `Kata "diberikan" berarti dikurang`,
          `Dikurangi: ${b} ${benda}`,
          `Hitung: ${a} - ${b} = ${answer}`,
          `Jadi sisanya ${answer} ${benda}`
        ],
        `Kata kunci: "diberikan", "hilang", "dimakan" = pengurangan (-)`
      );
    },
    
    perbandingan() {
      let a = QuestionGenerator.rand(5, 20);
      let b = QuestionGenerator.rand(5, 20);
      while (a === b) b = QuestionGenerator.rand(5, 20);
      
      const bigger = Math.max(a, b);
      
      return {
        question: `Mana yang lebih besar? ${a} atau ${b}?`,
        options: [String(a), String(b), 'Sama', 'Tidak tahu'],
        correct_answer: [String(a), String(b)].indexOf(String(bigger)),
        topic: 'Perbandingan',
        solution: [
          `Bandingkan kedua angka: ${a} dan ${b}`,
          `Lihat angka puluhan dan satuan`,
          `${bigger} lebih besar dari ${Math.min(a, b)}`,
          `Jadi jawabannya ${bigger}`
        ],
        quick_tip: `Angka dengan nilai lebih tinggi adalah yang lebih besar. Hitung dari kiri!`
      };
    },
    
    logikaTebakAngka() {
      const target = QuestionGenerator.rand(3, 10);
      const before = target - 1;
      const after = target + 1;
      
      return {
        question: `Aku angka di antara ${before} dan ${after}. Angka berapa aku?`,
        options: [String(before - 1), String(target), String(after), String(target + 2)].sort(() => Math.random() - 0.5),
        correct_answer: [String(before - 1), String(target), String(after), String(target + 2)].sort(() => Math.random() - 0.5).indexOf(String(target)),
        topic: 'Logika',
        solution: [
          `Angka di antara ${before} dan ${after}`,
          `Urutan: ${before}, ?, ${after}`,
          `Angka setelah ${before} adalah ${target}`,
          `Cek: ${target} sebelum ${after}? Ya!`
        ],
        quick_tip: `Angka "di antara" adalah angka yang berada tepat setelah angka pertama dan sebelum angka kedua`
      };
    }
  },

  // ============================================================
  // GRADE 2 GENERATORS
  // ============================================================
  grade2: {
    skipCounting() {
      const step = QuestionGenerator.pick([2, 3, 4, 5, 10]);
      const start = step;
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const answer = start + step * 4;
      
      return QuestionGenerator.buildQuestion(
        `Skip counting: ${seq.join(', ')}, ...?`,
        answer,
        'Skip Counting',
        [
          `Pola loncat: ${seq.join(', ')}`,
          `Selisih: ${seq[1]} - ${seq[0]} = ${step}`,
          `Setiap angka bertambah ${step}`,
          `${seq[3]} + ${step} = ${answer}`
        ],
        `Skip counting = menghitung loncat. Cari selisihnya, lalu tambahkan ke angka terakhir!`
      );
    },
    
    penjumlahan2Digit() {
      const a = QuestionGenerator.rand(100, 500);
      const b = QuestionGenerator.rand(100, 400);
      const answer = a + b;
      
      return QuestionGenerator.buildQuestion(
        `${a} + ${b} = ...?`,
        answer,
        'Penjumlahan',
        [
          `Susun ke bawah:`,
          `  ${a}`,
          `+ ${b}`,
          `------`,
          `Satuan: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}`,
          `Puluhan: ${Math.floor((a % 100) / 10)} + ${Math.floor((b % 100) / 10)}${((a % 10) + (b % 10) >= 10) ? ' + 1 (simpanan)' : ''}`,
          `Ratusan: ${Math.floor(a / 100)} + ${Math.floor(b / 100)}`,
          `Hasil: ${answer}`
        ],
        `Susun ke bawah, mulai dari satuan. Jika lebih dari 9, simpan di kolom berikutnya!`,
        'number',
        100
      );
    },
    
    perkalian() {
      const a = QuestionGenerator.rand(2, 5);
      const b = QuestionGenerator.rand(2, 5);
      const answer = a * b;
      
      return QuestionGenerator.buildQuestion(
        `${a} × ${b} = ...?`,
        answer,
        'Perkalian',
        [
          `Perkalian = penjumlahan berulang`,
          `${a} × ${b} artinya ${b} sebanyak ${a} kali`,
          `${Array(a).fill(b).join(' + ')} = ${answer}`,
          `Jadi ${a} × ${b} = ${answer}`
        ],
        `${a} × ${b} = ${b} + ${b} + ... (${a} kali). Hafalkan perkalian dasar 1-10!`
      );
    },
    
    pembagian() {
      const b = QuestionGenerator.rand(2, 5);
      const answer = QuestionGenerator.rand(2, 6);
      const a = b * answer;
      
      return QuestionGenerator.buildQuestion(
        `${a} ÷ ${b} = ...?`,
        answer,
        'Pembagian',
        [
          `Pembagian = membagi rata`,
          `${a} dibagi menjadi ${b} kelompok`,
          `Cari: ${b} × ? = ${a}`,
          `${b} × ${answer} = ${a}`,
          `Jadi ${a} ÷ ${b} = ${answer}`
        ],
        `Pembagian adalah kebalikan perkalian. Cari angka yang jika dikalikan ${b} hasilnya ${a}!`
      );
    },
    
    nilaiTempat() {
      const digits = QuestionGenerator.rand(100, 999);
      const positions = ['satuan', 'puluhan', 'ratusan'];
      const posIndex = QuestionGenerator.rand(0, 2);
      const digit = parseInt(String(digits)[2 - posIndex]);
      
      const posName = positions[posIndex];
      const nilai = posIndex === 0 ? digit : posIndex === 1 ? digit * 10 : digit * 100;
      
      return QuestionGenerator.buildQuestion(
        `Pada angka ${digits}, angka ${digit} menempati nilai tempat apa?`,
        posName,
        'Nilai Tempat',
        [
          `Angka ${digits} terdiri dari:`,
          `${String(digits)[0]} = ratusan (${String(digits)[0]} × 100 = ${String(digits)[0] * 100})`,
          `${String(digits)[1]} = puluhan (${String(digits)[1]} × 10 = ${String(digits)[1] * 10})`,
          `${String(digits)[2]} = satuan (${String(digits)[2]} × 1 = ${String(digits)[2]})`,
          `Angka ${digit} ada di posisi ${posName}`
        ],
        `Dari kanan ke kiri: satuan → puluhan → ratusan → ribuan`,
        'custom',
        {
          options: ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan'],
          correctIndex: posIndex
        }
      );
    }
  },

  // ============================================================
  // GRADE 3 GENERATORS
  // ============================================================
  grade3: {
    operasiCampuran() {
      const a = QuestionGenerator.rand(10, 30);
      const b = QuestionGenerator.rand(2, 5);
      const c = QuestionGenerator.rand(2, 5);
      const answer = a + b * c;
      
      return QuestionGenerator.buildQuestion(
        `${a} + ${b} × ${c} = ...?`,
        answer,
        'Operasi Campuran',
        [
          `Ingat urutan operasi: perkalian/pembagian dulu, baru penjumlahan/pengurangan`,
          `Kerjakan perkalian dulu: ${b} × ${c} = ${b * c}`,
          `Lalu penjumlahan: ${a} + ${b * c}`,
          `Hasil: ${answer}`
        ],
        `KABATAKU: Kali, Bagi, Tambah, Kurang. Kerjakan perkalian/pembagian terlebih dahulu!`
      );
    },
    
    pecahanSederhana() {
      const types = [
        { q: '1/2 atau 1/4', a: '1/2', s: ['Pecahan dengan penyebut lebih kecil nilainya lebih besar', '1/2 = setengah, 1/4 = seperempat', 'Setengah lebih besar dari seperempat'] },
        { q: '2/3 atau 1/3', a: '2/3', s: ['Penyebut sama, bandingkan pembilang', '2 > 1, jadi 2/3 > 1/3'] },
        { q: '3/4 atau 1/4', a: '3/4', s: ['Penyebut sama, bandingkan pembilang', '3 > 1, jadi 3/4 > 1/4'] }
      ];
      
      const type = QuestionGenerator.pick(types);
      
      return {
        question: `Mana yang lebih besar? ${type.q}?`,
        options: type.q.split(' atau '),
        correct_answer: type.q.split(' atau ').indexOf(type.a),
        topic: 'Pecahan',
        solution: type.s,
        quick_tip: `Jika penyebut sama, pembilang lebih besar = pecahan lebih besar. Jika pembilang sama, penyebut lebih kecil = pecahan lebih besar.`
      };
    },
    
    kelilingPersegi() {
      const sisi = QuestionGenerator.rand(4, 12);
      const answer = sisi * 4;
      
      return QuestionGenerator.buildQuestion(
        `Keliling persegi dengan sisi ${sisi} cm adalah?`,
        answer,
        'Keliling',
        [
          `Persegi punya 4 sisi sama panjang`,
          `Rumus keliling persegi: K = 4 × sisi`,
          `K = 4 × ${sisi}`,
          `K = ${answer} cm`
        ],
        `Keliling persegi = 4 × sisi. Cukup kalikan sisi dengan 4!`,
        'number',
        10
      );
    },
    
    analogi() {
      const a = QuestionGenerator.rand(2, 5);
      const b = a * 2;
      const c = QuestionGenerator.rand(3, 7);
      const answer = c * 2;
      
      return QuestionGenerator.buildQuestion(
        `${a} : ${b} = ${c} : ...?`,
        answer,
        'Analogi',
        [
          `Cari hubungan: ${a} menjadi ${b}`,
          `${a} × 2 = ${b} (dikali 2)`,
          `Terapkan pola yang sama: ${c} × 2`,
          `${c} × 2 = ${answer}`
        ],
        `Cari dulu hubungan antara pasangan pertama, lalu terapkan ke pasangan kedua!`
      );
    }
  },

  // ============================================================
  // GRADE 4 GENERATORS
  // ============================================================
  grade4: {
    operasiBesar() {
      const a = QuestionGenerator.rand(1000, 2000);
      const b = QuestionGenerator.rand(3, 9);
      const answer = a * b;
      
      return QuestionGenerator.buildQuestion(
        `${a.toLocaleString()} × ${b} = ...?`,
        answer,
        'Operasi Bilangan',
        [
          `Kalikan dengan metode susun:`,
          `${a} × ${b}`,
          `= (${Math.floor(a / 1000)}000 × ${b}) + (${a % 1000} × ${b})`,
          `= ${Math.floor(a / 1000) * b * 1000} + ${(a % 1000) * b}`,
          `= ${answer}`
        ],
        `Pecah angka besar: kalikan ribuan dan ratusan terpisah, lalu jumlahkan!`,
        'number',
        1000
      );
    },
    
    pecahanSenilai() {
      const pembilang = QuestionGenerator.rand(1, 3);
      const penyebut = QuestionGenerator.rand(2, 4);
      const pengali = QuestionGenerator.rand(2, 4);
      const answer = pembilang * pengali;
      
      return QuestionGenerator.buildQuestion(
        `${pembilang}/${penyebut} = .../${penyebut * pengali} (pecahan senilai)`,
        answer,
        'Pecahan Senilai',
        [
          `Pecahan senilai: pembilang dan penyebut dikalikan angka yang sama`,
          `Penyebut: ${penyebut} × ${pengali} = ${penyebut * pengali}`,
          `Maka pembilang juga dikali ${pengali}`,
          `${pembilang} × ${pengali} = ${answer}`
        ],
        `Jika penyebut dikali X, pembilang juga harus dikali X agar senilai!`
      );
    },
    
    kelilingPersegiPanjang() {
      const p = QuestionGenerator.rand(8, 20);
      const l = QuestionGenerator.rand(4, 12);
      const answer = 2 * (p + l);
      
      return QuestionGenerator.buildQuestion(
        `Keliling persegi panjang dengan p=${p} cm, l=${l} cm?`,
        answer,
        'Keliling',
        [
          `Rumus keliling persegi panjang: K = 2 × (p + l)`,
          `K = 2 × (${p} + ${l})`,
          `K = 2 × ${p + l}`,
          `K = ${answer} cm`
        ],
        `Keliling = jumlah semua sisi. Persegi panjang punya 2 panjang dan 2 lebar: 2×(p+l)`
      );
    },
    
    luasPersegiPanjang() {
      const p = QuestionGenerator.rand(8, 15);
      const l = QuestionGenerator.rand(5, 12);
      const answer = p * l;
      
      return QuestionGenerator.buildQuestion(
        `Luas persegi panjang dengan p=${p} cm, l=${l} cm?`,
        answer,
        'Luas',
        [
          `Rumus luas persegi panjang: L = p × l`,
          `L = ${p} × ${l}`,
          `L = ${answer} cm²`
        ],
        `Luas persegi panjang = panjang × lebar. Satuannya cm² (persegi)!`,
        'number',
        20
      );
    },
    
    sudut() {
      const types = [
        { q: 'Sudut kurang dari 90° disebut?', a: 'Lancip', s: ['Sudut lancip: 0° < x < 90°', 'Contoh: 30°, 45°, 60°'] },
        { q: 'Sudut tepat 90° disebut?', a: 'Siku-siku', s: ['Sudut siku-siku = 90°', 'Seperti sudut pada buku atau meja'] },
        { q: 'Sudut lebih dari 90° tapi kurang dari 180° disebut?', a: 'Tumpul', s: ['Sudut tumpul: 90° < x < 180°', 'Contoh: 100°, 120°, 150°'] },
        { q: 'Sudut tepat 180° disebut?', a: 'Lurus', s: ['Sudut lurus = 180°', 'Seperti garis lurus'] }
      ];
      
      const type = QuestionGenerator.pick(types);
      
      return {
        question: type.q,
        options: ['Lancip', 'Siku-siku', 'Tumpul', 'Lurus'],
        correct_answer: ['Lancip', 'Siku-siku', 'Tumpul', 'Lurus'].indexOf(type.a),
        topic: 'Sudut',
        solution: type.s,
        quick_tip: `Lancip < 90° | Siku-siku = 90° | Tumpul 90°-180° | Lurus = 180°`
      };
    }
  },

  // ============================================================
  // GRADE 5 GENERATORS
  // ============================================================
  grade5: {
    fpb() {
      const pairs = [
        { a: 12, b: 18, fpb: 6 }, { a: 24, b: 36, fpb: 12 },
        { a: 15, b: 20, fpb: 5 }, { a: 28, b: 42, fpb: 14 },
        { a: 16, b: 24, fpb: 8 }, { a: 30, b: 45, fpb: 15 }
      ];
      
      const pair = QuestionGenerator.pick(pairs);
      
      return QuestionGenerator.buildQuestion(
        `FPB dari ${pair.a} dan ${pair.b} adalah?`,
        pair.fpb,
        'FPB',
        [
          `Faktorkan ${pair.a}: ${QuestionGenerator.getFactors(pair.a).join(', ')}`,
          `Faktorkan ${pair.b}: ${QuestionGenerator.getFactors(pair.b).join(', ')}`,
          `Cari faktor persekutuan terbesar`,
          `FPB(${pair.a}, ${pair.b}) = ${pair.fpb}`
        ],
        `FPB = Faktor Persekutuan Terbesar. Cari faktor yang sama dan paling besar!`
      );
    },
    
    kpk() {
      const pairs = [
        { a: 4, b: 6, kpk: 12 }, { a: 3, b: 5, kpk: 15 },
        { a: 6, b: 8, kpk: 24 }, { a: 4, b: 10, kpk: 20 },
        { a: 5, b: 15, kpk: 15 }, { a: 6, b: 9, kpk: 18 }
      ];
      
      const pair = QuestionGenerator.pick(pairs);
      
      return QuestionGenerator.buildQuestion(
        `KPK dari ${pair.a} dan ${pair.b} adalah?`,
        pair.kpk,
        'KPK',
        [
          `Kelipatan ${pair.a}: ${pair.a}, ${pair.a * 2}, ${pair.a * 3}, ${pair.a * 4}, ...`,
          `Kelipatan ${pair.b}: ${pair.b}, ${pair.b * 2}, ${pair.b * 3}, ...`,
          `Cari kelipatan yang sama dan paling kecil`,
          `KPK(${pair.a}, ${pair.b}) = ${pair.kpk}`
        ],
        `KPK = Kelipatan Persekutuan terKecil. Daftar kelipatan, cari yang sama dan terkecil!`
      );
    },
    
    operasiPecahan() {
      const types = [
        () => {
          const a = QuestionGenerator.rand(1, 3);
          const c = QuestionGenerator.rand(1, 3);
          const b = QuestionGenerator.rand(4, 8);
          const answer = `${a + c}/${b}`;
          return {
            q: `${a}/${b} + ${c}/${b} = ...?`,
            a: answer,
            s: [`Penyebut sudah sama: ${b}`, `Jumlahkan pembilang: ${a} + ${c} = ${a + c}`, `Hasil: ${(a + c)}/${b}`],
            t: `Jika penyebut sama, cukup jumlahkan pembilangnya!`
          };
        },
        () => {
          const a = QuestionGenerator.pick([1, 2, 3]);
          const b = QuestionGenerator.pick([2, 3, 4]);
          const c = QuestionGenerator.pick([1, 2]);
          const d = QuestionGenerator.pick([3, 4, 5]);
          const pembilang = a * d + c * b;
          const penyebut = b * d;
          return {
            q: `${a}/${b} + ${c}/${d} = ...?`,
            a: `${pembilang}/${penyebut}`,
            s: [`Penyebut berbeda, samakan dulu`, `KPK dari ${b} dan ${d} = ${b * d}`, `${a}/${b} = ${a * d}/${b * d}`, `${c}/${d} = ${c * b}/${d * b}`, `Jumlahkan: ${a * d}/${b * d} + ${c * b}/${b * d} = ${pembilang}/${penyebut}`],
            t: `Samakan penyebut dengan KPK, baru jumlahkan pembilang!`
          };
        }
      ];
      
      const gen = QuestionGenerator.pick(types);
      const result = gen();
      
      return {
        question: result.q,
        options: [result.a, `${QuestionGenerator.rand(1, 5)}/${QuestionGenerator.rand(5, 9)}`, `${QuestionGenerator.rand(1, 4)}/${QuestionGenerator.rand(3, 7)}`, `${QuestionGenerator.rand(2, 6)}/${QuestionGenerator.rand(4, 8)}`].sort(() => Math.random() - 0.5),
        correct_answer: [result.a, `${QuestionGenerator.rand(1, 5)}/${QuestionGenerator.rand(5, 9)}`, `${QuestionGenerator.rand(1, 4)}/${QuestionGenerator.rand(3, 7)}`, `${QuestionGenerator.rand(2, 6)}/${QuestionGenerator.rand(4, 8)}`].sort(() => Math.random() - 0.5).indexOf(result.a),
        topic: 'Pecahan',
        solution: result.s,
        quick_tip: result.t
      };
    },
    
    volumeBalok() {
      const p = QuestionGenerator.rand(4, 10);
      const l = QuestionGenerator.rand(3, 8);
      const t = QuestionGenerator.rand(2, 6);
      const answer = p * l * t;
      
      return QuestionGenerator.buildQuestion(
        `Volume balok dengan p=${p}, l=${l}, t=${t} cm?`,
        answer,
        'Volume',
        [
          `Rumus volume balok: V = p × l × t`,
          `V = ${p} × ${l} × ${t}`,
          `V = ${p * l} × ${t}`,
          `V = ${answer} cm³`
        ],
        `Volume balok = panjang × lebar × tinggi. Satuannya cm³ (kubik)!`
      );
    },
    
    persen() {
      const persen = QuestionGenerator.pick([10, 20, 25, 50, 75]);
      const angka = QuestionGenerator.pick([100, 200, 400, 500]);
      const answer = (persen / 100) * angka;
      
      return QuestionGenerator.buildQuestion(
        `${persen}% dari ${angka} adalah?`,
        answer,
        'Persen',
        [
          `${persen}% artinya ${persen}/100`,
          `${persen}% dari ${angka} = ${persen}/100 × ${angka}`,
          `= ${persen} × ${angka / 100}`,
          `= ${answer}`
        ],
        `Persen = per seratus. Kalikan angka dengan persen, lalu bagi 100!`
      );
    }
  },

  // ============================================================
  // GRADE 6 GENERATORS
  // ============================================================
  grade6: {
    bilanganPrima() {
      const prima = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
      const bukanPrima = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25, 27];
      
      const correct = QuestionGenerator.pick(prima);
      const options = [correct];
      while (options.length < 4) {
        const wrong = QuestionGenerator.pick(bukanPrima);
        if (!options.includes(wrong)) options.push(wrong);
      }
      
      return {
        question: `Manakah bilangan prima?`,
        options: options.sort(() => Math.random() - 0.5).map(String),
        correct_answer: options.sort(() => Math.random() - 0.5).map(String).indexOf(String(correct)),
        topic: 'Bilangan Prima',
        solution: [
          `Bilangan prima hanya punya 2 faktor: 1 dan dirinya sendiri`,
          `Cek ${correct}: hanya bisa dibagi 1 dan ${correct}`,
          `Angka lain punya faktor tambahan`,
          `Jadi ${correct} adalah bilangan prima`
        ],
        quick_tip: `Bilangan prima: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31... (hafalkan!)`
      };
    },
    
    rasio() {
      const r1 = QuestionGenerator.rand(2, 5);
      const r2 = r1 + QuestionGenerator.rand(1, 4);
      const pengali = QuestionGenerator.rand(2, 5);
      const nilai1 = r1 * pengali;
      const answer = r2 * pengali;
      
      return QuestionGenerator.buildQuestion(
        `Perbandingan A:B = ${r1}:${r2}. Jika A = ${nilai1}, maka B = ...?`,
        answer,
        'Rasio',
        [
          `Rasio A:B = ${r1}:${r2}`,
          `A = ${nilai1}, cari pengali: ${nilai1} ÷ ${r1} = ${pengali}`,
          `Terapkan ke B: ${r2} × ${pengali}`,
          `B = ${answer}`
        ],
        `Cari dulu pengalinya (nilai diketahui ÷ rasio), lalu kalikan ke rasio yang ditanya!`
      );
    },
    
    mean() {
      const nums = Array.from({ length: 5 }, () => QuestionGenerator.rand(4, 12));
      const sum = nums.reduce((a, b) => a + b, 0);
      const answer = sum / 5;
      
      return QuestionGenerator.buildQuestion(
        `Mean (rata-rata) dari ${nums.join(', ')}?`,
        answer,
        'Statistik',
        [
          `Rumus mean = jumlah semua data ÷ banyak data`,
          `Jumlah: ${nums.join(' + ')} = ${sum}`,
          `Banyak data: 5`,
          `Mean = ${sum} ÷ 5 = ${answer}`
        ],
        `Mean = jumlahkan semua angka, lalu bagi dengan banyaknya angka!`,
        'decimal',
        3
      );
    },
    
    peluangDadu() {
      const types = [
        { q: 'Peluang muncul angka genap pada dadu?', a: '1/2', s: ['Dadu punya 6 sisi: 1,2,3,4,5,6', 'Genap: 2,4,6 = 3 angka', 'Peluang = 3/6 = 1/2'] },
        { q: 'Peluang muncul angka 5 pada dadu?', a: '1/6', s: ['Dadu punya 6 sisi', 'Angka 5 hanya ada 1', 'Peluang = 1/6'] },
        { q: 'Peluang muncul angka kurang dari 3 pada dadu?', a: '1/3', s: ['Kurang dari 3: 1, 2 = 2 angka', 'Peluang = 2/6 = 1/3'] }
      ];
      
      const type = QuestionGenerator.pick(types);
      
      return {
        question: type.q,
        options: ['1/6', '1/3', '1/2', '2/3'],
        correct_answer: ['1/6', '1/3', '1/2', '2/3'].indexOf(type.a),
        topic: 'Peluang',
        solution: type.s,
        quick_tip: `Peluang = kejadian yang diinginkan ÷ total kemungkinan`
      };
    },
    
    aljabarDasar() {
      const x = QuestionGenerator.rand(3, 10);
      const b = QuestionGenerator.rand(2, 8);
      const hasil = x + b;
      
      return QuestionGenerator.buildQuestion(
        `Jika x + ${b} = ${hasil}, maka x = ...?`,
        x,
        'Aljabar',
        [
          `Persamaan: x + ${b} = ${hasil}`,
          `Untuk mencari x, kurangkan kedua ruas dengan ${b}`,
          `x = ${hasil} - ${b}`,
          `x = ${x}`
        ],
        `Pindahkan angka ke sisi lain dengan operasi kebalikan (+ jadi -, × jadi ÷)`
      );
    }
  },

  // ============================================================
  // GRADE 7 GENERATORS
  // ============================================================
  grade7: {
    bilanganBulat() {
      const a = QuestionGenerator.rand(-15, -5);
      const b = QuestionGenerator.rand(10, 20);
      const c = QuestionGenerator.rand(-5, 5);
      const answer = a + b + c;
      
      return QuestionGenerator.buildQuestion(
        `${a} + ${b} ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = ...?`,
        answer,
        'Bilangan Bulat',
        [
          `Kerjakan dari kiri ke kanan`,
          `${a} + ${b} = ${a + b}`,
          `${a + b} ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = ${answer}`,
          `Hasil: ${answer}`
        ],
        `Negatif + Positif: kurangkan, tanda ikut yang lebih besar. Bayangkan sebagai hutang dan uang!`
      );
    },
    
    plsv() {
      const x = QuestionGenerator.rand(3, 12);
      const a = QuestionGenerator.rand(2, 5);
      const b = QuestionGenerator.rand(1, 10);
      const hasil = a * x + b;
      
      return QuestionGenerator.buildQuestion(
        `Penyelesaian ${a}x + ${b} = ${hasil} adalah x = ...?`,
        x,
        'PLSV',
        [
          `Persamaan: ${a}x + ${b} = ${hasil}`,
          `Kurangkan ${b} dari kedua ruas: ${a}x = ${hasil} - ${b} = ${hasil - b}`,
          `Bagi dengan ${a}: x = ${hasil - b} ÷ ${a}`,
          `x = ${x}`
        ],
        `Isolasikan x: pindahkan angka dulu (kurang/tambah), baru bagi dengan koefisien x!`
      );
    },
    
    proporsi() {
      const workers1 = QuestionGenerator.pick([2, 3, 4, 5]);
      const days1 = QuestionGenerator.pick([6, 8, 10, 12]);
      const workers2 = workers1 * 2;
      const answer = days1 / 2;
      
      return QuestionGenerator.buildQuestion(
        `Jika ${workers1} pekerja selesai dalam ${days1} hari, berapa hari jika ${workers2} pekerja?`,
        answer,
        'Perbandingan Terbalik',
        [
          `Ini perbandingan terbalik (semakin banyak pekerja, semakin cepat)`,
          `Rumus: pekerja₁ × hari₁ = pekerja₂ × hari₂`,
          `${workers1} × ${days1} = ${workers2} × hari₂`,
          `${workers1 * days1} = ${workers2} × hari₂`,
          `hari₂ = ${workers1 * days1} ÷ ${workers2} = ${answer}`
        ],
        `Perbandingan terbalik: kalikan yang diketahui, lalu bagi dengan nilai baru!`
      );
    },
    
    garisSudut() {
      const sudut = QuestionGenerator.rand(30, 70);
      const answer = 180 - sudut;
      
      return QuestionGenerator.buildQuestion(
        `Dua sudut berpelurus. Jika satu sudut ${sudut}°, sudut lainnya?`,
        answer,
        'Garis & Sudut',
        [
          `Sudut berpelurus berjumlah 180°`,
          `Sudut 1 + Sudut 2 = 180°`,
          `${sudut}° + Sudut 2 = 180°`,
          `Sudut 2 = 180° - ${sudut}° = ${answer}°`
        ],
        `Berpelurus = 180°. Berpenyiku = 90°. Tinggal kurangkan!`
      );
    }
  },

  // ============================================================
  // GRADE 8 GENERATORS
  // ============================================================
  grade8: {
    spldv() {
      const x = QuestionGenerator.rand(3, 7);
      const y = QuestionGenerator.rand(1, 5);
      const sum = x + y;
      const diff = x - y;
      
      return QuestionGenerator.buildQuestion(
        `Jika x + y = ${sum} dan x - y = ${diff}, maka x = ...?`,
        x,
        'SPLDV',
        [
          `Persamaan 1: x + y = ${sum}`,
          `Persamaan 2: x - y = ${diff}`,
          `Jumlahkan kedua persamaan:`,
          `2x = ${sum} + ${diff} = ${sum + diff}`,
          `x = ${sum + diff} ÷ 2 = ${x}`
        ],
        `Metode eliminasi: jumlahkan/kurangkan kedua persamaan untuk menghilangkan satu variabel!`
      );
    },
    
    fungsi() {
      const a = QuestionGenerator.rand(2, 4);
      const b = QuestionGenerator.rand(1, 5);
      const input = QuestionGenerator.rand(3, 8);
      const answer = a * input + b;
      
      return QuestionGenerator.buildQuestion(
        `Jika f(x) = ${a}x + ${b}, maka f(${input}) = ...?`,
        answer,
        'Fungsi',
        [
          `f(x) = ${a}x + ${b}`,
          `Ganti x dengan ${input}:`,
          `f(${input}) = ${a}(${input}) + ${b}`,
          `= ${a * input} + ${b}`,
          `= ${answer}`
        ],
        `Fungsi: ganti variabel x dengan angka yang diminta, lalu hitung!`
      );
    },
    
    pythagoras() {
      const triples = [
        { a: 3, b: 4, c: 5 }, { a: 5, b: 12, c: 13 },
        { a: 6, b: 8, c: 10 }, { a: 8, b: 15, c: 17 },
        { a: 9, b: 12, c: 15 }, { a: 7, b: 24, c: 25 }
      ];
      
      const t = QuestionGenerator.pick(triples);
      
      return QuestionGenerator.buildQuestion(
        `Segitiga siku-siku dengan sisi ${t.a} dan ${t.b}. Sisi miring (hipotenusa)?`,
        t.c,
        'Pythagoras',
        [
          `Rumus Pythagoras: c² = a² + b²`,
          `c² = ${t.a}² + ${t.b}²`,
          `c² = ${t.a * t.a} + ${t.b * t.b}`,
          `c² = ${t.a * t.a + t.b * t.b}`,
          `c = √${t.c * t.c} = ${t.c}`
        ],
        `Hafalkan tripel Pythagoras: 3,4,5 | 5,12,13 | 6,8,10 | 8,15,17 | 7,24,25`
      );
    },
    
    statistika() {
      const nums = Array.from({ length: 7 }, () => QuestionGenerator.rand(3, 9));
      nums.sort((a, b) => a - b);
      const median = nums[3];
      
      return {
        question: `Median dari ${nums.join(', ')}?`,
        options: [String(nums[2]), String(median), String(nums[4]), String(nums[5])],
        correct_answer: [String(nums[2]), String(median), String(nums[4]), String(nums[5])].indexOf(String(median)),
        topic: 'Statistika',
        solution: [
          `Data sudah terurut: ${nums.join(', ')}`,
          `Median = nilai tengah`,
          `Ada 7 data, tengah ada di posisi ke-4`,
          `Data ke-4: ${median}`,
          `Median = ${median}`
        ],
        quick_tip: `Median = nilai tengah setelah data diurutkan. Untuk data ganjil, ambil yang paling tengah!`
      };
    }
  },

  // ============================================================
  // GRADE 9 GENERATORS
  // ============================================================
  grade9: {
    persamaanKuadrat() {
      const x1 = QuestionGenerator.rand(1, 4);
      const x2 = QuestionGenerator.rand(x1 + 1, 6);
      const b = -(x1 + x2);
      const c = x1 * x2;
      
      return {
        question: `Akar-akar dari x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x + ${c} = 0 adalah?`,
        options: [
          `x=${x1}, x=${x2}`,
          `x=${x1 + 1}, x=${x2 + 1}`,
          `x=-${x1}, x=-${x2}`,
          `x=${x1 - 1}, x=${x2 + 2}`
        ].sort(() => Math.random() - 0.5),
        correct_answer: [
          `x=${x1}, x=${x2}`,
          `x=${x1 + 1}, x=${x2 + 1}`,
          `x=-${x1}, x=-${x2}`,
          `x=${x1 - 1}, x=${x2 + 2}`
        ].sort(() => Math.random() - 0.5).indexOf(`x=${x1}, x=${x2}`),
        topic: 'Persamaan Kuadrat',
        solution: [
          `x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x + ${c} = 0`,
          `Cari dua angka yang jika dijumlah = ${-b} dan dikali = ${c}`,
          `Angka tersebut: ${x1} dan ${x2}`,
          `Cek: ${x1} + ${x2} = ${x1 + x2} = ${-b} ✓`,
          `Cek: ${x1} × ${x2} = ${x1 * x2} = ${c} ✓`,
          `Faktor: (x - ${x1})(x - ${x2}) = 0`,
          `Akar: x = ${x1} atau x = ${x2}`
        ],
        quick_tip: `Cari 2 angka: jumlah = -b, kali = c. Lalu faktorkan (x - angka1)(x - angka2) = 0`
      };
    },
    
    titikPuncak() {
      const xp = QuestionGenerator.rand(1, 4);
      const yp = QuestionGenerator.rand(-3, 3);
      const b = -2 * xp;
      const c = xp * xp + yp;
      
      return QuestionGenerator.buildQuestion(
        `Titik puncak y = x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} adalah?`,
        `(${xp}, ${yp})`,
        'Fungsi Kuadrat',
        [
          `Rumus titik puncak: x = -b/(2a)`,
          `a = 1, b = ${b}`,
          `x = -${b}/(2×1) = ${xp}`,
          `Substitusi x = ${xp}:`,
          `y = ${xp}² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}(${xp}) ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`,
          `y = ${xp * xp} ${b >= 0 ? '+' : '-'} ${Math.abs(b * xp)} ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = ${yp}`,
          `Titik puncak: (${xp}, ${yp})`
        ],
        `Titik puncak: x = -b/2a, lalu substitusi ke persamaan untuk dapat y!`,
        'custom',
        {
          options: [`(${xp}, ${yp})`, `(${xp + 1}, ${yp + 1})`, `(-${xp}, ${yp})`, `(${xp}, ${yp + 2})`],
          correctIndex: 0
        }
      );
    },
    
    trigonometri() {
      const types = [
        { q: 'sin 30°', a: '1/2', s: ['sin 30° = 1/2', 'Ini nilai dasar trigonometri yang harus dihafal'] },
        { q: 'cos 60°', a: '1/2', s: ['cos 60° = 1/2', 'cos 60° = sin 30°'] },
        { q: 'tan 45°', a: '1', s: ['tan 45° = sin 45°/cos 45° = 1', 'Sudut 45° selalu punya tan = 1'] },
        { q: 'sin 90°', a: '1', s: ['sin 90° = 1', 'Nilai maksimum sinus'] },
        { q: 'cos 0°', a: '1', s: ['cos 0° = 1', 'Nilai maksimum cosinus'] }
      ];
      
      const type = QuestionGenerator.pick(types);
      
      return {
        question: `Nilai ${type.q} = ...?`,
        options: ['0', '1/2', '√2/2', '1'].sort(() => Math.random() - 0.5),
        correct_answer: ['0', '1/2', '√2/2', '1'].sort(() => Math.random() - 0.5).indexOf(type.a),
        topic: 'Trigonometri',
        solution: type.s,
        quick_tip: `Hafalkan: sin 30°=1/2, sin 45°=√2/2, sin 60°=√3/2, sin 90°=1`
      };
    },
    
    deretAritmatika() {
      const a = QuestionGenerator.rand(2, 5);
      const b = QuestionGenerator.rand(2, 4);
      const n = QuestionGenerator.pick([10, 12, 15, 20]);
      const un = a + (n - 1) * b;
      const answer = n * (a + un) / 2;
      
      return QuestionGenerator.buildQuestion(
        `Jumlah ${n} suku pertama deret ${a} + ${a + b} + ${a + 2 * b} + ... adalah?`,
        answer,
        'Deret',
        [
          `Deret aritmatika: a = ${a}, beda = ${b}`,
          `Rumus jumlah: Sn = n/2 × (a + Un)`,
          `Cari Un dulu: Un = a + (n-1)b`,
          `U${n} = ${a} + (${n}-1)×${b} = ${a} + ${(n - 1) * b} = ${un}`,
          `S${n} = ${n}/2 × (${a} + ${un})`,
          `S${n} = ${n / 2} × ${a + un} = ${answer}`
        ],
        `Sn = n/2 × (a + Un). Cari suku terakhir dulu, baru gunakan rumus jumlah!`
      );
    }
  },

  // Helper: Get factors
  getFactors(n) {
    const factors = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) factors.push(i);
    }
    return factors;
  },

  // ============================================================
  // MAIN GENERATE FUNCTION
  // ============================================================
  generate(grade, count = 15) {
    const generators = this['grade' + grade];
    if (!generators) {
      return this.generateMixed(count);
    }
    
    const questions = [];
    const genKeys = Object.keys(generators);
    
    for (let i = 0; i < count; i++) {
      const genKey = genKeys[i % genKeys.length];
      try {
        const q = generators[genKey]();
        questions.push(q);
      } catch (e) {
        console.error(`Generator ${genKey} failed:`, e);
      }
    }
    
    return questions.sort(() => Math.random() - 0.5);
  },

  // Generate campuran semua kelas
  generateMixed(count = 15) {
    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const questions = [];
    
    for (let i = 0; i < count; i++) {
      const grade = grades[i % grades.length];
      const generators = this['grade' + grade];
      const genKeys = Object.keys(generators);
      const genKey = QuestionGenerator.pick(genKeys);
      
      try {
        const q = generators[genKey]();
        q.grade = grade;
        questions.push(q);
      } catch (e) {
        console.error('Mixed generator failed:', e);
      }
    }
    
    return questions.sort(() => Math.random() - 0.5);
  }
};

// Export untuk penggunaan global
if (typeof window !== 'undefined') {
  window.QuestionGenerator = QuestionGenerator;
}