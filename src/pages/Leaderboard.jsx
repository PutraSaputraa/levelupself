import { classNames } from '../lib/classNames'

export function Leaderboard({ currentUserId, leaderboard }) {
  const currentUser = leaderboard.find((user) => user.id === currentUserId)
  const topThree = leaderboard.slice(0, 3)

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Competition</span>
          <h1>Leaderboard</h1>
        </div>
        {currentUser && <div className="level-pill">Rank #{currentUser.rank}</div>}
      </header>

      <section className="podium-grid">
        {topThree.map((player) => (
          <article
            className={classNames(
              'panel podium-card',
              `rank-${player.rank}`,
              player.id === currentUserId && 'current',
            )}
            key={player.id}
          >
            <div className="podium-head">
              <span className="rank-medal">#{player.rank}</span>
              <span className="podium-label">
                {player.rank === 1 ? 'Top Player' : `Challenger ${player.rank}`}
              </span>
            </div>
            <div className="player-avatar">{player.name.slice(0, 2).toUpperCase()}</div>
            <div className="podium-body">
              <h2>{player.name}</h2>
              <strong>{player.score} pts</strong>
              <span>
                {player.total_xp} XP - streak {player.streak} hari
              </span>
            </div>
            <div className="podium-meter">
              <div style={{ width: `${Math.min(100, player.completionRate || 12)}%` }} />
            </div>
          </article>
        ))}
      </section>

      <section className="panel leaderboard-panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">All players</span>
            <h2>Peringkat user</h2>
          </div>
          <span className="date-chip">XP + streak + misi</span>
        </div>
        <div className="leaderboard-list">
          {leaderboard.map((player) => (
            <div
              className={classNames('leaderboard-row', player.id === currentUserId && 'current')}
              key={player.id}
            >
              <div className="rank-cell">#{player.rank}</div>
              <div className="player-cell">
                <strong>{player.name}</strong>
                <span>{player.email}</span>
              </div>
              <div>
                <span>Score</span>
                <strong>{player.score}</strong>
              </div>
              <div>
                <span>Level</span>
                <strong>{player.level}</strong>
              </div>
              <div>
                <span>XP</span>
                <strong>{player.total_xp}</strong>
              </div>
              <div>
                <span>Streak</span>
                <strong>{player.streak}</strong>
              </div>
              <div>
                <span>Done</span>
                <strong>{player.completed}</strong>
              </div>
              <div>
                <span>Rate</span>
                <strong>{player.completionRate}%</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
