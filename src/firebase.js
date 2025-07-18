
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: yours key,
  authDomain: yours key,
  projectId: yours key,
  storageBucket: yours key,
  messagingSenderId: yours key,
  appId: yours key,
  measurementId: yours key
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
