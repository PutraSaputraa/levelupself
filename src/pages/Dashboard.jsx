import { HistoryPanel } from '../components/HistoryPanel'
import { MissionCard } from '../components/MissionCard'
import { TierBadge } from '../components/TierBadge'
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
          <span className="eyebrow">Quest board</span>
          <h1>{user.name}</h1>
        </div>
        <TierBadge tier={user.level} />
      </header>

      <section className="dashboard-grid">
        <div className="panel xp-panel tier-panel">
          <div className="tier-hero">
            <TierBadge tier={user.level} size="large" />
            <div>
              <span className="eyebrow">Current rank</span>
              <h2>Tier {user.level}</h2>
              <p>
                {progress.isMaxTier
                  ? 'Tier maksimum tercapai. Sekarang kumpulkan poin sebanyak mungkin.'
                  : `Naikkan XP untuk membuka Tier ${progress.tier + 1}.`}
              </p>
            </div>
          </div>
          <div className="metric-row">
            <div>
              <span>Total poin</span>
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
            <span>{progress.isMaxTier ? 'Tier maksimum' : `Progress ke Tier ${progress.tier + 1}`}</span>
            <span>
              {progress.isMaxTier ? `${progress.gained} poin setelah Tier 7` : `${progress.gained}/${progress.needed} XP`}
            </span>
          </div>
          <div className="progress-track">
            <div style={{ width: `${progress.percent}%` }} />
          </div>
        </div>

        <div className="panel badge-panel">
          <h2>Badge</h2>
          <div className="badges">
            {badges.slice(0, 5).map((badge) => (
              <div
                className={classNames('badge', 'earned')}
                key={badge.id}
              >
                <strong>{badge.name}</strong>
                <span>{badge.description}</span>
              </div>
            ))}
            {badges.length === 0 && <p>Belum ada badge aktif.</p>}
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
