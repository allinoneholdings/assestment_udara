import React from "react";
import "../style.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from '../components/Footer.jsx';

export default function Login() {

    const [formData, setFormData] = useState({username: "", password: ""});

        const handleChange = (e) =>
        setFormData({...formData, [e.target.name]: e.target.value });

        const handleSubmit =  async (e) => {
        e.preventDefault();
        
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("You have successfully logged in!");
        // Redirect based on role
        if (data.role === "Cashier") {
          navigate("/cashier");
        } else if (data.role === "Manager") {
          navigate("/manager");
        } else if (data.role === "Admin") {
          navigate("/admin");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Something went wrong");
    }
  };

    return(
      <>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="login-form-container">
            <h2>Login</h2>
            <label>Username :</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
            <label>Password :</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            <Link to="/cashier">
              <button type="submit">Submit</button>
            </Link>
          </div>
        </form>
        </div>
        <Footer />
    </>
    );
}