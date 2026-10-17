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
    } catch (e) { console.warn('Audio error'); }
  }
  playTone(freq, dur, type = 'square', vol = 0.15) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    gain.gain.setValueAtTime(vol, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + dur);
  }
  playShoot() { this.init(); this.playTone(800, 0.1, 'square', 0.12); }
  playPop() { this.init(); this.playTone(1200, 0.08, 'sine', 0.15); }
  playCorrect() { this.init(); this.playTone(523, 0.1, 'sine', 0.15); setTimeout(() => this.playTone(784, 0.15, 'sine', 0.15), 150); }
  playWrong() { this.init(); this.playTone(200, 0.2, 'sawtooth', 0.12); }
  playCombo() { this.init(); this.playTone(880, 0.08, 'sine', 0.12); setTimeout(() => this.playTone(1320, 0.12, 'sine', 0.12), 100); }
  playGameOver() { this.init(); this.playTone(400, 0.2, 'sawtooth', 0.1); setTimeout(() => this.playTone(200, 0.3, 'sawtooth', 0.1), 200); }
  playStart() { this.init(); this.playTone(523, 0.15, 'sine', 0.12); setTimeout(() => this.playTone(784, 0.15, 'sine', 0.12), 150); }
  playFlip() { this.init(); this.playTone(500, 0.05, 'triangle', 0.1); }
}
const sfx = new SFXManager();

// ==================== HELPERS ====================
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==================== KISI-KISI ====================
const KISI_KISI = {
  1: { nama: 'Kelas 1', topik: [
    { nama: 'Penjumlahan', gen: () => { const a=randInt(1,9),b=randInt(1,10-a); return {text:`${a}+${b}=?`, answer:(a+b).toString()}; }},
    { nama: 'Pengurangan', gen: () => { const a=randInt(2,10),b=randInt(1,a-1); return {text:`${a}-${b}=?`, answer:(a-b).toString()}; }},
    { nama: 'Bilangan Setelah', gen: () => { const n=randInt(1,19); return {text:`Angka setelah ${n}?`, answer:(n+1).toString()}; }},
    { nama: 'Bilangan Sebelum', gen: () => { const n=randInt(2,20); return {text:`Angka sebelum ${n}?`, answer:(n-1).toString()}; }},
    { nama: 'Nilai Tempat', gen: () => { const s=randInt(1,9),p=randInt(1,9); return {text:`Satuan dari ${p*10+s}?`, answer:s.toString()}; }},
    { nama: 'Membandingkan', gen: () => { let a=randInt(1,20),b=randInt(1,20); while(a===b)b=randInt(1,20); return {text:`${a} atau ${b} lebih besar?`, answer:Math.max(a,b).toString()}; }},
  ]},
  2: { nama: 'Kelas 2', topik: [
    { nama: 'Penjumlahan', gen: () => { const a=randInt(10,40),b=randInt(1,50-a); return {text:`${a}+${b}=?`, answer:(a+b).toString()}; }},
    { nama: 'Pengurangan', gen: () => { const a=randInt(20,50),b=randInt(1,a-1); return {text:`${a}-${b}=?`, answer:(a-b).toString()}; }},
    { nama: 'Perkalian', gen: () => { const a=randInt(2,5),b=randInt(1,10); return {text:`${a}×${b}=?`, answer:(a*b).toString()}; }},
    { nama: 'Pembagian', gen: () => { const b=randInt(2,5),ans=randInt(1,10); return {text:`${b*ans}÷${b}=?`, answer:ans.toString()}; }},
    { nama: 'Genap/Ganjil', gen: () => { const n=randInt(1,50); return {text:`${n} termasuk?`, answer:n%2===0?'genap':'ganjil'}; }},
  ]},
  3: { nama: 'Kelas 3', topik: [
    { nama: 'Perkalian', gen: () => { const a=randInt(2,10),b=randInt(2,10); return {text:`${a}×${b}=?`, answer:(a*b).toString()}; }},
    { nama: 'Pembagian', gen: () => { const b=randInt(2,10),ans=randInt(2,10); return {text:`${b*ans}÷${b}=?`, answer:ans.toString()}; }},
    { nama: 'Penjumlahan', gen: () => { const a=randInt(100,500),b=randInt(100,999-a); return {text:`${a}+${b}=?`, answer:(a+b).toString()}; }},
    { nama: 'Pengurangan', gen: () => { const a=randInt(300,999),b=randInt(100,a-100); return {text:`${a}-${b}=?`, answer:(a-b).toString()}; }},
    { nama: 'Satuan Panjang', gen: () => { const m=randInt(1,10); return {text:`${m}m = ? cm`, answer:(m*100).toString()}; }},
    { nama: 'Keliling Persegi', gen: () => { const s=randInt(2,10); return {text:`Keliling persegi sisi ${s}cm=?`, answer:(s*4).toString()}; }},
  ]},
  4: { nama: 'Kelas 4', topik: [
    { nama: 'Perkalian', gen: () => { const a=randInt(10,30),b=randInt(2,9); return {text:`${a}×${b}=?`, answer:(a*b).toString()}; }},
    { nama: 'KPK', gen: () => { const p=[[2,3,6],[3,4,12],[2,5,10],[3,5,15]]; const[a,b,k]=p[randInt(0,p.length-1)]; return {text:`KPK ${a} dan ${b}=?`, answer:k.toString()}; }},
    { nama: 'FPB', gen: () => { const p=[[4,6,2],[6,9,3],[8,12,4],[10,15,5]]; const[a,b,f]=p[randInt(0,p.length-1)]; return {text:`FPB ${a} dan ${b}=?`, answer:f.toString()}; }},
    { nama: 'Luas Persegi Panjang', gen: () => { const p=randInt(3,12),l=randInt(2,8); return {text:`Luas ${p}×${l}=?`, answer:(p*l).toString()}; }},
  ]},
  5: { nama: 'Kelas 5', topik: [
    { nama: 'Desimal', gen: () => { const p=[['0.5','1/2'],['0.25','1/4'],['0.75','3/4']]; const[d,f]=p[randInt(0,p.length-1)]; return {text:`${d}=?`, answer:f}; }},
    { nama: 'Luas Segitiga', gen: () => { const a=randInt(4,12),t=randInt(3,10); return {text:`Luas segitiga a=${a},t=${t}=?`, answer:(a*t/2).toString()}; }},
    { nama: 'Volume Kubus', gen: () => { const s=randInt(2,5); return {text:`Volume kubus sisi ${s}=?`, answer:(s*s*s).toString()}; }},
    { nama: 'Rata-rata', gen: () => { const n=[randInt(2,8),randInt(2,8),randInt(2,8)]; const s=n.reduce((a,b)=>a+b,0); return {text:`Rata-rata ${n.join(',')}=?`, answer:(s/3).toFixed(1)}; }},
  ]},
  6: { nama: 'Kelas 6', topik: [
    { nama: 'Bilangan Bulat', gen: () => { const a=randInt(1,10),b=randInt(1,10); return {text:`${-a}+${b}=?`, answer:(b-a).toString()}; }},
    { nama: 'Pangkat', gen: () => { const n=randInt(2,12); return {text:`${n}²=?`, answer:(n*n).toString()}; }},
    { nama: 'Akar', gen: () => { const n=randInt(2,12); return {text:`√${n*n}=?`, answer:n.toString()}; }},
    { nama: 'Luas Lingkaran', gen: () => { const r=randInt(1,7); return {text:`Luas lingkaran r=${r}=?`, answer:Math.round(3.14*r*r).toString()}; }},
  ]},
};

// ==================== SOAL GENERATOR ====================
class SoalGenerator {
  constructor(kelas) { this.kelas = kelas; this.used = new Set(); }
  generate() {
    const kelasList = this.kelas === 'SEMUA KELAS' ? [1,2,3,4,5,6] : [parseInt(this.kelas)];
    const k = kelasList[randInt(0, kelasList.length-1)];
    const topik = KISI_KISI[k].topik[randInt(0, KISI_KISI[k].topik.length-1)];
    const soal = topik.gen();
    const key = `${k}-${topik.nama}-${soal.text}`;
    let att = 0;
    while (this.used.has(key) && att < 3) { const s = topik.gen(); soal.text = s.text; soal.answer = s.answer; att++; }
    this.used.add(key);
    return { text: soal.text, answer: soal.answer, choices: this.makeChoices(soal.answer), topic: topik.nama, kelas: k };
  }
  makeChoices(ans) {
    const choices = new Set([ans]);
    const isNum = !isNaN(parseFloat(ans));
    let att = 0;
    while (choices.size < 4 && att < 50) {
      att++;
      if (isNum) {
        const n = parseFloat(ans), off = randInt(1, Math.max(5, Math.abs(n)));
        const w = n + (Math.random() > 0.5 ? off : -off);
        const ws = Number.isInteger(n) ? Math.round(w).toString() : w.toFixed(1);
        if (ws !== ans && parseFloat(ws) > 0) choices.add(ws);
      } else {
        const dm = {'genap':['ganjil','prima'],'ganjil':['genap','prima'],'1/2':['1/3','1/4'],'1/4':['1/2','3/4']};
        const ds = dm[ans] || ['A','B','C'];
        const d = ds[randInt(0, ds.length-1)];
        if (d !== ans) choices.add(d);
      }
    }
    while (choices.size < 4) choices.add('X');
    return shuffleArray([...choices]);
  }
  reset() { this.used.clear(); }
}

// ==================== PARTICLE ====================
class Particle {
  constructor(x, y, color) {
    this.x = x; this.y = y;
    this.vx = (Math.random()-0.5)*8; this.vy = (Math.random()-0.5)*8;
    this.life = 1; this.color = color; this.size = Math.random()*4+2;
  }
  update() { this.x += this.vx; this.y += this.vy; this.vy += 0.2; this.life -= 0.02; }
  draw(ctx) { ctx.globalAlpha = this.life; ctx.fillStyle = this.color; ctx.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size); ctx.globalAlpha = 1; }
}

// ==================== GAME ENGINE ====================
class GameEngine {
  constructor(canvas, ctx, soalGen, onGameOver) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.soalGen = soalGen;
    this.onGameOver = onGameOver;
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeRemaining = 60;
    this.active = false;
    this.particles = [];
    this.currentQ = null;
    this.timerInterval = null;
    this.animId = null;
    this.keys = {};
    this.gameType = '';
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); this.onShoot(); }
    });
    document.addEventListener('keyup', (e) => { this.keys[e.key] = false; });
  }

  onShoot() {} // override
  onClick(x, y) {} // override

  start(type) {
    this.gameType = type;
    this.active = true;
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeRemaining = 60;
    this.particles = [];
    this.updateHUD();
    this.nextQuestion();
    this.startTimer();
    this.loop();
  }

  stop() {
    this.active = false;
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timeRemaining = 60;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      if (this.timeRemaining <= 0) { clearInterval(this.timerInterval); this.endGame(); }
    }, 1000);
  }

  updateTimerDisplay() {
    const el = document.getElementById('timerDisplay');
    if (el) { el.textContent = this.timeRemaining + 's'; el.style.color = this.timeRemaining <= 10 ? '#ef4444' : '#fbbf24'; }
  }

  nextQuestion() {
    this.currentQ = this.soalGen.generate();
    this.updateQuestionDisplay();
    this.spawnGameObjects();
  }

  updateQuestionDisplay() {
    if (!this.currentQ) return;
    const q = document.getElementById('questionText');
    const t = document.getElementById('topicLabel');
    const k = document.getElementById('kelasLabel');
    if (q) q.textContent = this.currentQ.text;
    if (t) t.textContent = this.currentQ.topic;
    if (k) k.textContent = 'Kelas ' + this.currentQ.kelas;
  }

  updateHUD() {
    const s = document.getElementById('scoreDisplay');
    const c = document.getElementById('comboDisplay');
    const l = document.getElementById('livesDisplay');
    if (s) s.textContent = this.score;
    if (c) c.textContent = this.combo + 'x';
    if (l) l.textContent = this.lives;
  }

  spawnGameObjects() {} // override

  handleCorrect(x, y) {
    this.combo++;
    this.score += 100 * Math.min(this.combo, 5);
    sfx.playCorrect();
    if (this.combo >= 3) sfx.playCombo();
    for (let i = 0; i < 15; i++) this.particles.push(new Particle(x, y, '#22c55e'));
    this.updateHUD();
    setTimeout(() => { if (this.active) this.nextQuestion(); }, 800);
  }

  handleWrong(x, y) {
    this.combo = 0;
    this.lives--;
    sfx.playWrong();
    for (let i = 0; i < 10; i++) this.particles.push(new Particle(x, y, '#ef4444'));
    this.updateHUD();
    if (this.lives <= 0) setTimeout(() => this.endGame(), 500);
    else setTimeout(() => { if (this.active) this.nextQuestion(); }, 800);
  }

  updateParticles() { this.particles = this.particles.filter(p => { p.update(); return p.life > 0; }); }
  drawParticles() { this.particles.forEach(p => p.draw(this.ctx)); }

  endGame() {
    this.stop();
    sfx.playGameOver();
    this.onGameOver(this.score);
  }

  update() { this.updateParticles(); }
  draw() {} // override

  loop() {
    if (!this.active) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

// ==================== SHOOTER GAME ====================
class ShooterGame extends GameEngine {
  constructor(canvas, ctx, soalGen, onGameOver) {
    super(canvas, ctx, soalGen, onGameOver);
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 80;
    this.bullets = [];
    this.enemies = [];
    this.lastShot = 0;
  }
  onShoot() {
    if (!this.active) return;
    const now = Date.now();
    if (now - this.lastShot < 250) return;
    this.lastShot = now;
    sfx.playShoot();
    this.bullets.push({ x: this.playerX, y: this.playerY - 20 });
  }
  spawnGameObjects() {
    this.enemies = [];
    if (!this.currentQ) return;
    const choices = this.currentQ.choices;
    const spacing = this.canvas.width / (choices.length + 1);
    choices.forEach((choice, i) => {
      this.enemies.push({
        x: spacing * (i + 1) - 40, y: 100 + Math.random() * 100,
        width: 80, height: 60, speed: 0.5 + Math.random() * 0.5,
        answer: choice, isCorrect: choice === this.currentQ.answer,
        alive: true, color: ['#ef4444','#3b82f6','#22c55e','#f59e0b'][i % 4],
        bounce: Math.random() * Math.PI * 2
      });
    });
  }
  update() {
    if (!this.active) return;
    if (this.keys['ArrowLeft'] || this.keys['a']) this.playerX -= 6;
    if (this.keys['ArrowRight'] || this.keys['d']) this.playerX += 6;
    this.playerX = Math.max(30, Math.min(this.canvas.width - 30, this.playerX));
    this.bullets = this.bullets.filter(b => { b.y -= 10; return b.y > -20; });
    this.enemies.forEach(e => {
      if (!e.alive) return;
      e.y += e.speed; e.bounce += 0.05;
      if (e.y > this.canvas.height - 60) {
        e.alive = false;
        if (e.isCorrect) { this.lives--; this.combo = 0; sfx.playWrong(); this.updateHUD(); if (this.lives <= 0) setTimeout(() => this.endGame(), 500); else setTimeout(() => { if (this.active) this.nextQuestion(); }, 800); }
      }
    });
    this.bullets.forEach(b => {
      this.enemies.forEach(e => {
        if (!e.alive) return;
        if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
          b.y = -100; e.alive = false;
          if (e.isCorrect) this.handleCorrect(e.x + e.width/2, e.y + e.height/2);
          else this.handleWrong(e.x + e.width/2, e.y + e.height/2);
        }
      });
    });
    super.update();
  }
  draw() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) { const x = (i*137)%w, y = (i*97)%h; ctx.globalAlpha = 0.3+Math.sin(Date.now()*0.001+i)*0.2; ctx.fillRect(x, y, 1.5, 1.5); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#166534'; ctx.fillRect(0, h-60, w, 60);
    ctx.fillStyle = '#22c55e'; for (let i = 0; i < w; i += 40) ctx.fillRect(i, h-60, 2, 60);
    ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(this.playerX, this.playerY-25); ctx.lineTo(this.playerX-20, this.playerY+15); ctx.lineTo(this.playerX+20, this.playerY+15); ctx.closePath(); ctx.fill();
    this.bullets.forEach(b => { ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 10; ctx.fillRect(b.x-3, b.y, 6, 15); ctx.shadowBlur = 0; });
    this.enemies.forEach(e => {
      if (!e.alive) return;
      const by = Math.sin(e.bounce)*3;
      ctx.fillStyle = e.color; ctx.fillRect(e.x, e.y+by, e.width, e.height);
      ctx.strokeStyle = e.isCorrect ? '#22c55e' : '#ef4444'; ctx.lineWidth = 3; ctx.strokeRect(e.x, e.y+by, e.width, e.height);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e.answer, e.x+e.width/2, e.y+by+e.height/2);
    });
    this.drawParticles();
  }
}

// ==================== BUBBLE GAME ====================
class BubbleGame extends GameEngine {
  constructor(canvas, ctx, soalGen, onGameOver) {
    super(canvas, ctx, soalGen, onGameOver);
    this.bubbles = [];
  }
  spawnGameObjects() {
    this.bubbles = [];
    if (!this.currentQ) return;
    const choices = this.currentQ.choices;
    const spacing = this.canvas.width / (choices.length + 1);
    choices.forEach((choice, i) => {
      this.bubbles.push({
        x: spacing*(i+1), y: this.canvas.height+50+Math.random()*200,
        radius: 45, speed: 1+Math.random()*1.5,
        answer: choice, isCorrect: choice === this.currentQ.answer,
        alive: true, color: ['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899'][i%6],
        wobble: Math.random()*Math.PI*2
      });
    });
  }
  onClick(x, y) {
    if (!this.active) return;
    for (let b of this.bubbles) {
      if (!b.alive) continue;
      if (Math.sqrt((x-b.x)**2+(y-b.y)**2) < b.radius) {
        b.alive = false; sfx.playPop();
        if (b.isCorrect) this.handleCorrect(b.x, b.y); else this.handleWrong(b.x, b.y);
        return;
      }
    }
  }
  update() {
    if (!this.active) return;
    this.bubbles.forEach(b => {
      if (!b.alive) return;
      b.y -= b.speed; b.wobble += 0.05; b.x += Math.sin(b.wobble)*0.5;
      if (b.y < -b.radius) {
        b.alive = false;
        if (b.isCorrect) { this.lives--; this.combo=0; sfx.playWrong(); this.updateHUD(); if (this.lives<=0) setTimeout(()=>this.endGame(),500); else setTimeout(()=>{if(this.active)this.nextQuestion();},800); }
      }
    });
    super.update();
  }
  draw() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'#0ea5e9'); grad.addColorStop(1,'#0369a1');
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i=0;i<20;i++){const x=(i*73)%w,y=(Date.now()*0.05+i*100)%h;ctx.beginPath();ctx.arc(x,y,3+(i%5),0,Math.PI*2);ctx.fill();}
    this.bubbles.forEach(b => {
      if (!b.alive) return;
      const grad = ctx.createRadialGradient(b.x-10,b.y-10,5,b.x,b.y,b.radius);
      grad.addColorStop(0,'rgba(255,255,255,0.4)'); grad.addColorStop(0.5,b.color); grad.addColorStop(1,b.color);
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x,b.y,b.radius,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(b.x-12,b.y-12,10,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(b.x,b.y,b.radius,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.answer, b.x, b.y);
    });
    this.drawParticles();
  }
}

// ==================== RUNNER GAME ====================
class RunnerGame extends GameEngine {
  constructor(canvas, ctx, soalGen, onGameOver) {
    super(canvas, ctx, soalGen, onGameOver);
    this.playerX = canvas.width/2; this.playerY = canvas.height-100;
    this.lanes = [];
  }
  spawnGameObjects() {
    this.lanes = [];
    if (!this.currentQ) return;
    const choices = this.currentQ.choices;
    const lw = this.canvas.width / choices.length;
    choices.forEach((choice, i) => {
      this.lanes.push({ x: i*lw, width: lw, answer: choice, isCorrect: choice===this.currentQ.answer, color: ['#ef4444','#3b82f6','#22c55e','#f59e0b'][i%4] });
    });
  }
  onClick(x, y) {
    if (!this.active) return;
    for (let lane of this.lanes) {
      if (x >= lane.x && x <= lane.x+lane.width) {
        sfx.playCorrect();
        if (lane.isCorrect) this.handleCorrect(x, y); else this.handleWrong(x, y);
        return;
      }
    }
  }
  update() {
    if (!this.active) return;
    if (this.keys['ArrowLeft']||this.keys['a']) this.playerX -= 6;
    if (this.keys['ArrowRight']||this.keys['d']) this.playerX += 6;
    this.playerX = Math.max(30, Math.min(this.canvas.width-30, this.playerX));
    super.update();
  }
  draw() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'#fbbf24'); grad.addColorStop(0.5,'#f97316'); grad.addColorStop(1,'#dc2626');
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(w-100,80,50,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#166534'; ctx.fillRect(0,h-100,w,100);
    this.lanes.forEach(lane => {
      ctx.fillStyle = lane.color; ctx.fillRect(lane.x,h-200,lane.width,100);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center'; ctx.fillText(lane.answer, lane.x+lane.width/2, h-150);
    });
    ctx.font = '50px Arial'; ctx.textAlign = 'center'; ctx.fillText('🏃', this.playerX, this.playerY);
    this.drawParticles();
  }
}

// ==================== MEMORY GAME ====================
class MemoryGame extends GameEngine {
  constructor(canvas, ctx, soalGen, onGameOver) {
    super(canvas, ctx, soalGen, onGameOver);
    this.cards = []; this.flipped = []; this.matched = 0;
  }
  spawnGameObjects() {
    this.cards = []; this.flipped = []; this.matched = 0;
    if (!this.currentQ) return;
    const choices = this.currentQ.choices;
    const pairs = [];
    pairs.push({text: this.currentQ.text, isQ: true, mid: 0});
    pairs.push({text: this.currentQ.answer, isQ: false, mid: 0});
    choices.filter(c=>c!==this.currentQ.answer).slice(0,3).forEach((c,i)=>{
      pairs.push({text:'Soal '+(i+1), isQ:true, mid:i+1});
      pairs.push({text:c, isQ:false, mid:i+1});
    });
    const shuffled = shuffleArray(pairs);
    const cols=4, rows=2;
    const cw = (this.canvas.width-40)/cols, ch = (this.canvas.height-150)/rows;
    shuffled.forEach((item,i)=>{
      const col=i%cols, row=Math.floor(i/cols);
      this.cards.push({x:20+col*cw+5, y:100+row*ch+5, width:cw-10, height:ch-10, text:item.text, isQ:item.isQ, mid:item.mid, flipped:false, matched:false});
    });
  }
  onClick(x, y) {
    if (!this.active || this.flipped.length>=2) return;
    for (let card of this.cards) {
      if (card.flipped||card.matched) continue;
      if (x>=card.x&&x<=card.x+card.width&&y>=card.y&&y<=card.y+card.height) {
        card.flipped = true; this.flipped.push(card); sfx.playFlip();
        if (this.flipped.length===2) setTimeout(()=>this.checkMatch(), 800);
        return;
      }
    }
  }
  checkMatch() {
    const [c1,c2] = this.flipped;
    if (c1.mid===c2.mid && c1.isQ!==c2.isQ) {
      c1.matched=true; c2.matched=true; this.matched++;
      sfx.playCorrect();
      for(let i=0;i<10;i++) this.particles.push(new Particle((c1.x+c2.x)/2,(c1.y+c2.y)/2,'#22c55e'));
      if (c1.mid===0) this.handleCorrect((c1.x+c2.x)/2,(c1.y+c2.y)/2);
    } else { c1.flipped=false; c2.flipped=false; sfx.playWrong(); }
    this.flipped = [];
  }
  draw() {
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'#4c1d95'); grad.addColorStop(1,'#1e1b4b');
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
    this.cards.forEach(card => {
      if (card.matched) {
        ctx.fillStyle='#22c55e'; ctx.fillRect(card.x,card.y,card.width,card.height);
        ctx.fillStyle='#fff'; ctx.font='bold 20px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✓',card.x+card.width/2,card.y+card.height/2);
      } else if (card.flipped) {
        ctx.fillStyle='#fbbf24'; ctx.fillRect(card.x,card.y,card.width,card.height);
        ctx.fillStyle='#000'; ctx.font='bold 11px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle';
        const t = card.text.length>22?card.text.substring(0,20)+'...':card.text;
        ctx.fillText(t, card.x+card.width/2, card.y+card.height/2);
      } else {
        ctx.fillStyle='#8b5cf6'; ctx.fillRect(card.x,card.y,card.width,card.height);
        ctx.fillStyle='#fff'; ctx.font='30px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('?',card.x+card.width/2,card.y+card.height/2);
      }
    });
    this.drawParticles();
  }
}

// ==================== SPACE GAME ====================
class SpaceGame extends GameEngine {
  constructor(canvas, ctx, soalGen, onGameOver) {
    super(canvas, ctx, soalGen, onGameOver);
    this.playerX = canvas.width/2; this.playerY = canvas.height-80;
    this.bullets = []; this.asteroids = []; this.stars = []; this.lastShot = 0;
    for (let i=0;i<100;i++) this.stars.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, size:Math.random()*2, speed:0.5+Math.random()*1.5});
  }
  onShoot() {
    if (!this.active) return;
    const now = Date.now();
    if (now-this.lastShot<200) return;
    this.lastShot = now; sfx.playShoot();
    this.bullets.push({x:this.playerX, y:this.playerY-20});
  }
  spawnGameObjects() {
    this.asteroids = [];
    if (!this.currentQ) return;
    const choices = this.currentQ.choices;
    const spacing = this.canvas.width/(choices.length+1);
    choices.forEach((choice,i)=>{
      this.asteroids.push({
        x:spacing*(i+1)-35, y:-50-Math.random()*200, radius:35, speed:1+Math.random(),
        answer:choice, isCorrect:choice===this.currentQ.answer, alive:true,
        rotation:0, rotSpeed:(Math.random()-0.5)*0.1, color:['#78716c','#a8a29e','#57534e'][i%3]
      });
    });
  }
  update() {
    if (!this.active) return;
    if (this.keys['ArrowLeft']||this.keys['a']) this.playerX-=7;
    if (this.keys['ArrowRight']||this.keys['d']) this.playerX+=7;
    this.playerX = Math.max(30,Math.min(this.canvas.width-30,this.playerX));
    this.stars.forEach(s=>{s.y+=s.speed; if(s.y>this.canvas.height){s.y=0;s.x=Math.random()*this.canvas.width;}});
    this.bullets = this.bullets.filter(b=>{b.y-=12;return b.y>-20;});
    this.asteroids.forEach(a=>{
      if(!a.alive) return;
      a.y+=a.speed; a.rotation+=a.rotSpeed;
      if(a.y>this.canvas.height+50){
        a.alive=false;
        if(a.isCorrect){this.lives--;this.combo=0;sfx.playWrong();this.updateHUD();if(this.lives<=0)setTimeout(()=>this.endGame(),500);else setTimeout(()=>{if(this.active)this.nextQuestion();},800);}
      }
    });
    this.bullets.forEach(b=>{
      this.asteroids.forEach(a=>{
        if(!a.alive) return;
        const dist = Math.sqrt((b.x-a.x-a.radius)**2+(b.y-a.y-a.radius)**2);
        if(dist<a.radius){b.y=-100;a.alive=false;if(a.isCorrect)this.handleCorrect(a.x+a.radius,a.y+a.radius);else this.handleWrong(a.x+a.radius,a.y+a.radius);}
      });
    });
    super.update();
  }
  draw() {
    const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
    ctx.fillStyle='#020617'; ctx.fillRect(0,0,w,h);
    this.stars.forEach(s=>{ctx.fillStyle='#fff';ctx.globalAlpha=0.3+Math.sin(Date.now()*0.001+s.x)*0.3;ctx.fillRect(s.x,s.y,s.size,s.size);});
    ctx.globalAlpha=1;
    ctx.font='40px Arial'; ctx.textAlign='center'; ctx.fillText('🚀',this.playerX,this.playerY);
    this.bullets.forEach(b=>{ctx.strokeStyle='#ef4444';ctx.lineWidth=3;ctx.shadowColor='#ef4444';ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x,b.y+15);ctx.stroke();ctx.shadowBlur=0;});
    this.asteroids.forEach(a=>{
      if(!a.alive) return;
      ctx.save(); ctx.translate(a.x+a.radius,a.y+a.radius); ctx.rotate(a.rotation);
      ctx.fillStyle=a.color; ctx.beginPath();
      for(let i=0;i<8;i++){const angle=(i/8)*Math.PI*2,r=a.radius*(0.8+Math.random()*0.2);const x=Math.cos(angle)*r,y=Math.sin(angle)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.arc(-10,-10,8,0,Math.PI*2); ctx.arc(12,8,6,0,Math.PI*2); ctx.fill();
      ctx.restore();
      ctx.fillStyle='#fbbf24'; ctx.font='bold 16px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(a.answer,a.x+a.radius,a.y+a.radius);
    });
    this.drawParticles();
  }
}

// ==================== MAIN APP ====================
let currentGame = null;
let currentType = '';
let soalGen = null;

const GAMES = {
  shooter: { name: 'Math Shooter', Class: ShooterGame },
  bubble: { name: 'Bubble Pop', Class: BubbleGame },
  runner: { name: 'Math Runner', Class: RunnerGame },
  memory: { name: 'Memory Match', Class: MemoryGame },
  space: { name: 'Space Math', Class: SpaceGame }
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

  canvas.width = 900;
  canvas.height = 600;

  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.game;
      startGame(type);
    });
  });

  function startGame(type) {
    sfx.playStart();
    currentType = type;
    const category = categorySelect?.value || 'SEMUA KELAS';
    soalGen = new SoalGenerator(category);

    mainMenu.classList.remove('active');
    gameScreen.classList.add('active');
    gameOverOverlay.style.display = 'none';

    const GameClass = GAMES[type].Class;
    currentGame = new GameClass(canvas, ctx, soalGen, (score) => showGameOver(score));

    // Setup keyboard controls
    currentGame.setupControls();

    // Setup click/touch
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      if (currentGame && typeof currentGame.onClick === 'function') {
        currentGame.onClick(x, y);
      }
    };

    currentGame.start(type);
  }

  function showGameOver(score) {
    gameOverOverlay.style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalStats').textContent = 'Kelas: ' + (categorySelect?.value || 'SEMUA') + ' | Game: ' + GAMES[currentType].name;
  }

  if (backBtn) backBtn.addEventListener('click', () => {
    if (currentGame) currentGame.stop();
    currentGame = null;
    gameScreen.classList.remove('active');
    mainMenu.classList.add('active');
    gameOverOverlay.style.display = 'none';
  });

  if (restartBtn) restartBtn.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    if (soalGen) soalGen.reset();
    if (currentType) startGame(currentType);
  });

  if (menuBtn) menuBtn.addEventListener('click', () => {
    if (currentGame) currentGame.stop();
    currentGame = null;
    gameScreen.classList.remove('active');
    mainMenu.classList.add('active');
    gameOverOverlay.style.display = 'none';
  });

  document.addEventListener('click', () => sfx.init(), { once: true });
});
