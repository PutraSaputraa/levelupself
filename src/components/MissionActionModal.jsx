import { useEffect, useRef, useState } from 'react'

const HOLD_MS = 1100

export function MissionActionModal({ action, mission, onCancel, onConfirm, pending }) {
  const [progress, setProgress] = useState(0)
  const [reason, setReason] = useState('')
  const frameRef = useRef(null)
  const startedAtRef = useRef(null)

  const isComplete = action === 'complete'
  const title = isComplete ? 'Tamatkan misi ini' : 'Lewati misi ini'
  const actionLabel = isComplete ? 'Tahan untuk selesai' : 'Tahan untuk skip'
  const doneLabel = isComplete ? 'Misi ditamatkan' : 'Misi dilewati'

  useEffect(() => {
    return () => cancelHold()
  }, [])

  function cancelHold() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    startedAtRef.current = null
    setProgress(0)
  }

  function tick() {
    const elapsed = performance.now() - startedAtRef.current
    const nextProgress = Math.min(100, Math.round((elapsed / HOLD_MS) * 100))
    setProgress(nextProgress)

    if (nextProgress >= 100) {
      frameRef.current = null
      onConfirm(reason)
      return
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  function startHold() {
    if (pending || frameRef.current) return
    startedAtRef.current = performance.now()
    frameRef.current = requestAnimationFrame(tick)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal action-modal">
        <span className="eyebrow">{isComplete ? 'Quest clear' : 'Quest skip'}</span>
        <h2>{title}</h2>
        <p>{mission.title}</p>

        <div className="action-summary">
          <div>
            <span>Reward</span>
            <strong>{isComplete ? `${mission.xp_reward} XP` : '0 XP'}</strong>
          </div>
          <div>
            <span>Durasi</span>
            <strong>{mission.duration_minutes} menit</strong>
          </div>
        </div>

        {!isComplete && (
          <label className="field skip-reason">
            <span>Alasan skip</span>
            <textarea
              onChange={(event) => setReason(event.target.value)}
              placeholder="Contoh: terlalu sulit, tidak sempat, kurang cocok"
              value={reason}
            />
          </label>
        )}

        <button
          className="hold-button"
          disabled={pending}
          onPointerCancel={cancelHold}
          onPointerDown={startHold}
          onPointerLeave={cancelHold}
          onPointerUp={cancelHold}
          style={{ '--hold-progress': `${progress}%` }}
          type="button"
        >
          <span>{progress >= 100 ? doneLabel : actionLabel}</span>
        </button>

        <div className="wide-actions">
          <button className="ghost" disabled={pending} onClick={onCancel} type="button">
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}
