import { getCategoryLabel } from '../data/categories'
import { classNames } from '../lib/classNames'
import { getXpCategory } from '../lib/categoryXp'

export function HistoryPanel({ logs }) {
  return (
    <section className="panel">
      <div className="section-head">
        <h2>Riwayat misi terakhir</h2>
      </div>
      <div className="history-list">
        {logs.length === 0 && (
          <p>Belum ada riwayat. Selesaikan satu misi untuk mulai mengumpulkan data.</p>
        )}
        {logs.map((log) => (
          <div className="history-row" key={log.id}>
            <div>
              <strong>{log.title}</strong>
              <span>
                {getCategoryLabel(getXpCategory(log))} - {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
            <span className={classNames('status-chip', log.status)}>{log.status}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
