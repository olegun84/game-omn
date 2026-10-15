// game.js - Main Game Logic

class MathShooterGame {
  constructor() {
    this.playerName = '';
    this.grade = 1;
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
    this.gameLoop = null;
    this.timerInterval = null;
    this.questionTime = 15000; // 15 seconds per question
    this.timeLeft = 15000;
    this.isPaused = false;
    this.enemies = [];
    this.enemySpeed = 1;
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
    if (!starsContainer) return;
    
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (2 + Math.random() * 3) + 's';
      starsContainer.appendChild(star);
    }
  }

  setupEventListeners() {
    // Start game button
    document.getElementById('startBtn')?.addEventListener('click', () => this.startGame());
    
    // Play again
    document.getElementById('playAgainBtn')?.addEventListener('click', () => this.restartGame());
    
    // Back to menu
    document.getElementById('menuBtn')?.addEventListener('click', () => this.showScreen('menuScreen'));
    
    // Leaderboard
    document.getElementById('leaderboardBtn')?.addEventListener('click', () => this.showLeaderboard());
    document.getElementById('backFromLeaderboard')?.addEventListener('click', () => this.showScreen('menuScreen'));
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId)?.classList.add('active');
  }

  async startGame() {
    this.playerName = document.getElementById('playerName').value.trim() || 'Player';
    this.grade = parseInt(document.getElementById('gradeSelect').value);
    
    // Reset game state
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.health = 100;
    this.enemiesDefeated = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.currentQuestionIndex = 0;
    this.wave = 1;
    this.enemySpeed = 1;
    this.gameActive = true;
    
    // Fetch questions
    try {
      this.questions = await DB.getQuestions(this.grade, 20);
    } catch (e) {
      this.questions = DB.getFallbackQuestions(this.grade, 20);
    }
    
    if (this.questions.length === 0) {
      this.questions = DB.getFallbackQuestions(this.grade, 20);
    }
    
    // Switch to game screen
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
    
    // Remove existing enemies
    document.querySelectorAll('.enemy').forEach(e => e.remove());
    
    const question = this.questions[this.currentQuestionIndex];
    const enemyType = Math.random() > 0.5 ? 'zombie' : 'helicopter';
    const enemyEmoji = enemyType === 'zombie' ? '🧟' : '🚁';
    
    const enemy = document.createElement('div');
    enemy.className = `enemy ${enemyType}`;
    enemy.textContent = enemyEmoji;
    
    // Position
    const areaWidth = gameArea.offsetWidth;
    const areaHeight = gameArea.offsetHeight;
    
    if (enemyType === 'zombie') {
      enemy.style.right = '-60px';
      enemy.style.bottom = '60px';
    } else {
      enemy.style.right = '-60px';
      enemy.style.top = (20 + Math.random() * (areaHeight / 2)) + 'px';
    }
    
    gameArea.appendChild(enemy);
    
    // Update active game in database
    this.updateActiveGameInDB(question);
    
    // Show question
    this.showQuestion(question);
    
    // Start enemy movement
    this.moveEnemy(enemy, enemyType);
    
    // Start timer
    this.startTimer();
  }

  moveEnemy(enemy, type) {
    let position = -60;
    const gameArea = document.querySelector('.game-area');
    const areaWidth = gameArea?.offsetWidth || 800;
    const speed = this.enemySpeed * (type === 'zombie' ? 0.5 : 1);
    
    const moveInterval = setInterval(() => {
      if (!this.gameActive || this.isPaused) return;
      
      position += speed;
      
      if (type === 'zombie') {
        enemy.style.right = position + 'px';
      } else {
        enemy.style.right = position + 'px';
      }
      
      // Enemy reached the player
      if (position > areaWidth + 60) {
        clearInterval(moveInterval);
        this.enemyReachedPlayer();
      }
    }, 50);
    
    this.currentEnemy = { element: enemy, interval: moveInterval };
  }

  enemyReachedPlayer() {
    this.health -= 20;
    this.combo = 0;
    this.updateHUD();
    
    // Screen shake effect
    document.querySelector('.game-area').style.animation = 'wrongShake 0.5s ease';
    setTimeout(() => {
      document.querySelector('.game-area').style.animation = '';
    }, 500);
    
    if (this.health <= 0) {
      this.endGame();
    } else {
      this.nextQuestion();
    }
  }

  showQuestion(question) {
    const questionText = document.getElementById('questionText');
    const questionTopic = document.getElementById('questionTopic');
    const optionsGrid = document.getElementById('optionsGrid');
    
    if (questionText) questionText.textContent = question.question;
    if (questionTopic) questionTopic.textContent = question.topic;
    
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
      if (this.isPaused) return;
      
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
    this.combo = 0;
    this.health -= 10;
    this.questionsAnswered++;
    this.updateHUD();
    
    // Show correct answer
    const question = this.questions[this.currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    options.forEach((opt, idx) => {
      if (idx === question.correct_answer) {
        opt.classList.add('correct');
      }
    });
    
    // Create explosion for wrong answer
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
    
    // Disable all options
    options.forEach(opt => {
      opt.style.pointerEvents = 'none';
    });
    
    if (isCorrect) {
      // Correct answer!
      options[selectedIndex].classList.add('correct');
      this.combo++;
      this.correctAnswers++;
      
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      
      // Calculate score with combo bonus
      const timeBonus = Math.floor(this.timeLeft / 1000);
      const comboBonus = this.combo * 10;
      const baseScore = 100;
      const totalPoints = baseScore + timeBonus + comboBonus;
      
      this.score += totalPoints;
      this.enemiesDefeated++;
      
      // Kill enemy animation
      const enemy = this.currentEnemy?.element;
      if (enemy) {
        enemy.classList.add('dying');
        this.createExplosion('💥', enemy.offsetLeft, enemy.offsetTop);
        this.createScorePopup('+' + totalPoints, enemy.offsetLeft, enemy.offsetTop);
      }
      
      // Show combo indicator
      if (this.combo >= 3) {
        this.showCombo(this.combo);
      }
      
      // Create particles
      this.createParticles(enemy?.offsetLeft || 400, enemy?.offsetTop || 150);
      
      // Increase difficulty
      if (this.enemiesDefeated % 5 === 0) {
        this.wave++;
        this.enemySpeed += 0.3;
      }
      
    } else {
      // Wrong answer
      options[selectedIndex].classList.add('wrong');
      options[question.correct_answer].classList.add('correct');
      this.combo = 0;
      this.health -= 15;
      
      this.createExplosion('❌');
    }
    
    this.updateHUD();
    
    // Update active game in DB
    DB.updateActiveGame(
      this.sessionId,
      this.playerName,
      this.grade,
      question.id,
      question.question,
      question.options[question.correct_answer],
      question.options,
      this.score
    );
    
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
    popup.style.left = (x || gameArea.offsetWidth / 2) + 'px';
    popup.style.top = (y || gameArea.offsetHeight / 2 - 30) + 'px';
    gameArea.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
  }

  createParticles(x, y) {
    const gameArea = document.querySelector('.game-area');
    if (!gameArea) return;
    
    const colors = ['#FF6584', '#6C63FF', '#00f5ff', '#39ff14', '#FFD600', '#ff00ff'];
    
    for (let i = 0; i < 15; i++) {
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
        question.id,
        question.question,
        question.options[question.correct_answer],
        question.options,
        this.score
      );
    } catch (e) {
      console.log('DB update skipped (offline mode)');
    }
  }

  async endGame() {
    this.gameActive = false;
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.currentEnemy?.interval) clearInterval(this.currentEnemy.interval);
    
    // End game session in DB
    try {
      await DB.endGame(this.sessionId);
      await DB.saveScore(this.playerName, this.grade, this.score, this.enemiesDefeated, this.sessionId);
    } catch (e) {
      console.log('DB save skipped (offline mode)');
    }
    
    // Show results
    this.showResults();
  }

  showResults() {
    this.showScreen('resultScreen');
    
    const accuracy = this.questionsAnswered > 0 
      ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) 
      : 0;
    
    document.getElementById('resultScore').textContent = this.score;
    document.getElementById('resultDefeated').textContent = this.enemiesDefeated;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    document.getElementById('resultCombo').textContent = this.maxCombo + 'x';
    
    // Set result emoji based on performance
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
    
    listEl.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Memuat...</p></div>';
    
    try {
      const { data } = await DB.getLeaderboard(this.grade);
      
      if (data && data.length > 0) {
        listEl.innerHTML = data.map((item, index) => {
          const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
          const topClass = index < 3 ? `top-${index + 1}` : '';
          
          return `
            <li class="leaderboard-item ${topClass}">
              <span class="rank">${rankEmoji}</span>
              <div class="player-info">
                <div class="player-name-lb">${item.player_name}</div>
                <div class="player-grade">Grade ${item.grade} | ${item.enemies_defeated} musuh</div>
              </div>
              <span class="player-score-lb">${item.score}</span>
            </li>
          `;
        }).join('');
      } else {
        listEl.innerHTML = '<div class="no-games"><div class="no-games-emoji">🎮</div><p>Belum ada skor. Jadilah yang pertama!</p></div>';
      }
    } catch (e) {
      listEl.innerHTML = '<div class="no-games"><div class="no-games-emoji">📡</div><p>Tidak dapat memuat leaderboard</p></div>';
    }
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new MathShooterGame();
});