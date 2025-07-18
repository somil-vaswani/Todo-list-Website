import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";


export default function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  const showMessage = (msg) => setPopup(msg);

  const login = () => {
    if (!email) return showMessage("Please enter an email.");
    if (!password) return showMessage("Please enter a password.");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        setUser(userCred.user);
        navigate("/");
      })
      .catch(err => showMessage(err.code?.replace("auth/", "") || "login-failed"));

  };

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        navigate("/");
      })
      .catch(err => showMessage(err.code?.replace("auth/", "") || "login-failed"));

  };

  const handleReset = () => {
    if (!resetEmail) return showMessage("Please enter your email.");
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        showMessage("Reset email sent. Check your inbox.");
        setShowReset(false);
        setResetEmail("");
      })
      .catch(err => showMessage(err.code?.replace("auth/", "") || "login-failed"));

  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="mb-4 text-center">Login</h2>

      {showReset ? (
        <>
          <inputas
            className="form-control mb-3"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button className="btn btn-warning w-100 mb-2" onClick={handleReset}>
            Send Reset Email
          </button>
          <button className="btn btn-outline-secondary w-100" onClick={() => setShowReset(false)}>
            Back to Login
          </button>
        </>
      ) : (
        <>
          <input
            className="form-control mb-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <div className="input-group mb-3">
            <input
              className="form-control"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="btn btn-primary w-100 mb-2" onClick={login}>
            Sign In
          </button>
          <div className="text-center text-muted">
            -------------------------OR-------------------------
          </div>
          <button className="btn btn-danger w-100 mb-3 " onClick={googleLogin}>
            Sign in with Google
          </button>

          <div className="d-flex justify-content-between">
            <button className="btn btn-link p-0" onClick={() => setShowReset(true)}>
              Forgot Password?
            </button>
            <Link to="/signup" className="btn btn-link p-0">
              New User? Sign Up
            </Link>
          </div>
        </>
      )}

      {popup && (
        <div className="position-fixed top-50 start-50 translate-middle bg-light border shadow p-4 text-center rounded" style={{ zIndex: 9999 }}>
          <p>{popup}</p>
          <button className="btn btn-sm btn-primary mt-2" onClick={() => setPopup("")}>OK</button>
        </div>
      )}
    </div>
  );
}
