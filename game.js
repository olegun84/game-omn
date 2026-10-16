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

  playShoot() {
    this.init();
    this.playTone(800, 0.1, 'square', 0.12);
    setTimeout(() => this.playTone(600, 0.08, 'square', 0.1), 50);
  }

  playCorrect() {
    this.init();
    this.playTone(523, 0.1, 'sine', 0.15);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.15), 100);
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.15), 200);
  }

  playWrong() {
    this.init();
    this.playTone(200, 0.15, 'sawtooth', 0.12);
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.12), 150);
  }

  playCombo() {
    this.init();
    this.playTone(880, 0.08, 'sine', 0.12);
    setTimeout(() => this.playTone(1100, 0.08, 'sine', 0.12), 80);
    setTimeout(() => this.playTone(1320, 0.12, 'sine', 0.12), 160);
  }

  playWaveStart() {
    this.init();
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.12), i * 100);
    });
  }

  playGameOver() {
    this.init();
    [400, 350, 300, 200].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sawtooth', 0.1), i * 150);
    });
  }

  playEnemyHit() {
    this.init();
    this.playTone(300, 0.05, 'square', 0.1);
    this.playTone(150, 0.1, 'square', 0.08);
  }

  playButton() {
    this.init();
    this.playTone(600, 0.05, 'sine', 0.1);
  }

  playStartGame() {
    this.init();
    [262, 330, 392, 523].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.12), i * 120);
    });
  }
}

const sfx = new SFXManager();

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
    this.totalQuestions = 15;
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.playerX = 400;
    this.playerY = 500;
    this.gameActive = false;
    this.questionData = null;
    this.answerChoices = [];
    this.waveEnemies = [];
    this.waveIndex = 0;
    this.keys = {};
    this.lastShot = 0;
    this.shootCooldown = 250;
    this.animFrameId = null;
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

  generateQuestion() {
    const topics = ['nilai_tempat', 'penjumlahan', 'pengurangan', 'perkalian', 'pembagian'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    switch (topic) {
      case 'nilai_tempat': return this.generateNilaiTempat();
      case 'penjumlahan': return this.generatePenjumlahan();
      case 'pengurangan': return this.generatePengurangan();
      case 'perkalian': return this.generatePerkalian();
      case 'pembagian': return this.generatePembagian();
      default: return this.generatePenjumlahan();
    }
  }

  generateNilaiTempat() {
    const numbers = [
      { num: 523, digit: 2, answer: 'puluhan', choices: ['ratusan', 'puluhan', 'satuan', 'ribuan'] },
      { num: 1456, digit: 4, answer: 'ratusan', choices: ['ribuan', 'ratusan', 'puluhan', 'satuan'] },
      { num: 7891, digit: 8, answer: 'ratusan', choices: ['ribuan', 'ratusan', 'puluhan', 'satuan'] },
      { num: 3024, digit: 0, answer: 'ratusan', choices: ['ribuan', 'ratusan', 'puluhan', 'satuan'] },
      { num: 67, digit: 6, answer: 'puluhan', choices: ['ratusan', 'puluhan', 'satuan', 'ribuan'] },
      { num: 4521, digit: 1, answer: 'satuan', choices: ['ribuan', 'ratusan', 'puluhan', 'satuan'] },
      { num: 8903, digit: 9, answer: 'ratusan', choices: ['ribuan', 'ratusan', 'puluhan', 'satuan'] },
      { num: 2345, digit: 2, answer: 'ribuan', choices: ['ribuan', 'ratusan', 'puluhan', 'satuan'] },
    ];
    const q = numbers[Math.floor(Math.random() * numbers.length)];
    return {
      text: `Pada angka ${q.num}, angka ${q.digit} menempati nilai tempat apa?`,
      answer: q.answer,
      choices: this.shuffleArray([...q.choices]),
      topic: 'NILAI TEMPAT'
    };
  }

  generatePenjumlahan() {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 50) + 10;
    const answer = a + b;
    const choices = this.generateChoices(answer);
    return {
      text: `${a} + ${b} = ?`,
      answer: answer.toString(),
      choices: choices.map(c => c.toString()),
      topic: 'PENJUMLAHAN'
    };
  }

  generatePengurangan() {
    const a = Math.floor(Math.random() * 50) + 30;
    const b = Math.floor(Math.random() * 30) + 1;
    const answer = a - b;
    const choices = this.generateChoices(answer);
    return {
      text: `${a} - ${b} = ?`,
      answer: answer.toString(),
      choices: choices.map(c => c.toString()),
      topic: 'PENGURANGAN'
    };
  }

  generatePerkalian() {
    const a = Math.floor(Math.random() * 10) + 2;
    const b = Math.floor(Math.random() * 10) + 2;
    const answer = a * b;
    const choices = this.generateChoices(answer);
    return {
      text: `${a} × ${b} = ?`,
      answer: answer.toString(),
      choices: choices.map(c => c.toString()),
      topic: 'PERKALIAN'
    };
  }

  generatePembagian() {
    const b = Math.floor(Math.random() * 9) + 2;
    const answer = Math.floor(Math.random() * 10) + 2;
    const a = b * answer;
    const choices = this.generateChoices(answer);
    return {
      text: `${a} ÷ ${b} = ?`,
      answer: answer.toString(),
      choices: choices.map(c => c.toString()),
      topic: 'PEMBAGIAN'
    };
  }

  generateChoices(correct) {
    const choices = new Set([correct]);
    while (choices.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const val = correct + (offset === 0 ? 1 : offset);
      if (val > 0) choices.add(val);
    }
    return this.shuffleArray([...choices]);
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  nextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion > this.totalQuestions) {
      this.endGame();
      return;
    }
    this.questionData = this.generateQuestion();
    this.answerChoices = this.questionData.choices || [];
    if (!Array.isArray(this.answerChoices) || this.answerChoices.length === 0) {
      this.answerChoices = ['A', 'B', 'C', 'D'];
    }
    this.updateUI();
    this.startWave();
  }

  startWave() {
    this.waveEnemies = [];
    sfx.playWaveStart();
    if (!this.answerChoices || !Array.isArray(this.answerChoices)) {
      this.answerChoices = ['A', 'B', 'C', 'D'];
    }
    this.answerChoices.forEach((choice, index) => {
      const enemy = {
        x: 100 + index * 180,
        y: -50 - Math.random() * 200,
        width: 80,
        height: 50,
        speed: 0.5 + Math.random() * 0.5,
        answer: choice,
        isCorrect: choice === this.questionData.answer,
        alive: true,
        color: this.getEnemyColor(index)
      };
      this.waveEnemies.push(enemy);
    });
    this.enemies = [...this.waveEnemies];
    this.showQuestion();
  }

  showQuestion() {
    const questionEl = document.getElementById('questionText');
    const topicEl = document.getElementById('topicLabel');
    if (questionEl) questionEl.textContent = this.questionData.text;
    if (topicEl) topicEl.textContent = this.questionData.topic;
    this.answerChoices = this.answerChoices || [];
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
        if (enemy.y > this.canvas.height + 50) {
          enemy.alive = false;
          if (enemy.isCorrect) {
            this.defeats++;
            this.combo = 0;
            sfx.playWrong();
            this.updateUI();
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

    if (this.defeats >= 5) this.gameOver();
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
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(enemy.answer, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 + 5);
      ctx.strokeStyle = enemy.isCorrect ? '#2ecc71' : '#e74c3c';
      ctx.lineWidth = 2;
      ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
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
    sfx.playGameOver();
    const overlay = document.getElementById('gameOverOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const finalScore = document.getElementById('finalScore');
      if (finalScore) finalScore.textContent = this.score;
    }
  }

  endGame() {
    this.gameActive = false;
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
    const overlay = document.getElementById('gameOverOverlay');
    if (overlay) overlay.style.display = 'none';
    sfx.playButton();
    this.nextQuestion();
  }

  destroy() {
    this.gameActive = false;
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
