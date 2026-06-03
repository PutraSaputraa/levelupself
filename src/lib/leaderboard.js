export function getLeaderboard(users, logs, options = {}) {
  const { categoryId = null } = options

  return users
    .map((user) => {
      const userLogs = logs.filter((log) => {
        if (log.user_id !== user.id) return false
        if (!categoryId) return true
        return log.xp_category === categoryId || log.event_category === categoryId
      })
      const completed = categoryId
        ? user.category_completed?.[categoryId] ??
          userLogs.filter((log) => log.status === 'completed').length
        : user.completed_count ?? userLogs.filter((log) => log.status === 'completed').length
      const skipped = categoryId
        ? user.category_skipped?.[categoryId] ??
          userLogs.filter((log) => log.status === 'skipped').length
        : user.skipped_count ?? userLogs.filter((log) => log.status === 'skipped').length
      const attempts = completed + skipped
      const completionRate = attempts === 0 ? 0 : Math.round((completed / attempts) * 100)
      const categoryXp = categoryId ? user.category_xp?.[categoryId] ?? 0 : user.total_xp
      const score = categoryId ? categoryXp : user.total_xp + user.streak * 20

      return {
        ...user,
        category_xp_value: categoryXp,
        completed,
        skipped,
        completionRate,
        score,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (categoryId && b.category_xp_value !== a.category_xp_value) {
        return b.category_xp_value - a.category_xp_value
      }
      if (b.total_xp !== a.total_xp) return b.total_xp - a.total_xp
      return b.streak - a.streak
    })
    .map((user, index) => ({ ...user, rank: index + 1 }))
}
