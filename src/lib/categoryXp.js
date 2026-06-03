export function getXpCategory(mission = {}) {
  const rawCategory = mission.event_category ?? mission.category ?? 'general'
  const aliases = {
    productivity: 'focus',
    reflection: 'mindfulness',
  }

  return aliases[rawCategory] ?? rawCategory
}
