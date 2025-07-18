// MyComponents/Theme.js
import React, { useEffect } from 'react';

export default function Theme({ theme, setTheme }) {
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme); // dynamically change theme on <body>
  }, [theme]);

  return (
    <div className="container mt-4">
      <h2>Select Theme</h2>
      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="radio"
          name="theme"
          id="light"
          value="light"
          checked={theme === "light"}
          onChange={handleThemeChange}
        />
        <label className="form-check-label" htmlFor="light">
          Light Theme
        </label>
      </div>
      <div className="form-check mt-2">
        <input
          className="form-check-input"
          type="radio"
          name="theme"
          id="dark"
          value="dark"
          checked={theme === "dark"}
          onChange={handleThemeChange}
        />
        <label className="form-check-label" htmlFor="dark">
          Dark Theme
        </label>
      </div>
    </div>
  );
}
