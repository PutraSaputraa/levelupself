import { useState } from 'react'
import { classNames } from '../lib/classNames'

export function Achievements({ achievementGroups, earnedCount }) {
  const [selected, setSelected] = useState(null)
  const total = achievementGroups.reduce((count, group) => count + group.items.length, 0)

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Milestones</span>
          <h1>Achievement</h1>
        </div>
        <span className="level-pill">
          {earnedCount}/{total} terbuka
        </span>
      </header>

      {achievementGroups.map((group) => (
        <section className="panel" key={group.id}>
          <div className="section-head">
            <div>
              <span className="eyebrow">Kategori</span>
              <h2>{group.title}</h2>
            </div>
          </div>
          <div className="achievement-card-grid">
            {group.items.map((item) => (
              <button
                className={classNames('achievement-card', item.earned && 'earned')}
                key={item.id}
                onClick={() => setSelected({ ...item, groupTitle: group.title })}
                type="button"
              >
                <span className="achievement-icon">{item.earned ? 'OK' : 'LOCK'}</span>
                <strong>{item.name}</strong>
                <small>{item.earned ? 'Terbuka' : 'Terkunci'}</small>
              </button>
            ))}
          </div>
        </section>
      ))}

      {selected && (
        <div className="modal-backdrop">
          <div className="modal achievement-modal">
            <span className="eyebrow">{selected.groupTitle}</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="action-summary">
              <div>
                <span>Status</span>
                <strong>{selected.earned ? 'Terbuka' : 'Terkunci'}</strong>
              </div>
              <div>
                <span>Reward</span>
                <strong>{selected.reward}</strong>
              </div>
            </div>
            <button className="primary full" onClick={() => setSelected(null)} type="button">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
