// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDsQaTirMD8xXUG8_ANVsARVHipNSs__Hk',
  authDomain: 'hant-teut.firebaseapp.com',
  projectId: 'hant-teut',
  storageBucket: 'hant-teut.firebasestorage.app',
  messagingSenderId: '139799513560',
  appId: '1:139799513560:web:5550a79be89c03b3d80aad',
  measurementId: 'G-VJ9LPJ68C0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Firestore 인스턴스를 초기화하고 내보냅니다.
// 앱의 다른 파일에서 이 'db'를 import하여 사용하게 됩니다.
export const db = getFirestore(app)
