
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYfgaI8nini114v-W6HTxlsTtwnMVLSJg",
  authDomain: "todoslist-dace5.firebaseapp.com",
  projectId: "todoslist-dace5",
  storageBucket: "todoslist-dace5.firebasestorage.app",
  messagingSenderId: "70694948040",
  appId: "1:70694948040:web:01240a922962a63e46e9fd",
  measurementId: "G-YCKRCYMFBX"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);