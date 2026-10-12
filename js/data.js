// ===== SAMPLE DATA & INITIAL STATE =====
const DEMO_USERS = {
  'guru@demo.com': {
    id: 'u1',
    email: 'guru@demo.com',
    name: 'Bu Sari Wijaya',
    role: 'guru',
    avatar: 'S',
    password: 'demo123'
  },
  'siswa@demo.com': {
    id: 'u2',
    email: 'siswa@demo.com',
    name: 'Andi Pratama',
    role: 'siswa',
    avatar: 'A',
    password: 'demo123',
    points: 1250,
    level: 3,
    badges: ['Pemula', 'Petualang'],
    streak: 5
  }
};

const SAMPLE_CLASSES = [
  {
    id: 'c1',
    name: 'Matematika Kelas 8A',
    code: 'MTK8A',
    teacherId: 'u1',
    students: ['u2'],
    description: 'Aljabar, Geometri, dan Statistika',
    color: 'bg-blue-500'
  },
  {
    id: 'c2',
    name: 'Bahasa Indonesia 8B',
    code: 'BIN8B',
    teacherId: 'u1',
    students: ['u2'],
    description: 'Teks Eksposisi, Puisi, dan Drama',
    color: 'bg-emerald-500'
  }
];

const SAMPLE_MATERIALS = [
  {
    id: 'm1',
    classId: 'c1',
    title: 'Persamaan Linear Satu Variabel',
    type: 'teks',
    content: 'Persamaan linear satu variabel adalah persamaan yang memiliki satu peubah dan pangkat tertinggi peubahnya adalah satu. Contoh: 2x + 5 = 11.',
    createdAt: '2026-10-01'
  },
  {
    id: 'm2',
    classId: 'c1',
    title: 'Video: Cara Menyelesaikan PLSV',
    type: 'video',
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    createdAt: '2026-10-03'
  },
  {
    id: 'm3',
    classId: 'c2',
    title: 'Struktur Teks Eksposisi',
    type: 'teks',
    content: 'Teks eksposisi terdiri dari tesis, argumentasi, dan penegasan ulang. Tujuannya untuk menyampaikan informasi secara objektif.',
    createdAt: '2026-10-05'
  }
];

const SAMPLE_QUIZZES = [
  {
    id: 'q1',
    classId: 'c1',
    title: 'Kuis Cepat: PLSV',
    type: 'cepat',
    timeLimit: 60,
    questions: [
      {
        id: 'qq1',
        text: 'Hasil dari 3x + 7 = 16 adalah...',
        options: ['x = 3', 'x = 2', 'x = 4', 'x = 5'],
        correct: 0
      },
      {
        id: 'qq2',
        text: 'Jika 2x - 5 = 9, maka nilai x adalah...',
        options: ['5', '6', '7', '8'],
        correct: 2
      },
      {
        id: 'qq3',
        text: 'Persamaan mana yang merupakan PLSV?',
        options: ['x² + 2 = 5', '2x + 3 = 7', 'x³ - 1 = 0', '√x = 4'],
        correct: 1
      }
    ],
    createdAt: '2026-10-08'
  },
  {
    id: 'q2',
    classId: 'c1',
    title: 'Battle Mode: Matematika Seru',
    type: 'battle',
    timeLimit: 30,
    code: 'BATTLE01',
    questions: [
      {
        id: 'bq1',
        text: '5 × 7 + 3 = ?',
        options: ['38', '35', '40', '36'],
        correct: 0
      },
      {
        id: 'bq2',
        text: 'Akar kuadrat dari 144 adalah...',
        options: ['10', '11', '12', '13'],
        correct: 2
      },
      {
        id: 'bq3',
        text: '25% dari 80 adalah...',
        options: ['15', '20', '25', '30'],
        correct: 1
      }
    ],
    createdAt: '2026-10-10'
  }
];

const SAMPLE_ANNOUNCEMENTS = [
  {
    id: 'a1',
    classId: 'c1',
    title: 'Ulangan Harian minggu depan',
    content: 'Persiapkan materi PLSV dan Sistem Persamaan Linear. Ulangan dilaksanakan hari Senin.',
    createdAt: '2026-10-09'
  }
];

// Leaderboard sample
const SAMPLE_LEADERBOARD = [
  { name: 'Andi Pratama', points: 1250, level: 3, avatar: 'A' },
  { name: 'Siti Nurhaliza', points: 1180, level: 3, avatar: 'S' },
  { name: 'Budi Santoso', points: 980, level: 2, avatar: 'B' },
  { name: 'Dewi Lestari', points: 870, level: 2, avatar: 'D' },
  { name: 'Rizky Fadilah', points: 720, level: 2, avatar: 'R' }
];

// Badge definitions
const BADGES = {
  'Pemula': { icon: '🌱', color: 'bg-green-100 text-green-700', desc: 'Menyelesaikan kuis pertama' },
  'Petualang': { icon: '🧭', color: 'bg-blue-100 text-blue-700', desc: 'Mencapai 500 poin' },
  'Master': { icon: '🏆', color: 'bg-yellow-100 text-yellow-700', desc: 'Mencapai level 5' },
  'Legend': { icon: '👑', color: 'bg-purple-100 text-purple-700', desc: 'Mencapai 2000 poin' },
  'Juara Battle': { icon: '⚔️', color: 'bg-red-100 text-red-700', desc: 'Menang di Battle Mode' },
  'Streak 7': { icon: '🔥', color: 'bg-orange-100 text-orange-700', desc: '7 hari berturut-turut' }
};

const LEVELS = [
  { level: 1, min: 0, title: 'Pemula' },
  { level: 2, min: 300, title: 'Pembelajar' },
  { level: 3, min: 800, title: 'Petualang' },
  { level: 4, min: 1500, title: 'Ahli' },
  { level: 5, min: 2500, title: 'Master' },
  { level: 6, min: 4000, title: 'Legend' }
];
