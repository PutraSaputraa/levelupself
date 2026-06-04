import { useState } from 'react'
import { ChoiceGroup, MultiChoice } from '../components/ChoiceGroup'
import { surveyOptions } from '../data/appData'

export function Onboarding({ initialProfile, onSave }) {
  const [profile, setProfile] = useState(initialProfile)

  function toggleList(field, value) {
    setProfile((current) => {
      const list = current[field] ?? []
      return {
        ...current,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      }
    })
  }

  return (
    <main className="onboarding">
      <section className="panel intro-panel">
        <span className="eyebrow">Onboarding survey</span>
        <h1>Personalisasi misi pertamamu</h1>
        <p>
          Jawaban ini dipakai untuk scoring rekomendasi. Tidak ada machine learning dulu,
          tapi datanya sudah siap untuk dikembangkan nanti.
        </p>
      </section>
      <section className="survey-grid">
        <ChoiceGroup
          field="main_goal"
          items={surveyOptions.main_goal}
          onChange={setProfile}
          title="Tujuan utama"
          value={profile.main_goal}
        />
        <ChoiceGroup
          field="available_time"
          items={surveyOptions.available_time}
          onChange={setProfile}
          title="Waktu luang per hari"
          value={profile.available_time}
        />
        <ChoiceGroup
          field="activity_level"
          items={surveyOptions.activity_level}
          onChange={setProfile}
          title="Tier aktivitas"
          value={profile.activity_level}
        />
        <MultiChoice
          items={surveyOptions.activities}
          onToggle={(value) => toggleList('preferred_activities', value)}
          selected={profile.preferred_activities}
          title="Aktivitas disukai"
        />
        <MultiChoice
          items={surveyOptions.disliked}
          onToggle={(value) => toggleList('disliked_activities', value)}
          selected={profile.disliked_activities}
          title="Aktivitas tidak disukai"
        />
        <ChoiceGroup
          field="active_time"
          items={surveyOptions.active_time}
          onChange={setProfile}
          title="Waktu paling cocok"
          value={profile.active_time}
        />
        <ChoiceGroup
          field="motivation_style"
          items={surveyOptions.motivation_style}
          onChange={setProfile}
          title="Gaya motivasi"
          value={profile.motivation_style}
        />
        <ChoiceGroup
          field="starting_difficulty"
          items={surveyOptions.starting_difficulty}
          onChange={setProfile}
          title="Tingkat awal"
          value={profile.starting_difficulty}
        />
      </section>
      <button className="primary onboarding-submit" onClick={() => onSave(profile)} type="button">
        Mulai misi hari ini
      </button>
    </main>
  )
}
