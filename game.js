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
  playPop() { this.init(); this.playTone(1200, 0.08, 'sine', 0.15); setTimeout(() => this.playTone(800, 0.06, 'sine', 0.1), 40); }
  playJump() { this.init(); this.playTone(400, 0.1, 'sine', 0.12); setTimeout(() => this.playTone(600, 0.1, 'sine', 0.12), 50); }
  playFlip() { this.init(); this.playTone(500, 0.05, 'triangle', 0.1); }
  playLaser() { this.init(); this.playTone(1000, 0.15, 'sawtooth', 0.1); setTimeout(() => this.playTone(500, 0.1, 'sawtooth', 0.08), 50); }
  playCorrect() { this.init(); [523, 659, 784].forEach((f, i) => setTimeout(() => this.playTone(f, 0.1, 'sine', 0.15), i * 80)); }
  playWrong() { this.init(); this.playTone(200, 0.15, 'sawtooth', 0.12); setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.12), 150); }
  playCombo() { this.init(); [880, 1100, 1320].forEach((f, i) => setTimeout(() => this.playTone(f, 0.08, 'sine', 0.12), i * 60)); }
  playGameOver() { this.init(); [400, 350, 300, 200].forEach((f, i) => setTimeout(() => this.playTone(f, 0.2, 'sawtooth', 0.1), i * 150)); }
  playWin() { this.init(); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.15, 'sine', 0.15), i * 100)); }
  playStart() { this.init(); [262, 330, 392, 523].forEach((f, i) => setTimeout(() => this.playTone(f, 0.15, 'sine', 0.12), i * 120)); }
}

const sfx = new SFXManager();

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

// ==================== KISI-KISI SOAL ====================
const KISI_KISI = {
  1: {
    nama: 'Kelas 1',
    topik: [
      { nama: 'Penjumlahan 1-10', generator: () => { const a = randInt(1, 9), b = randInt(1, 10 - a); return { text: `${a} + ${b} = ?`, answer: (a + b).toString() }; }},
      { nama: 'Pengurangan 1-10', generator: () => { const a = randInt(2, 10), b = randInt(1, a - 1); return { text: `${a} - ${b} = ?`, answer: (a - b).toString() }; }},
      { nama: 'Bilangan Setelah', generator: () => { const n = randInt(1, 19); return { text: `Angka setelah ${n} adalah?`, answer: (n + 1).toString() }; }},
      { nama: 'Bilangan Sebelum', generator: () => { const n = randInt(2, 20); return { text: `Angka sebelum ${n} adalah?`, answer: (n - 1).toString() }; }},
      { nama: 'Nilai Tempat Satuan', generator: () => { const s = randInt(1, 9), p = randInt(1, 9); return { text: `Angka satuan dari ${p*10+s} adalah?`, answer: s.toString() }; }},
      { nama: 'Nilai Tempat Puluhan', generator: () => { const s = randInt(0, 9), p = randInt(1, 9); return { text: `Angka puluhan dari ${p*10+s} adalah?`, answer: p.toString() }; }},
      { nama: 'Membandingkan', generator: () => { let a = randInt(1, 20), b = randInt(1, 20); while(a===b) b = randInt(1, 20); return { text: `${a} atau ${b} lebih besar?`, answer: Math.max(a,b).toString() }; }},
    ]
  },
  2: {
    nama: 'Kelas 2',
    topik: [
      { nama: 'Penjumlahan 1-50', generator: () => { const a = randInt(10, 40), b = randInt(1, 50 - a); return { text: `${a} + ${b} = ?`, answer: (a + b).toString() }; }},
      { nama: 'Pengurangan 1-50', generator: () => { const a = randInt(20, 50), b = randInt(1, a - 1); return { text: `${a} - ${b} = ?`, answer: (a - b).toString() }; }},
      { nama: 'Perkalian 2-5', generator: () => { const a = randInt(2, 5), b = randInt(1, 10); return { text: `${a} × ${b} = ?`, answer: (a * b).toString() }; }},
      { nama: 'Pembagian', generator: () => { const b = randInt(2, 5), ans = randInt(1, 10); return { text: `${b*ans} ÷ ${b} = ?`, answer: ans.toString() }; }},
      { nama: 'Genap/Ganjil', generator: () => { const n = randInt(1, 50); return { text: `${n} termasuk bilangan?`, answer: n % 2 === 0 ? 'genap' : 'ganjil' }; }},
      { nama: 'Nilai Tempat Ratusan', generator: () => { const r = randInt(1, 9), p = randInt(0, 9), s = randInt(0, 9); return { text: `Angka ratusan dari ${r*100+p*10+s} adalah?`, answer: r.toString() }; }},
    ]
  },
  3: {
    nama: 'Kelas 3',
    topik: [
      { nama: 'Perkalian 1-10', generator: () => { const a = randInt(2, 10), b = randInt(2, 10); return { text: `${a} × ${b} = ?`, answer: (a * b).toString() }; }},
      { nama: 'Pembagian 1-10', generator: () => { const b = randInt(2, 10), ans = randInt(2, 10); return { text: `${b*ans} ÷ ${b} = ?`, answer: ans.toString() }; }},
      { nama: 'Penjumlahan 3 Angka', generator: () => { const a = randInt(100, 500), b = randInt(100, 999 - a); return { text: `${a} + ${b} = ?`, answer: (a + b).toString() }; }},
      { nama: 'Pengurangan 3 Angka', generator: () => { const a = randInt(300, 999), b = randInt(100, a - 100); return { text: `${a} - ${b} = ?`, answer: (a - b).toString() }; }},
      { nama: 'Satuan Panjang', generator: () => { const m = randInt(1, 10); return { text: `${m} meter = ... cm`, answer: (m * 100).toString() }; }},
      { nama: 'Satuan Berat', generator: () => { const kg = randInt(1, 10); return { text: `${kg} kg = ... gram`, answer: (kg * 1000).toString() }; }},
      { nama: 'Keliling Persegi', generator: () => { const s = randInt(2, 10); return { text: `Keliling persegi sisi ${s} cm = ?`, answer: (s * 4).toString() }; }},
    ]
  },
  4: {
    nama: 'Kelas 4',
    topik: [
      { nama: 'Perkalian 2 Angka', generator: () => { const a = randInt(10, 30), b = randInt(2, 9); return { text: `${a} × ${b} = ?`, answer: (a * b).toString() }; }},
      { nama: 'KPK', generator: () => { const pairs = [[2,3,6],[2,4,4],[3,4,12],[2,5,10],[3,5,15]]; const [a,b,k] = pairs[randInt(0, pairs.length-1)]; return { text: `KPK dari ${a} dan ${b} = ?`, answer: k.toString() }; }},
      { nama: 'FPB', generator: () => { const pairs = [[4,6,2],[6,9,3],[8,12,4],[10,15,5]]; const [a,b,f] = pairs[randInt(0, pairs.length-1)]; return { text: `FPB dari ${a} dan ${b} = ?`, answer: f.toString() }; }},
      { nama: 'Luas Persegi Panjang', generator: () => { const p = randInt(3, 12), l = randInt(2, 8); return { text: `Luas ${p}×${l} cm = ? cm²`, answer: (p*l).toString() }; }},
      { nama: 'Keliling Persegi Panjang', generator: () => { const p = randInt(3, 10), l = randInt(2, 8); return { text: `Keliling (${p}+${l})×2 = ?`, answer: ((p+l)*2).toString() }; }},
      { nama: 'Sudut Siku-siku', generator: () => { return { text: 'Berapa derajat sudut siku-siku?', answer: '90' }; }},
    ]
  },
  5: {
    nama: 'Kelas 5',
    topik: [
      { nama: 'Desimal ke Pecahan', generator: () => { const pairs = [['0.5','1/2'],['0.25','1/4'],['0.75','3/4'],['0.2','1/5']]; const [d,p] = pairs[randInt(0, pairs.length-1)]; return { text: `${d} = ? (pecahan)`, answer: p }; }},
      { nama: 'Persen', generator: () => { const pairs = [['50%','1/2'],['25%','1/4'],['75%','3/4'],['20%','1/5']]; const [p,f] = pairs[randInt(0, pairs.length-1)]; return { text: `${p} = ? (pecahan)`, answer: f }; }},
      { nama: 'Luas Segitiga', generator: () => { const a = randInt(4, 12), t = randInt(3, 10); return { text: `Luas segitiga alas ${a}, tinggi ${t} = ?`, answer: (a*t/2).toString() }; }},
      { nama: 'Volume Kubus', generator: () => { const s = randInt(2, 5); return { text: `Volume kubus sisi ${s} cm = ? cm³`, answer: (s*s*s).toString() }; }},
      { nama: 'Volume Balok', generator: () => { const p = randInt(2, 5), l = randInt(2, 4), t = randInt(2, 4); return { text: `Volume ${p}×${l}×${t} = ? cm³`, answer: (p*l*t).toString() }; }},
      { nama: 'Rata-rata', generator: () => { const nums = [randInt(2,8), randInt(2,8), randInt(2,8)]; const sum = nums.reduce((a,b)=>a+b,0); return { text: `Rata-rata ${nums.join(', ')} = ?`, answer: (sum/3).toFixed(1) }; }},
    ]
  },
  6: {
    nama: 'Kelas 6',
    topik: [
      { nama: 'Bilangan Bulat', generator: () => { const a = randInt(1, 10), b = randInt(1, 10); return { text: `${-a} + ${b} = ?`, answer: (b - a).toString() }; }},
      { nama: 'Pangkat Dua', generator: () => { const n = randInt(2, 12); return { text: `${n}² = ?`, answer: (n*n).toString() }; }},
      { nama: 'Akar Kuadrat', generator: () => { const n = randInt(2, 12); return { text: `√${n*n} = ?`, answer: n.toString() }; }},
      { nama: 'Rasio', generator: () => { const a = randInt(2, 5), b = randInt(2, 5), k = randInt(2, 5); return { text: `Perbandingan ${a}:${b}, jika ${a*k}, maka ?`, answer: (b*k).toString() }; }},
      { nama: 'Luas Lingkaran', generator: () => { const r = randInt(1, 7); return { text: `Luas lingkaran r=${r}, π=3.14 = ?`, answer: Math.round(3.14*r*r).toString() }; }},
      { nama: 'Keliling Lingkaran', generator: () => { const r = randInt(1, 7); return { text: `Keliling r=${r}, π=3.14 = ?`, answer: Math.round(2*3.14*r).toString() }; }},
      { nama: 'Volume Tabung', generator: () => { const r = randInt(1, 3), t = randInt(5, 10); return { text: `Volume tabung r=${r}, t=${t} = ?`, answer: Math.round(3.14*r*r*t).toString() }; }},
    ]
  }
};

// ==================== SOAL GENERATOR ====================
class SoalGenerator {
  constructor(kelas) {
    this.kelas = kelas;
    this.usedQuestions = new Set();
  }

  generate() {
    let availableKelas = this.kelas === 'SEMUA KELAS' ? [1,2,3,4,5,6] : [parseInt(this.kelas)];
    const selectedKelas = availableKelas[randInt(0, availableKelas.length - 1)];
    const kisi = KISI_KISI[selectedKelas];
    const topik = kisi.topik[randInt(0, kisi.topik.length - 1)];
    const soal = topik.generator();
    
    const key = `${selectedKelas}-${topik.nama}-${soal.text}`;
    let attempts = 0;
    while (this.usedQuestions.has(key) && attempts < 3) {
      const newSoal = topik.generator();
      soal.text = newSoal.text;
      soal.answer = newSoal.answer;
      attempts++;
    }
    this.usedQuestions.add(key);
    
    return {
      text: soal.text,
      answer: soal.answer,
      choices: this.generateChoices(soal.answer),
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
        if (wrongStr !== correctAnswer && parseFloat(wrongStr) > 0) choices.add(wrongStr);
      } else {
        const distractors = this.getTextDistractors(correctAnswer);
        const d = distractors[randInt(0, distractors.length - 1)];
        if (d !== correctAnswer) choices.add(d);
      }
    }
    while (choices.size < 4) choices.add(`Opsi ${choices.size + 1}`);
    return shuffleArray([...choices]);
  }

  getTextDistractors(answer) {
    const map = {
      'genap': ['ganjil', 'prima', 'komposit'],
      'ganjil': ['genap', 'prima', 'komposit'],
      '1/2': ['1/3', '1/4', '2/3'],
      '1/4': ['1/2', '1/3', '3/4'],
      '3/4': ['1/2', '1/4', '2/3'],
      '1/5': ['1/2', '1/3', '1/4'],
    };
    return map[answer] || ['A', 'B', 'C'];
  }

  reset() { this.usedQuestions.clear(); }
}

// ==================== PARTICLE SYSTEM ====================
class Particle {
  constructor(x, y, color, size = 4) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.life = 1;
    this.color = color;
    this.size = Math.random() * size + 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2;
    this.life -= 0.02;
  }
  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

// ==================== BASE GAME CLASS ====================
class BaseGame {
  constructor(canvas, ctx, soalGenerator, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.soalGenerator = soalGenerator;
    this.onScore = onScore;
    this.onGameOver = onGameOver;
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeRemaining = 60;
    this.active = false;
    this.particles = [];
    this.currentQuestion = null;
    this.timerInterval = null;
  }

  start() {
    this.active = true;
    this.startTimer();
    this.nextQuestion();
  }

  stop() {
    this.active = false;
    this.clearTimer();
  }

  startTimer() {
    this.clearTimer();
    this.timeRemaining = 60;
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      if (this.timeRemaining <= 0) {
        this.clearTimer();
        this.endGame();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const el = document.getElementById('timerDisplay');
    if (el) {
      el.textContent = `${this.timeRemaining}s`;
      el.style.color = this.timeRemaining <= 10 ? '#ef4444' : '#fbbf24';
    }
  }

  nextQuestion() {
    this.currentQuestion = this.soalGenerator.generate();
    this.updateQuestionDisplay();
  }

  updateQuestionDisplay() {
    if (!this.currentQuestion) return;
    const qEl = document.getElementById('questionText');
    const tEl = document.getElementById('topicLabel');
    const kEl = document.getElementById('kelasLabel');
    if (qEl) qEl.textContent = this.currentQuestion.text;
    if (tEl) tEl.textContent = this.currentQuestion.topic;
    if (kEl) kEl.textContent = `Kelas ${this.currentQuestion.kelas}`;
  }

  updateHUD() {
    const sEl = document.getElementById('scoreDisplay');
    const cEl = document.getElementById('comboDisplay');
    const lEl = document.getElementById('livesDisplay');
    if (sEl) sEl.textContent = this.score;
    if (cEl) cEl.textContent = `${this.combo}x`;
    if (lEl) lEl.textContent = this.lives;
  }

  handleCorrect(x, y) {
    this.combo++;
    const multiplier = Math.min(this.combo, 5);
    this.score += 100 * multiplier;
    sfx.playCorrect();
    if (this.combo >= 3) sfx.playCombo();
    this.spawnParticles(x, y, '#22c55e', 20);
    this.updateHUD();
    this.onScore(this.score);
    setTimeout(() => this.nextQuestion(), 500);
  }

  handleWrong(x, y) {
    this.combo = 0;
    this.lives--;
    sfx.playWrong();
    this.spawnParticles(x, y, '#ef4444', 15);
    this.updateHUD();
    if (this.lives <= 0) {
      setTimeout(() => this.endGame(), 500);
    } else {
      setTimeout(() => this.nextQuestion(), 500);
    }
  }

  spawnParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  updateParticles() {
    this.particles = this.particles.filter(p => {
      p.update();
      return p.life > 0;
    });
  }

  drawParticles() {
    this.particles.forEach(p => p.draw(this.ctx));
  }

  endGame() {
    this.stop();
    sfx.playGameOver();
    this.onGameOver(this.score);
  }
}

// ==================== GAME 1: MATH SHOOTER ====================
class MathShooter extends BaseGame {
  constructor(canvas, ctx, soalGenerator, onScore, onGameOver) {
    super(canvas, ctx, soalGenerator, onScore, onGameOver);
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 80;
    this.bullets = [];
    this.enemies = [];
    this.keys = {};
    this.lastShot = 0;
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); this.shoot(); }
    });
    document.addEventListener('keyup', (e) => { this.keys[e.key] = false; });
  }

  shoot() {
    if (!this.active) return;
    const now = Date.now();
    if (now - this.lastShot < 250) return;
    this.lastShot = now;
    sfx.playShoot();
    this.bullets.push({ x: this.playerX, y: this.playerY - 20, speed: 10 });
  }

  spawnEnemies() {
    this.enemies = [];
    const choices = this.currentQuestion.choices;
    const spacing = this.canvas.width / (choices.length + 1);
    choices.forEach((choice, i) => {
      this.enemies.push({
        x: spacing * (i + 1) - 40,
        y: 100 + Math.random() * 100,
        width: 80,
        height: 60,
        speed: 0.5 + Math.random() * 0.5,
        answer: choice,
        isCorrect: choice === this.currentQuestion.answer,
        alive: true,
        color: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'][i % 4],
        bounce: Math.random() * Math.PI * 2
      });
    });
  }

  nextQuestion() {
    super.nextQuestion();
    this.spawnEnemies();
  }

  update() {
    if (!this.active) return;
    if (this.keys['ArrowLeft'] || this.keys['a']) this.playerX -= 6;
    if (this.keys['ArrowRight'] || this.keys['d']) this.playerX += 6;
    this.playerX = Math.max(30, Math.min(this.canvas.width - 30, this.playerX));

    this.bullets = this.bullets.filter(b => { b.y -= b.speed; return b.y > -20; });

    this.enemies.forEach(e => {
      if (e.alive) {
        e.y += e.speed;
        e.bounce += 0.05;
        if (e.y > this.canvas.height - 60) {
          e.alive = false;
          if (e.isCorrect) {
            this.lives--;
            this.combo = 0;
            sfx.playWrong();
            this.updateHUD();
            if (this.lives <= 0) setTimeout(() => this.endGame(), 500);
            else setTimeout(() => this.nextQuestion(), 500);
          }
        }
      }
    });

    this.bullets.forEach(b => {
      this.enemies.forEach(e => {
        if (!e.alive) return;
        if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
          b.y = -100;
          e.alive = false;
          sfx.playShoot();
          if (e.isCorrect) this.handleCorrect(e.x + e.width/2, e.y + e.height/2);
          else this.handleWrong(e.x + e.width/2, e.y + e.height/2);
        }
      });
    });

    this.updateParticles();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137) % w, y = (i * 97) % h;
      ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.2;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;

    // Ground
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, h - 60, w, 60);
    ctx.fillStyle = '#22c55e';
    for (let i = 0; i < w; i += 40) ctx.fillRect(i, h - 60, 2, 60);

    // Player (spaceship)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(this.playerX, this.playerY - 25);
    ctx.lineTo(this.playerX - 20, this.playerY + 15);
    ctx.lineTo(this.playerX + 20, this.playerY + 15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(this.playerX, this.playerY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Bullets
    this.bullets.forEach(b => {
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.fillRect(b.x - 3, b.y, 6, 15);
      ctx.shadowBlur = 0;
    });

    // Enemies (zombies)
    this.enemies.forEach(e => {
      if (!e.alive) return;
      const bounceY = Math.sin(e.bounce) * 3;
      ctx.fillStyle = e.color;
      ctx.fillRect(e.x, e.y + bounceY, e.width, e.height);
      ctx.strokeStyle = e.isCorrect ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(e.x, e.y + bounceY, e.width, e.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.answer, e.x + e.width/2, e.y + bounceY + e.height/2);
    });

    this.drawParticles();
  }
}

// ==================== GAME 2: BUBBLE POP ====================
class BubblePop extends BaseGame {
  constructor(canvas, ctx, soalGenerator, onScore, onGameOver) {
    super(canvas, ctx, soalGenerator, onScore, onGameOver);
    this.bubbles = [];
    this.spawnTimer = 0;
  }

  spawnBubbles() {
    this.bubbles = [];
    const choices = this.currentQuestion.choices;
    const spacing = this.canvas.width / (choices.length + 1);
    choices.forEach((choice, i) => {
      this.bubbles.push({
        x: spacing * (i + 1),
        y: this.canvas.height + 50 + Math.random() * 200,
        radius: 45,
        speed: 1 + Math.random() * 1.5,
        answer: choice,
        isCorrect: choice === this.currentQuestion.answer,
        alive: true,
        color: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'][i % 6],
        wobble: Math.random() * Math.PI * 2
      });
    });
  }

  nextQuestion() {
    super.nextQuestion();
    this.spawnBubbles();
  }

  handleClick(x, y) {
    if (!this.active) return;
    for (let b of this.bubbles) {
      if (!b.alive) continue;
      const dist = Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2);
      if (dist < b.radius) {
        b.alive = false;
        sfx.playPop();
        if (b.isCorrect) this.handleCorrect(b.x, b.y);
        else this.handleWrong(b.x, b.y);
        return;
      }
    }
  }

  update() {
    if (!this.active) return;
    this.bubbles.forEach(b => {
      if (b.alive) {
        b.y -= b.speed;
        b.wobble += 0.05;
        b.x += Math.sin(b.wobble) * 0.5;
        if (b.y < -b.radius) {
          b.alive = false;
          if (b.isCorrect) {
            this.lives--;
            this.combo = 0;
            sfx.playWrong();
            this.updateHUD();
            if (this.lives <= 0) setTimeout(() => this.endGame(), 500);
            else setTimeout(() => this.nextQuestion(), 500);
          }
        }
      }
    });
    this.updateParticles();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // Underwater background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0ea5e9');
    grad.addColorStop(1, '#0369a1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Bubbles background
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i < 20; i++) {
      const x = (i * 73) % w, y = (Date.now() * 0.05 + i * 100) % h;
      ctx.beginPath();
      ctx.arc(x, y, 3 + (i % 5), 0, Math.PI * 2);
      ctx.fill();
    }

    // Bubbles
    this.bubbles.forEach(b => {
      if (!b.alive) return;
      // Bubble body
      const grad = ctx.createRadialGradient(b.x - 10, b.y - 10, 5, b.x, b.y, b.radius);
      grad.addColorStop(0, 'rgba(255,255,255,0.4)');
      grad.addColorStop(0.5, b.color);
      grad.addColorStop(1, b.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      // Shine
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(b.x - 12, b.y - 12, 10, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.answer, b.x, b.y);
    });

    this.drawParticles();
  }
}

// ==================== GAME 3: MATH RUNNER ====================
class MathRunner extends BaseGame {
  constructor(canvas, ctx, soalGenerator, onScore, onGameOver) {
    super(canvas, ctx, soalGenerator, onScore, onGameOver);
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 100;
    this.lanes = [];
    this.obstacles = [];
  }

  spawnLanes() {
    this.lanes = [];
    const choices = this.currentQuestion.choices;
    const laneWidth = this.canvas.width / choices.length;
    choices.forEach((choice, i) => {
      this.lanes.push({
        x: i * laneWidth,
        width: laneWidth,
        answer: choice,
        isCorrect: choice === this.currentQuestion.answer,
        color: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'][i % 4]
      });
    });
  }

  nextQuestion() {
    super.nextQuestion();
    this.spawnLanes();
    this.playerX = this.canvas.width / 2;
  }

  handleClick(x, y) {
    if (!this.active) return;
    for (let lane of this.lanes) {
      if (x >= lane.x && x <= lane.x + lane.width) {
        sfx.playJump();
        if (lane.isCorrect) this.handleCorrect(x, y);
        else this.handleWrong(x, y);
        return;
      }
    }
  }

  update() {
    if (!this.active) return;
    if (this.keys && (this.keys['ArrowLeft'] || this.keys['a'])) this.playerX -= 6;
    if (this.keys && (this.keys['ArrowRight'] || this.keys['d'])) this.playerX += 6;
    this.playerX = Math.max(30, Math.min(this.canvas.width - 30, this.playerX));
    this.updateParticles();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // Sky background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fbbf24');
    grad.addColorStop(0.5, '#f97316');
    grad.addColorStop(1, '#dc2626');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sun
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(w - 100, 80, 50, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, h - 100, w, 100);

    // Lanes
    this.lanes.forEach(lane => {
      ctx.fillStyle = lane.color;
      ctx.fillRect(lane.x, h - 200, lane.width, 100);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(lane.answer, lane.x + lane.width/2, h - 150);
    });

    // Player (runner)
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('', this.playerX, this.playerY);

    this.drawParticles();
  }
}

// ==================== GAME 4: MEMORY MATCH ====================
class MemoryMatch extends BaseGame {
  constructor(canvas, ctx, soalGenerator, onScore, onGameOver) {
    super(canvas, ctx, soalGenerator, onScore, onGameOver);
    this.cards = [];
    this.flipped = [];
    this.matched = 0;
    this.cols = 4;
    this.rows = 2;
  }

  spawnCards() {
    this.cards = [];
    this.flipped = [];
    this.matched = 0;
    const choices = this.currentQuestion.choices;
    const pairs = [];
    
    // Create pairs: question + correct answer, and wrong answers
    pairs.push({ text: this.currentQuestion.text, isQuestion: true, matchId: 0 });
    pairs.push({ text: this.currentQuestion.answer, isQuestion: false, matchId: 0 });
    
    choices.filter(c => c !== this.currentQuestion.answer).slice(0, 3).forEach((c, i) => {
      pairs.push({ text: `Soal ${i+1}`, isQuestion: true, matchId: i+1 });
      pairs.push({ text: c, isQuestion: false, matchId: i+1 });
    });

    const shuffled = shuffleArray(pairs);
    const cardWidth = (this.canvas.width - 40) / this.cols;
    const cardHeight = (this.canvas.height - 150) / this.rows;

    shuffled.forEach((item, i) => {
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);
      this.cards.push({
        x: 20 + col * cardWidth + 5,
        y: 100 + row * cardHeight + 5,
        width: cardWidth - 10,
        height: cardHeight - 10,
        text: item.text,
        isQuestion: item.isQuestion,
        matchId: item.matchId,
        flipped: false,
        matched: false,
        color: '#8b5cf6'
      });
    });
  }

  nextQuestion() {
    super.nextQuestion();
    this.spawnCards();
  }

  handleClick(x, y) {
    if (!this.active || this.flipped.length >= 2) return;
    
    for (let card of this.cards) {
      if (card.flipped || card.matched) continue;
      if (x >= card.x && x <= card.x + card.width && y >= card.y && y <= card.y + card.height) {
        card.flipped = true;
        this.flipped.push(card);
        sfx.playFlip();
        
        if (this.flipped.length === 2) {
          setTimeout(() => this.checkMatch(), 800);
        }
        return;
      }
    }
  }

  checkMatch() {
    const [c1, c2] = this.flipped;
    if (c1.matchId === c2.matchId && c1.isQuestion !== c2.isQuestion) {
      c1.matched = true;
      c2.matched = true;
      this.matched++;
      sfx.playCorrect();
      this.spawnParticles((c1.x + c2.x)/2, (c1.y + c2.y)/2, '#22c55e', 15);
      
      if (c1.matchId === 0) {
        // Found the correct pair
        this.handleCorrect((c1.x + c2.x)/2, (c1.y + c2.y)/2);
      }
    } else {
      c1.flipped = false;
      c2.flipped = false;
      sfx.playWrong();
    }
    this.flipped = [];
  }

  update() {
    if (!this.active) return;
    this.updateParticles();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#4c1d95');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Cards
    this.cards.forEach(card => {
      if (card.matched) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(card.x, card.y, card.width, card.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', card.x + card.width/2, card.y + card.height/2);
      } else if (card.flipped) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(card.x, card.y, card.width, card.height);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = card.text.length > 20 ? card.text.substring(0, 18) + '...' : card.text;
        ctx.fillText(text, card.x + card.width/2, card.y + card.height/2);
      } else {
        ctx.fillStyle = card.color;
        ctx.fillRect(card.x, card.y, card.width, card.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', card.x + card.width/2, card.y + card.height/2);
      }
    });

    this.drawParticles();
  }
}

// ==================== GAME 5: SPACE MATH ====================
class SpaceMath extends BaseGame {
  constructor(canvas, ctx, soalGenerator, onScore, onGameOver) {
    super(canvas, ctx, soalGenerator, onScore, onGameOver);
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 80;
    this.bullets = [];
    this.asteroids = [];
    this.stars = [];
    this.keys = {};
    this.lastShot = 0;
    
    // Generate stars
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: 0.5 + Math.random() * 1.5
      });
    }
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); this.shoot(); }
    });
    document.addEventListener('keyup', (e) => { this.keys[e.key] = false; });
  }

  shoot() {
    if (!this.active) return;
    const now = Date.now();
    if (now - this.lastShot < 200) return;
    this.lastShot = now;
    sfx.playLaser();
    this.bullets.push({ x: this.playerX, y: this.playerY - 20, speed: 12 });
  }

  spawnAsteroids() {
    this.asteroids = [];
    const choices = this.currentQuestion.choices;
    const spacing = this.canvas.width / (choices.length + 1);
    choices.forEach((choice, i) => {
      this.asteroids.push({
        x: spacing * (i + 1) - 35,
        y: -50 - Math.random() * 200,
        radius: 35,
        speed: 1 + Math.random() * 1,
        answer: choice,
        isCorrect: choice === this.currentQuestion.answer,
        alive: true,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        color: ['#78716c', '#a8a29e', '#57534e'][i % 3]
      });
    });
  }

  nextQuestion() {
    super.nextQuestion();
    this.spawnAsteroids();
  }

  update() {
    if (!this.active) return;
    if (this.keys['ArrowLeft'] || this.keys['a']) this.playerX -= 7;
    if (this.keys['ArrowRight'] || this.keys['d']) this.playerX += 7;
    this.playerX = Math.max(30, Math.min(this.canvas.width - 30, this.playerX));

    // Update stars
    this.stars.forEach(s => {
      s.y += s.speed;
      if (s.y > this.canvas.height) { s.y = 0; s.x = Math.random() * this.canvas.width; }
    });

    this.bullets = this.bullets.filter(b => { b.y -= b.speed; return b.y > -20; });

    this.asteroids.forEach(a => {
      if (a.alive) {
        a.y += a.speed;
        a.rotation += a.rotSpeed;
        if (a.y > this.canvas.height + 50) {
          a.alive = false;
          if (a.isCorrect) {
            this.lives--;
            this.combo = 0;
            sfx.playWrong();
            this.updateHUD();
            if (this.lives <= 0) setTimeout(() => this.endGame(), 500);
            else setTimeout(() => this.nextQuestion(), 500);
          }
        }
      }
    });

    this.bullets.forEach(b => {
      this.asteroids.forEach(a => {
        if (!a.alive) return;
        const dist = Math.sqrt((b.x - a.x - a.radius) ** 2 + (b.y - a.y - a.radius) ** 2);
        if (dist < a.radius) {
          b.y = -100;
          a.alive = false;
          sfx.playLaser();
          if (a.isCorrect) this.handleCorrect(a.x + a.radius, a.y + a.radius);
          else this.handleWrong(a.x + a.radius, a.y + a.radius);
        }
      });
    });

    this.updateParticles();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;

    // Space background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    // Stars
    this.stars.forEach(s => {
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.001 + s.x) * 0.3;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1;

    // Nebula effect
    const nebula = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, 400);
    nebula.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
    nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, w, h);

    // Player (rocket)
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚀', this.playerX, this.playerY);

    // Bullets (lasers)
    this.bullets.forEach(b => {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x, b.y + 15);
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Asteroids
    this.asteroids.forEach(a => {
      if (!a.alive) return;
      ctx.save();
      ctx.translate(a.x + a.radius, a.y + a.radius);
      ctx.rotate(a.rotation);
      
      // Asteroid body
      ctx.fillStyle = a.color;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = a.radius * (0.8 + Math.random() * 0.2);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Craters
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.arc(-10, -10, 8, 0, Math.PI * 2);
      ctx.arc(12, 8, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Answer text
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.answer, a.x + a.radius, a.y + a.radius);
    });

    this.drawParticles();
  }
}

// ==================== MAIN APP CONTROLLER ====================
let currentGame = null;
let currentGameType = null;
let soalGenerator = null;

const GAMES = {
  shooter: { name: 'Math Shooter', class: MathShooter, needsKeyboard: true },
  bubble: { name: 'Bubble Pop', class: BubblePop, needsKeyboard: false },
  runner: { name: 'Math Runner', class: MathRunner, needsKeyboard: true },
  memory: { name: 'Memory Match', class: MemoryMatch, needsKeyboard: false },
  space: { name: 'Space Math', class: SpaceMath, needsKeyboard: true }
};

document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.getElementById('mainMenu');
  const gameScreen = document.getElementById('gameScreen');
  const playerNameInput = document.getElementById('playerName');
  const categorySelect = document.getElementById('categorySelect');
  const backBtn = document.getElementById('backBtn');
  const restartBtn = document.getElementById('restartBtn');
  const menuBtn = document.getElementById('menuBtn');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size
  canvas.width = 900;
  canvas.height = 600;

  // Game card clicks
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameType = card.dataset.game;
      startGame(gameType);
    });
  });

  function startGame(gameType) {
    sfx.playStart();
    currentGameType = gameType;
    const playerName = playerNameInput?.value?.trim() || 'Player';
    const category = categorySelect?.value || 'SEMUA KELAS';

    soalGenerator = new SoalGenerator(category);
    
    mainMenu.classList.remove('active');
    gameScreen.classList.add('active');
    gameOverOverlay.style.display = 'none';

    const GameClass = GAMES[gameType].class;
    currentGame = new GameClass(
      canvas, ctx, soalGenerator,
      (score) => {}, // onScore
      (finalScore) => showGameOver(finalScore) // onGameOver
    );

    if (GAMES[gameType].needsKeyboard) {
      currentGame.setupControls();
    }

    // Click handler for non-keyboard games
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      if (currentGame.handleClick) currentGame.handleClick(x, y);
    };

    currentGame.start();
    gameLoop();
  }

  function gameLoop() {
    if (!currentGame || !currentGame.active) return;
    currentGame.update();
    currentGame.draw();
    requestAnimationFrame(gameLoop);
  }

  function showGameOver(finalScore) {
    gameOverOverlay.style.display = 'flex';
    document.getElementById('finalScore').textContent = finalScore;
    document.getElementById('finalStats').textContent = 
      `Kelas: ${categorySelect.value} | Game: ${GAMES[currentGameType].name}`;
  }

  backBtn.addEventListener('click', () => {
    if (currentGame) currentGame.stop();
    gameScreen.classList.remove('active');
    mainMenu.classList.add('active');
    gameOverOverlay.style.display = 'none';
  });

  restartBtn.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    soalGenerator.reset();
    startGame(currentGameType);
  });

  menuBtn.addEventListener('click', () => {
    if (currentGame) currentGame.stop();
    gameScreen.classList.remove('active');
    mainMenu.classList.add('active');
    gameOverOverlay.style.display = 'none';
  });

  // Init audio
  document.addEventListener('click', () => sfx.init(), { once: true });
});
