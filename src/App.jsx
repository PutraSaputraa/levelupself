import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AppShell } from './components/AppShell'
import { FeedbackModal } from './components/FeedbackModal'
import { LevelUpModal } from './components/LevelUpModal'
import { MissionActionModal } from './components/MissionActionModal'
import { emptyProfile, badgeRules } from './data/appData'
import { initialMissions } from './data/missions'
import { todayKey } from './lib/date'
import {
  addMissionLog,
  addRecommendationFeedback,
  createDailyMissions,
  ensureUserDocument,
  loginWithFirebase,
  logoutFromFirebase,
  registerWithFirebase,
  saveProfile,
  seedInitialMissionsIfEmpty,
  subscribeAuth,
  subscribeDailyMissions,
  subscribeMissionLogs,
  subscribeMissions,
  subscribeProfile,
  subscribeUser,
  subscribeUsers,
  syncMissionChanges,
  updateDailyMission,
  updateUser,
} from './lib/firebaseStore'
import { getFirebaseErrorMessage } from './lib/firebaseErrors'
import { getLeaderboard } from './lib/leaderboard'
import { getLevelFromXp, getLevelProgress } from './lib/leveling'
import { recommendDailyMissions } from './lib/recommendations'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { Landing } from './pages/Landing'
import { Leaderboard } from './pages/Leaderboard'
import { MissionDetail } from './pages/MissionDetail'
import { Onboarding } from './pages/Onboarding'
import { Profile } from './pages/Profile'
import { Progress } from './pages/Progress'

function App() {
  const [authUser, setAuthUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [profile, setProfile] = useState(null)
  const [missions, setMissions] = useState(initialMissions)
  const [todayMissions, setTodayMissions] = useState([])
  const [logs, setLogs] = useState([])
  const [authMode, setAuthMode] = useState('login')
  const [activePage, setActivePage] = useState('dashboard')
  const [selectedMission, setSelectedMission] = useState(null)
  const [levelUp, setLevelUp] = useState(null)
  const [feedbackMission, setFeedbackMission] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)

  const progress = getLevelProgress(user?.total_xp ?? 0)
  const leaderboard = getLeaderboard(users, logs)
  const visiblePage = activePage === 'admin' && user && !user.is_admin ? 'dashboard' : activePage
  const missionMap = useMemo(
    () => Object.fromEntries(missions.map((mission) => [mission.id, mission])),
    [missions],
  )

  useEffect(() => {
    return subscribeAuth(async (firebaseUser) => {
      setAuthUser(firebaseUser)
      setAuthReady(true)
      if (!firebaseUser) {
        setUser(null)
        setProfile(null)
        setTodayMissions([])
        setLogs([])
      }
      if (firebaseUser) await ensureUserDocument(firebaseUser)
    })
  }, [])

  useEffect(() => {
    if (!authUser) return undefined

    const unsubscribers = [
      subscribeUser(authUser.uid, setUser),
      subscribeProfile(authUser.uid, setProfile),
      subscribeDailyMissions(authUser.uid, todayKey(), setTodayMissions),
      subscribeMissionLogs(authUser.uid, setLogs),
    ]

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
  }, [authUser])

  useEffect(() => subscribeUsers(setUsers), [])
  useEffect(() => subscribeMissions(setMissions), [])

  useEffect(() => {
    if (!user?.is_admin) return
    seedInitialMissionsIfEmpty().catch((error) => {
      console.warn('Mission seed skipped:', error.message)
    })
  }, [user?.is_admin])

  useEffect(() => {
    if (!authUser || !profile?.onboarding_completed || todayMissions.length > 0) return

    const recommended = recommendDailyMissions({
      missions,
      profile,
      logs,
      date: todayKey(),
    })

    createDailyMissions(authUser.uid, recommended).catch((error) => {
      alert(getFirebaseErrorMessage(error, 'Membuat misi harian'))
    })
  }, [authUser, logs, missions, profile, todayMissions.length])

  async function register(form) {
    const data = new FormData(form)
    const email = data.get('email').trim().toLowerCase()
    const name = data.get('name').trim() || 'Player'
    const password = data.get('password')

    try {
      await registerWithFirebase({ email, name, password })
    } catch (error) {
      alert(getFirebaseErrorMessage(error, 'Register'))
    }
  }

  async function login(form) {
    const data = new FormData(form)
    const email = data.get('email').trim().toLowerCase()
    const password = data.get('password')

    try {
      await loginWithFirebase({ email, password })
    } catch (error) {
      alert(getFirebaseErrorMessage(error, 'Login'))
    }
  }

  async function useDemo() {
    try {
      await loginWithFirebase({ email: 'demo@levelupself.app', password: 'demo123' })
    } catch {
      const demo = await registerWithFirebase({
        email: 'demo@levelupself.app',
        name: 'Demo Player',
        password: 'demo123',
      })
      await updateUser(demo.id, { total_xp: 80, streak: 1, is_admin: true })
    }
  }

  async function saveOnboarding(nextProfile) {
    await saveProfile(authUser.uid, { ...nextProfile, onboarding_completed: true })
  }

  function requestMissionAction(action, dailyMission) {
    setPendingAction({ action, dailyMission })
  }

  async function completeMission(dailyMission) {
    const mission = missionMap[dailyMission.mission_id]
    const nextXp = user.total_xp + mission.xp_reward
    const nextLevel = getLevelFromXp(nextXp)
    const nextStreak = user.last_completed_date === todayKey() ? user.streak : user.streak + 1
    const completedAt = new Date().toISOString()

    await updateDailyMission(dailyMission.id, {
      status: 'completed',
      completed_at: completedAt,
    })
    await addMissionLog({
      user_id: user.id,
      mission_id: mission.id,
      title: mission.title,
      category: mission.category,
      status: 'completed',
      completed: true,
      skipped: false,
      rating: null,
      feedback: '',
      duration_actual: mission.duration_minutes,
      recommended_score: dailyMission.recommended_score,
      time_completed: completedAt,
      created_at: completedAt,
    })
    await updateUser(user.id, {
      total_xp: nextXp,
      level: nextLevel,
      streak: nextStreak,
      last_completed_date: todayKey(),
    })

    setFeedbackMission(mission)
    if (nextLevel > user.level) setLevelUp(nextLevel)
  }

  async function skipMission(dailyMission, reason = '') {
    const mission = missionMap[dailyMission.mission_id]
    const createdAt = new Date().toISOString()

    await updateDailyMission(dailyMission.id, { status: 'skipped' })
    await addMissionLog({
      user_id: user.id,
      mission_id: mission.id,
      title: mission.title,
      category: mission.category,
      status: 'skipped',
      completed: false,
      skipped: true,
      rating: null,
      feedback: reason,
      duration_actual: 0,
      recommended_score: dailyMission.recommended_score,
      time_completed: null,
      created_at: createdAt,
    })
  }

  async function confirmMissionAction(reason) {
    if (!pendingAction) return
    setActionBusy(true)

    try {
      if (pendingAction.action === 'complete') {
        await completeMission(pendingAction.dailyMission)
      } else {
        await skipMission(pendingAction.dailyMission, reason)
      }
      setPendingAction(null)
    } catch (error) {
      alert(getFirebaseErrorMessage(error, 'Memproses misi'))
    } finally {
      setActionBusy(false)
    }
  }

  function earnedBadges() {
    const completed = logs.filter((log) => log.status === 'completed').length
    return badgeRules.filter((badge) => {
      if (badge.id === 'first-step') return completed >= 1
      if (badge.id === 'streak-3') return user?.streak >= 3
      if (badge.id === 'level-3') return user?.level >= 3
      return false
    })
  }

  async function handleMissionChange(updater) {
    const nextMissions = typeof updater === 'function' ? updater(missions) : updater
    setMissions(nextMissions)
    try {
      await syncMissionChanges(missions, nextMissions)
    } catch (error) {
      alert(getFirebaseErrorMessage(error, 'Menyimpan misi'))
      setMissions(missions)
    }
  }

  if (!authReady) {
    return <main className="loading-screen">Menghubungkan ke Firebase...</main>
  }

  if (!authUser) {
    return (
      <Landing
        authMode={authMode}
        onAuthMode={setAuthMode}
        onDemo={useDemo}
        onLogin={login}
        onRegister={register}
      />
    )
  }

  if (!user || !profile) {
    return <main className="loading-screen">Memuat data user...</main>
  }

  if (!profile.onboarding_completed) {
    return <Onboarding initialProfile={profile ?? emptyProfile} onSave={saveOnboarding} />
  }

  return (
    <AppShell
      activePage={visiblePage}
      isAdmin={user.is_admin}
      onLogout={logoutFromFirebase}
      onNavigate={setActivePage}
    >
      {visiblePage === 'dashboard' && (
        <Dashboard
          badges={earnedBadges()}
          dailyMissions={todayMissions}
          missionMap={missionMap}
          onComplete={(dailyMission) => requestMissionAction('complete', dailyMission)}
          onSelect={(mission) => {
            setSelectedMission(mission)
            setActivePage('missions')
          }}
          onSkip={(dailyMission) => requestMissionAction('skip', dailyMission)}
          progress={progress}
          user={user}
          userLogs={logs}
        />
      )}
      {visiblePage === 'missions' && (
        <MissionDetail
          dailyMissions={todayMissions}
          missionMap={missionMap}
          onComplete={(dailyMission) => requestMissionAction('complete', dailyMission)}
          onSelect={setSelectedMission}
          onSkip={(dailyMission) => requestMissionAction('skip', dailyMission)}
          selectedMission={selectedMission}
        />
      )}
      {visiblePage === 'progress' && <Progress user={user} userLogs={logs} />}
      {visiblePage === 'leaderboard' && (
        <Leaderboard currentUserId={user.id} leaderboard={leaderboard} />
      )}
      {visiblePage === 'profile' && (
        <Profile
          onSave={(nextProfile) => saveProfile(user.id, nextProfile)}
          profile={profile}
          user={user}
        />
      )}
      {visiblePage === 'admin' && (
        <Admin missions={missions} onChange={handleMissionChange} user={user} />
      )}

      {levelUp && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      {feedbackMission && (
        <FeedbackModal
          mission={feedbackMission}
          onClose={() => setFeedbackMission(null)}
          onSave={async (entry) => {
            await addRecommendationFeedback({
              ...entry,
              user_id: user.id,
              created_at: new Date().toISOString(),
            })
            setFeedbackMission(null)
          }}
        />
      )}
      {pendingAction && (
        <MissionActionModal
          action={pendingAction.action}
          mission={missionMap[pendingAction.dailyMission.mission_id]}
          onCancel={() => setPendingAction(null)}
          onConfirm={confirmMissionAction}
          pending={actionBusy}
        />
      )}
    </AppShell>
  )
}

export default App
