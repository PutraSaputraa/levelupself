import { classNames } from '../lib/classNames'

const navItems = [
  ['dashboard', 'Dashboard'],
  ['missions', 'Mission Detail'],
  ['progress', 'Progress'],
  ['leaderboard', 'Leaderboard'],
  ['profile', 'Profile'],
]

export function AppShell({ activePage, children, isAdmin, onLogout, onNavigate }) {
  const visibleNavItems = isAdmin ? [...navItems, ['admin', 'Admin']] : navItems

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">LU</span>
          <div>
            <strong>LevelUp Self</strong>
            <small>Personal growth RPG</small>
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
