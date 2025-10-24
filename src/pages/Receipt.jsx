import React from "react";
import "../style.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Footer from "../components/Footer.jsx";

export default function Receipt () {

  const [billings, setBillings] = useState([]);

  // Fetch billing data from backend
  useEffect(() => {
    fetch("/api/billing")
      .then(res => res.json())
      .then(data => setBillings(data))
      .catch(err => console.error("Failed to fetch billings:", err));
  }, []);

  const handleDownload = (id) => {
    fetch(`/api/billing/${id}/pdf`)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt_${id}.pdf`;
        a.click();
      })
      .catch(err => console.error("Failed to download PDF:", err));
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
                <th>Items Count</th>
                <th>Billed Date</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billings.map(billing => (
                <tr key={billing._id}>
                  <td>{billing._id}</td>
                  <td>{billing.items.length}</td>
                  <td>{new Date(billing.createdAt).toLocaleDateString()}</td>
                  <td>{billing.totalAmount.toFixed(2)}</td>
                  <td>
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(billing._id)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
              {billings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No receipts found.</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
<Footer />
    </div>
    );
}
