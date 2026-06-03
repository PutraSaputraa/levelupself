import { HistoryPanel } from '../components/HistoryPanel'
import { MissionCard } from '../components/MissionCard'
import { badgeRules } from '../data/appData'
import { classNames } from '../lib/classNames'
import { todayKey } from '../lib/date'

export function Dashboard({
  badges,
  dailyMissions,
  missionMap,
  onComplete,
  onSkip,
  progress,
  user,
  userLogs,
}) {
  const completedToday = dailyMissions.filter((item) => item.status === 'completed').length

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Selamat datang</span>
          <h1>{user.name}</h1>
        </div>
        <div className="level-pill">Level {user.level}</div>
      </header>

      <section className="dashboard-grid">
        <div className="panel xp-panel">
          <div className="metric-row">
            <div>
              <span>Total XP</span>
              <strong>{user.total_xp}</strong>
            </div>
            <div>
              <span>Streak</span>
              <strong>{user.streak} hari</strong>
            </div>
            <div>
              <span>Misi selesai</span>
              <strong>{completedToday}/3</strong>
            </div>
          </div>
          <div className="progress-label">
            <span>Progress ke Level {progress.level + 1}</span>
            <span>
              {progress.gained}/{progress.needed} XP
            </span>
          </div>
          <div className="progress-track">
            <div style={{ width: `${progress.percent}%` }} />
          </div>
        </div>

        <div className="panel badge-panel">
          <h2>Badge</h2>
          <div className="badges">
            {badgeRules.map((badge) => (
              <div
                className={classNames(
                  'badge',
                  badges.some((item) => item.id === badge.id) && 'earned',
                )}
                key={badge.id}
              >
                <strong>{badge.name}</strong>
                <span>{badge.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <span className="eyebrow">Today quest</span>
            <h2>Misi hari ini</h2>
          </div>
          <span className="date-chip">{todayKey()}</span>
        </div>
        <div className="mission-grid">
          {dailyMissions.map((daily) => (
            <MissionCard
              daily={daily}
              key={daily.id}
              mission={missionMap[daily.mission_id]}
              onComplete={() => onComplete(daily)}
              onSkip={() => onSkip(daily)}
            />
          ))}
        </div>
      </section>

      <HistoryPanel logs={userLogs.slice(0, 5)} />
    </div>
  )
}
