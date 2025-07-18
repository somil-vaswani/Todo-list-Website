import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";


export default function Header({ title, theme, setTheme }) {

  const location = useLocation();
  const [date, setDate] = useState(new Date());


  // inside Header component
  const { profile } = useContext(AuthContext);
  const avatarUrl = profile?.avatar || "https://api.dicebear.com/6.x/croodles/svg?seed=Zoe";


  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const navbarStyle = {
    backgroundColor: theme === "dark" ? "#343a40" : "#f086af",
    color: theme === "dark" ? "#fff" : "#000"
  };

  const linkStyle = (path) => ({
    fontWeight: location.pathname === path ? "bold" : "normal",
    color: navbarStyle.color
  });

  return (
    <nav className="navbar navbar-expand-lg" style={navbarStyle}>
      <div className="container-fluid">
        <span className="navbar-brand fw-bold" style={{ color: navbarStyle.color }}>
          {title}
        </span>

        <div className="position-absolute start-50 translate-middle-x text-center">
          <div className="fw-bold" style={{ color: navbarStyle.color }}>{formattedDate}</div>
          <div className="small" style={{ color: navbarStyle.color }}>{formattedTime}</div>
        </div>

        <div className="d-flex align-items-center ms-auto">
          <button
            className={`btn btn-sm ${theme === "dark" ? "btn-light" : "btn-dark"}`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          <ul className="navbar-nav me-3 mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={linkStyle("/")}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about" style={linkStyle("/about")}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile" style={linkStyle("/profile")}>
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="rounded-circle"
                  width="30"
                  onError={(e) => e.target.src = "https://api.dicebear.com/6.x/croodles/svg?seed=Zoe"}
                />

              </Link>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  setTheme: PropTypes.func.isRequired
};
