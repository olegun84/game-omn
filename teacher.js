// teacher.js - Teacher Dashboard Logic v3

class TeacherDashboard {
  constructor() {
    this.isAuthenticated = false;
    this.currentFilter = 'all';
    this.refreshInterval = null;
    this.TEACHER_PASSWORD = 'guru2026';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createStars();
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
    document.getElementById('loginBtn')?.addEventListener('click', () => this.login());
    document.getElementById('teacherPassword')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.login();
    });
    
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    document.getElementById('refreshBtn')?.addEventListener('click', () => this.fetchData());
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.grade;
        this.fetchData();
      });
    });
  }

  login() {
    const password = document.getElementById('teacherPassword')?.value;
    
    if (password === this.TEACHER_PASSWORD) {
      this.isAuthenticated = true;
      this.showScreen('dashboardScreen');
      this.fetchData();
      this.startAutoRefresh();
    } else {
      alert('❌ Password salah! Coba lagi.');
      const input = document.getElementById('teacherPassword');
      if (input) input.value = '';
    }
  }

  logout() {
    this.isAuthenticated = false;
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.showScreen('loginScreen');
    const input = document.getElementById('teacherPassword');
    if (input) input.value = '';
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId)?.classList.add('active');
  }

  startAutoRefresh() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      if (this.isAuthenticated) {
        this.fetchData();
      }
    }, 5000);
  }

  async fetchData() {
    const grid = document.getElementById('activeGamesGrid');
    if (!grid) return;
    
    try {
      let { data: games, error } = await DB.getActiveGames();
      
      if (error) throw error;
      
      if (this.currentFilter !== 'all') {
        games = games.filter(g => g.grade === this.currentFilter);
      }
      
      this.updateStats(games);
      
      if (games && games.length > 0) {
        grid.innerHTML = games.map(game => this.renderGameCard(game)).join('');
      } else {
        grid.innerHTML = `
          <div class="no-games" style="grid-column: 1 / -1;">
            <div class="no-games-emoji">🎮</div>
            <p>Tidak ada siswa yang sedang bermain saat ini</p>
            <p style="font-size: 0.8rem; margin-top: 10px; color: #666;">
              Data muncul otomatis ketika siswa mulai bermain
            </p>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error fetching data:', e);
      grid.innerHTML = `
        <div class="no-games" style="grid-column: 1 / -1;">
          <div class="no-games-emoji">📡</div>
          <p>Tidak dapat terhubung ke database</p>
          <p style="font-size: 0.8rem; margin-top: 10px; color: #666;">
            Pastikan Supabase sudah dikonfigurasi dengan benar
          </p>
        </div>
      `;
    }
  }

  updateStats(games) {
    const totalActive = document.getElementById('totalActive');
    const totalScore = document.getElementById('totalScore');
    const avgScore = document.getElementById('avgScore');
    const highestScore = document.getElementById('highestScore');
    
    if (totalActive) totalActive.textContent = games.length;
    
    if (games.length > 0) {
      const scores = games.map(g => g.score || 0);
      const total = scores.reduce((a, b) => a + b, 0);
      
      if (totalScore) totalScore.textContent = total;
      if (avgScore) avgScore.textContent = Math.round(total / games.length);
      if (highestScore) highestScore.textContent = Math.max(...scores);
    } else {
      if (totalScore) totalScore.textContent = '0';
      if (avgScore) avgScore.textContent = '0';
      if (highestScore) highestScore.textContent = '0';
    }
  }

  renderGameCard(game) {
    const options = game.options || [];
    const correctAnswer = game.correct_answer || '-';
    const solution = game.solution || [];
    const quickTip = game.quick_tip || '';
    
    const optionsHtml = options.map((opt) => {
      const isCorrect = opt === correctAnswer;
      return `<div class="game-card-option ${isCorrect ? 'is-correct' : ''}">${opt} ${isCorrect ? '✅' : ''}</div>`;
    }).join('');
    
    const solutionHtml = solution.length > 0 ? `
      <div class="solution-box">
        <div class="solution-title">📝 Cara Menyelesaikan (Metode Termudah)</div>
        <ol class="solution-steps">
          ${solution.map(step => `<li>${step}</li>`).join('')}
        </ol>
        ${quickTip ? `<div class="quick-tip">${quickTip}</div>` : ''}
      </div>
    ` : '';
    
    const timeAgo = this.getTimeAgo(game.updated_at);
    const gradeLabel = game.grade === 'all' ? 'Campuran' : `Kelas ${game.grade}`;
    
    return `
      <div class="game-card">
        <div class="game-card-header">
          <span class="game-card-player">🎮 ${game.player_name}</span>
          <span class="game-card-grade">${gradeLabel}</span>
        </div>
        
        <div class="game-card-topic">📌 ${game.current_topic || 'Matematika'}</div>
        
        <div class="game-card-question">
          <strong>📝 Soal:</strong><br>
          ${game.current_question || 'Memuat...'}
        </div>
        
        <div class="game-card-answer">
          <div class="answer-label">✅ Kunci Jawaban</div>
          <div class="answer-value">${correctAnswer}</div>
        </div>
        
        <div class="game-card-options">
          ${optionsHtml}
        </div>
        
        ${solutionHtml}
        
        <div class="game-card-score">
          <span style="color: #aaa; font-size: 0.8rem;">⏱️ ${timeAgo}</span>
          <span class="score-display">🎯 ${game.score || 0}</span>
        </div>
      </div>
    `;
  }

  getTimeAgo(dateString) {
    if (!dateString) return 'baru saja';
    
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 10) return 'baru saja';
    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.teacherDashboard = new TeacherDashboard();
});
