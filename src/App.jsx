import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AppShell } from './components/AppShell'
import { FeedbackModal } from './components/FeedbackModal'
import { LevelUpModal } from './components/LevelUpModal'
import { MissionActionModal } from './components/MissionActionModal'
import { emptyProfile } from './data/appData'
import { initialMissions } from './data/missions'
import { evaluateAchievements, flattenEarnedAchievements } from './lib/achievements'
import { todayKey } from './lib/date'
import {
  addMissionLog,
  addRecommendationFeedback,
  createDailyMissions,
  ensureUserDocument,
  incrementBy,
  loginWithFirebase,
  logoutFromFirebase,
  registerWithFirebase,
  saveProfile,
  seedInitialMissionsIfEmpty,
  respondToFriendRequest,
  sendFriendRequest,
  subscribeAuth,
  subscribeDailyMissions,
  subscribeFriendRequests,
  subscribeMissionLogs,
  subscribeMissions,
  subscribeProfile,
  subscribeUser,
  subscribeUsers,
  syncMissionChanges,
  updateDailyMission,
  updateUser,
} from './lib/firebaseStore'
import { getXpCategory } from './lib/categoryXp'
import { getFirebaseErrorMessage } from './lib/firebaseErrors'
import { getTierFromXp, getTierProgress } from './lib/leveling'
import { recommendDailyMissions } from './lib/recommendations'
import { Achievements } from './pages/Achievements'
import { Admin } from './pages/Admin'
import { Dashboard } from './pages/Dashboard'
import { Event } from './pages/Event'
import { Friends } from './pages/Friends'
import { Landing } from './pages/Landing'
import { Leaderboard } from './pages/Leaderboard'
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
  const [friendRequests, setFriendRequests] = useState([])
  const [logs, setLogs] = useState([])
  const [authMode, setAuthMode] = useState('login')
  const [activePage, setActivePage] = useState('dashboard')
  const [activeEventCategory, setActiveEventCategory] = useState(null)
  const [tierUp, setTierUp] = useState(null)
  const [feedbackMission, setFeedbackMission] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)

  const progress = getTierProgress(user?.total_xp ?? 0)
  const visiblePage = activePage === 'admin' && user && !user.is_admin ? 'dashboard' : activePage
  const friendIds = useMemo(() => {
    if (!user) return []
    const legacyIds = user.friend_ids ?? []
    const acceptedIds = friendRequests
      .filter((request) => request.status === 'accepted')
      .map((request) =>
        request.from_user_id === user.id ? request.to_user_id : request.from_user_id,
      )

    return Array.from(new Set([...legacyIds, ...acceptedIds]))
  }, [friendRequests, user])
  const achievementGroups = useMemo(
    () => (user ? evaluateAchievements({ logs, profile, user }) : []),
    [logs, profile, user],
  )
  const earnedAchievements = useMemo(
    () => flattenEarnedAchievements(achievementGroups),
    [achievementGroups],
  )
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
        setFriendRequests([])
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
      subscribeFriendRequests(authUser.uid, setFriendRequests),
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
    if (!user) return
    const computedTier = getTierFromXp(user.total_xp)
    if (user.level === computedTier) return

    updateUser(user.id, { level: computedTier }).catch((error) => {
      console.warn('Tier sync skipped:', error.message)
    })
  }, [user])

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

  function requestMissionAction(action, dailyMission, source = 'daily', missionOverride = null) {
    const mission = missionOverride ?? missionMap[dailyMission.mission_id]
    setPendingAction({ action, dailyMission, mission, source })
  }

  async function completeMission(dailyMission) {
    const mission = missionMap[dailyMission.mission_id]
    const nextXp = user.total_xp + mission.xp_reward
    const nextTier = getTierFromXp(nextXp)
    const nextStreak = user.last_completed_date === todayKey() ? user.streak : user.streak + 1
    const completedAt = new Date().toISOString()
    const xpCategory = getXpCategory(mission)

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
      xp_reward: mission.xp_reward,
      xp_category: xpCategory,
      recommended_score: dailyMission.recommended_score,
      time_completed: completedAt,
      created_at: completedAt,
    })
    await updateUser(user.id, {
      total_xp: nextXp,
      level: nextTier,
      [`category_xp.${xpCategory}`]: incrementBy(mission.xp_reward),
      [`category_completed.${xpCategory}`]: incrementBy(1),
      completed_count: incrementBy(1),
      streak: nextStreak,
      best_streak: Math.max(user.best_streak ?? 0, nextStreak),
      last_completed_date: todayKey(),
    })

    setFeedbackMission(mission)
    if (nextTier > user.level) setTierUp(nextTier)
  }

  async function skipMission(dailyMission, reason = '') {
    const mission = missionMap[dailyMission.mission_id]
    const createdAt = new Date().toISOString()
    const xpCategory = getXpCategory(mission)

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
      xp_reward: 0,
      xp_category: xpCategory,
      recommended_score: dailyMission.recommended_score,
      time_completed: null,
      created_at: createdAt,
    })
    await updateUser(user.id, {
      [`category_skipped.${xpCategory}`]: incrementBy(1),
      skipped_count: incrementBy(1),
    })
  }

  async function completeEventMission(eventMission) {
    const completedAt = new Date().toISOString()
    const nextXp = user.total_xp + eventMission.xp_reward
    const nextTier = getTierFromXp(nextXp)
    const xpCategory = getXpCategory(eventMission)

    await addMissionLog({
      user_id: user.id,
      mission_id: eventMission.id,
      title: eventMission.title,
      category: eventMission.category,
      source: 'event',
      event_category: eventMission.event_category,
      metric_type: eventMission.metric_type,
      metric_value: eventMission.metric_value,
      status: 'completed',
      completed: true,
      skipped: false,
      rating: null,
      feedback: '',
      duration_actual: eventMission.duration_minutes,
      xp_reward: eventMission.xp_reward,
      xp_category: xpCategory,
      recommended_score: 0,
      time_completed: completedAt,
      created_at: completedAt,
    })
    await updateUser(user.id, {
      total_xp: nextXp,
      level: nextTier,
      [`category_xp.${xpCategory}`]: incrementBy(eventMission.xp_reward),
      [`category_completed.${xpCategory}`]: incrementBy(1),
      completed_count: incrementBy(1),
    })

    if (nextTier > user.level) setTierUp(nextTier)
  }

  async function confirmMissionAction(reason) {
    if (!pendingAction) return
    setActionBusy(true)

    try {
      if (pendingAction.action === 'complete') {
        if (pendingAction.source === 'event') {
          await completeEventMission(pendingAction.mission)
        } else {
          await completeMission(pendingAction.dailyMission)
        }
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

  async function addFriend(friendId) {
    if (friendId === user.id) {
      alert('Kamu tidak bisa menambahkan diri sendiri.')
      return
    }

    if (friendIds.includes(friendId)) return
    const targetUser = users.find((candidate) => candidate.id === friendId)
    if (!targetUser) return

    try {
      await sendFriendRequest({ fromUser: user, toUser: targetUser })
    } catch (error) {
      alert(getFirebaseErrorMessage(error, 'Mengirim friend request'))
    }
  }

  async function respondFriendRequest(requestId, status) {
    try {
      await respondToFriendRequest(requestId, status)
    } catch (error) {
      alert(getFirebaseErrorMessage(error, 'Merespons friend request'))
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
          badges={earnedAchievements}
          dailyMissions={todayMissions}
          missionMap={missionMap}
          onComplete={(dailyMission) => requestMissionAction('complete', dailyMission)}
          onNavigate={setActivePage}
          onSelectEventCategory={(categoryId) => {
            setActiveEventCategory(categoryId)
            setActivePage('event')
          }}
          onSkip={(dailyMission) => requestMissionAction('skip', dailyMission)}
          progress={progress}
          user={user}
          userLogs={logs}
        />
      )}
      {visiblePage === 'progress' && <Progress user={user} userLogs={logs} />}
      {visiblePage === 'leaderboard' && (
        <Leaderboard
          currentUserId={user.id}
          friendIds={friendIds}
          logs={logs}
          users={users}
        />
      )}
      {visiblePage === 'friends' && (
        <Friends
          friendIds={friendIds}
          friendRequests={friendRequests}
          onAddFriend={addFriend}
          onRespondRequest={respondFriendRequest}
          user={user}
          users={users}
        />
      )}
      {visiblePage === 'event' && (
        <Event
          initialCategoryId={activeEventCategory}
          eventLogs={logs.filter((log) => log.source === 'event' && log.status === 'completed')}
          onComplete={(eventMission) =>
            requestMissionAction('complete', { mission_id: eventMission.id }, 'event', eventMission)
          }
        />
      )}
      {visiblePage === 'achievements' && (
        <Achievements achievementGroups={achievementGroups} earnedCount={earnedAchievements.length} />
      )}
      {visiblePage === 'profile' && (
        <Profile
          onSave={(nextProfile) => saveProfile(user.id, nextProfile)}
          profile={profile}
          user={user}
          userLogs={logs}
        />
      )}
      {visiblePage === 'admin' && (
        <Admin missions={missions} onChange={handleMissionChange} user={user} />
      )}

      {tierUp && <LevelUpModal tier={tierUp} onClose={() => setTierUp(null)} />}
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
          mission={pendingAction.mission}
          onCancel={() => setPendingAction(null)}
          onConfirm={confirmMissionAction}
          pending={actionBusy}
        />
      )}
    </AppShell>
  )
}

export default App
