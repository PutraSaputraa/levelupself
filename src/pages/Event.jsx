import { useMemo, useState } from 'react'
import { eventCategories } from '../data/appData'

export function Event({ eventLogs, onComplete }) {
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const activeCategory = eventCategories.find((item) => item.id === activeCategoryId)
  const completionCounts = useMemo(
    () =>
      eventLogs.reduce((counts, log) => {
        counts[log.mission_id] = (counts[log.mission_id] ?? 0) + 1
        return counts
      }, {}),
    [eventLogs],
  )

  if (!activeCategory) {
    return (
      <div className="page-stack">
        <header className="topbar">
          <div>
            <span className="eyebrow">Extra challenge</span>
            <h1>Event</h1>
          </div>
          <span className="level-pill">Kategori misi tambahan</span>
        </header>

        <section className="event-category-grid">
          {eventCategories.map((category) => {
            const totalDone = eventLogs.filter((log) => log.event_category === category.id).length

            return (
              <button
                className="event-category-card"
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                type="button"
              >
                <span className="eyebrow">{category.name}</span>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <div className="event-category-footer">
                  <span>{category.missions.length} misi</span>
                  <strong>{totalDone} selesai</strong>
                </div>
              </button>
            )
          })}
        </section>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Event category</span>
          <h1>{activeCategory.name}</h1>
        </div>
        <button className="ghost" onClick={() => setActiveCategoryId(null)} type="button">
          Kembali
        </button>
      </header>

      <section className="panel event-panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Misi tambahan</span>
            <h2>{activeCategory.description}</h2>
          </div>
          <span className="date-chip">Akumulatif</span>
        </div>
        <div className="event-mission-grid">
          {activeCategory.missions.map((mission) => {
            const eventMission = { ...mission, event_category: activeCategory.id }
            const doneCount = completionCounts[mission.id] ?? 0

            return (
              <article className="event-mission-card" key={mission.id}>
                <div className="mission-meta">
                  <span>{activeCategory.name}</span>
                  <span>{mission.duration_minutes} min</span>
                  <span>{mission.xp_reward} XP</span>
                </div>
                <h3>{mission.title}</h3>
                <p>
                  Selesaikan untuk menambah progres {metricLabel(mission.metric_type)} sebanyak{' '}
                  {mission.metric_value}.
                </p>
                <div className="event-progress-line">
                  <span>Dikerjakan</span>
                  <strong>{doneCount}x</strong>
                </div>
                <button className="primary" onClick={() => onComplete(eventMission)} type="button">
                  Kerjakan misi
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function metricLabel(metricType) {
  const labels = {
    push_up: 'push up',
    focus_minutes: 'menit fokus',
    cardio_minutes: 'menit cardio',
    stamina_minutes: 'menit stamina',
    reading_minutes: 'menit membaca',
    meditation_mission: 'misi meditasi',
    mindfulness_mission: 'misi mindfulness',
    mental_mission: 'misi mental',
    strength_mission: 'misi strength',
    intelect_mission: 'misi intelect',
  }

  return labels[metricType] ?? 'progres kategori'
}
