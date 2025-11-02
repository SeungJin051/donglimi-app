// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Firebase 초기화를 안전하게 처리
let app
let db

try {
  // 이미 초기화된 앱이 있는지 확인
  if (getApps().length === 0) {
    // 필수 환경 변수 검증
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn(
        'Firebase configuration is missing required fields. Some features may not work.'
      )
    } else {
      app = initializeApp(firebaseConfig)
      db = getFirestore(app)
    }
  } else {
    app = getApps()[0]
    db = getFirestore(app)
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  // 앱이 크래시되지 않도록 에러만 로깅
}

// Firestore 인스턴스를 안전하게 내보냅니다.
// 앱의 다른 파일에서 이 'db'를 import하여 사용하게 됩니다.
// db가 undefined일 수 있으므로 사용 시 null 체크가 필요합니다.
export { db }

// Firebase 초기화 상태 확인 함수
export function isFirebaseInitialized() {
  return db !== undefined && db !== null
}
