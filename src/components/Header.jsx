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
          <a href="/about">About</a>
          <a href="/login">Login</a>
        </nav>
      </div>
    </header>
  );
}
