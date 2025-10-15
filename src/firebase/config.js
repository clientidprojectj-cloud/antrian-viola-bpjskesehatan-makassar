// 1. Impor fungsi yang kita butuhkan dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 2. Konfigurasi proyek Firebase Anda
// TODO: Ganti dengan konfigurasi dari project Firebase Anda
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 3. Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);

// 4. Inisialisasi Firebase Authentication dan ekspor untuk digunakan di tempat lain
const auth = getAuth(app);

export { auth };