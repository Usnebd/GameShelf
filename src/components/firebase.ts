import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import firebase from "firebase/compat/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import firebaseui from "firebaseui";

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
export const ui = new firebaseui.auth.AuthUI(firebase.auth());
// Initialize auth
export const auth: Auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
});

export const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function () {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
  },
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};
