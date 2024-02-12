import { initializeApp } from "firebase/app";
import {
  getAuth,
  Auth,
  EmailAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChoaAsbIA-XZVDmWE7DL0ahoh_5hCnQaI",
  authDomain: "mychiosco.firebaseapp.com",
  projectId: "mychiosco",
  storageBucket: "mychiosco.appspot.com",
  messagingSenderId: "1081911084888",
  appId: "1:1081911084888:web:a21598ee68f712d48d872d",
  measurementId: "G-KP603W9N6L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize auth
export const auth: Auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
});
