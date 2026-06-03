export function xpForLevel(level) {
  if (level <= 1) return 0
  if (level === 2) return 100
  if (level === 3) return 250
  if (level === 4) return 500
  if (level === 5) return 900
  return level * level * 100
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
