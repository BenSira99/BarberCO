import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import config from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(config) : getApp();

// Initialize Firestore with specific database ID if provided
export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
};
export type { User };
