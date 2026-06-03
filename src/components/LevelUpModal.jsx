export function LevelUpModal({ level, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal level-modal">
        <span className="eyebrow">Level up</span>
        <h1>Level {level}</h1>
        <p>Kamu naik level. Momentum kecil seperti ini yang bikin rutinitas bertahan.</p>
        <button className="primary full" onClick={onClose} type="button">
          Lanjut
        </button>
      </div>
    </div>
  )
}
