export function xpToNextLevel(level) {
  if (level <= 1) return 100
  return 100 + (level - 1) * 50 + Math.max(0, level - 2) ** 2 * 25
}

export function xpForLevel(level) {
  if (level <= 1) return 0

  let total = 0
  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    total += xpToNextLevel(currentLevel)
  }

  return total
}

export function getLevelFromXp(totalXp) {
  let level = 1
  while (totalXp >= xpForLevel(level + 1)) {
    level += 1
  }
  return level
}

export function getLevelProgress(totalXp) {
  const level = getLevelFromXp(totalXp)
  const current = xpForLevel(level)
  const next = xpForLevel(level + 1)
  const gained = totalXp - current
  const needed = next - current

  return {
    level,
    current,
    next,
    gained,
    needed,
    percent: Math.min(100, Math.round((gained / needed) * 100)),
  }
}
