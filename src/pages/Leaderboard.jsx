import { classNames } from '../lib/classNames'

export function Leaderboard({ currentUserId, friendIds = [], leaderboard }) {
  const [friendsBoard, allBoard] = [
    leaderboard.filter((player) => player.id === currentUserId || friendIds.includes(player.id)),
    leaderboard,
  ]
  const currentUser = leaderboard.find((user) => user.id === currentUserId)
  const boards = [
    ['friends', 'Peringkat teman', friendsBoard],
    ['all', 'Peringkat semua', allBoard],
  ]

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Competition</span>
          <h1>Leaderboard</h1>
        </div>
        {currentUser && <div className="level-pill">Rank #{currentUser.rank}</div>}
      </header>

      {boards.map(([key, title, board]) => (
        <LeaderboardBoard
          board={board}
          currentUserId={currentUserId}
          key={key}
          title={title}
          type={key}
        />
      ))}
    </div>
  )
}

function LeaderboardBoard({ board, currentUserId, title, type }) {
  const rankedBoard = board.map((player, index) => ({ ...player, displayRank: index + 1 }))
  const topThree = rankedBoard.slice(0, 3)

  return (
    <section className="panel leaderboard-panel">
      <div className="section-head">
        <div>
          <span className="eyebrow">{type === 'friends' ? 'Friend board' : 'Global board'}</span>
          <h2>{title}</h2>
        </div>
        <span className="date-chip">XP + streak + misi</span>
      </div>

      {rankedBoard.length === 0 ? (
        <p>Belum ada data leaderboard.</p>
      ) : (
        <>
          <div className="podium-grid compact-podium">
            {topThree.map((player) => (
              <article
                className={classNames(
                  'podium-card',
                  `rank-${player.displayRank}`,
                  player.id === currentUserId && 'current',
                )}
                key={player.id}
              >
                <div className="podium-head">
                  <span className="rank-medal">#{player.displayRank}</span>
                  <span className="podium-label">
                    {player.displayRank === 1 ? 'Top Player' : `Challenger ${player.displayRank}`}
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
          </div>

          <div className="leaderboard-list">
            {rankedBoard.map((player) => (
              <div
                className={classNames('leaderboard-row', player.id === currentUserId && 'current')}
                key={player.id}
              >
                <div className="rank-cell">#{player.displayRank}</div>
                <div className="player-cell">
                  <strong>{player.name}</strong>
                  <span>{player.friend_code}</span>
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
        </>
      )}
    </section>
  )
}
