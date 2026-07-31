import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, serverTimestamp, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBlfa9SDEEVS5TlcG9MZcaeTUKlHnSXxzk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0530848128.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0530848128",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0530848128.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "75751672476",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:75751672476:web:62d0803c4da42ee5f67b59"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-munsatflixs-692556ed-f323-404b-b5ea-be1e7b027457";
const db = getFirestore(app, dbId);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail };
export { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, serverTimestamp, updateDoc };
