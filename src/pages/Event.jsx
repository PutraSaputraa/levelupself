import { useState } from 'react'
import { eventCategories } from '../data/appData'
import { classNames } from '../lib/classNames'

export function Event({ completedEventIds, onComplete }) {
  const [activeCategory, setActiveCategory] = useState(eventCategories[0].id)
  const category = eventCategories.find((item) => item.id === activeCategory) ?? eventCategories[0]

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Extra challenge</span>
          <h1>Event</h1>
        </div>
        <span className="level-pill">3 misi per kategori</span>
      </header>

      <section className="panel event-panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Kategori event</span>
            <h2>{category.name}</h2>
          </div>
          <span className="date-chip">Misi tambahan</span>
        </div>
        <div className="event-tabs">
          {eventCategories.map((item) => (
            <button
              className={classNames(activeCategory === item.id && 'selected')}
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="event-mission-grid">
          {category.missions.map((mission) => {
            const completed = completedEventIds.includes(mission.id)
            const eventMission = { ...mission, event_category: category.id }

            return (
              <article className={classNames('event-mission-card', completed && 'completed')} key={mission.id}>
                <div className="mission-meta">
                  <span>{category.name}</span>
                  <span>{mission.duration_minutes} min</span>
                  <span>{mission.xp_reward} XP</span>
                </div>
                <h3>{mission.title}</h3>
                <p>
                  Misi event ini membantu membuka achievement kategori {category.name.toLowerCase()}.
                </p>
                {completed ? (
                  <span className="status-chip completed">completed</span>
                ) : (
                  <button className="primary" onClick={() => onComplete(eventMission)} type="button">
                    Ambil event
                  </button>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
