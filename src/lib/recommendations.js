const goalMap = {
  lebih_sehat: 'health',
  lebih_disiplin: 'discipline',
  lebih_produktif: 'productive',
  lebih_tenang: 'calm',
  rajin_membaca: 'reading',
  membangun_rutinitas: 'routine',
}

const difficultyRank = {
  very_light: 1,
  normal: 2,
  challenging: 3,
}

const timeMap = {
  '5 menit': 5,
  '10 menit': 10,
  '15 menit': 15,
  '30 menit': 30,
  '1 jam': 60,
}

const activityKeywords = {
  'jalan kaki': ['walk', 'Jalan'],
  'push up': ['pushup', 'Push'],
  lari: ['run', 'Lari'],
  membaca: ['read', 'Baca'],
  meditasi: ['meditate', 'Meditasi'],
  journaling: ['journal', 'Journal'],
  'belajar skill baru': ['learn', 'skill', 'Belajar'],
  menulis: ['journal', 'Journal'],
  'olahraga berat': ['run', 'pushup', 'Lari', 'Push'],
}

function matchesActivity(mission, activity) {
  const terms = activityKeywords[activity] ?? [activity]
  const haystack = `${mission.id} ${mission.title} ${mission.category}`.toLowerCase()
  return terms.some((term) => haystack.includes(term.toLowerCase()))
}

function categoryStats(logs, category) {
  return logs.filter((log) => log.category === category)
}

export function scoreMission(mission, profile, logs = []) {
  let score = 10
  const reasons = []
  const mappedGoal = goalMap[profile.main_goal]
  const availableTime = timeMap[profile.available_time] ?? 10

  if (mission.target_goal.includes(mappedGoal)) {
    score += 40
    reasons.push('selaras dengan tujuan utama')
  }

  if (mission.difficulty === profile.starting_difficulty) {
    score += 25
    reasons.push('tingkat tantangan pas')
  }

  if (mission.duration_minutes <= availableTime) {
    score += 20
    reasons.push('cukup untuk waktu luangmu')
  }

  if ((profile.preferred_activities ?? []).some((item) => matchesActivity(mission, item))) {
    score += 15
    reasons.push('cocok dengan aktivitas favorit')
  }

  if ((profile.disliked_activities ?? []).some((item) => matchesActivity(mission, item))) {
    score -= 50
    reasons.push('dikurangi karena kurang disukai')
  }

  const beginner =
    profile.activity_level === 'sangat_jarang_bergerak' ||
    profile.starting_difficulty === 'very_light'

  if (beginner && mission.energy_required === 'high') {
    score -= 30
    reasons.push('terlalu berat untuk fase awal')
  }

  const stats = categoryStats(logs, mission.category)
  const skipped = stats.filter((log) => log.status === 'skipped').length
  const completed = stats.filter((log) => log.status === 'completed').length

  if (skipped >= 3) {
    score -= 20
    reasons.push('kategori ini sering diskip')
  }

  if (completed >= 5) {
    score += 10
    reasons.push('kategori ini sering berhasil')
  }

  return {
    score,
    reasons,
  }
}

export function recommendDailyMissions({ missions, profile, logs, date }) {
  const scored = missions
    .map((mission) => ({
      ...mission,
      recommendation: scoreMission(mission, profile, logs),
    }))
    .filter((mission) => {
      const isNewUser = logs.length < 5
      return !(isNewUser && difficultyRank[mission.difficulty] > 2)
    })
    .sort((a, b) => b.recommendation.score - a.recommendation.score)

  const main = scored[0]
  const light = scored.find(
    (mission) => mission.difficulty === 'very_light' && mission.id !== main?.id,
  )
  const bonus = scored.find(
    (mission) => mission.id !== main?.id && mission.id !== light?.id,
  )

  return [main, light, bonus].filter(Boolean).map((mission, index) => ({
    id: `${date}-${mission.id}-${index}`,
    mission_id: mission.id,
    date,
    status: 'pending',
    slot: ['utama', 'ringan', 'bonus'][index],
    recommended_score: mission.recommendation.score,
    reasons: mission.recommendation.reasons,
    created_at: new Date().toISOString(),
  }))
}
