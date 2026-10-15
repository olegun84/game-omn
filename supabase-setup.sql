-- Run this in your Supabase SQL Editor

-- Tabel soal matematika
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  grade INTEGER NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel skor pemain
CREATE TABLE player_scores (
  id SERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  grade INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  enemies_defeated INTEGER DEFAULT 0,
  game_session TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel sesi game aktif (untuk guru melihat)
CREATE TABLE active_games (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  player_name TEXT NOT NULL,
  grade INTEGER NOT NULL,
  current_question_id INTEGER REFERENCES questions(id),
  current_question TEXT,
  correct_answer TEXT,
  options TEXT[],
  score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert soal untuk Grade 1
INSERT INTO questions (grade, topic, question, options, correct_answer, difficulty) VALUES
(1, 'Pola Bilangan', 'Lanjutkan pola: 2, 4, 6, 8, ...?', ARRAY['9', '10', '11', '12'], 1, 1),
(1, 'Pola Bilangan', 'Lanjutkan pola: 1, 3, 5, 7, ...?', ARRAY['8', '9', '10', '11'], 1, 1),
(1, 'Penjumlahan', 'Ibu punya 5 apel. Dibelinya lagi 3 apel. Berapa total apel ibu?', ARRAY['6', '7', '8', '9'], 2, 1),
(1, 'Pengurangan', 'Adi punya 10 permen. Diberikan 4 kepada teman. Sisa permen Adi?', ARRAY['5', '6', '7', '8'], 1, 1),
(1, 'Perbandingan', 'Mana yang lebih besar? 15 atau 12?', ARRAY['12', '15', 'Sama', 'Tidak tahu'], 1, 1),
(1, 'Pengelompokan', 'Manakah yang BUKAN buah?', ARRAY['Apel', 'Jeruk', 'Wortel', 'Mangga'], 2, 1),
(1, 'Bangun Datar', 'Berapa sisi yang dimiliki segitiga?', ARRAY['2', '3', '4', '5'], 1, 1),
(1, 'Pola Gambar', '🔴🔵🔴🔵🔴...? Warna selanjutnya?', ARRAY['🔴', '🔵', '🟢', '🟡'], 1, 1),
(1, 'Konsep Waktu', 'Kegiatan apa yang dilakukan pagi hari?', ARRAY['Tidur', 'Makan siang', 'Bangun tidur', 'Malam'], 2, 1),
(1, 'Logika', 'Jika 🍎=2 dan 🍊=3, berapa 🍎+🍊?', ARRAY['4', '5', '6', '7'], 1, 1);

-- Insert soal untuk Grade 2
INSERT INTO questions (grade, topic, question, options, correct_answer, difficulty) VALUES
(2, 'Pola Bilangan', 'Skip counting: 5, 10, 15, 20, ...?', ARRAY['22', '25', '30', '35'], 1, 1),
(2, 'Pola Bilangan', 'Skip counting: 3, 6, 9, 12, ...?', ARRAY['13', '14', '15', '16'], 2, 1),
(2, 'Penjumlahan', '245 + 132 = ...?', ARRAY['367', '377', '387', '357'], 1, 2),
(2, 'Pengurangan', '500 - 237 = ...?', ARRAY['263', '273', '253', '283'], 0, 2),
(2, 'Perkalian', '3 × 4 artinya ...?', ARRAY['3+4', '4+4+4', '3+3+3+3', '4+4+4+4'], 1, 1),
(2, 'Pembagian', '12 permen dibagi 3 anak. Tiap anak dapat?', ARRAY['3', '4', '5', '6'], 1, 1),
(2, 'Nilai Tempat', 'Angka 7 pada 375 menempati nilai?', ARRAY['Satuan', 'Puluhan', 'Ratusan', 'Ribuan'], 1, 2),
(2, 'Soal Cerita', 'Ani beli 25 permen, lalu beli lagi 18. Total permen Ani?', ARRAY['42', '43', '44', '45'], 1, 2),
(2, 'Simetri', 'Huruf mana yang punya simetri lipat?', ARRAY['F', 'G', 'A', 'Z'], 2, 1),
(2, 'Logika', 'Mana yang berbeda? 🐱🐶🐰🌸', ARRAY['🐱', '🐶', '🐰', '🌸'], 3, 1);

-- Insert soal untuk Grade 3
INSERT INTO questions (grade, topic, question, options, correct_answer, difficulty) VALUES
(3, 'Operasi Campuran', '20 + 5 × 3 = ...?', ARRAY['75', '35', '25', '65'], 1, 2),
(3, 'Operasi Campuran', '100 - 4 × 10 = ...?', ARRAY['60', '960', '40', '50'], 0, 2),
(3, 'Pola Bilangan', '1, 4, 9, 16, 25, ...? (pola kuadrat)', ARRAY['30', '35', '36', '49'], 2, 3),
(3, 'Pecahan', 'Mana yang lebih besar? 1/2 atau 1/4?', ARRAY['1/2', '1/4', 'Sama', 'Tidak bisa'], 0, 2),
(3, 'Keliling', 'Keliling persegi dengan sisi 8 cm adalah?', ARRAY['16 cm', '24 cm', '32 cm', '64 cm'], 2, 2),
(3, 'Tabel', 'Jika 3 buku = Rp6.000, maka 5 buku =?', ARRAY['Rp8.000', 'Rp10.000', 'Rp12.000', 'Rp15.000'], 1, 2),
(3, 'Soal Cerita', 'Ayah punya 60 telur. Dijual 25, pecah 5. Sisa telur?', ARRAY['25', '30', '35', '40'], 1, 2),
(3, 'Analogi', '2 : 4 = 3 : ...?', ARRAY['5', '6', '7', '8'], 1, 2),
(3, 'Logika Tabel', 'Jika A=1, B=2, C=3, maka A+B+C=?', ARRAY['5', '6', '7', '8'], 1, 2),
(3, 'Pecahan', '1/3 + 1/3 = ...?', ARRAY['1/6', '2/3', '1/3', '2/6'], 1, 2);

-- Insert soal untuk Grade 4
INSERT INTO questions (grade, topic, question, options, correct_answer, difficulty) VALUES
(4, 'Operasi Bilangan', '1.250 × 8 = ...?', ARRAY['8.000', '9.000', '10.000', '12.000'], 2, 2),
(4, 'Pecahan', '2/4 = .../8 (pecahan senilai)?', ARRAY['3', '4', '5', '6'], 1, 2),
(4, 'Faktor', 'Faktor dari 12 adalah?', ARRAY['1,2,3,4,6,12', '1,2,3,4,5,12', '1,2,4,6,12', '1,3,4,6,12'], 0, 2),
(4, 'Keliling', 'Keliling persegi panjang p=10, l=6?', ARRAY['16', '32', '60', '36'], 1, 2),
(4, 'Luas', 'Luas persegi panjang p=12, l=8?', ARRAY['20', '40', '80', '96'], 3, 2),
(4, 'Sudut', 'Sudut 90° disebut sudut?', ARRAY['Lancip', 'Siku-siku', 'Tumpul', 'Lurus'], 1, 2),
(4, 'Pola Bilangan', '2, 6, 18, 54, ...? (×3)', ARRAY['108', '162', '72', '216'], 1, 3),
(4, 'Soal HOTS', 'Harga buku Rp3.000. Beli 15 buku, bayar Rp50.000. Kembalian?', ARRAY['Rp5.000', 'Rp10.000', 'Rp15.000', 'Rp20.000'], 0, 3),
(4, 'Pecahan', '3/5 ... 2/3. Tanda yang tepat?', ARRAY['>', '<', '=', '≥'], 1, 3),
(4, 'Logika', 'Semua kucing punya ekor. Tom adalah kucing. Kesimpulan?', ARRAY['Tom tidak punya ekor', 'Tom punya ekor', 'Tom bukan kucing', 'Tidak bisa disimpulkan'], 1, 2);

-- Insert soal untuk Grade 5
INSERT INTO questions (grade, topic, question, options, correct_answer, difficulty) VALUES
(5, 'FPB', 'FPB dari 12 dan 18 adalah?', ARRAY['2', '3', '6', '9'], 2, 2),
(5, 'KPK', 'KPK dari 4 dan 6 adalah?', ARRAY['6', '12', '18', '24'], 1, 2),
(5, 'Pecahan', '2/3 + 1/4 = ...?', ARRAY['3/7', '11/12', '3/12', '8/12'], 1, 3),
(5, 'Desimal', '0,75 dalam persen adalah?', ARRAY['7,5%', '35%', '75%', '750%'], 2, 2),
(5, 'Luas', 'Luas segitiga alas=10, tinggi=8?', ARRAY['18', '40', '80', '100'], 1, 2),
(5, 'Volume', 'Volume balok p=5, l=4, t=3?', ARRAY['12', '20', '60', '120'], 2, 2),
(5, 'Pola', '1, 1, 2, 3, 5, 8, ...? (Fibonacci)', ARRAY['10', '11', '13', '15'], 2, 3),
(5, 'Soal Cerita', 'Harga 3 buku Rp15.000. Harga 7 buku?', ARRAY['Rp30.000', 'Rp35.000', 'Rp40.000', 'Rp45.000'], 1, 3),
(5, 'Persen', '25% dari 200 adalah?', ARRAY['25', '50', '75', '100'], 1, 2),
(5, 'Pecahan', '3/4 × 2/5 = ...?', ARRAY['6/20', '5/9', '6/9', '5/20'], 0, 3);

-- Insert soal untuk Grade 6
INSERT INTO questions (grade, topic, question, options, correct_answer, difficulty) VALUES
(6, 'Bilangan Prima', 'Manakah bilangan prima?', ARRAY['15', '21', '23', '27'], 2, 2),
(6, 'Faktorisasi', 'Faktorisasi prima dari 60?', ARRAY['2²×3×5', '2×3²×5', '2²×3²×5', '2³×3×5'], 0, 3),
(6, 'Rasio', 'Perbandingan umur Ani:Budi = 3:5. Jika Ani 12 tahun, Budi?', ARRAY['15', '18', '20', '25'], 2, 2),
(6, 'Skala', 'Skala 1:100.000. Jarak di peta 5 cm. Jarak sebenarnya?', ARRAY['5 km', '50 km', '500 km', '5.000 km'], 0, 3),
(6, 'Statistik', 'Mean dari 4, 6, 8, 10, 12?', ARRAY['6', '7', '8', '9'], 2, 2),
(6, 'Peluang', 'Peluang muncul angka 3 pada dadu?', ARRAY['1/2', '1/3', '1/6', '1/4'], 2, 2),
(6, 'Aljabar', 'Jika x + 5 = 12, maka x =?', ARRAY['5', '6', '7', '8'], 2, 2),
(6, 'Logika', 'Jika hujan→jalan basah. Jalan tidak basah. Kesimpulan?', ARRAY['Hujan', 'Tidak hujan', 'Jalan kering', 'Mungkin hujan'], 1, 3),
(6, 'Operasi', '3² + 4² = ...?', ARRAY['7', '12', '25', '49'], 2, 2),
(6, 'Perbandingan', 'Jika 2 kg apel Rp30.000, harga 5 kg?', ARRAY['Rp60.000', 'Rp75.000', 'Rp80.000', 'Rp90.000'], 1, 2);

-- Index untuk performa
CREATE INDEX idx_questions_grade ON questions(grade);
CREATE INDEX idx_active_games_session ON active_games(session_id);
CREATE INDEX idx_active_games_active ON active_games(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_games ENABLE ROW LEVEL SECURITY;

-- Policy: Semua bisa baca soal
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);

-- Policy: Semua bisa insert skor
CREATE POLICY "Anyone can insert scores" ON player_scores FOR INSERT WITH CHECK (true);

-- Policy: Semua bisa baca skor
CREATE POLICY "Anyone can read scores" ON player_scores FOR SELECT USING (true);

-- Policy: Semua bisa manage active games
CREATE POLICY "Anyone can manage active games" ON active_games FOR ALL USING (true) WITH CHECK (true);