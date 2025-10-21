import React from "react";
import "../style.css";

export default function Header() {
  return (
<header className="header">
      <div className="navbar-container">
        <div className="logo">
          <a href="/">
            <img src="/Images/liquor.png" alt="FitZone Logo" />
          </a>
        </div>
        <nav className="main-nav">
          <a href="/">Home</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
        </nav>
        <div className="auth-buttons">
          <a href="/login">
            <button className="login-button">Login</button>
          </a>
        </div>
      </div>
    </header>
  );
}
