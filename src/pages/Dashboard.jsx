import { useState } from 'react'
import mapBackground from '../assets/Background.png'
import miniProfileFrame from '../assets/mini_profile.png'
import profileBackground from '../assets/Profile.png'
import { HistoryPanel } from '../components/HistoryPanel'
import { MissionCard } from '../components/MissionCard'
import { TierBadge } from '../components/TierBadge'
import { classNames } from '../lib/classNames'
import { todayKey } from '../lib/date'

const mapHotspots = [
  {
    id: 'strength',
    label: 'Fitness',
    title: 'Gunung Strength',
    className: 'mountain',
  },
  {
    id: 'intelect',
    label: 'Intelect',
    title: 'Library Rusak',
    className: 'library',
  },
  {
    id: 'mental',
    label: 'Mental',
    title: 'Pulau Melayang',
    className: 'island',
  },
  {
    id: 'stamina',
    label: 'Stamina',
    title: 'Jalan Kanan',
    className: 'road',
  },
]

export function Dashboard({
  badges,
  dailyMissions,
  missionMap,
  onComplete,
  onNavigate,
  onSelectEventCategory,
  onSkip,
  progress,
  user,
  userLogs,
}) {
  const [profileOpen, setProfileOpen] = useState(false)
  const completedToday = dailyMissions.filter((item) => item.status === 'completed').length

  return (
    <div className="map-page">
      <section className="world-map" style={{ backgroundImage: `url(${mapBackground})` }}>
        <div className="map-shade" />
        <div className="map-title">
          <span className="eyebrow">World map</span>
          <h1>LevelUp Self</h1>
        </div>
        <button className="mini-profile-button" onClick={() => setProfileOpen(true)} type="button">
          <img alt="" src={miniProfileFrame} />
          <div>
            <strong>{user.name}</strong>
            <span>Tier {user.level} - {user.total_xp} poin</span>
          </div>
        </button>

        {mapHotspots.map((hotspot) => (
          <button
            className={`map-hotspot ${hotspot.className}`}
            key={hotspot.id}
            onClick={() => onSelectEventCategory(hotspot.id)}
            type="button"
          >
            <span>{hotspot.label}</span>
            <small>{hotspot.title}</small>
          </button>
        ))}

        <button className="map-hotspot achievement" onClick={() => onNavigate('achievements')} type="button">
          <span>Achievement</span>
          <small>Bangunan kanan</small>
        </button>

        <div className="map-quest-card">
          <TierBadge tier={user.level} size="compact" />
          <div>
            <span>{progress.isMaxTier ? 'Tier maksimum' : `Menuju Tier ${progress.tier + 1}`}</span>
            <strong>
              {progress.isMaxTier
                ? `${progress.gained} poin setelah Tier 7`
                : `${progress.gained}/${progress.needed} XP`}
            </strong>
          </div>
          <div className="progress-track">
            <div style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      </section>

      {profileOpen && (
        <div className="modal-backdrop profile-map-backdrop">
          <section className="map-profile-panel" style={{ backgroundImage: `url(${profileBackground})` }}>
            <button className="profile-close" onClick={() => setProfileOpen(false)} type="button">
              Tutup
            </button>
            <div className="map-profile-left">
              <TierBadge tier={user.level} size="large" />
              <div className="map-profile-name">
                <span className="eyebrow">Adventurer</span>
                <h2>{user.name}</h2>
                <p>{user.friend_code}</p>
              </div>
            </div>
            <div className="map-profile-stats">
              <div>
                <span>Tier</span>
                <strong>{user.level}</strong>
              </div>
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
                <strong>{user.completed_count ?? completedToday}</strong>
              </div>
            </div>
          </section>
        </div>
      )}

      <div className="page-stack map-content">
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
    </div>
  )
}
