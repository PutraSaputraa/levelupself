import { Field } from '../components/Field'
import { classNames } from '../lib/classNames'

export function Landing({ authMode, onAuthMode, onDemo, onLogin, onRegister }) {
  return (
    <main className="landing">
      <section className="landing-copy">
        <span className="eyebrow">Rule-based personal growth</span>
        <h1>LevelUp Self</h1>
        <p>
          Dapatkan 3 misi harian yang disesuaikan dengan tujuan, energi, waktu luang,
          dan kebiasaanmu. Selesaikan misi, kumpulkan XP, naik level.
        </p>
        <div className="hero-stats">
          <div>
            <strong>+XP</strong>
            <span>Setiap misi selesai</span>
          </div>
          <div>
            <strong>3</strong>
            <span>Misi harian</span>
          </div>
          <div>
            <strong>AI-ready</strong>
            <span>Behavior logging</span>
          </div>
        </div>
        <p className="safety-note">
          Sesuaikan aktivitas dengan kondisi tubuhmu. Jika memiliki cedera atau kondisi
          kesehatan tertentu, pilih misi ringan atau konsultasikan dengan profesional.
        </p>
      </section>
      <section className="auth-card">
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
