import { useEffect } from "react";
import "../style.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer.jsx";

export default function Management () {

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    age: "",
    birthday: "",
    joined: "",
    role: "",
    password: "",
  });

  const API_URL = "http://localhost:5000/api/signups";

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleAddItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

// Add user through backend API
  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add user");
      }

      showToast("success", "User Added", newItem.name);

      // Refresh user list from backend
      const updatedRes = await fetch(API_URL);
      const updatedUsers = await updatedRes.json();
      setUsers(updatedUsers);

      // Reset form + close modal
      setNewItem({ name: "", age: "", birthday: "", role: "", password: "" });
      setShowModal(false);
    } catch (err) {
      console.error("Error adding user:", err);
      showToast("❌", "Failed to Add User", newItem.name);
    }
  };

  const handleDelete = (user) => {
    setDeleteModalItem(user);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${deleteModalItem._id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      showToast("success", "User Deleted", deleteModalItem.name);
      setUsers(users.filter((u) => u._id !== deleteModalItem._id));
      setDeleteModalItem(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      showToast("❌", "Failed to Delete User", deleteModalItem.name);
    }
  };

  const showToast = (type, text, userName = "") => {
  setToast({ type, text, user: userName });

  // Auto hide after 3 seconds
  setTimeout(() => setToast(null), 3000);
};


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

    <div className="table-container">
        <h2>User Management</h2>
        <button type="button" onClick={() => setShowModal(true)} className="add-button">Add User</button>

        {message && <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}

          <div className="table-scroll">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Birthday</th>
                  <th>Joined Date</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{new Date(user.birthday).toLocaleDateString()}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(user)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>
    </div>

                {/* Popup Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New User</h3>
              <form onSubmit={handleAddItemSubmit} className="add-item-form">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleAddItemChange}
                  required
                />

                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={newItem.age}
                  onChange={handleAddItemChange}
                  required
                />

                <label>Birthday:</label>
                <input
                  type="date"
                  name="birthday"
                  value={newItem.birthday}
                  onChange={handleAddItemChange}
                  required
                />

                <label>Role:</label>
                <select
                  name="role"
                  value={newItem.role}
                  onChange={handleAddItemChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>


                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={newItem.password}
                  onChange={handleAddItemChange}
                  required
                />

                <div className="modal-buttons">
                  <button type="submit">Add User</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
{deleteModalItem && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Delete User</h3>
      <p>Are you sure you want to delete ?<strong>{deleteModalItem.name}</strong></p>
      <div className="modal-buttons">
        <button onClick={confirmDelete} style={{ background: "#e60000", color: "#fff" }}>Yes, Delete</button>
        <button onClick={() => setDeleteModalItem(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
<Footer />
    </div>
    {toast && (
  <div className={`toast ${toast.type}`}>
    {toast.type === "success" ? "✅" : "❌"} {toast.text} {toast.user && `: ${toast.user}`}
  </div>
)}
    </>
    );
}
