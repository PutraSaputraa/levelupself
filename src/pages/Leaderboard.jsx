import { useMemo, useState } from 'react'
import { eventCategories } from '../data/appData'
import { classNames } from '../lib/classNames'
import { getLeaderboard } from '../lib/leaderboard'

export function Leaderboard({ currentUserId, friendIds = [], logs, users }) {
  const [selectedBoard, setSelectedBoard] = useState(null)
  const leaderboard = useMemo(
    () => getLeaderboard(users, logs, { categoryId: selectedBoard?.categoryId }),
    [logs, selectedBoard?.categoryId, users],
  )
  const board =
    selectedBoard?.scope === 'friends'
      ? leaderboard.filter((player) => player.id === currentUserId || friendIds.includes(player.id))
      : leaderboard
  const currentUserRank = board.findIndex((user) => user.id === currentUserId) + 1

  if (!selectedBoard) {
    return (
      <div className="page-stack">
        <header className="topbar">
          <div>
            <span className="eyebrow">Competition</span>
            <h1>Leaderboard</h1>
          </div>
          <span className="level-pill">Pilih arena</span>
        </header>

        <section className="leaderboard-menu-grid">
          <button
            className="leaderboard-menu-card featured"
            onClick={() => setSelectedBoard({ scope: 'global', title: 'Peringkat semua' })}
            type="button"
          >
            <span className="eyebrow">Global</span>
            <h2>Semua player</h2>
            <p>Total XP, streak, dan misi selesai dari semua kategori.</p>
            <strong>Masuk global</strong>
          </button>
          <button
            className="leaderboard-menu-card"
            onClick={() => setSelectedBoard({ scope: 'friends', title: 'Peringkat teman' })}
            type="button"
          >
            <span className="eyebrow">Friend</span>
            <h2>Teman saja</h2>
            <p>Bandingkan progress umum dengan teman yang sudah disetujui.</p>
            <strong>Masuk friend</strong>
          </button>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <span className="eyebrow">Category board</span>
              <h2>Peringkat berdasarkan kategori XP</h2>
            </div>
            <span className="date-chip">Level tetap total XP</span>
          </div>
          <div className="leaderboard-category-grid">
            {eventCategories.map((category) => (
              <article className="leaderboard-category-card" key={category.id}>
                <span className="eyebrow">{category.name}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="leaderboard-card-actions">
                  <button
                    className="primary"
                    onClick={() =>
                      setSelectedBoard({
                        categoryId: category.id,
                        categoryName: category.name,
                        scope: 'global',
                        title: `${category.name} global`,
                      })
                    }
                    type="button"
                  >
                    Global
                  </button>
                  <button
                    className="ghost"
                    onClick={() =>
                      setSelectedBoard({
                        categoryId: category.id,
                        categoryName: category.name,
                        scope: 'friends',
                        title: `${category.name} teman`,
                      })
                    }
                    type="button"
                  >
                    Teman
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">
            {selectedBoard.categoryName ?? (selectedBoard.scope === 'friends' ? 'Friend board' : 'Global board')}
          </span>
          <h1>{selectedBoard.title}</h1>
        </div>
        <div className="topbar-actions">
          {currentUserRank > 0 && <div className="level-pill">Rank #{currentUserRank}</div>}
          <button className="ghost" onClick={() => setSelectedBoard(null)} type="button">
            Ganti board
          </button>
        </div>
      </header>

      <LeaderboardBoard
        board={board}
        categoryName={selectedBoard.categoryName}
        currentUserId={currentUserId}
        title={selectedBoard.title}
        type={selectedBoard.scope}
      />
    </div>
  )
}

function LeaderboardBoard({ board, categoryName, currentUserId, title, type }) {
  const rankedBoard = board.map((player, index) => ({ ...player, displayRank: index + 1 }))
  const topThree = rankedBoard.slice(0, 3)
  const isCategoryBoard = Boolean(categoryName)

  return (
    <section className="panel leaderboard-panel">
      <div className="section-head">
        <div>
          <span className="eyebrow">{type === 'friends' ? 'Friend board' : 'Global board'}</span>
          <h2>{title}</h2>
        </div>
        <span className="date-chip">
          {isCategoryBoard ? `${categoryName} XP` : 'XP + streak + misi'}
        </span>
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
                    {isCategoryBoard
                      ? `${player.category_xp_value} XP ${categoryName}`
                      : `${player.total_xp} XP - streak ${player.streak} hari`}
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
                  <span>{isCategoryBoard ? `${categoryName} XP` : 'XP'}</span>
                  <strong>{isCategoryBoard ? player.category_xp_value : player.total_xp}</strong>
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
