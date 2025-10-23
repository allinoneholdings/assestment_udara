import React from "react";
import "../style.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Receipt () {

    const [users, setUsers] = useState([
      { id: 1, id: "John Doe", quantity: 28, billed: "2023-03-12", price: "2,500" },
      { id: 2, id: "Jane Smith", quantity: 32, billed: "2022-07-05", price: "5,000" },
      { id: 3, id: "Mike Ross", quantity: 25, billed: "2024-01-18", price: "3,500" },
            { id: 1, id: "John Doe", quantity: 28, billed: "2023-03-12", price: "2,500" },
      { id: 2, id: "Jane Smith", quantity: 32, billed: "2022-07-05", price: "5,000" },
      { id: 3, id: "Mike Ross", quantity: 25, billed: "2024-01-18", price: "3,500" },
            { id: 1, id: "John Doe", quantity: 28, billed: "2023-03-12", price: "2,500" },
      { id: 2, id: "Jane Smith", quantity: 32, billed: "2022-07-05", price: "5,000" },
      { id: 3, id: "Mike Ross", quantity: 25, billed: "2024-01-18", price: "3,500" },
    ]);
  
    const handleDownload = (id) => {
      setUsers(users.filter((user) => user.id !== id));
    };

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
          <div className="table-container">
        <h2>Receipt</h2>

        <div className="table-scroll">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quantity</th>
              <th>Billed Date</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.quantity}</td>
                <td>{user.billed}</td>
                <td>{user.price}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDownload(user.id)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    );
}
