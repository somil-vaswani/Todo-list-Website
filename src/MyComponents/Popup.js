// src/components/Popup.js
import React from 'react';

export  function Popup({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
        <button className="btn btn-primary mt-3" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
