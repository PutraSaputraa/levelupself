export const surveyOptions = {
  main_goal: [
    ['lebih_sehat', 'Lebih sehat'],
    ['lebih_disiplin', 'Lebih disiplin'],
    ['lebih_produktif', 'Lebih produktif'],
    ['lebih_tenang', 'Lebih tenang'],
    ['rajin_membaca', 'Rajin membaca'],
    ['membangun_rutinitas', 'Membangun rutinitas'],
  ],
  available_time: ['5 menit', '10 menit', '15 menit', '30 menit', '1 jam'],
  activity_level: [
    ['sangat_jarang_bergerak', 'Sangat jarang bergerak'],
    ['ringan', 'Ringan'],
    ['cukup_aktif', 'Cukup aktif'],
    ['aktif', 'Aktif'],
  ],
  activities: [
    'jalan kaki',
    'push up',
    'lari',
    'membaca',
    'meditasi',
    'journaling',
    'belajar skill baru',
  ],
  disliked: ['olahraga berat', 'lari', 'membaca', 'menulis', 'meditasi'],
  active_time: ['pagi', 'siang', 'sore', 'malam'],
  motivation_style: ['santai', 'tegas', 'kompetitif', 'pelan-pelan asal konsisten'],
  starting_difficulty: [
    ['very_light', 'Sangat ringan'],
    ['normal', 'Normal'],
    ['challenging', 'Menantang'],
  ],
}

export const emptyProfile = {
  main_goal: 'lebih_sehat',
  available_time: '10 menit',
  activity_level: 'ringan',
  preferred_activities: ['jalan kaki'],
  disliked_activities: [],
  active_time: 'pagi',
  motivation_style: 'pelan-pelan asal konsisten',
  starting_difficulty: 'very_light',
  onboarding_completed: false,
}

export const achievementGroups = [
  {
    id: 'starter',
    title: 'Achievement awal',
    items: [
      { id: 'first-step', name: 'First Step', description: 'Menyelesaikan misi pertama', reward: '50 XP' },
      { id: 'new-adventurer', name: 'New Adventurer', description: 'Menyelesaikan onboarding survey', reward: '30 XP' },
      { id: 'day-one-hero', name: 'Day One Hero', description: 'Menyelesaikan semua misi di hari pertama', reward: '75 XP' },
      { id: 'starter-pack', name: 'Starter Pack', description: 'Menyelesaikan 3 misi pertama', reward: '100 XP' },
      { id: 'level-up-rookie', name: 'Level Up Rookie', description: 'Naik ke level 2', reward: 'Badge' },
    ],
  },
  {
    id: 'streak',
    title: 'Achievement streak',
    items: [
      { id: 'streak-3', name: '3 Day Spark', description: 'Aktif 3 hari berturut-turut', reward: '100 XP' },
      { id: 'week-warrior', name: 'One Week Warrior', description: 'Aktif 7 hari berturut-turut', reward: '250 XP' },
      { id: 'two-week-discipline', name: 'Two Week Discipline', description: 'Aktif 14 hari berturut-turut', reward: '500 XP' },
      { id: 'thirty-day-legend', name: '30 Day Legend', description: 'Aktif 30 hari berturut-turut', reward: 'Badge spesial' },
      { id: 'no-zero-day', name: 'No Zero Day', description: 'Minimal 1 misi setiap hari selama 7 hari', reward: '300 XP' },
    ],
  },
  {
    id: 'comeback',
    title: 'Achievement comeback',
    items: [
      { id: 'comeback-kid', name: 'Comeback Kid', description: 'Kembali menyelesaikan misi setelah absen 3 hari', reward: '100 XP' },
      { id: 'still-standing', name: 'Still Standing', description: 'Kembali setelah absen 7 hari', reward: '200 XP' },
      { id: 'restart-strong', name: 'Restart Strong', description: 'Menyelesaikan 3 misi setelah sempat tidak aktif', reward: '250 XP' },
      { id: 'never-too-late', name: 'Never Too Late', description: 'Kembali aktif setelah 14 hari absen', reward: 'Badge' },
      { id: 'fresh-start', name: 'Fresh Start', description: 'Mengulang rutinitas dari awal setelah streak putus', reward: '100 XP' },
    ],
  },
  {
    id: 'fitness',
    title: 'Achievement fitness',
    items: [
      { id: 'mini-athlete', name: 'Mini Athlete', description: 'Menyelesaikan 5 misi fitness', reward: '150 XP' },
      { id: 'push-up-starter', name: 'Push Up Starter', description: 'Menyelesaikan total 50 push up', reward: 'Badge' },
      { id: 'walker', name: 'Walker', description: 'Menyelesaikan 5 misi jalan kaki', reward: '150 XP' },
      { id: 'runner-seed', name: 'Runner Seed', description: 'Menyelesaikan misi lari pertama', reward: '100 XP' },
      { id: 'body-activated', name: 'Body Activated', description: 'Menyelesaikan misi fitness 7 hari berbeda', reward: '300 XP' },
      { id: 'stronger-week', name: 'Stronger Week', description: 'Menyelesaikan 10 misi fitness dalam seminggu', reward: 'Badge' },
    ],
  },
  {
    id: 'reading',
    title: 'Achievement membaca',
    items: [
      { id: 'book-starter', name: 'Book Starter', description: 'Menyelesaikan misi membaca pertama', reward: '50 XP' },
      { id: 'reader-10', name: '10 Minute Reader', description: 'Membaca 10 menit selama 5 hari', reward: '150 XP' },
      { id: 'page-collector', name: 'Page Collector', description: 'Mencatat total 50 halaman dibaca', reward: '200 XP' },
      { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Menyelesaikan 10 misi membaca', reward: 'Badge' },
      { id: 'night-reader', name: 'Night Reader', description: 'Menyelesaikan misi membaca di malam hari 5 kali', reward: '150 XP' },
      { id: 'consistent-reader', name: 'Consistent Reader', description: 'Membaca 7 hari berturut-turut', reward: 'Badge' },
    ],
  },
  {
    id: 'mindfulness',
    title: 'Achievement mindfulness',
    items: [
      { id: 'calm-start', name: 'Calm Start', description: 'Meditasi pertama kali', reward: '50 XP' },
      { id: 'quiet-mind', name: 'Quiet Mind', description: 'Menyelesaikan 5 misi meditasi', reward: '150 XP' },
      { id: 'breathing-master', name: 'Breathing Master', description: 'Menyelesaikan 10 misi pernapasan/meditasi', reward: 'Badge' },
      { id: 'peaceful-week', name: 'Peaceful Week', description: 'Meditasi 7 hari dalam seminggu', reward: '300 XP' },
      { id: 'mind-reset', name: 'Mind Reset', description: 'Menyelesaikan misi refleksi setelah hari buruk', reward: '100 XP' },
      { id: 'inner-balance', name: 'Inner Balance', description: 'Menyelesaikan 20 misi mindfulness', reward: 'Badge' },
    ],
  },
  {
    id: 'productivity',
    title: 'Achievement produktivitas',
    items: [
      { id: 'focus-mode', name: 'Focus Mode', description: 'Menyelesaikan misi fokus pertama', reward: '50 XP' },
      { id: 'task-finisher', name: 'Task Finisher', description: 'Menyelesaikan 10 misi produktivitas', reward: '200 XP' },
      { id: 'clean-desk', name: 'Clean Desk', description: 'Menyelesaikan misi merapikan area kerja', reward: '75 XP' },
      { id: 'deep-work-rookie', name: 'Deep Work Rookie', description: 'Fokus belajar/kerja 25 menit pertama', reward: '100 XP' },
      { id: 'anti-procrastination', name: 'Anti Procrastination', description: 'Menyelesaikan misi yang sebelumnya pernah di-skip', reward: '150 XP' },
      { id: 'productive-week', name: 'Productive Week', description: 'Menyelesaikan 15 misi produktivitas dalam 7 hari', reward: 'Badge' },
    ],
  },
  {
    id: 'level-xp',
    title: 'Achievement level dan XP',
    items: [
      { id: 'level-5', name: 'Level 5 Reached', description: 'Mencapai level 5', reward: 'Badge' },
      { id: 'level-10', name: 'Level 10 Hero', description: 'Mencapai level 10', reward: 'Badge spesial' },
      { id: 'xp-collector', name: 'XP Collector', description: 'Mengumpulkan 1.000 XP', reward: '100 XP bonus' },
      { id: 'growth-machine', name: 'Growth Machine', description: 'Mengumpulkan 5.000 XP', reward: 'Badge' },
      { id: 'discipline-master', name: 'Discipline Master', description: 'Mengumpulkan 10.000 XP', reward: 'Title spesial' },
      { id: 'almost-rpg', name: 'Almost RPG', description: 'Naik level 3 kali dalam sebulan', reward: 'Badge' },
    ],
  },
]

export const eventCategories = [
  {
    id: 'fitness',
    name: 'Fitness',
    missions: [
      { id: 'event-squat-20', title: 'Bodyweight squat 20 kali', category: 'fitness', duration_minutes: 8, xp_reward: 55 },
      { id: 'event-plank-30', title: 'Plank 30 detik', category: 'fitness', duration_minutes: 4, xp_reward: 35 },
      { id: 'event-mobility-8', title: 'Mobility flow 8 menit', category: 'fitness', duration_minutes: 8, xp_reward: 45 },
    ],
  },
  {
    id: 'focus',
    name: 'Fokus',
    missions: [
      { id: 'event-focus-25', title: 'Deep work 25 menit', category: 'productivity', duration_minutes: 25, xp_reward: 75 },
      { id: 'event-inbox-zero', title: 'Rapikan 10 item inbox', category: 'productivity', duration_minutes: 12, xp_reward: 45 },
      { id: 'event-priority-3', title: 'Tulis 3 prioritas besok', category: 'productivity', duration_minutes: 6, xp_reward: 30 },
    ],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    missions: [
      { id: 'event-walk-fast-15', title: 'Jalan cepat 15 menit', category: 'cardio', duration_minutes: 15, xp_reward: 60 },
      { id: 'event-run-light-8', title: 'Lari ringan 8 menit', category: 'cardio', duration_minutes: 8, xp_reward: 55 },
      { id: 'event-stairs-5', title: 'Naik turun tangga 5 menit', category: 'cardio', duration_minutes: 5, xp_reward: 40 },
    ],
  },
  {
    id: 'calistenic',
    name: 'Calistenic',
    missions: [
      { id: 'event-pushup-10', title: 'Push up 10 kali', category: 'calistenic', duration_minutes: 6, xp_reward: 50 },
      { id: 'event-lunge-12', title: 'Lunge 12 kali', category: 'calistenic', duration_minutes: 7, xp_reward: 45 },
      { id: 'event-hollow-20', title: 'Hollow hold 20 detik', category: 'calistenic', duration_minutes: 5, xp_reward: 40 },
    ],
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    missions: [
      { id: 'event-breath-5', title: 'Latihan napas 5 menit', category: 'mindfulness', duration_minutes: 5, xp_reward: 35 },
      { id: 'event-meditate-7', title: 'Meditasi 7 menit', category: 'mindfulness', duration_minutes: 7, xp_reward: 45 },
      { id: 'event-reflect-1', title: 'Refleksi 1 paragraf', category: 'reflection', duration_minutes: 8, xp_reward: 40 },
    ],
  },
  {
    id: 'reading',
    name: 'Membaca',
    missions: [
      { id: 'event-read-10', title: 'Baca 10 menit', category: 'reading', duration_minutes: 10, xp_reward: 45 },
      { id: 'event-note-idea', title: 'Catat 1 ide dari bacaan', category: 'reading', duration_minutes: 6, xp_reward: 35 },
      { id: 'event-night-read', title: 'Baca sebelum tidur', category: 'reading', duration_minutes: 10, xp_reward: 45 },
    ],
  },
]

export const demoRivals = [
  {
    name: 'Raka Habit',
    email: 'raka@levelupself.app',
    total_xp: 340,
    level: 3,
    streak: 4,
  },
  {
    name: 'Maya Focus',
    email: 'maya@levelupself.app',
    total_xp: 220,
    level: 2,
    streak: 2,
  },
  {
    name: 'Nadia Calm',
    email: 'nadia@levelupself.app',
    total_xp: 125,
    level: 2,
    streak: 5,
  },
]
