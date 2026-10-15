// supabase.js - Konfigurasi Supabase + Integrasi Generator

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

let supabaseClient = null;
try {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn('Supabase belum dikonfigurasi, mode offline aktif');
}

const DB = {
  // Generate soal menggunakan QuestionGenerator
  async getQuestions(grade, count = 15) {
    // Selalu gunakan generator untuk soal tak terbatas
    if (grade === 'all') {
      return QuestionGenerator.generateMixed(count);
    }
    return QuestionGenerator.generate(parseInt(grade), count);
  },

  // Simpan skor
  async saveScore(playerName, grade, score, enemiesDefeated, accuracy, maxCombo, sessionId) {
    if (!supabaseClient) return { error: 'offline' };
    
    const { data, error } = await supabaseClient
      .from('player_scores')
      .insert([{
        player_name: playerName,
        grade: String(grade),
        score: score,
        enemies_defeated: enemiesDefeated,
        accuracy: accuracy,
        max_combo: maxCombo,
        game_session: sessionId
      }]);
    
    return { data, error };
  },

  // Update sesi game aktif dengan SOLUTION
  async updateActiveGame(sessionId, playerName, grade, question, topic, correctAnswer, options, solution, quickTip, score) {
    if (!supabaseClient) return { error: 'offline' };
    
    const { data, error } = await supabaseClient
      .from('active_games')
      .upsert([{
        session_id: sessionId,
        player_name: playerName,
        grade: String(grade),
        current_question: question,
        current_topic: topic,
        correct_answer: correctAnswer,
        options: options,
        solution: solution,
        quick_tip: quickTip,
        score: score,
        is_active: true,
        updated_at: new Date().toISOString()
      }], { onConflict: 'session_id' });
    
    return { data, error };
  },

  // End game session
  async endGame(sessionId) {
    if (!supabaseClient) return { error: 'offline' };
    
    const { data, error } = await supabaseClient
      .from('active_games')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('session_id', sessionId);
    
    return { data, error };
  },

  // Get all active games (untuk guru)
  async getActiveGames() {
    if (!supabaseClient) return { data: [], error: 'offline' };
    
    const { data, error } = await supabaseClient
      .from('active_games')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });
    
    return { data: data || [], error };
  },

  // Get leaderboard
  async getLeaderboard(grade = null) {
    if (!supabaseClient) return { data: [], error: 'offline' };
    
    let query = supabaseClient
      .from('player_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);
    
    if (grade) {
      query = query.eq('grade', String(grade));
    }
    
    const { data, error } = await query;
    return { data: data || [], error };
  }
};
