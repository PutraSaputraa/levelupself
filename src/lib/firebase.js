import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAVcub5SYfhtYZ5wB11u7zQH7OU6pJUmas',
  authDomain: 'levelupself-4c412.firebaseapp.com',
  projectId: 'levelupself-4c412',
  storageBucket: 'levelupself-4c412.firebasestorage.app',
  messagingSenderId: '304471444315',
  appId: '1:304471444315:web:44cbf147c418606461687e',
  measurementId: 'G-3QKFJRS0H5',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null,
)

export { app, auth, db, analyticsPromise }
