import { Field } from '../components/Field'
import { TierBadge } from '../components/TierBadge'
import { getTierIcon } from '../data/tiers'
import { classNames } from '../lib/classNames'

export function Landing({ authMode, onAuthMode, onDemo, onLogin, onRegister }) {
  return (
    <main className="landing">
      <section className="landing-copy">
        <span className="eyebrow">Personal growth RPG</span>
        <h1>LevelUp Self</h1>
        <p>
          Dapatkan 3 quest harian yang disesuaikan dengan tujuan, energi, waktu luang,
          dan kebiasaanmu. Selesaikan quest, kumpulkan poin, dan naik sampai Tier 7.
        </p>
        <div className="tier-showcase" aria-label="Tier journey">
          {[1, 2, 3, 4, 5, 6, 7].map((tier) => (
            <img alt={`Tier ${tier}`} key={tier} src={getTierIcon(tier)} />
          ))}
        </div>
        <div className="hero-stats">
          <div>
            <strong>+Poin</strong>
            <span>Setiap quest selesai</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Tier RPG</span>
          </div>
          <div>
            <strong>Endless</strong>
            <span>Poin setelah Tier 7</span>
          </div>
        </div>
        <p className="safety-note">
          Sesuaikan aktivitas dengan kondisi tubuhmu. Jika memiliki cedera atau kondisi
          kesehatan tertentu, pilih misi ringan atau konsultasikan dengan profesional.
        </p>
      </section>
      <section className="auth-card">
        <TierBadge tier={7} size="large" />
        <div className="segmented">
          <button
            className={classNames(authMode === 'login' && 'active')}
            onClick={() => onAuthMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={classNames(authMode === 'register' && 'active')}
            onClick={() => onAuthMode('register')}
            type="button"
          >
            Register
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            authMode === 'login' ? onLogin(event.currentTarget) : onRegister(event.currentTarget)
          }}
        >
          {authMode === 'register' && (
            <Field label="Nama" name="name" placeholder="Nama kamu" />
          )}
          <Field label="Email" name="email" placeholder="nama@email.com" type="email" />
          <Field label="Password" name="password" placeholder="Minimal 6 karakter" type="password" />
          <button className="primary full" type="submit">
            {authMode === 'login' ? 'Masuk' : 'Buat akun'}
          </button>
          <button className="ghost full" onClick={onDemo} type="button">
            Coba akun demo
          </button>
        </form>
      </section>
    </main>
  )
}
