import { useState } from 'react'

const feedbackItems = [
  ['liked', 'Misi ini cocok'],
  ['too_easy', 'Terlalu mudah'],
  ['too_hard', 'Terlalu sulit'],
  ['boring', 'Membosankan'],
  ['want_more_like_this', 'Mau misi seperti ini lagi'],
]

export function FeedbackModal({ mission, onClose, onSave }) {
  const [entry, setEntry] = useState({
    mission_id: mission.id,
    liked: true,
    too_easy: false,
    too_hard: false,
    boring: false,
    want_more_like_this: true,
  })

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Feedback misi</h2>
        <p>{mission.title}</p>
        {feedbackItems.map(([key, label]) => (
          <label className="check-row" key={key}>
            <input
              checked={entry[key]}
              onChange={(event) => setEntry({ ...entry, [key]: event.target.checked })}
              type="checkbox"
            />
            <span>{label}</span>
          </label>
        ))}
        <div className="wide-actions">
          <button className="ghost" onClick={onClose} type="button">
            Nanti
          </button>
          <button className="primary" onClick={() => onSave(entry)} type="button">
            Simpan feedback
          </button>
        </div>
      </div>
    </div>
  )
}
