import tier7Icon from '../assets/tier7_icon.png'
import { classNames } from '../lib/classNames'

const navItems = [
  ['dashboard', 'Dashboard'],
  ['progress', 'Progress'],
  ['leaderboard', 'Leaderboard'],
  ['friends', 'Friends'],
  ['event', 'Event'],
  ['achievements', 'Achievement'],
  ['profile', 'Profile'],
]

export function AppShell({ activePage, children, isAdmin, onLogout, onNavigate }) {
  const visibleNavItems = isAdmin ? [...navItems, ['admin', 'Admin']] : navItems
  const isMapMode = activePage === 'dashboard'

  return (
    <main className={classNames('app-shell', isMapMode && 'map-shell')}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <img alt="" src={tier7Icon} />
          </span>
          <div>
            <strong>LevelUp Self</strong>
            <small>Tier quest RPG</small>
          </div>
        </div>
        <nav>
          {visibleNavItems.map(([page, label]) => (
            <button
              className={classNames(activePage === page && 'active')}
              key={page}
              onClick={() => onNavigate(page)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
        <button className="ghost full" onClick={onLogout} type="button">
          Logout
        </button>
      </aside>

      <section className="content">{children}</section>
    </main>
  )
}
