import { categoryAliases } from '../data/categories'

export function getXpCategory(mission = {}) {
  const rawCategory = mission.xp_category ?? mission.event_category ?? mission.category ?? 'stamina'

  return categoryAliases[rawCategory] ?? rawCategory
}
