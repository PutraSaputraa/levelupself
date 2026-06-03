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

export const badgeRules = [
  { id: 'first-step', name: 'First Step', description: 'Selesaikan misi pertama' },
  { id: 'streak-3', name: '3 Day Spark', description: 'Capai streak 3 hari' },
  { id: 'level-3', name: 'Level 3', description: 'Naik sampai level 3' },
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
