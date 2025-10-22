import React from "react";
import "../style.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="hero">
      <nav>
        <Link to="/">
          <h2 className="logo">Bottle <span> Drop </span></h2>
        </Link>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <Link to="/login">
          <button type="button">Login</button>
        </Link>
      </nav> 
      <div className="hero-text">
        <h1>Welcome to Bottle Drop</h1>
        <p>Recycle your bottles and cans with ease!</p>
        <Link to="/login">
          <button type="button">Get Started</button>
        </Link>
      </div>
    </div>
  );
}