import { classNames } from '../lib/classNames'

export function MissionCard({ daily, mission, onComplete, onSkip }) {
  return (
    <article className={classNames('mission-card', daily.status)}>
      <div className="mission-meta">
        <span>{daily.slot}</span>
        <span>{mission.duration_minutes} min</span>
        <span>{mission.xp_reward} XP</span>
      </div>
      <h3>{mission.title}</h3>
      <p>{mission.description}</p>
      <div className="reason-list">
        {daily.reasons.slice(0, 2).map((reason) => (
          <span key={reason}>{reason}</span>
        ))}
      </div>
      <div className="card-actions">
        {daily.status === 'pending' ? (
          <>
            <button className="ghost" onClick={onSkip} type="button">
              Skip
            </button>
            <button className="primary" onClick={onComplete} type="button">
              Selesai
            </button>
          </>
        ) : (
          <span className="status-chip">{daily.status}</span>
        )}
      </div>
    </article>
  )
}
