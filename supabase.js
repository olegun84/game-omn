// supabase.js - Konfigurasi Supabase Client
// GANTI URL DAN KEY DI BAWAH DENGAN PUNYA KAMU

const SUPABASE_URL = 'https://afqskvqritwyeduqsvyr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_W0xHaMYNdiUGwRPXN37J5A_yaRurxgW';

// Inisialisasi Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper functions untuk database
const DB = {
  // Ambil soal random untuk grade tertentu
  async getQuestions(grade, count = 10) {
    const { data, error } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('grade', grade)
      .limit(count);
    
    if (error) {
      console.error('Error fetching questions:', error);
      return this.getFallbackQuestions(grade, count);
    }
    
    // Shuffle array
    return data.sort(() => Math.random() - 0.5);
  },

  // Fallback questions jika database belum di-setup
  getFallbackQuestions(grade, count) {
    const allQuestions = {
      1: [
        { id: 1, question: 'Lanjutkan pola: 2, 4, 6, 8, ...?', options: ['9', '10', '11', '12'], correct_answer: 1, topic: 'Pola Bilangan' },
        { id: 2, question: 'Ibu punya 5 apel. Dibelinya lagi 3. Total?', options: ['6', '7', '8', '9'], correct_answer: 2, topic: 'Penjumlahan' },
        { id: 3, question: 'Adi punya 10 permen. Diberikan 4. Sisa?', options: ['5', '6', '7', '8'], correct_answer: 1, topic: 'Pengurangan' },
        { id: 4, question: 'Mana yang lebih besar? 15 atau 12?', options: ['12', '15', 'Sama', 'Tidak tahu'], correct_answer: 1, topic: 'Perbandingan' },
        { id: 5, question: 'Berapa sisi segitiga?', options: ['2', '3', '4', '5'], correct_answer: 1, topic: 'Bangun Datar' },
        { id: 6, question: '🔴🔵🔴🔵🔴...? Selanjutnya?', options: ['🔴', '🔵', '🟢', '🟡'], correct_answer: 1, topic: 'Pola Gambar' },
        { id: 7, question: 'Jika 🍎=2 dan 🍊=3, 🍎+🍊=?', options: ['4', '5', '6', '7'], correct_answer: 1, topic: 'Logika' },
        { id: 8, question: '1, 3, 5, 7, ...? Selanjutnya?', options: ['8', '9', '10', '11'], correct_answer: 1, topic: 'Pola Bilangan' },
        { id: 9, question: '7 + 8 = ...?', options: ['13', '14', '15', '16'], correct_answer: 2, topic: 'Penjumlahan' },
        { id: 10, question: 'Kegiatan pagi hari?', options: ['Tidur', 'Makan siang', 'Bangun tidur', 'Main malam'], correct_answer: 2, topic: 'Waktu' },
      ],
      2: [
        { id: 11, question: '5, 10, 15, 20, ...?', options: ['22', '25', '30', '35'], correct_answer: 1, topic: 'Pola Bilangan' },
        { id: 12, question: '245 + 132 = ...?', options: ['367', '377', '387', '357'], correct_answer: 1, topic: 'Penjumlahan' },
        { id: 13, question: '500 - 237 = ...?', options: ['263', '273', '253', '283'], correct_answer: 0, topic: 'Pengurangan' },
        { id: 14, question: '3 × 4 = ...?', options: ['7', '10', '12', '14'], correct_answer: 2, topic: 'Perkalian' },
        { id: 15, question: '12 ÷ 3 = ...?', options: ['3', '4', '5', '6'], correct_answer: 1, topic: 'Pembagian' },
        { id: 16, question: 'Angka 7 pada 375 nilainya?', options: ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan'], correct_answer: 1, topic: 'Nilai Tempat' },
        { id: 17, question: 'Ani beli 25+18 permen. Total?', options: ['42', '43', '44', '45'], correct_answer: 1, topic: 'Soal Cerita' },
        { id: 18, question: 'Huruf mana simetri lipat?', options: ['F', 'G', 'A', 'Z'], correct_answer: 2, topic: 'Simetri' },
        { id: 19, question: 'Mana berbeda? 🐱🐶🐰🌸', options: ['🐱', '🐶', '🐰', '🌸'], correct_answer: 3, topic: 'Logika' },
        { id: 20, question: '3, 6, 9, 12, ...?', options: ['13', '14', '15', '16'], correct_answer: 2, topic: 'Pola Bilangan' },
      ],
      3: [
        { id: 21, question: '20 + 5 × 3 = ...?', options: ['75', '35', '25', '65'], correct_answer: 1, topic: 'Operasi Campuran' },
        { id: 22, question: '100 - 4 × 10 = ...?', options: ['60', '960', '40', '50'], correct_answer: 0, topic: 'Operasi Campuran' },
        { id: 23, question: '1, 4, 9, 16, 25, ...?', options: ['30', '35', '36', '49'], correct_answer: 2, topic: 'Pola Bilangan' },
        { id: 24, question: 'Mana lebih besar? 1/2 atau 1/4?', options: ['1/2', '1/4', 'Sama', 'Tidak tahu'], correct_answer: 0, topic: 'Pecahan' },
        { id: 25, question: 'Keliling persegi sisi 8 cm?', options: ['16 cm', '24 cm', '32 cm', '64 cm'], correct_answer: 2, topic: 'Keliling' },
        { id: 26, question: '3 buku = Rp6.000. 5 buku =?', options: ['8.000', '10.000', '12.000', '15.000'], correct_answer: 1, topic: 'Tabel' },
        { id: 27, question: '60 telur, dijual 25, pecah 5. Sisa?', options: ['25', '30', '35', '40'], correct_answer: 1, topic: 'Soal Cerita' },
        { id: 28, question: '2:4 = 3:...?', options: ['5', '6', '7', '8'], correct_answer: 1, topic: 'Analogi' },
        { id: 29, question: 'A=1, B=2, C=3. A+B+C=?', options: ['5', '6', '7', '8'], correct_answer: 1, topic: 'Logika' },
        { id: 30, question: '1/3 + 1/3 = ...?', options: ['1/6', '2/3', '1/3', '2/6'], correct_answer: 1, topic: 'Pecahan' },
      ],
      4: [
        { id: 31, question: '1.250 × 8 = ...?', options: ['8.000', '9.000', '10.000', '12.000'], correct_answer: 2, topic: 'Operasi Bilangan' },
        { id: 32, question: '2/4 = .../8?', options: ['3', '4', '5', '6'], correct_answer: 1, topic: 'Pecahan' },
        { id: 33, question: 'Faktor dari 12?', options: ['1,2,3,4,6,12', '1,2,3,4,5,12', '1,2,4,6,12', '1,3,4,6,12'], correct_answer: 0, topic: 'Faktor' },
        { id: 34, question: 'Keliling P.Panjang p=10, l=6?', options: ['16', '32', '60', '36'], correct_answer: 1, topic: 'Keliling' },
        { id: 35, question: 'Luas P.Panjang p=12, l=8?', options: ['20', '40', '80', '96'], correct_answer: 3, topic: 'Luas' },
        { id: 36, question: 'Sudut 90° disebut?', options: ['Lancip', 'Siku-siku', 'Tumpul', 'Lurus'], correct_answer: 1, topic: 'Sudut' },
        { id: 37, question: '2, 6, 18, 54, ...?', options: ['108', '162', '72', '216'], correct_answer: 1, topic: 'Pola Bilangan' },
        { id: 38, question: 'Beli 15 buku @3000, bayar 50.000. Kembali?', options: ['5.000', '10.000', '15.000', '20.000'], correct_answer: 0, topic: 'Soal HOTS' },
        { id: 39, question: '3/5 ... 2/3?', options: ['>', '<', '=', '≥'], correct_answer: 1, topic: 'Pecahan' },
        { id: 40, question: 'Semua kucing berekor. Tom kucing. Maka?', options: ['Tom tak berekor', 'Tom berekor', 'Tom bukan kucing', 'Tak pasti'], correct_answer: 1, topic: 'Logika' },
      ],
      5: [
        { id: 41, question: 'FPB dari 12 dan 18?', options: ['2', '3', '6', '9'], correct_answer: 2, topic: 'FPB' },
        { id: 42, question: 'KPK dari 4 dan 6?', options: ['6', '12', '18', '24'], correct_answer: 1, topic: 'KPK' },
        { id: 43, question: '2/3 + 1/4 = ...?', options: ['3/7', '11/12', '3/12', '8/12'], correct_answer: 1, topic: 'Pecahan' },
        { id: 44, question: '0,75 dalam persen?', options: ['7,5%', '35%', '75%', '750%'], correct_answer: 2, topic: 'Desimal' },
        { id: 45, question: 'Luas segitiga a=10, t=8?', options: ['18', '40', '80', '100'], correct_answer: 1, topic: 'Luas' },
        { id: 46, question: 'Volume balok 5×4×3?', options: ['12', '20', '60', '120'], correct_answer: 2, topic: 'Volume' },
        { id: 47, question: '1, 1, 2, 3, 5, 8, ...?', options: ['10', '11', '13', '15'], correct_answer: 2, topic: 'Pola' },
        { id: 48, question: '3 buku 15.000. 7 buku?', options: ['30.000', '35.000', '40.000', '45.000'], correct_answer: 1, topic: 'Soal Cerita' },
        { id: 49, question: '25% dari 200?', options: ['25', '50', '75', '100'], correct_answer: 1, topic: 'Persen' },
        { id: 50, question: '3/4 × 2/5 = ...?', options: ['6/20', '5/9', '6/9', '5/20'], correct_answer: 0, topic: 'Pecahan' },
      ],
      6: [
        { id: 51, question: 'Bilangan prima?', options: ['15', '21', '23', '27'], correct_answer: 2, topic: 'Bilangan Prima' },
        { id: 52, question: 'Faktorisasi prima 60?', options: ['2²×3×5', '2×3²×5', '2²×3²×5', '2³×3×5'], correct_answer: 0, topic: 'Faktorisasi' },
        { id: 53, question: 'Ani:Budi=3:5. Ani 12 thn. Budi?', options: ['15', '18', '20', '25'], correct_answer: 2, topic: 'Rasio' },
        { id: 54, question: 'Skala 1:100.000. Peta 5cm. Asli?', options: ['5 km', '50 km', '500 km', '5.000 km'], correct_answer: 0, topic: 'Skala' },
        { id: 55, question: 'Mean: 4, 6, 8, 10, 12?', options: ['6', '7', '8', '9'], correct_answer: 2, topic: 'Statistik' },
        { id: 56, question: 'Peluang angka 3 pada dadu?', options: ['1/2', '1/3', '1/6', '1/4'], correct_answer: 2, topic: 'Peluang' },
        { id: 57, question: 'x + 5 = 12. x =?', options: ['5', '6', '7', '8'], correct_answer: 2, topic: 'Aljabar' },
        { id: 58, question: 'Hujan→basah. Tak basah. Maka?', options: ['Hujan', 'Tak hujan', 'Jalan kering', 'Mungkin'], correct_answer: 1, topic: 'Logika' },
        { id: 59, question: '3² + 4² = ...?', options: ['7', '12', '25', '49'], correct_answer: 2, topic: 'Operasi' },
        { id: 60, question: '2 kg = 30.000. 5 kg =?', options: ['60.000', '75.000', '80.000', '90.000'], correct_answer: 1, topic: 'Perbandingan' },
      ]
    };
    
    const questions = allQuestions[grade] || allQuestions[1];
    return questions.sort(() => Math.random() - 0.5).slice(0, count);
  },

  // Simpan skor
  async saveScore(playerName, grade, score, enemiesDefeated, sessionId) {
    const { data, error } = await supabaseClient
      .from('player_scores')
      .insert([{
        player_name: playerName,
        grade: grade,
        score: score,
        enemies_defeated: enemiesDefeated,
        game_session: sessionId
      }]);
    
    if (error) console.error('Error saving score:', error);
    return { data, error };
  },

  // Update sesi game aktif (untuk guru)
  async updateActiveGame(sessionId, playerName, grade, questionId, question, correctAnswer, options, score) {
    const { data, error } = await supabaseClient
      .from('active_games')
      .upsert([{
        session_id: sessionId,
        player_name: playerName,
        grade: grade,
        current_question_id: questionId,
        current_question: question,
        correct_answer: correctAnswer,
        options: options,
        score: score,
        is_active: true,
        updated_at: new Date().toISOString()
      }], { onConflict: 'session_id' });
    
    if (error) console.error('Error updating active game:', error);
    return { data, error };
  },

  // End game session
  async endGame(sessionId) {
    const { data, error } = await supabaseClient
      .from('active_games')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('session_id', sessionId);
    
    if (error) console.error('Error ending game:', error);
    return { data, error };
  },

  // Get all active games (untuk guru)
  async getActiveGames() {
    const { data, error } = await supabaseClient
      .from('active_games')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });
    
    if (error) console.error('Error fetching active games:', error);
    return { data: data || [], error };
  },

  // Get leaderboard
  async getLeaderboard(grade) {
    const { data, error } = await supabaseClient
      .from('player_scores')
      .select('*')
      .eq('grade', grade)
      .order('score', { ascending: false })
      .limit(10);
    
    if (error) console.error('Error fetching leaderboard:', error);
    return { data: data || [], error };
  }
};
