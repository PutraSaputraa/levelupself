import { achievementGroups } from '../data/appData'
import { getXpCategory } from './categoryXp'

const isCategory = (log, category) => getXpCategory(log) === category

function completedLogs(logs) {
  return logs.filter((log) => log.status === 'completed')
}

function countBy(logs, predicate) {
  return completedLogs(logs).filter(predicate).length
}

function uniqueCompletedDates(logs, predicate = () => true) {
  return new Set(
    completedLogs(logs)
      .filter(predicate)
      .map((log) => (log.time_completed ?? log.created_at ?? '').slice(0, 10))
      .filter(Boolean),
  ).size
}

function hasTitle(logs, text) {
  return completedLogs(logs).some((log) => log.title?.toLowerCase().includes(text))
}

function metricTotal(logs, type) {
  return completedLogs(logs)
    .filter((log) => log.metric_type === type)
    .reduce((total, log) => total + Number(log.metric_value ?? 0), 0)
}

function achievementChecks({ logs, profile, user }) {
  const completed = completedLogs(logs)
  const skipped = logs.filter((log) => log.status === 'skipped')
  const strengthCount = countBy(logs, (log) => isCategory(log, 'strength'))
  const intelectCount = countBy(logs, (log) => isCategory(log, 'intelect'))
  const mentalCount = countBy(logs, (log) => isCategory(log, 'mental'))
  const staminaCount = countBy(logs, (log) => isCategory(log, 'stamina'))
  const pushUpTotal = metricTotal(logs, 'push_up')
  const readingMinutes = metricTotal(logs, 'reading_minutes')
  const focusMinutes = metricTotal(logs, 'focus_minutes')
  const cardioMinutes = metricTotal(logs, 'cardio_minutes')
  const meditationMissions =
    metricTotal(logs, 'meditation_mission') + countBy(logs, (log) => log.title?.toLowerCase().includes('meditasi'))

  return {
    'first-step': completed.length >= 1,
    'new-adventurer': profile?.onboarding_completed,
    'day-one-hero': completed.length >= 3,
    'starter-pack': completed.length >= 3,
    'level-up-rookie': user.level >= 2,
    'streak-3': user.streak >= 3 || user.best_streak >= 3,
    'week-warrior': user.streak >= 7 || user.best_streak >= 7,
    'two-week-discipline': user.streak >= 14 || user.best_streak >= 14,
    'thirty-day-legend': user.streak >= 30 || user.best_streak >= 30,
    'no-zero-day': uniqueCompletedDates(logs) >= 7,
    'comeback-kid': false,
    'still-standing': false,
    'restart-strong': completed.length >= 3 && skipped.length >= 1,
    'never-too-late': false,
    'fresh-start': skipped.length >= 1 && completed.length >= 1,
    'mini-athlete': strengthCount >= 5,
    'push-up-starter': pushUpTotal >= 50,
    walker: countBy(logs, (log) => log.title?.toLowerCase().includes('jalan')) >= 5,
    'runner-seed': hasTitle(logs, 'lari') || metricTotal(logs, 'run_mission') >= 1,
    'body-activated': uniqueCompletedDates(logs, (log) => isCategory(log, 'strength')) >= 7,
    'stronger-week': strengthCount >= 10,
    'book-starter': intelectCount >= 1,
    'reader-10': readingMinutes >= 50 || intelectCount >= 5,
    'page-collector': readingMinutes >= 100 || intelectCount >= 5,
    'knowledge-seeker': intelectCount >= 10,
    'night-reader': metricTotal(logs, 'night_reading') >= 5 || hasTitle(logs, 'sebelum tidur'),
    'consistent-reader': uniqueCompletedDates(logs, (log) => isCategory(log, 'intelect')) >= 7,
    'calm-start': meditationMissions >= 1,
    'quiet-mind': meditationMissions >= 5,
    'breathing-master':
      meditationMissions +
        metricTotal(logs, 'mindfulness_mission') +
        countBy(logs, (log) => log.title?.toLowerCase().includes('napas')) >=
      10,
    'peaceful-week': uniqueCompletedDates(logs, (log) => log.title?.toLowerCase().includes('meditasi')) >= 7,
    'mind-reset': metricTotal(logs, 'reflection_mission') >= 1 || hasTitle(logs, 'refleksi'),
    'inner-balance': mentalCount >= 20,
    'focus-mode': focusMinutes >= 5 || hasTitle(logs, 'fokus') || hasTitle(logs, 'deep work'),
    'task-finisher': intelectCount >= 10,
    'clean-desk': hasTitle(logs, 'rapikan') || hasTitle(logs, 'meja'),
    'deep-work-rookie': focusMinutes >= 25 || hasTitle(logs, 'deep work'),
    'anti-procrastination': skipped.length >= 1 && intelectCount >= 1,
    'productive-week': intelectCount >= 15,
    'stamina-starter': staminaCount >= 1,
    'endurance-builder': staminaCount >= 10,
    'early-hydration': hasTitle(logs, 'minum air'),
    'recovery-reset': hasTitle(logs, 'tidur') || hasTitle(logs, 'stretching'),
    'stamina-week': staminaCount >= 15,
    'level-5': user.level >= 5,
    'level-10': user.level >= 7,
    'xp-collector': user.total_xp >= 1000,
    'growth-machine': user.total_xp >= 5000,
    'discipline-master': user.total_xp >= 10000,
    'almost-rpg': user.level >= 4,
    'cardio-starter': cardioMinutes >= 15 || staminaCount >= 3,
  }
}

export function evaluateAchievements({ logs, profile, user }) {
  const checks = achievementChecks({ logs, profile, user })

  return achievementGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      earned: Boolean(checks[item.id]),
    })),
  }))
}

export function flattenEarnedAchievements(groups) {
  return groups.flatMap((group) => group.items.filter((item) => item.earned))
}
