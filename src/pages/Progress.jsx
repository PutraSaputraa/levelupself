import { HistoryPanel } from '../components/HistoryPanel'
import { getCategoryLabel } from '../data/categories'
import { getXpCategory } from '../lib/categoryXp'

export function Progress({ user, userLogs }) {
  const byCategory = userLogs.reduce((acc, log) => {
    const category = getXpCategory(log)
    acc[category] ??= { completed: 0, skipped: 0 }
    acc[category][log.status] += 1
    return acc
  }, {})

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">History</span>
          <h1>Progress kamu</h1>
        </div>
      </header>
      <section className="dashboard-grid">
        <div className="panel">
          <h2>Ringkasan</h2>
          <div className="metric-row">
            <div>
              <span>Level</span>
              <strong>{user.level}</strong>
            </div>
            <div>
              <span>Total XP</span>
              <strong>{user.total_xp}</strong>
            </div>
            <div>
              <span>Log</span>
              <strong>{userLogs.length}</strong>
            </div>
          </div>
        </div>
        <div className="panel">
          <h2>Adaptasi kategori</h2>
          <div className="category-list">
            {Object.entries(byCategory).map(([category, stat]) => (
              <div key={category}>
                <span>{getCategoryLabel(category)}</span>
                <strong>
                  {stat.completed} done / {stat.skipped} skip
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <HistoryPanel logs={userLogs} />
    </div>
  )
}
