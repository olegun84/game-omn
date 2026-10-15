// teacher.js - Teacher Dashboard Logic

class TeacherDashboard {
  constructor() {
    this.isAuthenticated = false;
    this.currentFilter = 'all';
    this.refreshInterval = null;
    this.TEACHER_PASSWORD = 'guru2026'; // Change this in production!
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createStars();
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
      starsContainer.appendChild(star);
    }
  }

  setupEventListeners() {
    // Login
    document.getElementById('loginBtn')?.addEventListener('click', () => this.login());
    document.getElementById('teacherPassword')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.login();
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    
    // Refresh
    document.getElementById('refreshBtn')?.addEventListener('click', () => this.fetchData());
    
    // Filter buttons
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
      document.getElementById('teacherPassword').value = '';
    }
  }

  logout() {
    this.isAuthenticated = false;
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.showScreen('loginScreen');
    document.getElementById('teacherPassword').value = '';
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
    }, 5000); // Refresh every 5 seconds
  }

  async fetchData() {
    const grid = document.getElementById('activeGamesGrid');
    if (!grid) return;
    
    try {
      let { data: games, error } = await DB.getActiveGames();
      
      if (error) throw error;
      
      // Filter by grade if needed
      if (this.currentFilter !== 'all') {
        games = games.filter(g => g.grade === parseInt(this.currentFilter));
      }
      
      // Update stats
      this.updateStats(games);
      
      // Render game cards
      if (games && games.length > 0) {
        grid.innerHTML = games.map(game => this.renderGameCard(game)).join('');
      } else {
        grid.innerHTML = `
          <div class="no-games" style="grid-column: 1 / -1;">
            <div class="no-games-emoji">🎮</div>
            <p>Tidak ada siswa yang sedang bermain saat ini</p>
            <p style="font-size: 0.8rem; margin-top: 10px; color: #666;">
              Data akan muncul otomatis ketika siswa mulai bermain
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
    const totalDefeated = document.getElementById('totalDefeated');
    const avgScore = document.getElementById('avgScore');
    const highestScore = document.getElementById('highestScore');
    
    if (totalActive) totalActive.textContent = games.length;
    
    if (games.length > 0) {
      const scores = games.map(g => g.score || 0);
      const totalScore = scores.reduce((a, b) => a + b, 0);
      
      if (totalDefeated) totalDefeated.textContent = games.reduce((a, g) => a + (g.enemies_defeated || 0), 0);
      if (avgScore) avgScore.textContent = Math.round(totalScore / games.length);
      if (highestScore) highestScore.textContent = Math.max(...scores);
    } else {
      if (totalDefeated) totalDefeated.textContent = '0';
      if (avgScore) avgScore.textContent = '0';
      if (highestScore) highestScore.textContent = '0';
    }
  }

  renderGameCard(game) {
    const options = game.options || [];
    const correctAnswer = game.correct_answer || '-';
    
    const optionsHtml = options.map((opt, idx) => {
      const isCorrect = opt === correctAnswer;
      return `<div class="game-card-option ${isCorrect ? 'is-correct' : ''}">${opt} ${isCorrect ? '✅' : ''}</div>`;
    }).join('');
    
    const timeAgo = this.getTimeAgo(game.updated_at);
    
    return `
      <div class="game-card">
        <div class="game-card-header">
          <span class="game-card-player">🎮 ${game.player_name}</span>
          <span class="game-card-grade">Kelas ${game.grade}</span>
        </div>
        
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.teacherDashboard = new TeacherDashboard();
});