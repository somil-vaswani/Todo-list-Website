import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


export default function AuthSignUp({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [popup, setPopup] = useState("");

    const navigate = useNavigate();

    const showMessage = (msg) => setPopup(msg);

    const signup = () => {
        if (!email || !password || !name) {
            return showMessage("All fields are required.");
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCred) => {
                const user = userCred.user;
                await updateProfile(user, { displayName: name });
                await setDoc(doc(db, "users", user.uid), {
                    name,
                    email,
                    avatar: "https://api.dicebear.com/6.x/croodles/svg?seed=Zoe"
                });
                setUser(user);
                navigate("/");
            })
            .catch((err) => showMessage(err.code?.replace("auth/", "") || "signup-failed"));
    };

    const googleLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result.user);
                navigate("/");
            })
            .catch(err => showMessage(err.code?.replace("auth/", "") || "signup-failed"));

    };

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <h2 className="mb-4 text-center">Sign Up</h2>

            <input
                className="form-control mb-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
            />
            <input
                className="form-control mb-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                className="form-control mb-3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button className="btn btn-success w-100 mb-2" onClick={signup}>
                Sign Up
            </button>
            <button className="btn btn-danger w-100 mb-3" onClick={googleLogin}>
                Sign up with Google
            </button>

            <div className="text-center">
                <Link to="/login" className="btn btn-link">Have an account? Login</Link>
            </div>

            {popup && (
                <div className="position-fixed top-50 start-50 translate-middle bg-light border shadow p-4 text-center rounded" style={{ zIndex: 9999 }}>
                    <p>{popup}</p>
                    <button className="btn btn-sm btn-primary mt-2" onClick={() => setPopup("")}>OK</button>
                </div>
            )}
        </div>
    );
}
