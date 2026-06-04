import { useMemo, useState } from 'react'
import { TierBadge } from '../components/TierBadge'

export function Friends({
  friendIds,
  friendRequests,
  onAddFriend,
  onRespondRequest,
  user,
  users,
}) {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const friends = users.filter((candidate) => friendIds.includes(candidate.id))
  const incomingRequests = friendRequests.filter(
    (request) => request.to_user_id === user.id && request.status === 'pending',
  )
  const outgoingRequests = friendRequests.filter(
    (request) => request.from_user_id === user.id && request.status === 'pending',
  )
  const suggestions = useMemo(() => {
    const term = submittedQuery.trim().toLowerCase()
    if (!term) return []

    return users
      .filter((candidate) => candidate.id !== user.id)
      .filter((candidate) => {
        const name = candidate.name?.toLowerCase() ?? ''
        const code = candidate.friend_code?.toLowerCase() ?? ''
        return name.includes(term) || code.includes(term)
      })
      .slice(0, 6)
  }, [submittedQuery, user.id, users])

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
        <form
          className="friend-search-form"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmittedQuery(query)
          }}
        >
          <label className="field">
            <span>ID teman atau nama user</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder=""
              type="text"
              value={query}
            />
          </label>
          <button className="primary" type="submit">
            Cari
          </button>
        </form>
        <div className="friend-search-list">
          {submittedQuery && suggestions.length === 0 && <p>User belum ditemukan.</p>}
          {suggestions.map((candidate) => {
            const alreadyFriend = friendIds.includes(candidate.id)
            const hasPendingRequest = friendRequests.some(
              (request) =>
                request.status === 'pending' &&
                ((request.from_user_id === user.id && request.to_user_id === candidate.id) ||
                  (request.from_user_id === candidate.id && request.to_user_id === user.id)),
            )

            return (
              <div className="friend-row" key={candidate.id}>
                <div className="player-cell">
                  <strong>{candidate.name}</strong>
                  <span>{candidate.friend_code}</span>
                </div>
                <button
                  className={alreadyFriend || hasPendingRequest ? 'ghost' : 'primary'}
                  disabled={alreadyFriend || hasPendingRequest}
                  onClick={() => onAddFriend(candidate.id)}
                  type="button"
                >
                  {alreadyFriend ? 'Sudah teman' : hasPendingRequest ? 'Menunggu' : 'Request'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Friend request</span>
            <h2>Request masuk</h2>
          </div>
          <span className="date-chip">{incomingRequests.length} pending</span>
        </div>
        <div className="friend-list">
          {incomingRequests.length === 0 && <p>Tidak ada request masuk.</p>}
          {incomingRequests.map((request) => (
            <div className="friend-row" key={request.id}>
              <div className="player-cell">
                <strong>{request.from_name}</strong>
                <span>{request.from_friend_code}</span>
              </div>
              <div className="friend-actions">
                <button className="ghost" onClick={() => onRespondRequest(request.id, 'declined')} type="button">
                  Tolak
                </button>
                <button className="primary" onClick={() => onRespondRequest(request.id, 'accepted')} type="button">
                  Terima
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Sent request</span>
            <h2>Request terkirim</h2>
          </div>
          <span className="date-chip">{outgoingRequests.length} pending</span>
        </div>
        <div className="friend-list">
          {outgoingRequests.length === 0 && <p>Belum ada request terkirim.</p>}
          {outgoingRequests.map((request) => (
            <div className="friend-row" key={request.id}>
              <div className="player-cell">
                <strong>{request.to_name}</strong>
                <span>{request.to_friend_code}</span>
              </div>
              <span className="status-chip">pending</span>
            </div>
          ))}
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
              <TierBadge tier={friend.level} size="compact" />
              <div className="player-cell">
                <strong>{friend.name}</strong>
                <span>
                  Tier {friend.level} - {friend.total_xp} XP - {friend.friend_code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
