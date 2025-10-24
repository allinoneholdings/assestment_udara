import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import Footer from "../components/Footer.jsx";

export default function Item() {

  const API_URL = "http://localhost:5000/api/items";

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterQuantity, setFilterQuantity] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  // Modal for adding item
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [toast, setToast] = useState(null);

// Fetch items from backend
  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // normalize to frontend fields: id, name, quantity, price, createdAt, _id
      const norm = data.map((d) => ({
        id: d._id,
        _id: d._id,
        name: d.itemName,
        quantity: d.quantity,
        price: d.price,
        createdAt: d.createdAt,
      }));
      setItems(norm);
    } catch (err) {
      console.error("Fetch items error:", err);
      showToast("error", "Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // small toast helper
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  // input change
  const handleAddItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // submit add or update
  const handleAddItemSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      itemName: newItem.name,
      quantity: Number(newItem.quantity),
      price: Number(newItem.price),
    };

    try {
      if (isEditMode && editItem) {
        // PUT /api/items/:id
        const res = await fetch(`${API_URL}/${editItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.message || "Failed to update");

        // update local list
        setItems((prev) =>
          prev.map((it) => (it._id === updated._id ? {
            ...it,
            name: updated.itemName,
            quantity: updated.quantity,
            price: updated.price,
            createdAt: updated.createdAt,
          } : it))
        );

        showToast("success", `Updated: ${updated.itemName}`);
      } else {
        // POST /api/items
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        if (!res.ok) throw new Error(created.message || "Failed to create");

        // add to local list
        setItems((prev) => [
          {
            id: created._id,
            _id: created._id,
            name: created.itemName,
            quantity: created.quantity,
            price: created.price,
            createdAt: created.createdAt,
          },
          ...prev,
        ]);

        showToast("success", `Added: ${created.itemName}`);
      }

      // reset modal
      setNewItem({ name: "", quantity: "", price: "" });
      setIsEditMode(false);
      setEditItem(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      showToast("error", err.message || "Error saving item");
    }
  };

  // prepare delete modal
  const handleDelete = (item) => {
    setDeleteModalItem(item);
  };

  // confirm delete
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${deleteModalItem._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      setItems((prev) => prev.filter((i) => i._id !== deleteModalItem._id));
      showToast("success", `Deleted: ${deleteModalItem.name}`);
      setDeleteModalItem(null);
    } catch (err) {
      console.error(err);
      showToast("error", err.message || "Delete failed");
    }
  };

  // edit flow
  const handleUpdate = (item) => {
    setEditItem(item);
    setNewItem({ name: item.name, quantity: item.quantity, price: item.price });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Filters / search
  const uniqueNames = Array.from(new Set(items.map((i) => i.name))).sort();

  const filteredItems = items.filter((item) => {
    // search text by name
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    // name dropdown
    const matchesName = filterName ? item.name === filterName : true;

    // quantity ranges
    let matchesQuantity = true;
    if (filterQuantity) {
      if (filterQuantity === "5-10") matchesQuantity = item.quantity >= 5 && item.quantity <= 10;
      if (filterQuantity === "11-20") matchesQuantity = item.quantity >= 11 && item.quantity <= 20;
      if (filterQuantity === "21-30") matchesQuantity = item.quantity >= 21 && item.quantity <= 30;
      if (filterQuantity === "31+") matchesQuantity = item.quantity >= 31;
    }

    // price ranges
    let matchesPrice = true;
    if (filterPrice) {
      if (filterPrice === "0-9000") matchesPrice = item.price <= 9000;
      if (filterPrice === "9001-12000") matchesPrice = item.price >= 9001 && item.price <= 12000;
      if (filterPrice === "12001-15000") matchesPrice = item.price >= 12001 && item.price <= 15000;
      if (filterPrice === "15001+") matchesPrice = item.price >= 15001;
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

            {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "success" : "error"}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.text}
        </div>
      )}

      <div className="search-section">
        <div className="search-bar">
          <div className="search-row">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" onClick={() => { setShowModal(true); setIsEditMode(false); setNewItem({ name: "", quantity: "", price: "" }); }}>
              Add
            </button>
          </div>

          <div className="filter-row">
            <select onChange={(e) => setFilterName(e.target.value)} value={filterName}>
              <option value="">Name</option>
              {uniqueNames.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>

            <select onChange={(e) => setFilterQuantity(e.target.value)} value={filterQuantity}>
              <option value="">Quantity</option>
              <option value="5-10">5 – 10</option>
              <option value="11-20">11 – 20</option>
              <option value="21-30">21 – 30</option>
              <option value="31+">31+</option>
            </select>

            <select onChange={(e) => setFilterPrice(e.target.value)} value={filterPrice}>
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
                <th>Price (LKR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(item)}>Delete</button>
                    <button className="delete-btn" onClick={() => handleUpdate(item)}>Update</button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr><td colSpan="4" style={{ color: "#fff" }}>No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
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
                <button type="button" onClick={() => { setShowModal(false); setIsEditMode(false); setEditItem(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModalItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Item</h3>
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
  );
}
