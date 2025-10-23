import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style.css";

export default function Item() {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterQuantity, setFilterQuantity] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  // Items
  const [users, setUsers] = useState([
    { id: 1, name: "Jack Daniel’s Old No.7 750ml", quantity: 20, price: 12500 },
    { id: 2, name: "Johnnie Walker Black Label 750ml", quantity: 15, price: 15000 },
    { id: 3, name: "Chivas Regal 12 Years 700ml", quantity: 12, price: 16500 },
    { id: 4, name: "Absolut Vodka 1L", quantity: 25, price: 10000 },
    { id: 5, name: "Smirnoff Vodka 750ml", quantity: 30, price: 7800 },
    { id: 6, name: "Bacardi White Rum 750ml", quantity: 18, price: 8500 },
    { id: 7, name: "Captain Morgan Spiced Rum 750ml", quantity: 22, price: 9200 },
    { id: 8, name: "Jose Cuervo Tequila 750ml", quantity: 10, price: 11800 },
    { id: 9, name: "Baileys Irish Cream 750ml", quantity: 8, price: 13000 },
    { id: 10, name: "Heineken Beer 330ml (24 Pack)", quantity: 35, price: 9000 },
  ]);

  // Modal for adding item
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const handleAddItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      // Update existing item
      setUsers(
        users.map((user) =>
          user.id === editItem.id
            ? {
                ...user,
                name: newItem.name,
                quantity: Number(newItem.quantity),
                price: Number(newItem.price),
              }
            : user
        )
      );
      setIsEditMode(false);
      setEditItem(null);
    } else {
      // Add new item
      const newId = users.length + 1;
      setUsers([
        ...users,
        { id: newId, name: newItem.name, quantity: Number(newItem.quantity), price: Number(newItem.price) },
      ]);
    }

    setNewItem({ name: "", quantity: "", price: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const item = users.find((u) => u.id === id);
    setDeleteModalItem(item);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== deleteModalItem.id));
    setDeleteModalItem(null);
  };

  const handleUpdate = (id) => {
    const itemToEdit = users.find((u) => u.id === id);
    setEditItem(itemToEdit);
    setNewItem({
      name: itemToEdit.name,
      quantity: itemToEdit.quantity,
      price: itemToEdit.price,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Filter items based on search and dropdown
  const filteredUsers = users.filter((user) => {
    // Search by name
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by Name
    const matchesName = filterName ? user.name === filterName : true;

    // Filter by Quantity
    let matchesQuantity = true;
    if (filterQuantity) {
      if (filterQuantity === "5-10") matchesQuantity = user.quantity >= 5 && user.quantity <= 10;
      if (filterQuantity === "11-20") matchesQuantity = user.quantity >= 11 && user.quantity <= 20;
      if (filterQuantity === "21-30") matchesQuantity = user.quantity >= 21 && user.quantity <= 30;
      if (filterQuantity === "31+") matchesQuantity = user.quantity >= 31;
    }

    // Filter by Price
    let matchesPrice = true;
    if (filterPrice) {
      if (filterPrice === "0-9000") matchesPrice = user.price <= 9000;
      if (filterPrice === "9001-12000") matchesPrice = user.price >= 9001 && user.price <= 12000;
      if (filterPrice === "12001-15000") matchesPrice = user.price >= 12001 && user.price <= 15000;
      if (filterPrice === "15001+") matchesPrice = user.price >= 15001;
    }

    return matchesSearch && matchesName && matchesQuantity && matchesPrice;
  });

  return (
    <div className="hero">
      <nav>
        <Link to="/">
          <h2 className="logo">Cashier <span>Dashboard</span></h2>
        </Link>
        <ul>
          <li><a href="/items">Items</a></li>
          <li><a href="/billing">Billing</a></li>
          <li><a href="/management">Manage</a></li>
          <li><a href="/receipt">Receipt</a></li>
        </ul>
        <Link to="/"><button type="button">Logout</button></Link>
      </nav>

      <div className="search-section">
        <div className="search-bar">
          <div className="search-row">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" onClick={() => setShowModal(true)}>Add</button>
          </div>

          <div className="filter-row">
            <select onChange={(e) => setFilterName(e.target.value)}>
              <option value="">Name</option>
              <option value="Jack Daniel’s Old No.7 750ml">Jack Daniel</option>
              <option value="Johnnie Walker Black Label 750ml">Johnnie Walker</option>
              <option value="Chivas Regal 12 Years 700ml">Chivas Regal</option>
              <option value="Absolut Vodka 1L">Absolut Vodka</option>
              <option value="Smirnoff Vodka 750ml">Smirnoff Vodka</option>
              <option value="Bacardi White Rum 750ml">Bacardi Rum</option>
              <option value="Captain Morgan Spiced Rum 750ml">Captain Morgan</option>
              <option value="Jose Cuervo Tequila 750ml">Jose Cuervo</option>
              <option value="Baileys Irish Cream 750ml">Baileys</option>
              <option value="Heineken Beer 330ml (24 Pack)">Heineken</option>
            </select>

            <select onChange={(e) => setFilterQuantity(e.target.value)}>
              <option value="">Quantity</option>
              <option value="5-10">5 – 10</option>
              <option value="11-20">11 – 20</option>
              <option value="21-30">21 – 30</option>
              <option value="31+">31+</option>
            </select>

            <select onChange={(e) => setFilterPrice(e.target.value)}>
              <option value="">Price</option>
              <option value="0-9000">Below 9,000 LKR</option>
              <option value="9001-12000">9,001 – 12,000 LKR</option>
              <option value="12001-15000">12,001 – 15,000 LKR</option>
              <option value="15001+">Above 15,000 LKR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-containers">
        <div className="table-scroll">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.quantity}</td>
                  <td>{user.price.toLocaleString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                    <button className="delete-btn" onClick={() => handleUpdate(user.id)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditMode ? "Update Item" : "Add New Item"}</h3>
            <form onSubmit={handleAddItemSubmit} className="add-item-form">
              <label>Name:</label>
              <input type="text" name="name" value={newItem.name} onChange={handleAddItemChange} required />
              <label>Quantity:</label>
              <input type="number" name="quantity" value={newItem.quantity} onChange={handleAddItemChange} required />
              <label>Price:</label>
              <input type="number" name="price" value={newItem.price} onChange={handleAddItemChange} required />

              <div className="modal-buttons">
                <button type="submit">{isEditMode ? "Update" : "Add Item"}</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Item</h3>
            <p>Are you sure you want to delete ?<strong>{deleteModalItem.name}</strong></p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} style={{background: "#e60000", color: "#fff"}}>Yes, Delete</button>
              <button onClick={() => setDeleteModalItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
