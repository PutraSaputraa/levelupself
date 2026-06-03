import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  increment,
} from 'firebase/firestore'
import { emptyProfile } from '../data/appData'
import { initialMissions } from '../data/missions'
import { auth, db } from './firebase'

function getFriendCode(userId) {
  return `LUS-${userId.slice(0, 8).toUpperCase()}`
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

export async function registerWithFirebase({ email, name, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })

  const user = {
    id: credential.user.uid,
    name,
    email,
    total_xp: 0,
    category_xp: {},
    category_completed: {},
    category_skipped: {},
    completed_count: 0,
    skipped_count: 0,
    level: 1,
    streak: 0,
    best_streak: 0,
    is_admin: email.includes('admin'),
    friend_code: getFriendCode(credential.user.uid),
    friend_ids: [],
    earned_achievement_ids: [],
    created_at: new Date().toISOString(),
  }

  await setDoc(doc(db, 'users', credential.user.uid), user)
  await setDoc(doc(db, 'user_profiles', credential.user.uid), emptyProfile)

  return user
}

export async function loginWithFirebase({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logoutFromFirebase() {
  return signOut(auth)
}

export async function ensureUserDocument(firebaseUser) {
  const userRef = doc(db, 'users', firebaseUser.uid)
  const profileRef = doc(db, 'user_profiles', firebaseUser.uid)
  const [userSnapshot, profileSnapshot] = await Promise.all([getDoc(userRef), getDoc(profileRef)])
  const user = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player',
    email: firebaseUser.email,
    total_xp: 0,
    category_xp: {},
    category_completed: {},
    category_skipped: {},
    completed_count: 0,
    skipped_count: 0,
    level: 1,
    streak: 0,
    best_streak: 0,
    is_admin: firebaseUser.email?.includes('admin') ?? false,
    friend_code: getFriendCode(firebaseUser.uid),
    friend_ids: [],
    earned_achievement_ids: [],
    created_at: new Date().toISOString(),
  }

  if (!userSnapshot.exists()) await setDoc(userRef, user)
  if (userSnapshot.exists()) {
    const current = userSnapshot.data()
    await setDoc(
      userRef,
      {
        friend_code: current.friend_code ?? getFriendCode(firebaseUser.uid),
        friend_ids: current.friend_ids ?? [],
        best_streak: current.best_streak ?? current.streak ?? 0,
        category_xp: current.category_xp ?? {},
        category_completed: current.category_completed ?? {},
        category_skipped: current.category_skipped ?? {},
        completed_count: current.completed_count ?? 0,
        skipped_count: current.skipped_count ?? 0,
        earned_achievement_ids: current.earned_achievement_ids ?? [],
      },
      { merge: true },
    )
  }
  if (!profileSnapshot.exists()) await setDoc(profileRef, emptyProfile)
}

export function subscribeUser(userId, callback) {
  return onSnapshot(doc(db, 'users', userId), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null)
  })
}

export function subscribeProfile(userId, callback) {
  return onSnapshot(doc(db, 'user_profiles', userId), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null)
  })
}

export function subscribeUsers(callback) {
  return onSnapshot(collection(db, 'users'), (snapshot) => {
    callback(snapshot.docs.map((userDoc) => userDoc.data()))
  })
}

export function subscribeMissions(callback) {
  return onSnapshot(collection(db, 'missions'), (snapshot) => {
    const missions = snapshot.docs.map((missionDoc) => ({
      id: missionDoc.id,
      ...missionDoc.data(),
    }))
    callback(missions.length > 0 ? missions : initialMissions)
  })
}

export function subscribeDailyMissions(userId, date, callback) {
  const dailyQuery = query(
    collection(db, 'daily_missions'),
    where('user_id', '==', userId),
    where('date', '==', date),
  )

  return onSnapshot(dailyQuery, (snapshot) => {
    callback(snapshot.docs.map((dailyDoc) => ({ ...dailyDoc.data(), id: dailyDoc.id })))
  })
}

export function subscribeMissionLogs(userId, callback) {
  const logsQuery = query(
    collection(db, 'mission_logs'),
    where('user_id', '==', userId),
    limit(100),
  )

  return onSnapshot(logsQuery, (snapshot) => {
    const logs = snapshot.docs
      .map((logDoc) => ({ id: logDoc.id, ...logDoc.data() }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    callback(logs)
  })
}

export function subscribeFriendRequests(userId, callback) {
  const incomingQuery = query(collection(db, 'friend_requests'), where('to_user_id', '==', userId))
  const outgoingQuery = query(collection(db, 'friend_requests'), where('from_user_id', '==', userId))
  const requests = new Map()

  function emit() {
    callback(
      Array.from(requests.values()).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      ),
    )
  }

  const unsubscribeIncoming = onSnapshot(incomingQuery, (snapshot) => {
    snapshot.docs.forEach((requestDoc) => {
      requests.set(requestDoc.id, { id: requestDoc.id, ...requestDoc.data() })
    })
    emit()
  })

  const unsubscribeOutgoing = onSnapshot(outgoingQuery, (snapshot) => {
    snapshot.docs.forEach((requestDoc) => {
      requests.set(requestDoc.id, { id: requestDoc.id, ...requestDoc.data() })
    })
    emit()
  })

  return () => {
    unsubscribeIncoming()
    unsubscribeOutgoing()
  }
}

export async function saveProfile(userId, profile) {
  return setDoc(doc(db, 'user_profiles', userId), profile, { merge: true })
}

export async function updateUser(userId, patch) {
  return updateDoc(doc(db, 'users', userId), patch)
}

export function incrementBy(amount) {
  return increment(amount)
}

export async function sendFriendRequest({ fromUser, toUser }) {
  const existing = await getDocs(
    query(
      collection(db, 'friend_requests'),
      where('from_user_id', '==', fromUser.id),
      where('to_user_id', '==', toUser.id),
      limit(1),
    ),
  )
  if (!existing.empty) return

  const reverseExisting = await getDocs(
    query(
      collection(db, 'friend_requests'),
      where('from_user_id', '==', toUser.id),
      where('to_user_id', '==', fromUser.id),
      limit(1),
    ),
  )
  if (!reverseExisting.empty) return

  return addDoc(collection(db, 'friend_requests'), {
    from_user_id: fromUser.id,
    from_name: fromUser.name,
    from_friend_code: fromUser.friend_code,
    to_user_id: toUser.id,
    to_name: toUser.name,
    to_friend_code: toUser.friend_code,
    status: 'pending',
    created_at: new Date().toISOString(),
    responded_at: null,
  })
}

export async function respondToFriendRequest(requestId, status) {
  return updateDoc(doc(db, 'friend_requests', requestId), {
    status,
    responded_at: new Date().toISOString(),
  })
}

export async function createDailyMissions(userId, missions) {
  const existing = await getDocs(
    query(
      collection(db, 'daily_missions'),
      where('user_id', '==', userId),
      where('date', '==', missions[0]?.date ?? ''),
      limit(1),
    ),
  )
  if (!existing.empty) return

  await Promise.all(
    missions.map((mission) => addDoc(collection(db, 'daily_missions'), toDailyMissionDoc(userId, mission))),
  )
}

function toDailyMissionDoc(userId, mission) {
  return {
    user_id: userId,
    mission_id: mission.mission_id,
    date: mission.date,
    status: mission.status,
    slot: mission.slot,
    recommended_score: mission.recommended_score,
    reasons: mission.reasons,
    created_at: mission.created_at,
  }
}

export async function updateDailyMission(dailyMissionId, patch) {
  return updateDoc(doc(db, 'daily_missions', dailyMissionId), patch)
}

export async function addMissionLog(log) {
  return addDoc(collection(db, 'mission_logs'), log)
}

export async function addRecommendationFeedback(entry) {
  return addDoc(collection(db, 'recommendation_feedback'), entry)
}

export async function syncMissionChanges(previousMissions, nextMissions) {
  const previousIds = new Set(previousMissions.map((mission) => mission.id))
  const nextIds = new Set(nextMissions.map((mission) => mission.id))
  const added = nextMissions.filter((mission) => !previousIds.has(mission.id))
  const removed = previousMissions.filter((mission) => !nextIds.has(mission.id))
  const shared = nextMissions.filter((mission) => previousIds.has(mission.id))

  await Promise.all([
    ...added.map((mission) => setDoc(doc(db, 'missions', mission.id), mission)),
    ...shared.map((mission) => setDoc(doc(db, 'missions', mission.id), mission, { merge: true })),
    ...removed.map((mission) => deleteDoc(doc(db, 'missions', mission.id))),
  ])
}

export async function seedInitialMissionsIfEmpty() {
  const existing = await getDocs(query(collection(db, 'missions'), limit(1)))
  if (!existing.empty) return

  await Promise.all(
    initialMissions.map((mission) => setDoc(doc(db, 'missions', mission.id), mission)),
  )
}
