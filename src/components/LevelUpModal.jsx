import { TierBadge } from './TierBadge'

export function LevelUpModal({ tier, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal level-modal">
        <span className="eyebrow">Tier unlocked</span>
        <TierBadge tier={tier} size="large" />
        <h1>Tier {tier}</h1>
        <p>Kamu naik tier. Setelah Tier 7, petualangan lanjut sebagai perburuan poin tanpa batas.</p>
        <button className="primary full" onClick={onClose} type="button">
          Lanjut
        </button>
      </div>
    </div>
  )
}
