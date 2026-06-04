import { maxTier } from '../data/tierConfig.js'

export function xpToNextTier(tier) {
  if (tier >= maxTier) return 0
  if (tier <= 1) return 100
  return 100 + (tier - 1) * 50 + Math.max(0, tier - 2) ** 2 * 25
}

export function xpForTier(tier) {
  if (tier <= 1) return 0
  const cappedTier = Math.min(tier, maxTier)

  let total = 0
  for (let currentTier = 1; currentTier < cappedTier; currentTier += 1) {
    total += xpToNextTier(currentTier)
  }

  return total
}

export function getTierFromXp(totalXp) {
  let tier = 1
  while (tier < maxTier && totalXp >= xpForTier(tier + 1)) {
    tier += 1
  }
  return tier
}

export function getTierProgress(totalXp) {
  const tier = getTierFromXp(totalXp)
  const current = xpForTier(tier)
  const isMaxTier = tier >= maxTier
  const next = isMaxTier ? null : xpForTier(tier + 1)
  const gained = totalXp - current
  const needed = isMaxTier ? 0 : next - current

  return {
    tier,
    level: tier,
    current,
    next,
    gained,
    needed,
    isMaxTier,
    percent: isMaxTier ? 100 : Math.min(100, Math.round((gained / needed) * 100)),
  }
}

export const xpToNextLevel = xpToNextTier
export const xpForLevel = xpForTier
export const getLevelFromXp = getTierFromXp
export const getLevelProgress = getTierProgress
