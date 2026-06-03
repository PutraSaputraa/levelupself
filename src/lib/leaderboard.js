export function getLeaderboard(users, logs) {
  return users
    .map((user) => {
      const userLogs = logs.filter((log) => log.user_id === user.id)
      const completed = userLogs.filter((log) => log.status === 'completed').length
      const skipped = userLogs.filter((log) => log.status === 'skipped').length
      const completionRate =
        userLogs.length === 0 ? 0 : Math.round((completed / userLogs.length) * 100)

      return {
        ...user,
        completed,
        skipped,
        completionRate,
        score: user.total_xp + user.streak * 20 + completed * 10,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.total_xp !== a.total_xp) return b.total_xp - a.total_xp
      return b.streak - a.streak
    })
    .map((user, index) => ({ ...user, rank: index + 1 }))
}
