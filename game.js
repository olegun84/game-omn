// ==================== SFX MANAGER ====================
class SFXManager {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API tidak tersedia');
    }
  }

  playTone(frequency, duration, type = 'square', volume = 0.15) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  playShoot() { this.init(); this.playTone(800, 0.1, 'square', 0.12); setTimeout(() => this.playTone(600, 0.08, 'square', 0.1), 50); }
  playCorrect() { this.init(); this.playTone(523, 0.1, 'sine', 0.15); setTimeout(() => this.playTone(659, 0.1, 'sine', 0.15), 100); setTimeout(() => this.playTone(784, 0.15, 'sine', 0.15), 200); }
  playWrong() { this.init(); this.playTone(200, 0.15, 'sawtooth', 0.12); setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.12), 150); }
  playCombo() { this.init(); this.playTone(880, 0.08, 'sine', 0.12); setTimeout(() => this.playTone(1100, 0.08, 'sine', 0.12), 80); setTimeout(() => this.playTone(1320, 0.12, 'sine', 0.12), 160); }
  playWaveStart() { this.init(); [440, 554, 659, 880].forEach((freq, i) => { setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.12), i * 100); }); }
  playGameOver() { this.init(); [400, 350, 300, 200].forEach((freq, i) => { setTimeout(() => this.playTone(freq, 0.2, 'sawtooth', 0.1), i * 150); }); }
  playEnemyHit() { this.init(); this.playTone(300, 0.05, 'square', 0.1); this.playTone(150, 0.1, 'square', 0.08); }
  playButton() { this.init(); this.playTone(600, 0.05, 'sine', 0.1); }
  playStartGame() { this.init(); [262, 330, 392, 523].forEach((freq, i) => { setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.12), i * 120); }); }
  playTimeout() { this.init(); this.playTone(400, 0.1, 'triangle', 0.1); setTimeout(() => this.playTone(300, 0.15, 'triangle', 0.1), 100); }
}

const sfx = new SFXManager();

// ==================== KISI-KISI SOAL PER KELAS ====================
const KISI_KISI = {
  1: {
    nama: 'Kelas 1',
    topik: [
      { nama: 'Penjumlahan 1-10', generator: () => {
        const a = randInt(1, 9), b = randInt(1, 10 - a);
        return { text: `${a} + ${b} = ?`, answer: (a + b).toString() };
      }},
      { nama: 'Pengurangan 1-10', generator: () => {
        const a = randInt(2, 10), b = randInt(1, a - 1);
        return { text: `${a} - ${b} = ?`, answer: (a - b).toString() };
      }},
      { nama: 'Bilangan 1-20', generator: () => {
        const n = randInt(1, 20);
        return { text: `Angka setelah ${n} adalah?`, answer: (n + 1).toString() };
      }},
      { nama: 'Bilangan Sebelum', generator: () => {
        const n = randInt(2, 20);
        return { text: `Angka sebelum ${n} adalah?`, answer: (n - 1).toString() };
      }},
      { nama: 'Nilai Tempat Satuan', generator: () => {
        const satuan = randInt(1, 9), puluhan = randInt(1, 9);
        const num = puluhan * 10 + satuan;
        return { text: `Angka satuan dari ${num} adalah?`, answer: satuan.toString() };
      }},
      { nama: 'Nilai Tempat Puluhan', generator: () => {
        const satuan = randInt(0, 9), puluhan = randInt(1, 9);
        const num = puluhan * 10 + satuan;
        return { text: `Angka puluhan dari ${num} adalah?`, answer: puluhan.toString() };
      }},
      { nama: 'Membandingkan Bilangan', generator: () => {
        const a = randInt(1, 20), b = randInt(1, 20);
        if (a === b) return { text: `${a} ... ${b} (sama/tidak)`, answer: 'sama' };
        const bigger = Math.max(a, b);
        return { text: `Mana yang lebih besar: ${a} atau ${b}?`, answer: bigger.toString() };
      }},
      { nama: 'Penjumlahan 3 Angka', generator: () => {
        const a = randInt(1, 5), b = randInt(1, 5), c = randInt(1, 5);
        return { text: `${a} + ${b} + ${c} = ?`, answer: (a + b + c).toString() };
      }},
    ]
  },
  2: {
    nama: 'Kelas 2',
    topik: [
      { nama: 'Penjumlahan 1-50', generator: () => {
        const a = randInt(10, 40), b = randInt(1, 50 - a);
        return { text: `${a} + ${b} = ?`, answer: (a + b).toString() };
      }},
      { nama: 'Pengurangan 1-50', generator: () => {
        const a = randInt(20, 50), b = randInt(1, a - 1);
        return { text: `${a} - ${b} = ?`, answer: (a - b).toString() };
      }},
      { nama: 'Perkalian 2-5', generator: () => {
        const a = randInt(2, 5), b = randInt(1, 10);
        return { text: `${a} × ${b} = ?`, answer: (a * b).toString() };
      }},
      { nama: 'Pembagian Sederhana', generator: () => {
        const b = randInt(2, 5), answer = randInt(1, 10);
        const a = b * answer;
        return { text: `${a} ÷ ${b} = ?`, answer: answer.toString() };
      }},
      { nama: 'Nilai Tempat Ratusan', generator: () => {
        const r = randInt(1, 9), p = randInt(0, 9), s = randInt(0, 9);
        const num = r * 100 + p * 10 + s;
        return { text: `Angka ratusan dari ${num} adalah?`, answer: r.toString() };
      }},
      { nama: 'Penjumlahan Bersusun', generator: () => {
        const a = randInt(20, 80), b = randInt(10, 99 - a);
        return { text: `${a} + ${b} = ?`, answer: (a + b).toString() };
      }},
      { nama: 'Pengurangan Bersusun', generator: () => {
        const a = randInt(50, 99), b = randInt(10, a - 10);
        return { text: `${a} - ${b} = ?`, answer: (a - b).toString() };
      }},
      { nama: 'Bilangan Genap/Ganjil', generator: () => {
        const n = randInt(1, 50);
        const jenis = n % 2 === 0 ? 'genap' : 'ganjil';
        return { text: `${n} termasuk bilangan?`, answer: jenis };
      }},
    ]
  },
  3: {
    nama: 'Kelas 3',
    topik: [
      { nama: 'Perkalian 1-10', generator: () => {
        const a = randInt(2, 10), b = randInt(2, 10);
        return { text: `${a} × ${b} = ?`, answer: (a * b).toString() };
      }},
      { nama: 'Pembagian 1-10', generator: () => {
        const b = randInt(2, 10), answer = randInt(2, 10);
        return { text: `${b * answer}  ${b} = ?`, answer: answer.toString() };
      }},
      { nama: 'Penjumlahan 3 Angka', generator: () => {
        const a = randInt(100, 500), b = randInt(100, 999 - a);
        return { text: `${a} + ${b} = ?`, answer: (a + b).toString() };
      }},
      { nama: 'Pengurangan 3 Angka', generator: () => {
        const a = randInt(300, 999), b = randInt(100, a - 100);
        return { text: `${a} - ${b} = ?`, answer: (a - b).toString() };
      }},
      { nama: 'Pecahan Sederhana', generator: () => {
        const penyebut = randInt(2, 8);
        return { text: `1/${penyebut} + 1/${penyebut} = ?/${penyebut}`, answer: '2' };
      }},
      { nama: 'Perbandingan Pecahan', generator: () => {
        const p = randInt(2, 6);
        return { text: `Mana lebih besar: 1/2 atau 1/${p}? (jawaban: 1/2 atau 1/${p})`, answer: p > 2 ? '1/2' : '1/' + p };
      }},
      { nama: 'Satuan Panjang', generator: () => {
        const m = randInt(1, 10);
        return { text: `${m} meter = ... cm`, answer: (m * 100).toString() };
      }},
      { nama: 'Satuan Berat', generator: () => {
        const kg = randInt(1, 10);
        return { text: `${kg} kg = ... gram`, answer: (kg * 1000).toString() };
      }},
      { nama: 'Keliling Persegi', generator: () => {
        const s = randInt(2, 10);
        return { text: `Keliling persegi sisi ${s} cm = ... cm`, answer: (s * 4).toString() };
      }},
    ]
  },
  4: {
    nama: 'Kelas 4',
    topik: [
      { nama: 'Perkalian 2 Angka', generator: () => {
        const a = randInt(10, 30), b = randInt(2, 9);
        return { text: `${a} × ${b} = ?`, answer: (a * b).toString() };
      }},
      { nama: 'Pembagian 2 Angka', generator: () => {
        const b = randInt(2, 9), answer = randInt(10, 30);
        return { text: `${b * answer} ÷ ${b} = ?`, answer: answer.toString() };
      }},
      { nama: 'KPK Sederhana', generator: () => {
        const pairs = [[2,3,6],[2,4,4],[3,4,12],[2,5,10],[3,5,15],[4,6,12]];
        const [a, b, kpk] = pairs[randInt(0, pairs.length - 1)];
        return { text: `KPK dari ${a} dan ${b} adalah?`, answer: kpk.toString() };
      }},
      { nama: 'FPB Sederhana', generator: () => {
        const pairs = [[4,6,2],[6,9,3],[8,12,4],[10,15,5],[12,18,6]];
        const [a, b, fpb] = pairs[randInt(0, pairs.length - 1)];
        return { text: `FPB dari ${a} dan ${b} adalah?`, answer: fpb.toString() };
      }},
      { nama: 'Pecahan Senilai', generator: () => {
        const a = randInt(1, 5), k = randInt(2, 4);
        return { text: `${a}/${a+1} = ${a*k}/... (penyebut)`, answer: ((a+1)*k).toString() };
      }},
      { nama: 'Penjumlahan Pecahan', generator: () => {
        const p = randInt(2, 6);
        const a = randInt(1, p-1), b = randInt(1, p-a);
        return { text: `${a}/${p} + ${b}/${p} = .../${p}`, answer: (a+b).toString() };
      }},
      { nama: 'Luas Persegi Panjang', generator: () => {
        const p = randInt(3, 12), l = randInt(2, 8);
        return { text: `Luas persegi panjang ${p}×${l} cm = ... cm²`, answer: (p*l).toString() };
      }},
      { nama: 'Keliling Persegi Panjang', generator: () => {
        const p = randInt(3, 10), l = randInt(2, 8);
        return { text: `Keliling (${p}+${l})×2 = ... cm`, answer: ((p+l)*2).toString() };
      }},
      { nama: 'Sudut Siku-siku', generator: () => {
        return { text: 'Berapa derajat sudut siku-siku?', answer: '90' };
      }},
      { nama: 'Konversi Satuan', generator: () => {
        const km = randInt(1, 5);
        return { text: `${km} km = ... m`, answer: (km * 1000).toString() };
      }},
    ]
  },
  5: {
    nama: 'Kelas 5',
    topik: [
      { nama: 'Desimal ke Pecahan', generator: () => {
        const pairs = [['0.5','1/2'],['0.25','1/4'],['0.75','3/4'],['0.2','1/5'],['0.1','1/10']];
        const [d, p] = pairs[randInt(0, pairs.length - 1)];
        return { text: `${d} = ... (pecahan)`, answer: p };
      }},
      { nama: 'Persen Sederhana', generator: () => {
        const pairs = [['50%','1/2'],['25%','1/4'],['75%','3/4'],['20%','1/5'],['10%','1/10']];
        const [p, f] = pairs[randInt(0, pairs.length - 1)];
        return { text: `${p} = ... (pecahan)`, answer: f };
      }},
      { nama: 'Luas Segitiga', generator: () => {
        const a = randInt(4, 12), t = randInt(3, 10);
        return { text: `Luas segitiga alas ${a}, tinggi ${t} = ... (alas×tinggi÷2)`, answer: (a*t/2).toString() };
      }},
      { nama: 'Volume Kubus', generator: () => {
        const s = randInt(2, 5);
        return { text: `Volume kubus sisi ${s} cm = ... cm³`, answer: (s*s*s).toString() };
      }},
      { nama: 'Volume Balok', generator: () => {
        const p = randInt(2, 5), l = randInt(2, 4), t = randInt(2, 4);
        return { text: `Volume balok ${p}×${l}×${t} = ... cm³`, answer: (p*l*t).toString() };
      }},
      { nama: 'Rata-rata', generator: () => {
        const nums = [randInt(2,8), randInt(2,8), randInt(2,8)];
        const sum = nums.reduce((a,b) => a+b, 0);
        if (sum % 3 !== 0) return { text: `Rata-rata ${nums[0]}, ${nums[1]}, ${nums[2]} = ...`, answer: (sum/3).toFixed(1) };
        return { text: `Rata-rata ${nums[0]}, ${nums[1]}, ${nums[2]} = ...`, answer: (sum/3).toString() };
      }},
      { nama: 'Operasi Campuran', generator: () => {
        const a = randInt(2, 10), b = randInt(2, 5), c = randInt(1, 5);
        return { text: `${a} + ${b} × ${c} = ? (kerjakan perkalian dulu)`, answer: (a + b*c).toString() };
      }},
      { nama: 'Skala Peta', generator: () => {
        const skala = randInt(1, 5);
        const cm = randInt(2, 10);
        return { text: `Skala 1:${skala*100}, jarak ${cm} cm = ... m sebenarnya`, answer: (skala * cm).toString() };
      }},
      { nama: 'Konversi Liter', generator: () => {
        const l = randInt(1, 5);
        return { text: `${l} liter = ... ml`, answer: (l * 1000).toString() };
      }},
    ]
  },
  6: {
    nama: 'Kelas 6',
    topik: [
      { nama: 'Bilangan Bulat Negatif', generator: () => {
        const a = randInt(1, 10), b = randInt(1, 10);
        return { text: `${-a} + ${b} = ?`, answer: (b - a).toString() };
      }},
      { nama: 'Pengurangan Bilangan Bulat', generator: () => {
        const a = randInt(1, 15), b = randInt(1, 10);
        return { text: `${a} - (-${b}) = ?`, answer: (a + b).toString() };
      }},
      { nama: 'Perkalian Bilangan Bulat', generator: () => {
        const a = randInt(2, 8), b = randInt(2, 8);
        return { text: `${-a} × ${b} = ?`, answer: (-a*b).toString() };
      }},
      { nama: 'Pangkat Dua', generator: () => {
        const n = randInt(2, 12);
        return { text: `${n}² = ?`, answer: (n*n).toString() };
      }},
      { nama: 'Akar Kuadrat', generator: () => {
        const n = randInt(2, 12);
        return { text: `√${n*n} = ?`, answer: n.toString() };
      }},
      { nama: 'Rasio/Perbandingan', generator: () => {
        const a = randInt(2, 5), b = randInt(2, 5), k = randInt(2, 5);
        return { text: `Perbandingan ${a}:${b}, jika yang pertama ${a*k}, yang kedua = ?`, answer: (b*k).toString() };
      }},
      { nama: 'Debit Air', generator: () => {
        const volume = randInt(10, 50), waktu = randInt(2, 5);
        if (volume % waktu !== 0) return { text: `Volume ${volume}L dalam ${waktu} menit, debit = ... L/menit`, answer: (volume/waktu).toFixed(1) };
        return { text: `Volume ${volume}L dalam ${waktu} menit, debit = ... L/menit`, answer: (volume/waktu).toString() };
      }},
      { nama: 'Luas Lingkaran', generator: () => {
        const r = randInt(1, 7);
        return { text: `Luas lingkaran r=${r}, π=3.14, = ... (3.14×r×r, bulatkan)`, answer: Math.round(3.14*r*r).toString() };
      }},
      { nama: 'Keliling Lingkaran', generator: () => {
        const r = randInt(1, 7);
        return { text: `Keliling lingkaran r=${r}, π=3.14, = ... (2×3.14×r, bulatkan)`, answer: Math.round(2*3.14*r).toString() };
      }},
      { nama: 'Volume Tabung', generator: () => {
        const r = randInt(1, 3), t = randInt(5, 10);
        return { text: `Volume tabung r=${r}, t=${t}, π=3.14 = ... (bulatkan)`, answer: Math.round(3.14*r*r*t).toString() };
      }},
      { nama: 'Modus Data', generator: () => {
        const data = [3, 5, 5, 7, 8, 5, 9];
        return { text: `Modus dari 3,5,5,7,8,5,9 = ?`, answer: '5' };
      }},
      { nama: 'Median Data', generator: () => {
        return { text: `Median dari 2,4,6,8,10 = ?`, answer: '6' };
      }},
    ]
  }
};

// ==================== HELPER FUNCTIONS ====================
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==================== SOAL GENERATOR ====================
class SoalGenerator {
  constructor(kelas) {
    this.kelas = kelas; // 'SEMUA KELAS' atau angka 1-6
    this.usedQuestions = new Set(); // Track soal yang sudah dipakai
  }

  generate() {
    let availableKelas = [];
    
    if (this.kelas === 'SEMUA KELAS') {
      availableKelas = [1, 2, 3, 4, 5, 6];
    } else {
      availableKelas = [parseInt(this.kelas)];
    }

    // Pilih kelas random
    const selectedKelas = availableKelas[randInt(0, availableKelas.length - 1)];
    const kisi = KISI_KISI[selectedKelas];
    
    // Pilih topik random
    const topikIndex = randInt(0, kisi.topik.length - 1);
    const topik = kisi.topik[topikIndex];
    
    // Generate soal
    const soal = topik.generator();
    
    // Buat unique key untuk tracking
    const key = `${selectedKelas}-${topik.nama}-${soal.text}`;
    
    // Jika sudah pernah, generate ulang (max 3x)
    let attempts = 0;
    while (this.usedQuestions.has(key) && attempts < 3) {
      const newSoal = topik.generator();
      soal.text = newSoal.text;
      soal.answer = newSoal.answer;
      attempts++;
    }
    
    this.usedQuestions.add(key);
    
    // Generate pilihan jawaban
    const choices = this.generateChoices(soal.answer);
    
    return {
      text: soal.text,
      answer: soal.answer,
      choices: choices,
      topic: topik.nama,
      kelas: selectedKelas
    };
  }

  generateChoices(correctAnswer) {
    const choices = new Set([correctAnswer]);
    const isNumber = !isNaN(parseFloat(correctAnswer));
    
    let attempts = 0;
    while (choices.size < 4 && attempts < 50) {
      attempts++;
      
      if (isNumber) {
        const num = parseFloat(correctAnswer);
        const offset = randInt(1, Math.max(5, Math.abs(num)));
        const wrong = num + (Math.random() > 0.5 ? offset : -offset);
        const wrongStr = Number.isInteger(num) ? Math.round(wrong).toString() : wrong.toFixed(1);
        if (wrongStr !== correctAnswer && parseFloat(wrongStr) > 0) {
          choices.add(wrongStr);
        }
      } else {
        // Untuk jawaban teks, generate distractor
        const distractors = this.getTextDistractors(correctAnswer);
        const randomDistractor = distractors[randInt(0, distractors.length - 1)];
        if (randomDistractor !== correctAnswer) {
          choices.add(randomDistractor);
        }
      }
    }

    // Jika masih kurang dari 4, tambahkan default
    while (choices.size < 4) {
      choices.add(`Opsi ${choices.size + 1}`);
    }

    return shuffleArray([...choices]);
  }

  getTextDistractors(answer) {
    const distractorMap = {
      'genap': ['ganjil', 'prima', 'komposit'],
      'ganjil': ['genap', 'prima', 'komposit'],
      'sama': ['tidak sama', 'lebih besar', 'lebih kecil'],
      '1/2': ['1/3', '1/4', '2/3'],
      '1/4': ['1/2', '1/3', '3/4'],
      '3/4': ['1/2', '1/4', '2/3'],
      '1/5': ['1/2', '1/3', '1/4'],
      '1/10': ['1/5', '1/2', '1/3'],
      'puluhan': ['ratusan', 'satuan', 'ribuan'],
      'ratusan': ['puluhan', 'satuan', 'ribuan'],
      'satuan': ['puluhan', 'ratusan', 'ribuan'],
      'ribuan': ['ratusan', 'puluhan', 'satuan'],
      '5': ['3', '7', '9'],
      '6': ['4', '8', '10'],
      '90': ['45', '180', '360'],
    };
    return distractorMap[answer] || ['A', 'B', 'C'];
  }

  reset() {
    this.usedQuestions.clear();
  }
}

// ==================== MATH SHOOTER GAME ====================
class MathShooterGame {
  constructor(playerName, category) {
    this.playerName = playerName || 'Player';
    this.category = category || 'SEMUA KELAS';
    this.score = 0;
    this.combo = 0;
    this.wave = 1;
    this.defeats = 0;
    this.currentQuestion = 0;
    this.totalQuestions = 20;
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.playerX = 400;
    this.playerY = 540;
    this.gameActive = false;
    this.questionData = null;
    this.answerChoices = [];
    this.waveEnemies = [];
    this.keys = {};
    this.lastShot = 0;
    this.shootCooldown = 250;
    this.animFrameId = null;
    this.timerInterval = null;
    this.timeRemaining = 20;
    this.soalGenerator = new SoalGenerator(this.category);
  }

  init() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) {
      console.error('Canvas tidak ditemukan!');
      return false;
    }
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.playerX = this.canvas.width / 2;
    this.playerY = this.canvas.height - 80;
    this.setupEventListeners();
    this.gameActive = true;
    this.nextQuestion();
    this.gameLoop();
    return true;
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.shoot();
      }
      sfx.init();
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
    document.addEventListener('click', () => sfx.init(), { once: true });
  }

  nextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion > this.totalQuestions) {
      this.endGame();
      return;
    }

    // Generate soal baru dari generator
    this.questionData = this.soalGenerator.generate();
    this.answerChoices = this.questionData.choices || [];
    
    if (!Array.isArray(this.answerChoices) || this.answerChoices.length === 0) {
      this.answerChoices = ['A', 'B', 'C', 'D'];
    }

    this.updateUI();
    this.startWave();
    this.startQuestionTimer();
  }

  startQuestionTimer() {
    this.clearQuestionTimer();
    this.timeRemaining = 20;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      if (this.timeRemaining <= 5 && this.timeRemaining > 0) {
        // Warning sound
        if (this.timeRemaining === 5) sfx.playTimeout();
      }

      if (this.timeRemaining <= 0) {
        this.clearQuestionTimer();
        this.handleTimeout();
      }
    }, 1000);
  }

  clearQuestionTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) {
      timerEl.textContent = `⏱️ ${this.timeRemaining}s`;
      timerEl.style.color = this.timeRemaining <= 5 ? '#e74c3c' : '#00ff88';
    }
  }

  handleTimeout() {
    sfx.playTimeout();
    this.combo = 0;
    this.defeats++;
    this.updateUI();

    this.enemies.forEach(enemy => {
      if (enemy.alive) {
        enemy.alive = false;
        this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#e74c3c');
      }
    });

    this.showTimeoutMessage();

    setTimeout(() => {
      this.hideTimeoutMessage();
      this.nextQuestion();
    }, 2000);
  }

  showTimeoutMessage() {
    let msgEl = document.getElementById('timeoutMessage');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'timeoutMessage';
      msgEl.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(231, 76, 60, 0.95);
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 100;
        pointer-events: none;
        text-align: center;
      `;
      const container = this.canvas.parentElement;
      if (container) {
        container.style.position = 'relative';
        container.appendChild(msgEl);
      }
    }
    msgEl.innerHTML = '⏰ WAKTU HABIS!<br><small style="font-size:0.8rem">Jawaban: ' + this.questionData.answer + '</small>';
    msgEl.style.display = 'block';
  }

  hideTimeoutMessage() {
    const msgEl = document.getElementById('timeoutMessage');
    if (msgEl) msgEl.style.display = 'none';
  }

  startWave() {
    this.waveEnemies = [];
    this.enemies = [];
    sfx.playWaveStart();

    const canvasWidth = this.canvas.width;
    const spacing = canvasWidth / (this.answerChoices.length + 1);

    this.answerChoices.forEach((choice, index) => {
      const enemy = {
        x: spacing * (index + 1) - 40,
        y: 80 + Math.random() * 100,
        width: 80,
        height: 60,
        speed: 0.3 + Math.random() * 0.3,
        answer: choice,
        isCorrect: choice === this.questionData.answer,
        alive: true,
        color: this.getEnemyColor(index),
        bounceOffset: Math.random() * Math.PI * 2
      };
      this.waveEnemies.push(enemy);
      this.enemies.push(enemy);
    });

    this.showQuestion();
  }

  showQuestion() {
    const questionEl = document.getElementById('questionText');
    const topicEl = document.getElementById('topicLabel');
    const kelasEl = document.getElementById('kelasLabel');

    if (questionEl) questionEl.textContent = this.questionData.text;
    if (topicEl) topicEl.textContent = this.questionData.topic;
    if (kelasEl) kelasEl.textContent = `Kelas ${this.questionData.kelas}`;

    this.answerChoices.forEach((choice, index) => {
      const enemy = this.waveEnemies[index];
      if (enemy) {
        enemy.answer = choice;
        enemy.isCorrect = (choice === this.questionData.answer);
      }
    });
  }

  getEnemyColor(index) {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
    return colors[index % colors.length];
  }

  shoot() {
    if (!this.gameActive) return;
    const now = Date.now();
    if (now - this.lastShot < this.shootCooldown) return;
    this.lastShot = now;
    sfx.playShoot();

    this.bullets.push({
      x: this.playerX,
      y: this.playerY - 20,
      width: 6,
      height: 15,
      speed: 8
    });
  }

  update() {
    if (!this.gameActive) return;

    if (this.keys['ArrowLeft'] || this.keys['a']) this.playerX -= 5;
    if (this.keys['ArrowRight'] || this.keys['d']) this.playerX += 5;
    this.playerX = Math.max(30, Math.min(this.canvas.width - 30, this.playerX));

    this.bullets = this.bullets.filter(bullet => {
      bullet.y -= bullet.speed;
      return bullet.y > -20;
    });

    this.enemies.forEach(enemy => {
      if (enemy.alive) {
        enemy.y += enemy.speed;
        enemy.bounceOffset += 0.05;

        if (enemy.y > this.canvas.height - 60) {
          enemy.alive = false;
          if (enemy.isCorrect) {
            this.defeats++;
            this.combo = 0;
            sfx.playWrong();
            this.updateUI();
            this.clearQuestionTimer();
            setTimeout(() => this.nextQuestion(), 1000);
          }
        }
      }
    });

    this.bullets.forEach(bullet => {
      this.enemies.forEach(enemy => {
        if (!enemy.alive) return;
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          bullet.y = -100;
          enemy.alive = false;
          sfx.playEnemyHit();

          if (enemy.isCorrect) {
            this.combo++;
            const comboMultiplier = Math.min(this.combo, 5);
            this.score += 100 * comboMultiplier;
            sfx.playCorrect();
            if (this.combo >= 3) sfx.playCombo();
            this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#2ecc71');
            this.clearQuestionTimer();
            setTimeout(() => this.nextQuestion(), 1000);
          } else {
            this.combo = 0;
            this.defeats++;
            sfx.playWrong();
            this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#e74c3c');
          }
          this.updateUI();
        }
      });
    });

    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      p.vy += 0.1;
      return p.life > 0;
    });

    if (this.defeats >= 5) {
      this.gameOver();
    }
  }

  createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color,
        size: Math.random() * 4 + 2
      });
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137) % w;
      const y = (i * 97) % h;
      ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.2;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#1a3a1a';
    ctx.fillRect(0, h - 60, w, 60);
    ctx.fillStyle = '#2d5a2d';
    for (let i = 0; i < w; i += 40) {
      ctx.fillRect(i, h - 60, 2, 60);
    }

    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.moveTo(this.playerX, this.playerY - 25);
    ctx.lineTo(this.playerX - 20, this.playerY + 15);
    ctx.lineTo(this.playerX + 20, this.playerY + 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f1c40f';
    this.bullets.forEach(bullet => {
      ctx.shadowColor = '#f1c40f';
      ctx.shadowBlur = 10;
      ctx.fillRect(bullet.x - 3, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    this.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      const bounceY = Math.sin(enemy.bounceOffset) * 3;
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y + bounceY, enemy.width, enemy.height);
      ctx.strokeStyle = enemy.isCorrect ? '#2ecc71' : '#e74c3c';
      ctx.lineWidth = 3;
      ctx.strokeRect(enemy.x, enemy.y + bounceY, enemy.width, enemy.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(enemy.answer, enemy.x + enemy.width / 2, enemy.y + bounceY + enemy.height / 2);
    });

    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  updateUI() {
    const scoreEl = document.getElementById('scoreDisplay');
    const comboEl = document.getElementById('comboDisplay');
    const waveEl = document.getElementById('waveDisplay');
    const defeatEl = document.getElementById('defeatDisplay');
    const questionNumEl = document.getElementById('questionNum');
    const progressBar = document.getElementById('progressBar');

    if (scoreEl) scoreEl.textContent = this.score;
    if (comboEl) comboEl.textContent = `${this.combo}x`;
    if (waveEl) waveEl.textContent = this.wave;
    if (defeatEl) defeatEl.textContent = this.defeats;
    if (questionNumEl) questionNumEl.textContent = `SOAL ${this.currentQuestion} / ${this.totalQuestions}`;
    if (progressBar) {
      const pct = (this.currentQuestion / this.totalQuestions) * 100;
      progressBar.style.width = `${pct}%`;
    }
  }

  gameOver() {
    this.gameActive = false;
    this.clearQuestionTimer();
    sfx.playGameOver();
    const overlay = document.getElementById('gameOverOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const finalScore = document.getElementById('finalScore');
      if (finalScore) finalScore.textContent = this.score;
      const endTitle = document.getElementById('endTitle');
      if (endTitle) endTitle.textContent = ' GAME OVER';
    }
  }

  endGame() {
    this.gameActive = false;
    this.clearQuestionTimer();
    sfx.playCorrect();
    const overlay = document.getElementById('gameOverOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const finalScore = document.getElementById('finalScore');
      if (finalScore) finalScore.textContent = this.score;
      const endTitle = document.getElementById('endTitle');
      if (endTitle) endTitle.textContent = '🎉 SELESAI!';
    }
  }

  restart() {
    this.score = 0;
    this.combo = 0;
    this.wave = 1;
    this.defeats = 0;
    this.currentQuestion = 0;
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.gameActive = true;
    this.answerChoices = [];
    this.waveEnemies = [];
    this.playerX = this.canvas.width / 2;
    this.soalGenerator.reset();

    const overlay = document.getElementById('gameOverOverlay');
    if (overlay) overlay.style.display = 'none';

    this.hideTimeoutMessage();
    sfx.playButton();
    this.nextQuestion();
  }

  destroy() {
    this.gameActive = false;
    this.clearQuestionTimer();
    this.hideTimeoutMessage();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  gameLoop() {
    if (!this.gameActive) return;
    this.update();
    this.render();
    this.animFrameId = requestAnimationFrame(() => this.gameLoop());
  }
}

// ==================== APP CONTROLLER ====================
let game = null;

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const startBtn = document.getElementById('startBtn');
  const playerNameInput = document.getElementById('playerName');
  const categorySelect = document.getElementById('categorySelect');
  const restartBtn = document.getElementById('restartBtn');
  const backToMenuBtn = document.getElementById('backToMenuBtn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      sfx.playStartGame();
      const playerName = playerNameInput?.value?.trim() || 'Player';
      const category = categorySelect?.value || 'SEMUA KELAS';

      if (startScreen) startScreen.style.display = 'none';
      if (gameScreen) gameScreen.style.display = 'block';

      setTimeout(() => {
        game = new MathShooterGame(playerName, category);
        const success = game.init();
        if (!success) {
          console.error('Gagal menginisialisasi game!');
          alert('Gagal memuat game. Refresh halaman.');
        }
      }, 100);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      sfx.playButton();
      if (game) game.restart();
    });
  }

  if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
      sfx.playButton();
      if (game) game.destroy();
      game = null;
      if (gameScreen) gameScreen.style.display = 'none';
      if (startScreen) startScreen.style.display = 'block';
      const overlay = document.getElementById('gameOverOverlay');
      if (overlay) overlay.style.display = 'none';
    });
  }

  document.addEventListener('click', () => sfx.init(), { once: true });
});
