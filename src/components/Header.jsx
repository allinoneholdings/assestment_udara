import React from "react";
import "../style.css";

export default function Header() {
  return (
    <header>
      <div className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <a href="/">
              <img src="/Images/fitzone.png" alt="FitZone Logo" />
            </a>
          </div>
          <nav className="main-nav">
            <a href="/">Home</a>
            <a href="#our-packages">Membership Plan</a>
            <a href="#inquiries">Inquiries</a>
            <a href="#trainers">Personal Training</a>
            <a href="#contact">Contact</a>
            <a href="#about">About</a>
          </nav>
          <div className="button">
            <a href="/signup">
              <button className="button">Sign Up</button>
            </a>
            <a href="/login">
              <button className="button">Login</button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
