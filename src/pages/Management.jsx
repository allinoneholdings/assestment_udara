import React from "react";
import "../style.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Management () {

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", age: 28, birthday: "1997-05-10", joined: "2023-03-12", role: "Cashier" },
    { id: 2, name: "Jane Smith", age: 32, birthday: "1993-11-20", joined: "2022-07-05", role: "Manager" },
    { id: 3, name: "Mike Ross", age: 25, birthday: "2000-02-15", joined: "2024-01-18", role: "Assistant" },
        { id: 1, name: "John Doe", age: 28, birthday: "1997-05-10", joined: "2023-03-12", role: "Cashier" },
    { id: 2, name: "Jane Smith", age: 32, birthday: "1993-11-20", joined: "2022-07-05", role: "Manager" },
    { id: 3, name: "Mike Ross", age: 25, birthday: "2000-02-15", joined: "2024-01-18", role: "Assistant" },
        { id: 1, name: "John Doe", age: 28, birthday: "1997-05-10", joined: "2023-03-12", role: "Cashier" },
    { id: 2, name: "Jane Smith", age: 32, birthday: "1993-11-20", joined: "2022-07-05", role: "Manager" },
    { id: 3, name: "Mike Ross", age: 25, birthday: "2000-02-15", joined: "2024-01-18", role: "Assistant" },
  ]);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

        // State for modal
    const [showModal, setShowModal] = useState(false);

      const [newItem, setNewItem] = useState({
        name: "",
        age: "",
        birthday: "",
        joined: "",
        role: "",
      });

        const handleAddItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();

    // Add new item to list
    const newId = users.length + 1;
    setUsers([...users, { id: newId, ...newItem }]);

    // Reset form + close modal
    setNewItem({ name: "", age: "", birthday: "", joined: "", role: "" });
    setShowModal(false);
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
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.birthday}</td>
                <td>{user.joined}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
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
              <h3>Add New Item</h3>
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
                  type="text"
                  name="birthday"
                  value={newItem.birthday}
                  onChange={handleAddItemChange}
                  required
                />

                <label>Joined Date:</label>
                <input
                  type="text"
                  name="joined"
                  value={newItem.joined}
                  onChange={handleAddItemChange}
                  required
                />

                <label>Role:</label>
                <input
                  type="text"
                  name="role"
                  value={newItem.role}
                  onChange={handleAddItemChange}
                  required
                />

                <div className="modal-buttons">
                  <button type="submit">Add Item</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>

    </>
    );
}
