import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const cartoonAvatars = [
  "https://api.dicebear.com/6.x/adventurer/svg?seed=John",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Emma",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Mia",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Alex",
];

const defaultAvatar = "https://api.dicebear.com/6.x/croodles/svg?seed=Zoe"; // also save this in Firebase initially

export default function Profile({ setUser }) {
  const { user, profile, updateAvatar } = useContext(AuthContext);
  const name = profile?.name || "Sir";
  const navigate = useNavigate();
  const [editingPw, setEditingPw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState("");

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || defaultAvatar);


  // ⚡ Sync with Firebase value on load or avatar update
  useEffect(() => {
    setSelectedAvatar(profile.avatar || defaultAvatar);
  }, [profile.avatar]);

  const handleConfirmAvatar = async () => {
    if (!tempAvatar) return;
    await updateAvatar(tempAvatar);  // saves to Firebase + context
    setSelectedAvatar(tempAvatar);
    setTempAvatar(null);
    setShowAvatarPicker(false);
    setMsg("Avatar updated!");
  };

  const logout = () => {
    auth.signOut();
    setUser(null);
    navigate("/"); // redirect to home page
  };

  const handleChangePw = async () => {
    setMsg("");
    if (newPw !== confirmPw) return setMsg("New passwords do not match.");
    if (newPw === "" || oldPw === "" || confirmPw === "") return setMsg("Please fill in all password fields.");
    try {
      const cred = EmailAuthProvider.credential(user.email, oldPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      setMsg("Password updated!");
      setEditingPw(false);
      setOldPw(""); setNewPw(""); setConfirmPw("");
    } catch (e) {
      setMsg(e.message.replace("Firebase: Error (auth/", "").replace(")", ""));
    }
  };

  if (!user) return <div className="container mt-4">Not logged in.</div>;

  return (
    <div className="container my-4">
      <h3>Hello, {name}</h3>
      <img
        src={selectedAvatar}
        className="rounded-circle mb-3"
        alt="avatar"
        width="120"
        height="120"
      />

      <div className="mb-3">
        <button
          className="btn btn-info"
          onClick={() => {
            setShowAvatarPicker(!showAvatarPicker);
            setTempAvatar(null); // Reset
          }}
        >
          {showAvatarPicker ? "Cancel" : "Edit Avatar"}
        </button>
      </div>

      {showAvatarPicker && (
        <>
          <div className="mb-3 d-flex flex-wrap gap-3">
            {[defaultAvatar, ...cartoonAvatars].map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`avatar-${idx}`}
                className={`rounded-circle border ${tempAvatar === url ? "border-primary border-3" : "border-secondary"
                  }`}
                width="80"
                height="80"
                role="button"
                onClick={() => setTempAvatar(url)}
              />
            ))}
          </div>
          <button
            className="btn btn-success mb-3"
            onClick={handleConfirmAvatar}
            disabled={!tempAvatar || tempAvatar === selectedAvatar}
          >
            Confirm Avatar
          </button>
        </>
      )}

      <div className="mb-3">
        <strong>Email:</strong> {user.email}
      </div>

      <div className="mb-3">
        <strong>Password:</strong> ••••••••
      </div>

      {!editingPw ? (
        <button className="btn btn-warning" onClick={() => setEditingPw(true)}>
          Change Password
        </button>
      ) : (
        <div className="card p-3 mb-3">
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Old Password"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-2"
            placeholder="New Password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Confirm New Password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
          <div className="mt-2">
            <button className="btn btn-sm btn-success me-2" onClick={handleChangePw}>
              Update Password
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setEditingPw(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {msg && <div className="alert alert-info mt-3">{msg}</div>}

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-danger"
          onClick={() => window.confirm("Are you sure you want to Logout?") && logout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
