import { useState } from 'react'
import { Field } from '../components/Field'
import { selfCategories } from '../data/categories'

export function Admin({ missions, onChange, user }) {
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    category: 'strength',
    difficulty: 'very_light',
    duration_minutes: 5,
    xp_reward: 20,
  })

  if (!user.is_admin) {
    return <div className="panel">Halaman admin hanya aktif untuk akun admin atau akun demo.</div>
  }

  function addMission(event) {
    event.preventDefault()
    onChange((current) => [
      ...current,
      {
        ...draft,
        id: crypto.randomUUID(),
        duration_minutes: Number(draft.duration_minutes),
        xp_reward: Number(draft.xp_reward),
        energy_required: 'low',
        location: 'anywhere',
        equipment: 'none',
        target_goal: ['routine'],
      },
    ])
    setDraft({ ...draft, title: '', description: '' })
  }

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Mission management</h1>
        </div>
      </header>
      <section className="admin-layout">
        <form className="panel admin-form" onSubmit={addMission}>
          <Field
            label="Judul misi"
            name="title"
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            value={draft.title}
          />
          <label className="field">
            <span>Deskripsi</span>
            <textarea
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              required
              value={draft.description}
            />
          </label>
          <label className="field">
            <span>Kategori</span>
            <select
              name="category"
              onChange={(event) => setDraft({ ...draft, category: event.target.value })}
              required
              value={draft.category}
            >
              {selfCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Durasi menit"
            name="duration"
            onChange={(event) => setDraft({ ...draft, duration_minutes: event.target.value })}
            type="number"
            value={draft.duration_minutes}
          />
          <Field
            label="XP reward"
            name="xp"
            onChange={(event) => setDraft({ ...draft, xp_reward: event.target.value })}
            type="number"
            value={draft.xp_reward}
          />
          <button className="primary full" type="submit">
            Tambah misi
          </button>
        </form>
        <div className="panel mission-table">
          {missions.map((mission) => (
            <div className="admin-row" key={mission.id}>
              <div>
                <strong>{mission.title}</strong>
                <span>
                  {mission.category} - {mission.difficulty} - {mission.xp_reward} XP
                </span>
              </div>
              <button
                className="danger"
                onClick={() => onChange((current) => current.filter((item) => item.id !== mission.id))}
                type="button"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
