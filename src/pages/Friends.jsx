import { useMemo, useState } from 'react'

export function Friends({ onAddFriend, user, users }) {
  const [query, setQuery] = useState('')
  const friendIds = user.friend_ids ?? []
  const friends = users.filter((candidate) => friendIds.includes(candidate.id))
  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []

    return users
      .filter((candidate) => candidate.id !== user.id)
      .filter((candidate) => {
        const name = candidate.name?.toLowerCase() ?? ''
        const code = candidate.friend_code?.toLowerCase() ?? ''
        return name.includes(term) || code.includes(term)
      })
      .slice(0, 6)
  }, [query, user.id, users])

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Social</span>
          <h1>Friends</h1>
        </div>
        <button
          className="level-pill copy-pill"
          onClick={() => navigator.clipboard?.writeText(user.friend_code)}
          type="button"
        >
          {user.friend_code}
        </button>
      </header>

      <section className="panel friend-add-panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Add friend</span>
            <h2>Cari user</h2>
          </div>
        </div>
        <label className="field">
          <span>ID teman atau nama user</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Contoh: LUS-ABC12345 atau Kaputra"
            type="text"
            value={query}
          />
        </label>
        <div className="friend-search-list">
          {query && suggestions.length === 0 && <p>User belum ditemukan.</p>}
          {suggestions.map((candidate) => {
            const alreadyFriend = friendIds.includes(candidate.id)

            return (
              <div className="friend-row" key={candidate.id}>
                <div className="player-cell">
                  <strong>{candidate.name}</strong>
                  <span>{candidate.friend_code}</span>
                </div>
                <button
                  className={alreadyFriend ? 'ghost' : 'primary'}
                  disabled={alreadyFriend}
                  onClick={() => onAddFriend(candidate.id)}
                  type="button"
                >
                  {alreadyFriend ? 'Sudah teman' : 'Tambah'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Your circle</span>
            <h2>Daftar teman</h2>
          </div>
          <span className="date-chip">{friends.length} teman</span>
        </div>
        <div className="friend-list">
          {friends.length === 0 && <p>Belum ada teman. Tambahkan dengan ID atau nama user.</p>}
          {friends.map((friend) => (
            <div className="friend-row" key={friend.id}>
              <div className="player-avatar small">{friend.name.slice(0, 2).toUpperCase()}</div>
              <div className="player-cell">
                <strong>{friend.name}</strong>
                <span>
                  Level {friend.level} - {friend.total_xp} XP - {friend.friend_code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
