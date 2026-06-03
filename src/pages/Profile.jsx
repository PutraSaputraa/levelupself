import { useState } from 'react'
import { ChoiceGroup } from '../components/ChoiceGroup'
import { surveyOptions } from '../data/appData'

export function Profile({ onSave, profile, user }) {
  const [draft, setDraft] = useState(profile)

  return (
    <div className="page-stack">
      <header className="topbar">
        <div>
          <span className="eyebrow">Player profile</span>
          <h1>{user.name}</h1>
        </div>
      </header>
      <section className="survey-grid compact">
        <ChoiceGroup
          field="main_goal"
          items={surveyOptions.main_goal}
          onChange={setDraft}
          title="Tujuan utama"
          value={draft.main_goal}
        />
        <ChoiceGroup
          field="available_time"
          items={surveyOptions.available_time}
          onChange={setDraft}
          title="Waktu luang"
          value={draft.available_time}
        />
        <ChoiceGroup
          field="active_time"
          items={surveyOptions.active_time}
          onChange={setDraft}
          title="Waktu aktif"
          value={draft.active_time}
        />
        <ChoiceGroup
          field="starting_difficulty"
          items={surveyOptions.starting_difficulty}
          onChange={setDraft}
          title="Tingkat misi"
          value={draft.starting_difficulty}
        />
      </section>
      <button className="primary save-profile" onClick={() => onSave(draft)} type="button">
        Simpan profile
      </button>
    </div>
  )
}
