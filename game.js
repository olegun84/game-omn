// game.js - Main Game Logic v3

class MathShooterGame {
  constructor() {
    this.playerName = '';
    this.grade = '1';
    this.sessionId = this.generateSessionId();
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.health = 100;
    this.enemiesDefeated = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.currentEnemy = null;
    this.timerInterval = null;
    this.questionTime = 25000; // 25 detik
    this.timeLeft = 25000;
    this.enemySpeed = 0.7;
    this.wave = 1;
    this.gameActive = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createStars();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer || starsContainer.children.length > 0) return;
    
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      starsContainer.appendChild(star);
    }
  }

  setupEventListeners() {
    document.getElementById('startBtn')?.addEventListener('click', () => this.startGame());
    document.getElementById('playAgainBtn')?.addEventListener('click', () => this.restartGame());
    document.getElementById('menuBtn')?.addEventListener('click', () => this.showScreen('menuScreen'));
    document.getElementById('leaderboardBtn')?.addEventListener('click', () => this.showLeaderboard());
    document.getElementById('backFromLeaderboard')?.addEventListener('click', () => this.showScreen('menuScreen'));
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId)?.classList.add('active');
  }

  async startGame() {
    this.playerName = document.getElementById('playerName').value.trim() || 'Player';
    this.grade = document.getElementById('gradeSelect').value;
    
    // Reset state
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.health = 100;
    this.enemiesDefeated = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.currentQuestionIndex = 0;
    this.wave = 1;
    this.enemySpeed = 0.7;
    this.gameActive = true;
    
    // Generate soal dengan QuestionGenerator
    this.questions = await DB.getQuestions(this.grade, 15);
    
    const gradeLabel = this.grade === 'all' ? 'Semua Kelas' : `Kelas ${this.grade}`;
    document.getElementById('resultPlayerName').textContent = `Pemain: ${this.playerName} | ${gradeLabel}`;
    
    this.showScreen('gameScreen');
    this.updateHUD();
    this.startWave();
  }

  startWave() {
    if (!this.gameActive || this.currentQuestionIndex >= this.questions.length) {
      this.endGame();
      return;
    }
    
    this.spawnEnemy();
  }

  spawnEnemy() {
    const gameArea = document.querySelector('.game-area');
    if (!gameArea) return;
    
    document.querySelectorAll('.enemy').forEach(e => e.remove());
    
    const question = this.questions[this.currentQuestionIndex];
    const rand = Math.random();
    
    let enemyType, enemyEmoji;
    if (this.currentQuestionIndex > 0 && this.currentQuestionIndex % 5 === 4) {
      enemyType = 'boss';
      enemyEmoji = '👾';
    } else if (rand > 0.5) {
      enemyType = 'zombie';
      enemyEmoji = '🧟';
    } else {
      enemyType = 'helicopter';
      enemyEmoji = '🚁';
    }
    
    const enemy = document.createElement('div');
    enemy.className = `enemy ${enemyType}`;
    enemy.textContent = enemyEmoji;
    
    const areaHeight = gameArea.offsetHeight;
    
    if (enemyType === 'zombie' || enemyType === 'boss') {
      enemy.style.right = '-80px';
      enemy.style.bottom = '60px';
    } else {
      enemy.style.right = '-80px';
      enemy.style.top = (20 + Math.random() * (areaHeight / 2)) + 'px';
    }
    
    gameArea.appendChild(enemy);
    
    // KIRIM SOLUTION KE DATABASE UNTUK GURU
    this.updateActiveGameInDB(question);
    
    this.showQuestion(question);
    this.moveEnemy(enemy, enemyType);
    this.startTimer();
  }

  moveEnemy(enemy, type) {
    let position = -80;
    const gameArea = document.querySelector('.game-area');
    const areaWidth = gameArea?.offsetWidth || 800;
    
    const speed = type === 'boss' ? this.enemySpeed * 0.6 : this.enemySpeed;
    
    const moveInterval = setInterval(() => {
      if (!this.gameActive) {
        clearInterval(moveInterval);
        return;
      }
      
      position += speed;
      enemy.style.right = position + 'px';
      
      if (position > areaWidth + 80) {
        clearInterval(moveInterval);
        this.enemyReachedPlayer();
      }
    }, 50);
    
    this.currentEnemy = { element: enemy, interval: moveInterval };
  }

  enemyReachedPlayer() {
    this.health -= 20;
    this.combo = 0;
    this.questionsAnswered++;
    this.updateHUD();
    
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
      gameArea.style.animation = 'wrongShake 0.5s ease';
      setTimeout(() => {
        gameArea.style.animation = '';
      }, 500);
    }
    
    this.createExplosion('💥');
    
    setTimeout(() => {
      if (this.health <= 0) {
        this.endGame();
      } else {
        this.nextQuestion();
      }
    }, 1000);
  }

  showQuestion(question) {
    const questionText = document.getElementById('questionText');
    const questionTopic = document.getElementById('questionTopic');
    const optionsGrid = document.getElementById('optionsGrid');
    const waveIndicator = document.getElementById('waveIndicator');
    
    if (questionText) questionText.textContent = question.question;
    if (questionTopic) questionTopic.textContent = question.topic || 'Matematika';
    if (waveIndicator) waveIndicator.textContent = `SOAL ${this.currentQuestionIndex + 1} / ${this.questions.length}`;
    
    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => this.selectAnswer(index);
        optionsGrid.appendChild(btn);
      });
    }
  }

  startTimer() {
    this.timeLeft = this.questionTime;
    const timerFill = document.getElementById('timerFill');
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      if (!this.gameActive) return;
      
      this.timeLeft -= 100;
      const percentage = (this.timeLeft / this.questionTime) * 100;
      
      if (timerFill) {
        timerFill.style.width = percentage + '%';
      }
      
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timeUp();
      }
    }, 100);
  }

  timeUp() {
    if (this.currentEnemy?.interval) clearInterval(this.currentEnemy.interval);
    
    this.combo = 0;
    this.health -= 10;
    this.questionsAnswered++;
    this.updateHUD();
    
    const question = this.questions[this.currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    options.forEach((opt, idx) => {
      opt.style.pointerEvents = 'none';
      if (idx === question.correct_answer) {
        opt.classList.add('correct');
      }
    });
    
    this.createExplosion('⏰');
    
    setTimeout(() => {
      if (this.health <= 0) {
        this.endGame();
      } else {
        this.nextQuestion();
      }
    }, 1500);
  }

  selectAnswer(selectedIndex) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.currentEnemy?.interval) clearInterval(this.currentEnemy.interval);
    
    const question = this.questions[this.currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    const isCorrect = selectedIndex === question.correct_answer;
    
    this.questionsAnswered++;
    
    options.forEach(opt => {
      opt.style.pointerEvents = 'none';
    });
    
    if (isCorrect) {
      options[selectedIndex].classList.add('correct');
      this.combo++;
      this.correctAnswers++;
      
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      
      const timeBonus = Math.floor(this.timeLeft / 1000);
      const comboBonus = this.combo * 10;
      const baseScore = 100;
      const totalPoints = baseScore + timeBonus + comboBonus;
      
      this.score += totalPoints;
      this.enemiesDefeated++;
      
      const enemy = this.currentEnemy?.element;
      if (enemy) {
        const rect = enemy.getBoundingClientRect();
        const gameRect = document.querySelector('.game-area').getBoundingClientRect();
        const x = rect.left - gameRect.left + rect.width / 2;
        const y = rect.top - gameRect.top + rect.height / 2;
        
        enemy.classList.add('dying');
        this.createExplosion('💥', x, y);
        this.createScorePopup('+' + totalPoints, x, y);
        this.createParticles(x, y);
      }
      
      if (this.combo >= 3) {
        this.showCombo(this.combo);
      }
      
      if (this.enemiesDefeated % 5 === 0) {
        this.wave++;
        this.enemySpeed += 0.15;
      }
      
    } else {
      options[selectedIndex].classList.add('wrong');
      options[question.correct_answer].classList.add('correct');
      this.combo = 0;
      this.health -= 15;
      
      this.createExplosion('❌');
    }
    
    this.updateHUD();
    
    setTimeout(() => {
      if (this.health <= 0) {
        this.endGame();
      } else {
        this.nextQuestion();
      }
    }, 1500);
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame();
    } else {
      this.startWave();
    }
  }

  updateHUD() {
    const scoreEl = document.getElementById('scoreValue');
    const comboEl = document.getElementById('comboValue');
    const waveEl = document.getElementById('waveValue');
    const healthFill = document.getElementById('healthFill');
    const defeatedEl = document.getElementById('defeatedValue');
    
    if (scoreEl) scoreEl.textContent = this.score;
    if (comboEl) comboEl.textContent = this.combo + 'x';
    if (waveEl) waveEl.textContent = this.wave;
    if (defeatedEl) defeatedEl.textContent = this.enemiesDefeated;
    if (healthFill) healthFill.style.width = Math.max(0, this.health) + '%';
  }

  createExplosion(emoji, x, y) {
    const gameArea = document.querySelector('.game-area');
    if (!gameArea) return;
    
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.textContent = emoji;
    explosion.style.left = (x || gameArea.offsetWidth / 2) + 'px';
    explosion.style.top = (y || gameArea.offsetHeight / 2) + 'px';
    gameArea.appendChild(explosion);
    
    setTimeout(() => explosion.remove(), 800);
  }

  createScorePopup(text, x, y) {
    const gameArea = document.querySelector('.game-area');
    if (!gameArea) return;
    
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = (y - 30) + 'px';
    gameArea.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
  }

  createParticles(x, y) {
    const gameArea = document.querySelector('.game-area');
    if (!gameArea) return;
    
    const colors = ['#FF6584', '#6C63FF', '#00f5ff', '#39ff14', '#FFD600', '#ff00ff'];
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
      particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
      gameArea.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }

  showCombo(combo) {
    const indicator = document.createElement('div');
    indicator.className = 'combo-indicator';
    indicator.textContent = `🔥 ${combo}x COMBO! 🔥`;
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 1000);
  }

  async updateActiveGameInDB(question) {
    try {
      await DB.updateActiveGame(
        this.sessionId,
        this.playerName,
        this.grade,
        question.question,
        question.topic,
        question.options[question.correct_answer],
        question.options,
        question.solution || [],
        question.quick_tip || '',
        this.score
      );
    } catch (e) {
      console.log('DB update skipped');
    }
  }

  async endGame() {
    this.gameActive = false;
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.currentEnemy?.interval) clearInterval(this.currentEnemy.interval);
    
    const accuracy = this.questionsAnswered > 0 
      ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) 
      : 0;
    
    try {
      await DB.endGame(this.sessionId);
      await DB.saveScore(this.playerName, this.grade, this.score, this.enemiesDefeated, accuracy, this.maxCombo, this.sessionId);
    } catch (e) {
      console.log('DB save skipped');
    }
    
    this.showResults(accuracy);
  }

  showResults(accuracy) {
    this.showScreen('resultScreen');
    
    document.getElementById('resultScore').textContent = this.score;
    document.getElementById('resultDefeated').textContent = this.enemiesDefeated;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    document.getElementById('resultCombo').textContent = this.maxCombo + 'x';
    
    const resultEmoji = document.getElementById('resultEmoji');
    const resultTitle = document.getElementById('resultTitle');
    
    if (accuracy >= 80) {
      resultEmoji.textContent = '🏆';
      resultTitle.textContent = 'LUAR BIASA!';
    } else if (accuracy >= 60) {
      resultEmoji.textContent = '⭐';
      resultTitle.textContent = 'BAGUS!';
    } else if (accuracy >= 40) {
      resultEmoji.textContent = '💪';
      resultTitle.textContent = 'TERUS BERLATIH!';
    } else {
      resultEmoji.textContent = '📚';
      resultTitle.textContent = 'AYO BELAJAR LAGI!';
    }
  }

  restartGame() {
    this.sessionId = this.generateSessionId();
    this.showScreen('menuScreen');
  }

  async showLeaderboard() {
    this.showScreen('leaderboardScreen');
    
    const listEl = document.getElementById('leaderboardList');
    if (!listEl) return;
    
    listEl.innerHTML = '<li class="loading"><div class="loading-spinner"></div><p>Memuat...</p></li>';
    
    try {
      const { data } = await DB.getLeaderboard();
      
      if (data && data.length > 0) {
        listEl.innerHTML = data.map((item, index) => {
          const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
          const topClass = index < 3 ? `top-${index + 1}` : '';
          const gradeLabel = item.grade === 'all' ? 'Semua Kelas' : `Kelas ${item.grade}`;
          
          return `
            <li class="leaderboard-item ${topClass}">
              <span class="rank">${rankEmoji}</span>
              <div class="player-info">
                <div class="player-name-lb">${item.player_name}</div>
                <div class="player-grade">${gradeLabel} | Akurasi ${item.accuracy || 0}% | Combo ${item.max_combo || 0}x</div>
              </div>
              <span class="player-score-lb">${item.score}</span>
            </li>
          `;
        }).join('');
      } else {
        listEl.innerHTML = '<div class="no-games"><div class="no-games-emoji">🎮</div><p>Belum ada skor. Jadilah yang pertama!</p></div>';
      }
    } catch (e) {
      listEl.innerHTML = '<div class="no-games"><div class="no-games-emoji">📡</div><p>Mode offline - leaderboard tidak tersedia</p></div>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new MathShooterGame();
});
