import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHyUIu9NLqjsaVFq7KhcVEJ3tG8MEKFJ0",
  authDomain: "gen1000.firebaseapp.com",
  projectId: "gen1000",
  storageBucket: "gen1000.firebasestorage.app",
  messagingSenderId: "382359209764",
  appId: "1:382359209764:web:98fbe3af2747558f2015b1",
  measurementId: "G-F07NE6G64H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);