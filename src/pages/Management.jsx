import React from "react";
import "../style.css";
import { Link } from "react-router-dom";

export default function Management () {
    return (
    <div className="hero">
      <nav>
        <Link to="/">
          <h2 className="logo">Cashier <span> Dashboard </span></h2>
        </Link>
        <ul>
          <li><a href="/items">Items</a></li>
          <li><a href="/billing">Billing</a></li>
          <li><a href="/management">Manage</a></li>
          <li><a href="/receipt">Receipt</a></li>
        </ul>
        <Link to="/logout">
          <button type="button">Logout</button>
        </Link>
      </nav>
    </div>
    );
}
