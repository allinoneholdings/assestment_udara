import React from "react";
import "../style.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Cashier() {

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => 
    setSearchTerm({...searchTerm, [e.target.name]: e.target.value });

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
  };

    // Dummy items to show cards
  const dummyItems = [
    { id: 1, name: "Classic Whiskey", quantity: 12, price: 45.99 },
    { id: 2, name: "Red Wine", quantity: 8, price: 30.5 },
  ];

  return (
    <>
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

<div className="search-section">
<div className="search-bar">
  <form onSubmit={handleSearchSubmit} className="search-form">
    <h2>Search & Filter</h2>
    <div className="search-row">
      <input
        type="text"
        id="searchTerm"
        name="searchTerm"
        value={searchTerm.searchTerm || ""}
        onChange={handleSearchChange}
        placeholder="Search items..."
      />
      <button type="submit">Go</button>
    </div>
        <div className="filter-row">
      <select name="filterName">
        <option value="">Filter by Name</option>
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
      </select>

      <select name="filterQuantity">
        <option value="">Filter by Quantity</option>
        <option value="low-high">Low to High</option>
        <option value="high-low">High to Low</option>
      </select>

      <select name="filterPrice">
        <option value="">Filter by Price</option>
        <option value="low-high">Low to High</option>
        <option value="high-low">High to Low</option>
      </select>
    </div>
          <div className="items-container">
        {dummyItems.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))}
      </div>
  </form>
</div>
      </div>
      </div>
    </>
  );
} 