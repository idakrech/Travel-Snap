// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 123,//insert your API key here
  authDomain: "travel-snap-72662.firebaseapp.com",
  projectId: "travel-snap-72662",
  storageBucket: "travel-snap-72662.appspot.com",
  messagingSenderId: "3116379494",
  appId: "1:3116379494:web:672aa9d2dd99783cadaca7"
};

// Initialize Firebase

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();


export { app, auth, db, storage };