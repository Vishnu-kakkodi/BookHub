import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCD7MMX-GTKzhAGBbBBwLSAnfhY-iaS0sA",
  authDomain: "bookhub-7a8df.firebaseapp.com",
  projectId: "bookhub-7a8df",
  storageBucket: "bookhub-7a8df.firebasestorage.app",
  messagingSenderId: "240739221173",
  appId: "1:240739221173:web:f2342c82b85667519648fc",
  measurementId: "G-1XF3ZM4G1J"
};

// Prevent multiple app initializations
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
