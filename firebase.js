import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc,
  onSnapshot
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9r0D7oQK6oEnxZuOcWg4Ngn-U_-3ztjU",
  authDomain: "electronic-crime-app.firebaseapp.com",
  projectId: "electronic-crime-app",
  storageBucket: "electronic-crime-app.appspot.com",
  messagingSenderId: "375809244144",
  appId: "1:375809244144:web:8b532401785f2b1a1a7b35",
  measurementId: "G-ZD7VMHNVL1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, onSnapshot, setDoc,doc, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, getFirestore, query, getDocs, collection, where, addDoc, }