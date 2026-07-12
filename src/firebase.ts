import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDj8F-zWvCaNPhKNUGSF9lj_jZuuApo7Jo",
    authDomain: "vocantara.firebaseapp.com",
    projectId: "vocantara",
    storageBucket: "vocantara.firebasestorage.app",
    messagingSenderId: "302872035117",
    appId: "1:302872035117:web:2d272163008f2617ef1da4",
    measurementId: "G-1N13K4W9ZT"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);