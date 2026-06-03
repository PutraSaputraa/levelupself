import { useState } from 'react'
import { ChoiceGroup } from '../components/ChoiceGroup'
import { surveyOptions } from '../data/appData'
import { classNames } from '../lib/classNames'

export function Profile({ achievementGroups, badges, onSave, profile, user, userLogs }) {
  const [draft, setDraft] = useState(profile)
  const completed = userLogs.filter((log) => log.status === 'completed').length

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Player profile</span>
          <h1>{user.name}</h1>
        </div>
        <button
          className="level-pill copy-pill"
          onClick={() => navigator.clipboard?.writeText(user.friend_code)}
          type="button"
        >
          {user.friend_code}
        </button>
      </header>

      <section className="profile-grid">
        <div className="panel profile-hero">
          <div className="player-avatar profile-avatar">{user.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <span className="eyebrow">Player ID</span>
            <h2>{user.friend_code}</h2>
            <p>Bagikan ID ini agar teman bisa menambahkan kamu.</p>
          </div>
        </div>
        <div className="panel">
          <h2>Progress</h2>
          <div className="profile-stats">
            <div>
              <span>Level</span>
              <strong>{user.level}</strong>
            </div>
            <div>
              <span>Total XP</span>
              <strong>{user.total_xp}</strong>
            </div>
            <div>
              <span>Streak saat ini</span>
              <strong>{user.streak} hari</strong>
            </div>
            <div>
              <span>Streak terpanjang</span>
              <strong>{user.best_streak ?? user.streak} hari</strong>
            </div>
            <div>
              <span>Misi selesai</span>
              <strong>{completed}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Achievements</span>
            <h2>Achievement</h2>
          </div>
          <span className="date-chip">{badges.length} terbuka</span>
        </div>
        <div className="achievement-groups">
          {achievementGroups.map((group) => (
            <div className="achievement-group" key={group.id}>
              <h3>{group.title}</h3>
              <div className="achievement-list">
                {group.items.map((item) => (
                  <div className={classNames('achievement-row', item.earned && 'earned')} key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                    </div>
                    <span className="achievement-reward">{item.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="survey-grid compact">
        <ChoiceGroup
          field="main_goal"
          items={surveyOptions.main_goal}
          onChange={setDraft}
          title="Tujuan utama"
          value={draft.main_goal}
        />
        <ChoiceGroup
          field="available_time"
          items={surveyOptions.available_time}
          onChange={setDraft}
          title="Waktu luang"
          value={draft.available_time}
        />
        <ChoiceGroup
          field="active_time"
          items={surveyOptions.active_time}
          onChange={setDraft}
          title="Waktu aktif"
          value={draft.active_time}
        />
        <ChoiceGroup
          field="starting_difficulty"
          items={surveyOptions.starting_difficulty}
          onChange={setDraft}
          title="Tingkat misi"
          value={draft.starting_difficulty}
        />
      </section>
      <button className="primary save-profile" onClick={() => onSave(draft)} type="button">
        Simpan profile
      </button>
    </div>
  )
}
