import { classNames } from '../lib/classNames'

export function MissionDetail({
  dailyMissions,
  missionMap,
  onComplete,
  onSelect,
  onSkip,
  selectedMission,
}) {
  const selectedDaily = dailyMissions.find((item) => item.mission_id === selectedMission?.id)
  const mission = selectedMission ?? missionMap[dailyMissions[0]?.mission_id]

  if (!mission) return <div className="panel">Belum ada misi hari ini.</div>

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Mission detail</span>
          <h1>{mission.title}</h1>
        </div>
      </header>
      <section className="detail-layout">
        <div className="panel detail-main">
          <p>{mission.description}</p>
          <div className="detail-stats">
            <div>
              <span>Category</span>
              <strong>{mission.category}</strong>
            </div>
            <div>
              <span>Difficulty</span>
              <strong>{mission.difficulty}</strong>
            </div>
            <div>
              <span>Duration</span>
              <strong>{mission.duration_minutes} min</strong>
            </div>
            <div>
              <span>Reward</span>
              <strong>{mission.xp_reward} XP</strong>
            </div>
            <div>
              <span>Energy</span>
              <strong>{mission.energy_required}</strong>
            </div>
            <div>
              <span>Equipment</span>
              <strong>{mission.equipment}</strong>
            </div>
          </div>
          {selectedDaily && selectedDaily.status === 'pending' && (
            <div className="wide-actions">
              <button className="ghost" onClick={() => onSkip(selectedDaily)} type="button">
                Skip misi
              </button>
              <button className="primary" onClick={() => onComplete(selectedDaily)} type="button">
                Selesaikan misi
              </button>
            </div>
          )}
        </div>
        <div className="panel">
          <h2>Misi hari ini</h2>
          <div className="mini-list">
            {dailyMissions.map((daily) => (
              <button
                className={classNames(selectedMission?.id === daily.mission_id && 'selected')}
                key={daily.id}
                onClick={() => onSelect(missionMap[daily.mission_id])}
                type="button"
              >
                <span>{missionMap[daily.mission_id].title}</span>
                <small>{daily.status}</small>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
