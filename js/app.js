// ===== KELASCERDAS PROTOTYPE APP =====
let currentUser = null;
let currentRole = 'guru';
let currentView = 'dashboard';
let quizState = null; // for taking quiz
let battleState = null;

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  // Load dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
  }
  // Check existing session
  const saved = localStorage.getItem('kc_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    showMainApp();
  }
});

// ---------- AUTH ----------
function setLoginRole(role) {
  currentRole = role;
  document.getElementById('btn-role-guru').className =
    role === 'guru'
      ? 'flex-1 py-2.5 rounded-xl font-medium bg-primary-600 text-white'
      : 'flex-1 py-2.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  document.getElementById('btn-role-siswa').className =
    role === 'siswa'
      ? 'flex-1 py-2.5 rounded-xl font-medium bg-primary-600 text-white'
      : 'flex-1 py-2.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  // Pre-fill demo email
  document.getElementById('login-email').value = role === 'guru' ? 'guru@demo.com' : 'siswa@demo.com';
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const user = DEMO_USERS[email];
  if (user && user.password === password && user.role === currentRole) {
    currentUser = { ...user };
    // Load progress for student
    if (user.role === 'siswa') {
      const progress = JSON.parse(localStorage.getItem('kc_progress_' + user.id) || '{}');
      currentUser.points = progress.points ?? user.points;
      currentUser.level = progress.level ?? user.level;
      currentUser.badges = progress.badges ?? user.badges;
      currentUser.streak = progress.streak ?? user.streak;
    }
    localStorage.setItem('kc_user', JSON.stringify(currentUser));
    showMainApp();
  } else {
    showToast('Email, password, atau peran salah!', true);
  }
}

function logout() {
  localStorage.removeItem('kc_user');
  currentUser = null;
  document.getElementById('screen-main').classList.add('hidden');
  document.getElementById('screen-login').classList.remove('hidden');
  document.getElementById('profile-menu').classList.add('hidden');
}

function showMainApp() {
  document.getElementById('screen-login').classList.add('hidden');
  document.getElementById('screen-main').classList.remove('hidden');
  document.getElementById('nav-name').textContent = currentUser.name.split(' ')[0];
  document.getElementById('avatar').textContent = currentUser.avatar;
  renderSidebar();
  renderBottomNav();
  navigate('dashboard');
}

// ---------- NAVIGATION ----------
function navigate(view) {
  currentView = view;
  document.getElementById('profile-menu').classList.add('hidden');
  closeSidebar();
  const content = document.getElementById('main-content');
  content.innerHTML = '';

  if (currentUser.role === 'guru') {
    switch (view) {
      case 'dashboard': renderGuruDashboard(); break;
      case 'classes': renderClasses(); break;
      case 'quizzes': renderQuizzes(); break;
      case 'materials': renderMaterials(); break;
      case 'announcements': renderAnnouncements(); break;
      case 'analytics': renderAnalytics(); break;
      case 'profile': renderProfile(); break;
      default: renderGuruDashboard();
    }
  } else {
    switch (view) {
      case 'dashboard': renderSiswaDashboard(); break;
      case 'classes': renderClasses(); break;
      case 'quizzes': renderQuizzes(); break;
      case 'materials': renderMaterials(); break;
      case 'leaderboard': renderLeaderboard(); break;
      case 'profile': renderProfile(); break;
      default: renderSiswaDashboard();
    }
  }
  highlightNav(view);
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (currentUser.role === 'guru') {
    nav.innerHTML = `
      <a href="#" onclick="navigate('dashboard')" data-view="dashboard" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-home w-5"></i> Dashboard
      </a>
      <a href="#" onclick="navigate('classes')" data-view="classes" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-users w-5"></i> Kelas Saya
      </a>
      <a href="#" onclick="navigate('materials')" data-view="materials" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-book-open w-5"></i> Materi
      </a>
      <a href="#" onclick="navigate('quizzes')" data-view="quizzes" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-question-circle w-5"></i> Kuis
      </a>
      <a href="#" onclick="navigate('announcements')" data-view="announcements" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-bullhorn w-5"></i> Pengumuman
      </a>
      <a href="#" onclick="navigate('analytics')" data-view="analytics" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-chart-bar w-5"></i> Analitik
      </a>
    `;
  } else {
    nav.innerHTML = `
      <a href="#" onclick="navigate('dashboard')" data-view="dashboard" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-home w-5"></i> Dashboard
      </a>
      <a href="#" onclick="navigate('classes')" data-view="classes" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-users w-5"></i> Kelas Saya
      </a>
      <a href="#" onclick="navigate('materials')" data-view="materials" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-book-open w-5"></i> Materi
      </a>
      <a href="#" onclick="navigate('quizzes')" data-view="quizzes" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-question-circle w-5"></i> Kuis
      </a>
      <a href="#" onclick="navigate('leaderboard')" data-view="leaderboard" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium">
        <i class="fas fa-trophy w-5"></i> Leaderboard
      </a>
    `;
  }
}

function renderBottomNav() {
  const nav = document.getElementById('bottom-nav-items');
  if (currentUser.role === 'guru') {
    nav.innerHTML = `
      <button onclick="navigate('dashboard')" data-view="dashboard" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-home text-lg"></i><span>Home</span>
      </button>
      <button onclick="navigate('classes')" data-view="classes" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-users text-lg"></i><span>Kelas</span>
      </button>
      <button onclick="navigate('quizzes')" data-view="quizzes" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-question-circle text-lg"></i><span>Kuis</span>
      </button>
      <button onclick="navigate('analytics')" data-view="analytics" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-chart-bar text-lg"></i><span>Analitik</span>
      </button>
    `;
  } else {
    nav.innerHTML = `
      <button onclick="navigate('dashboard')" data-view="dashboard" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-home text-lg"></i><span>Home</span>
      </button>
      <button onclick="navigate('materials')" data-view="materials" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-book-open text-lg"></i><span>Materi</span>
      </button>
      <button onclick="navigate('quizzes')" data-view="quizzes" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-question-circle text-lg"></i><span>Kuis</span>
      </button>
      <button onclick="navigate('leaderboard')" data-view="leaderboard" class="bottom-item flex flex-col items-center gap-0.5 px-3 py-1 text-xs">
        <i class="fas fa-trophy text-lg"></i><span>Peringkat</span>
      </button>
    `;
  }
}

function highlightNav(view) {
  document.querySelectorAll('.nav-item, .bottom-item').forEach(el => {
    el.classList.remove('bg-primary-50', 'dark:bg-primary-900/30', 'text-primary-600', 'dark:text-primary-400');
    el.classList.add('text-slate-600', 'dark:text-slate-400');
  });
  document.querySelectorAll(`[data-view="${view}"]`).forEach(el => {
    el.classList.add('bg-primary-50', 'dark:bg-primary-900/30', 'text-primary-600', 'dark:text-primary-400');
    el.classList.remove('text-slate-600', 'dark:text-slate-400');
  });
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  sb.classList.toggle('-translate-x-full');
  ov.classList.toggle('hidden');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}
function toggleProfileMenu() {
  document.getElementById('profile-menu').classList.toggle('hidden');
}
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// ---------- TOAST & MODAL ----------
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.querySelector('i').className = isError ? 'fas fa-exclamation-circle text-red-400' : 'fas fa-check-circle text-green-400';
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2800);
}

function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal').classList.add('flex');
}
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal').classList.remove('flex');
}

// ---------- GURU DASHBOARD ----------
function renderGuruDashboard() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Halo, ${currentUser.name.split(' ')[0]}! 👋</h1>
      <p class="text-slate-500 dark:text-slate-400">Selamat datang di KelasCerdas</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-2xl font-bold text-primary-600">${SAMPLE_CLASSES.length}</div>
        <div class="text-sm text-slate-500">Kelas Aktif</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-2xl font-bold text-emerald-600">${SAMPLE_QUIZZES.length}</div>
        <div class="text-sm text-slate-500">Kuis</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-2xl font-bold text-amber-600">${SAMPLE_MATERIALS.length}</div>
        <div class="text-sm text-slate-500">Materi</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-2xl font-bold text-rose-600">12</div>
        <div class="text-sm text-slate-500">Siswa</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="font-semibold mb-3">Aksi Cepat</h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <button onclick="openCreateQuizModal()" class="card-hover bg-primary-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2">
        <i class="fas fa-plus-circle text-2xl"></i>
        <span class="text-sm font-medium">Buat Kuis</span>
      </button>
      <button onclick="openCreateMaterialModal()" class="card-hover bg-emerald-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2">
        <i class="fas fa-file-upload text-2xl"></i>
        <span class="text-sm font-medium">Upload Materi</span>
      </button>
      <button onclick="showAttendanceModal()" class="card-hover bg-amber-500 text-white rounded-2xl p-4 flex flex-col items-center gap-2">
        <i class="fas fa-qrcode text-2xl"></i>
        <span class="text-sm font-medium">Absensi QR</span>
      </button>
      <button onclick="navigate('announcements')" class="card-hover bg-violet-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2">
        <i class="fas fa-bullhorn text-2xl"></i>
        <span class="text-sm font-medium">Pengumuman</span>
      </button>
    </div>

    <!-- Recent Classes -->
    <h2 class="font-semibold mb-3">Kelas Saya</h2>
    <div class="space-y-3">
      ${SAMPLE_CLASSES.map(c => `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-4 card-hover cursor-pointer" onclick="navigate('classes')">
          <div class="w-12 h-12 ${c.color} rounded-xl flex items-center justify-center text-white font-bold">${c.code.slice(0,2)}</div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">${c.name}</div>
            <div class="text-sm text-slate-500">${c.students.length} siswa • Kode: ${c.code}</div>
          </div>
          <i class="fas fa-chevron-right text-slate-400"></i>
        </div>
      `).join('')}
    </div>
  `;
}

// ---------- SISWA DASHBOARD ----------
function renderSiswaDashboard() {
  const content = document.getElementById('main-content');
  const levelInfo = LEVELS.find(l => l.level === currentUser.level) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentUser.level + 1);
  const progressPct = nextLevel ? Math.min(100, ((currentUser.points - levelInfo.min) / (nextLevel.min - levelInfo.min)) * 100) : 100;

  content.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Halo, ${currentUser.name.split(' ')[0]}! 👋</h1>
      <p class="text-slate-500 dark:text-slate-400">Ayo lanjutkan belajar hari ini</p>
    </div>

    <!-- Gamification Card -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-5 text-white mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-sm opacity-80">Level ${currentUser.level} • ${levelInfo.title}</div>
          <div class="text-2xl font-bold">${currentUser.points} Poin</div>
        </div>
        <div class="text-right">
          <div class="text-3xl">🔥</div>
          <div class="text-sm">${currentUser.streak} hari streak</div>
        </div>
      </div>
      <div class="w-full bg-white/20 rounded-full h-2.5">
        <div class="bg-white h-2.5 rounded-full transition-all" style="width:${progressPct}%"></div>
      </div>
      <div class="text-xs mt-1.5 opacity-80">${nextLevel ? `${nextLevel.min - currentUser.points} poin lagi ke Level ${nextLevel.level}` : 'Level maksimal!'}</div>
    </div>

    <!-- Badges -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
      ${(currentUser.badges || []).map(b => {
        const info = BADGES[b] || { icon: '🏅', color: 'bg-slate-100 text-slate-700' };
        return `<div class="flex-shrink-0 ${info.color} px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">${info.icon} ${b}</div>`;
      }).join('')}
      <div class="flex-shrink-0 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full text-sm text-slate-500">+ lebih banyak</div>
    </div>

    <!-- Quick Actions -->
    <h2 class="font-semibold mb-3">Lanjutkan Belajar</h2>
    <div class="grid grid-cols-2 gap-3 mb-6">
      <button onclick="navigate('quizzes')" class="card-hover bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-left">
        <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center text-primary-600 mb-2">
          <i class="fas fa-bolt"></i>
        </div>
        <div class="font-semibold text-sm">Kuis Tersedia</div>
        <div class="text-xs text-slate-500">${SAMPLE_QUIZZES.length} kuis</div>
      </button>
      <button onclick="startBattleJoin()" class="card-hover bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 text-left">
        <div class="w-10 h-10 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center text-rose-600 mb-2">
          <i class="fas fa-sword"></i>
        </div>
        <div class="font-semibold text-sm">Join Battle</div>
        <div class="text-xs text-slate-500">Masuk kode battle</div>
      </button>
    </div>

    <!-- Recent Materials -->
    <h2 class="font-semibold mb-3">Materi Terbaru</h2>
    <div class="space-y-3">
      ${SAMPLE_MATERIALS.slice(0,3).map(m => `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-3 card-hover cursor-pointer" onclick="viewMaterial('${m.id}')">
          <div class="w-10 h-10 rounded-xl ${m.type==='video'?'bg-rose-100 text-rose-600':'bg-blue-100 text-blue-600'} flex items-center justify-center">
            <i class="fas ${m.type==='video'?'fa-play':'fa-file-alt'}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-sm truncate">${m.title}</div>
            <div class="text-xs text-slate-500">${m.type.toUpperCase()} • ${m.createdAt}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ---------- CLASSES ----------
function renderClasses() {
  const content = document.getElementById('main-content');
  const isGuru = currentUser.role === 'guru';
  content.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Kelas Saya</h1>
      ${isGuru ? `<button onclick="showToast('Fitur tambah kelas (demo)')" class="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium"><i class="fas fa-plus mr-1"></i> Tambah</button>` : ''}
    </div>
    <div class="space-y-4">
      ${SAMPLE_CLASSES.map(c => `
        <div class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
          <div class="h-2 ${c.color}"></div>
          <div class="p-5">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-bold text-lg">${c.name}</h3>
                <p class="text-sm text-slate-500 mt-1">${c.description}</p>
                <div class="flex items-center gap-3 mt-3 text-sm">
                  <span class="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">Kode: <b>${c.code}</b></span>
                  <span class="text-slate-500">${c.students.length} siswa</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-4">
              <button onclick="navigate('materials')" class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm font-medium">Materi</button>
              <button onclick="navigate('quizzes')" class="flex-1 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium">Kuis</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ---------- MATERIALS ----------
function renderMaterials() {
  const content = document.getElementById('main-content');
  const isGuru = currentUser.role === 'guru';
  content.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Materi Pembelajaran</h1>
      ${isGuru ? `<button onclick="openCreateMaterialModal()" class="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium"><i class="fas fa-plus mr-1"></i> Tambah</button>` : ''}
    </div>
    <div class="space-y-3">
      ${SAMPLE_MATERIALS.map(m => {
        const cls = SAMPLE_CLASSES.find(c => c.id === m.classId);
        return `
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 card-hover cursor-pointer" onclick="viewMaterial('${m.id}')">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 rounded-xl ${m.type==='video'?'bg-rose-100 text-rose-600 dark:bg-rose-900/40':'bg-blue-100 text-blue-600 dark:bg-blue-900/40'} flex items-center justify-center flex-shrink-0">
                <i class="fas ${m.type==='video'?'fa-play':'fa-file-alt'} text-lg"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold">${m.title}</div>
                <div class="text-sm text-slate-500 mt-0.5">${cls?.name || ''} • ${m.type.toUpperCase()}</div>
                <div class="text-xs text-slate-400 mt-1">${m.createdAt}</div>
              </div>
              <i class="fas fa-chevron-right text-slate-400 mt-1"></i>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function viewMaterial(id) {
  const m = SAMPLE_MATERIALS.find(x => x.id === id);
  if (!m) return;
  openModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">${m.title}</h2>
        <button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><i class="fas fa-times"></i></button>
      </div>
      ${m.type === 'video' ? `
        <div class="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
          <div class="text-center text-slate-500">
            <i class="fas fa-play-circle text-4xl mb-2"></i>
            <p class="text-sm">Video placeholder<br><span class="text-xs">(integrasi YouTube/Vimeo di versi penuh)</span></p>
          </div>
        </div>
      ` : `
        <div class="prose dark:prose-invert max-w-none mb-4">
          <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${m.content}</p>
        </div>
        <div class="flex gap-2 mb-4">
          <button onclick="showToast('Text-to-Speech diaktifkan (demo)')" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
            <i class="fas fa-volume-up mr-1"></i> Dengarkan
          </button>
          <button onclick="showToast('Mode font disleksia (demo)')" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
            <i class="fas fa-font mr-1"></i> Font Disleksia
          </button>
        </div>
      `}
      <button onclick="closeModal()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-medium">Tutup</button>
    </div>
  `);
}

function openCreateMaterialModal() {
  openModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Tambah Materi</h2>
        <button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><i class="fas fa-times"></i></button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Judul</label>
          <input type="text" id="mat-title" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="Judul materi">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Tipe</label>
          <select id="mat-type" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none">
            <option value="teks">Teks</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Konten / URL</label>
          <textarea id="mat-content" rows="4" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="Isi materi atau link video..."></textarea>
        </div>
        <button onclick="saveMaterial()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-medium">Simpan Materi</button>
      </div>
    </div>
  `);
}

function saveMaterial() {
  showToast('Materi berhasil disimpan (simulasi)');
  closeModal();
}

// ---------- QUIZZES ----------
function renderQuizzes() {
  const content = document.getElementById('main-content');
  const isGuru = currentUser.role === 'guru';
  content.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Kuis</h1>
      ${isGuru ? `<button onclick="openCreateQuizModal()" class="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium"><i class="fas fa-plus mr-1"></i> Buat Kuis</button>` : ''}
    </div>

    ${!isGuru ? `
      <div class="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-4 text-white mb-5 flex items-center justify-between">
        <div>
          <div class="font-bold">Battle Mode</div>
          <div class="text-sm opacity-90">Gabung dengan kode dari guru</div>
        </div>
        <button onclick="startBattleJoin()" class="px-4 py-2 bg-white text-rose-600 rounded-xl text-sm font-bold">Join</button>
      </div>
    ` : ''}

    <div class="space-y-3">
      ${SAMPLE_QUIZZES.map(q => {
        const cls = SAMPLE_CLASSES.find(c => c.id === q.classId);
        const typeLabel = { cepat: 'Kuis Cepat', battle: 'Battle Mode', adaptif: 'Adaptif' }[q.type] || q.type;
        const typeColor = { cepat: 'bg-blue-100 text-blue-700', battle: 'bg-rose-100 text-rose-700', adaptif: 'bg-purple-100 text-purple-700' }[q.type] || 'bg-slate-100 text-slate-700';
        return `
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center flex-shrink-0">
                <i class="fas ${q.type==='battle'?'fa-sword':'fa-question'} text-lg"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold">${q.title}</div>
                <div class="text-sm text-slate-500 mt-0.5">${cls?.name || ''} • ${q.questions.length} soal • ${q.timeLimit}s</div>
                <div class="flex items-center gap-2 mt-2">
                  <span class="${typeColor} px-2 py-0.5 rounded-lg text-xs font-medium">${typeLabel}</span>
                  ${q.code ? `<span class="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-xs">Kode: ${q.code}</span>` : ''}
                </div>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              ${isGuru ? `
                <button onclick="showToast('Lihat hasil kuis (demo)')" class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm font-medium">Hasil</button>
                <button onclick="startQuiz('${q.id}')" class="flex-1 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium">Preview</button>
              ` : `
                <button onclick="startQuiz('${q.id}')" class="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium">
                  <i class="fas fa-play mr-1"></i> Kerjakan
                </button>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function openCreateQuizModal() {
  openModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Buat Kuis Baru</h2>
        <button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><i class="fas fa-times"></i></button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Judul Kuis</label>
          <input type="text" id="quiz-title" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary-500" placeholder="Contoh: Kuis Aljabar">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Tipe</label>
          <select id="quiz-type" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none">
            <option value="cepat">Kuis Cepat</option>
            <option value="battle">Battle Mode</option>
            <option value="adaptif">Kuis Adaptif</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Batas Waktu (detik per soal)</label>
          <input type="number" id="quiz-time" value="30" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none">
        </div>
        <p class="text-sm text-slate-500">Di prototipe ini, soal diambil dari bank soal demo. Versi penuh mendukung upload & bank soal sendiri.</p>
        <button onclick="saveQuiz()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-medium">Buat Kuis</button>
      </div>
    </div>
  `);
}

function saveQuiz() {
  showToast('Kuis berhasil dibuat! (simulasi)');
  closeModal();
}

// ---------- QUIZ TAKING ----------
function startQuiz(quizId) {
  const quiz = SAMPLE_QUIZZES.find(q => q.id === quizId);
  if (!quiz) return;
  quizState = {
    quiz,
    current: 0,
    answers: [],
    score: 0,
    startTime: Date.now(),
    timer: null,
    timeLeft: quiz.timeLimit
  };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const { quiz, current, timeLeft } = quizState;
  const q = quiz.questions[current];
  const content = document.getElementById('main-content');

  content.innerHTML = `
    <div class="max-w-xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <button onclick="confirmQuitQuiz()" class="text-slate-500 hover:text-slate-700"><i class="fas fa-times text-xl"></i></button>
        <div class="text-sm font-medium">Soal ${current + 1}/${quiz.questions.length}</div>
        <div id="quiz-timer" class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-bold ${timeLeft <= 10 ? 'text-red-600' : ''}">
          ${timeLeft}s
        </div>
      </div>

      <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-6">
        <div class="bg-primary-600 h-1.5 rounded-full transition-all" style="width:${((current)/quiz.questions.length)*100}%"></div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 mb-4">
        <h2 class="text-lg font-semibold mb-6">${q.text}</h2>
        <div class="space-y-3" id="quiz-options">
          ${q.options.map((opt, i) => `
            <button onclick="selectAnswer(${i})" class="w-full text-left px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition font-medium">
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-sm mr-3">${String.fromCharCode(65+i)}</span>
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Start timer
  if (quizState.timer) clearInterval(quizState.timer);
  quizState.timer = setInterval(() => {
    quizState.timeLeft--;
    const el = document.getElementById('quiz-timer');
    if (el) {
      el.textContent = quizState.timeLeft + 's';
      if (quizState.timeLeft <= 10) el.classList.add('text-red-600');
    }
    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timer);
      selectAnswer(-1); // timeout
    }
  }, 1000);
}

function selectAnswer(idx) {
  clearInterval(quizState.timer);
  const { quiz, current } = quizState;
  const q = quiz.questions[current];
  const correct = idx === q.correct;
  if (correct) quizState.score += 100;
  quizState.answers.push({ questionId: q.id, selected: idx, correct });

  // Show feedback briefly
  const options = document.querySelectorAll('#quiz-options button');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900/30');
    } else if (i === idx && !correct) {
      btn.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900/30');
    }
  });

  setTimeout(() => {
    if (current + 1 < quiz.questions.length) {
      quizState.current++;
      quizState.timeLeft = quiz.timeLimit;
      renderQuizQuestion();
    } else {
      finishQuiz();
    }
  }, 900);
}

function finishQuiz() {
  clearInterval(quizState.timer);
  const { quiz, score, answers } = quizState;
  const correctCount = answers.filter(a => a.correct).length;
  const total = quiz.questions.length;
  const pct = Math.round((correctCount / total) * 100);

  // Update student progress
  if (currentUser.role === 'siswa') {
    currentUser.points = (currentUser.points || 0) + score;
    // Level up check
    const newLevel = LEVELS.slice().reverse().find(l => currentUser.points >= l.min);
    if (newLevel && newLevel.level > currentUser.level) {
      currentUser.level = newLevel.level;
      showToast(`Naik level! Sekarang Level ${currentUser.level}`);
    }
    // Badge
    if (score >= 200 && !(currentUser.badges || []).includes('Petualang')) {
      currentUser.badges = [...(currentUser.badges || []), 'Petualang'];
    }
    if (quiz.type === 'battle' && pct >= 70 && !(currentUser.badges || []).includes('Juara Battle')) {
      currentUser.badges = [...(currentUser.badges || []), 'Juara Battle'];
    }
    // Save
    localStorage.setItem('kc_progress_' + currentUser.id, JSON.stringify({
      points: currentUser.points,
      level: currentUser.level,
      badges: currentUser.badges,
      streak: currentUser.streak
    }));
    localStorage.setItem('kc_user', JSON.stringify(currentUser));
  }

  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="max-w-md mx-auto text-center py-8">
      <div class="text-6xl mb-4">${pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '💪'}</div>
      <h1 class="text-2xl font-bold mb-2">Kuis Selesai!</h1>
      <p class="text-slate-500 mb-6">${quiz.title}</p>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 mb-6">
        <div class="text-4xl font-bold text-primary-600 mb-1">${score}</div>
        <div class="text-sm text-slate-500 mb-4">Poin diperoleh</div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <div class="font-bold text-lg">${correctCount}/${total}</div>
            <div class="text-slate-500">Benar</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <div class="font-bold text-lg">${pct}%</div>
            <div class="text-slate-500">Akurasi</div>
          </div>
        </div>
      </div>

      <button onclick="navigate('quizzes')" class="w-full py-3.5 bg-primary-600 text-white rounded-xl font-semibold mb-3">Kembali ke Kuis</button>
      <button onclick="navigate('dashboard')" class="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-600 font-medium">Ke Dashboard</button>
    </div>
  `;
  quizState = null;
}

function confirmQuitQuiz() {
  if (confirm('Yakin ingin keluar dari kuis? Progress tidak disimpan.')) {
    clearInterval(quizState?.timer);
    quizState = null;
    navigate('quizzes');
  }
}

// ---------- BATTLE MODE JOIN ----------
function startBattleJoin() {
  openModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Join Battle Mode</h2>
        <button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><i class="fas fa-times"></i></button>
      </div>
      <p class="text-sm text-slate-500 mb-4">Masukkan kode battle yang diberikan guru</p>
      <input type="text" id="battle-code" maxlength="10" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary-500 text-center text-xl font-bold tracking-widest uppercase" placeholder="BATTLE01" value="BATTLE01">
      <button onclick="joinBattle()" class="w-full mt-4 py-3 bg-rose-600 text-white rounded-xl font-medium">Gabung Battle</button>
    </div>
  `);
}

function joinBattle() {
  const code = document.getElementById('battle-code').value.trim().toUpperCase();
  const quiz = SAMPLE_QUIZZES.find(q => q.code === code);
  if (quiz) {
    closeModal();
    showToast('Berhasil gabung battle!');
    setTimeout(() => startQuiz(quiz.id), 500);
  } else {
    showToast('Kode battle tidak ditemukan', true);
  }
}

// ---------- LEADERBOARD ----------
function renderLeaderboard() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Leaderboard</h1>
      <p class="text-slate-500 text-sm">Peringkat berdasarkan poin (dapat dinonaktifkan guru)</p>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      ${SAMPLE_LEADERBOARD.map((s, i) => {
        const isMe = s.name === currentUser.name;
        const rankColor = i === 0 ? 'text-yellow-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-slate-500';
        return `
          <div class="flex items-center gap-4 px-4 py-3.5 ${isMe ? 'bg-primary-50 dark:bg-primary-900/20' : ''} ${i < SAMPLE_LEADERBOARD.length-1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}">
            <div class="w-8 text-center font-bold ${rankColor}">${i + 1}</div>
            <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">${s.avatar}</div>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">${s.name} ${isMe ? '(Kamu)' : ''}</div>
              <div class="text-xs text-slate-500">Level ${s.level}</div>
            </div>
            <div class="font-bold text-primary-600">${s.points}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ---------- ANNOUNCEMENTS ----------
function renderAnnouncements() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Pengumuman</h1>
      <button onclick="showToast('Buat pengumuman (demo)')" class="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium"><i class="fas fa-plus mr-1"></i> Buat</button>
    </div>
    <div class="space-y-3">
      ${SAMPLE_ANNOUNCEMENTS.map(a => {
        const cls = SAMPLE_CLASSES.find(c => c.id === a.classId);
        return `
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-bullhorn"></i>
              </div>
              <div>
                <div class="font-semibold">${a.title}</div>
                <div class="text-sm text-slate-500 mt-0.5">${cls?.name || ''} • ${a.createdAt}</div>
                <p class="text-sm mt-2 text-slate-600 dark:text-slate-300">${a.content}</p>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ---------- ANALYTICS (Guru) ----------
function renderAnalytics() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Analitik Pembelajaran</h1>
      <p class="text-slate-500 text-sm">Ringkasan performa kelas (data simulasi)</p>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-sm text-slate-500">Rata-rata Skor</div>
        <div class="text-2xl font-bold text-primary-600">78%</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-sm text-slate-500">Penyelesaian Kuis</div>
        <div class="text-2xl font-bold text-emerald-600">85%</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-sm text-slate-500">Kehadiran</div>
        <div class="text-2xl font-bold text-amber-600">92%</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-sm text-slate-500">Aktif Minggu Ini</div>
        <div class="text-2xl font-bold text-rose-600">11/12</div>
      </div>
    </div>

    <h2 class="font-semibold mb-3">Soal Paling Sulit</h2>
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between text-sm">
        <span>Hasil dari 3x + 7 = 16 adalah...</span>
        <span class="font-bold text-red-500">45% benar</span>
      </div>
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between text-sm">
        <span>Jika 2x - 5 = 9, maka nilai x adalah...</span>
        <span class="font-bold text-amber-500">62% benar</span>
      </div>
      <div class="px-4 py-3 flex justify-between text-sm">
        <span>Persamaan mana yang merupakan PLSV?</span>
        <span class="font-bold text-emerald-500">88% benar</span>
      </div>
    </div>

    <p class="text-sm text-slate-500 text-center">Laporan orang tua & ekspor data tersedia di versi penuh</p>
  `;
}

// ---------- PROFILE ----------
function renderProfile() {
  const content = document.getElementById('main-content');
  const isSiswa = currentUser.role === 'siswa';
  content.innerHTML = `
    <div class="max-w-md mx-auto">
      <div class="text-center mb-6">
        <div class="w-20 h-20 rounded-full bg-primary-500 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-3">${currentUser.avatar}</div>
        <h1 class="text-xl font-bold">${currentUser.name}</h1>
        <p class="text-slate-500 text-sm">${currentUser.email} • ${currentUser.role === 'guru' ? 'Guru' : 'Siswa'}</p>
      </div>

      ${isSiswa ? `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 mb-4">
          <div class="flex justify-between items-center mb-3">
            <span class="font-semibold">Progress Belajar</span>
            <span class="text-primary-600 font-bold">Level ${currentUser.level}</span>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <div class="text-xl font-bold">${currentUser.points}</div>
              <div class="text-xs text-slate-500">Poin</div>
            </div>
            <div>
              <div class="text-xl font-bold">${currentUser.streak}</div>
              <div class="text-xs text-slate-500">Streak</div>
            </div>
            <div>
              <div class="text-xl font-bold">${(currentUser.badges||[]).length}</div>
              <div class="text-xs text-slate-500">Badge</div>
            </div>
          </div>
        </div>

        <h2 class="font-semibold mb-3">Badge yang Dimiliki</h2>
        <div class="grid grid-cols-2 gap-3 mb-6">
          ${(currentUser.badges || []).map(b => {
            const info = BADGES[b] || { icon: '🏅', color: 'bg-slate-100 text-slate-700', desc: '' };
            return `
              <div class="${info.color} rounded-2xl p-4 text-center">
                <div class="text-3xl mb-1">${info.icon}</div>
                <div class="font-semibold text-sm">${b}</div>
                <div class="text-xs opacity-80 mt-0.5">${info.desc}</div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 mb-4 text-center">
          <p class="text-slate-500 text-sm">Akun Guru</p>
          <p class="font-medium mt-1">${SAMPLE_CLASSES.length} kelas dikelola</p>
        </div>
      `}

      <div class="space-y-2">
        <button onclick="toggleDarkMode()" class="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <span><i class="fas fa-moon mr-2"></i> Mode Gelap</span>
          <span class="text-sm text-slate-500">${document.documentElement.classList.contains('dark') ? 'Aktif' : 'Nonaktif'}</span>
        </button>
        <button onclick="showToast('Pengaturan aksesibilitas (font, kontras, TTS) tersedia di versi penuh')" class="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <span><i class="fas fa-universal-access mr-2"></i> Aksesibilitas</span>
          <i class="fas fa-chevron-right text-slate-400"></i>
        </button>
        <button onclick="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-medium mt-4">
          <i class="fas fa-sign-out-alt"></i> Keluar
        </button>
      </div>
    </div>
  `;
}

// ---------- ATTENDANCE (demo) ----------
function showAttendanceModal() {
  openModal(`
    <div class="p-6 text-center">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Absensi QR</h2>
        <button onclick="closeModal()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><i class="fas fa-times"></i></button>
      </div>
      <div class="w-48 h-48 mx-auto bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
        <div class="text-center">
          <i class="fas fa-qrcode text-6xl text-slate-400 mb-2"></i>
          <p class="text-xs text-slate-500">QR Code Kelas<br>MTK8A</p>
        </div>
      </div>
      <p class="text-sm text-slate-500 mb-4">Siswa scan QR ini untuk absensi. Di versi penuh terintegrasi kamera & geolokasi.</p>
      <button onclick="showToast('Absensi berhasil dicatat (demo)'); closeModal()" class="w-full py-3 bg-primary-600 text-white rounded-xl font-medium">Simulasikan Scan</button>
    </div>
  `);
}

// Close modal on backdrop click
document.getElementById('modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});
