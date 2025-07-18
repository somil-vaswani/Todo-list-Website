import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, provider, db } from "./firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ avatar: "", email: "" });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const ref = doc(db, "users", u.uid);
        onSnapshot(ref, async (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
          } else {
            const defaultAvatar = "https://api.dicebear.com/6.x/croodles/svg?seed=Zoe";
            const init = {
              name: u.displayName || "Anonymous",
              email: u.email,
              avatar: defaultAvatar,
              streak: 0,
              lastCompletedDate: ""
            };
            await setDoc(ref, init);
            setProfile(init);
          }
        });
      } else {
        setUser(null);
        setProfile({ avatar: "" });
      }
    });

    return unsub;
  }, []);


  // Auth Actions
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const defaultAvatar = "https://api.dicebear.com/6.x/croodles/svg?seed=Zoe";
    await updateProfile(cred.user, { photoURL: defaultAvatar });
    await setDoc(doc(db, "users", cred.user.uid), {
      avatar: defaultAvatar,
      email,
      streak: 0,
      lastCompletedDate: ""
    });
  };

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    const u = result.user;

    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const avatar = "https://api.dicebear.com/6.x/croodles/svg?seed=Zoe";
      const init = {
        name: u.displayName || "Anonymous",
        email: u.email,
        avatar // always use cartoon avatar, not Google default
      };
      await setDoc(ref, init);
      setProfile(init);
    }
    setUser(u);
  };


  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => auth.signOut();

  // Profile Update (avatar)
  const updateAvatar = async (url) => {
    if (!user) return;
    await updateProfile(auth.currentUser, { photoURL: url });
    await updateDoc(doc(db, "users", user.uid), { avatar: url });
    setProfile((prev) => ({ ...prev, avatar: url }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        login,
        signup,
        googleLogin,
        resetPassword,
        logout,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
