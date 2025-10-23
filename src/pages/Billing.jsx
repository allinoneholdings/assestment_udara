import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import Footer from "../components/Footer.jsx";

export default function Billing() {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterQuantity, setFilterQuantity] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  // Items (stocks)
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

  // Billing quantities state (starts at 1)
  const [billingQuantities, setBillingQuantities] = useState(
    users.reduce((acc, user) => ({ ...acc, [user.id]: 1 }), {})
  );

  // Selected/Cart items
  const [cart, setCart] = useState([]);

  // Modal for adding item
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });

  const handleAddItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    const copyQuantities = { ...billingQuantities };
    delete copyQuantities[id];
    setBillingQuantities(copyQuantities);
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    const newId = users.length + 1;
    const item = {
      id: newId,
      name: newItem.name,
      quantity: Number(newItem.quantity),
      price: Number(newItem.price),
    };
    setUsers([...users, item]);
    setBillingQuantities({ ...billingQuantities, [newId]: 1 });
    setNewItem({ name: "", quantity: "", price: "" });
    setShowModal(false);
  };

  const handleUpdateCartItem = (id) => {
  const item = cart.find((c) => c.id === id);
  if (!item) return;

  // Ask user for new quantity (you can later replace with a proper modal)
  const newQty = parseInt(prompt(`Update quantity for ${item.name}:`, item.quantity));
  if (!newQty || newQty <= 0) return;

  const stockItem = users.find((u) => u.id === id);
  const unitPrice = Math.round(stockItem.price / stockItem.quantity);

  // Update cart
  const updatedCart = cart.map((c) =>
    c.id === id ? { ...c, quantity: newQty, totalPrice: unitPrice * newQty } : c
  );
  setCart(updatedCart);

  // Also update billing quantity state
  setBillingQuantities({ ...billingQuantities, [id]: newQty });
};

const handleCheckout = () => {
  if (cart.length === 0) return alert("Cart is empty!");

  // Update stock quantities
  const updatedUsers = users.map((u) => {
    const cartItem = cart.find((c) => c.id === u.id);
    if (cartItem) {
      return { ...u, quantity: u.quantity - cartItem.quantity };
    }
    return u;
  });

  setUsers(updatedUsers);
  setCart([]);
  alert("Checkout successful!");
};


  // Filter items based on search and dropdown
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesName = filterName ? user.name === filterName : true;

    let matchesQuantity = true;
    if (filterQuantity) {
      if (filterQuantity === "5-10") matchesQuantity = user.quantity >= 5 && user.quantity <= 10;
      if (filterQuantity === "11-20") matchesQuantity = user.quantity >= 11 && user.quantity <= 20;
      if (filterQuantity === "21-30") matchesQuantity = user.quantity >= 21 && user.quantity <= 30;
      if (filterQuantity === "31+") matchesQuantity = user.quantity >= 31;
    }

    let matchesPrice = true;
    if (filterPrice) {
      if (filterPrice === "0-9000") matchesPrice = user.price <= 9000;
      if (filterPrice === "9001-12000") matchesPrice = user.price >= 9001 && user.price <= 12000;
      if (filterPrice === "12001-15000") matchesPrice = user.price >= 12001 && user.price <= 15000;
      if (filterPrice === "15001+") matchesPrice = user.price >= 15001;
    }

    return matchesSearch && matchesName && matchesQuantity && matchesPrice;
  });


    // Handle adding item to cart
  const handleBuy = (user) => {
    const unitPrice = Math.round(user.price / user.quantity);
    const selectedQuantity = billingQuantities[user.id];

    const existingIndex = cart.findIndex((item) => item.id === user.id);
    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity = selectedQuantity;
      updatedCart[existingIndex].totalPrice = unitPrice * selectedQuantity;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          id: user.id,
          name: user.name,
          quantity: selectedQuantity,
          totalPrice: unitPrice * selectedQuantity,
        },
      ]);
    }
  };

  // Remove item from cart
  const handleRemoveCartItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Total items & price
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="hero">
      <nav>
        <Link to="/"><h2 className="logo">Cashier <span> Dashboard </span></h2></Link>
        <ul>
          <li><a href="/items">Items</a></li>
          <li><a href="/billing">Billing</a></li>
          <li><a href="/management">Manage</a></li>
          <li><a href="/receipt">Receipt</a></li>
        </ul>
        <Link to="/logout"><button type="button">Logout</button></Link>
      </nav>

      <div className="main-section">
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
              {users.map(user => (
                <option key={user.id} value={user.name}>
                  {user.name.split(" ")[0]} {/* Short version */}
                </option>
              ))}
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
                <th>Stocks</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const stockQuantity = user.quantity;
                const unitPrice = Math.round(user.price / stockQuantity);
                const billingQuantity = billingQuantities[user.id];
                const billingPrice = unitPrice * billingQuantity;

                return (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{stockQuantity}</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          onClick={() => {
                            if (billingQuantity > 1)
                              setBillingQuantities({ ...billingQuantities, [user.id]: billingQuantity - 1 });
                          }}
                        >
                          -
                        </button>
                        <span>{billingQuantity}</span>
                        <button
                          onClick={() => {
                            if (billingQuantity < stockQuantity)
                              setBillingQuantities({ ...billingQuantities, [user.id]: billingQuantity + 1 });
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{billingPrice.toLocaleString()}</td>
                    <td>
                        <button className="delete-btn" onClick={() => handleBuy(user)}>Buy</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>

            {/* Cart Section */}
      {cart.length > 0 && (
          <div className="cart-section">
          <h2 style={{ color: "white", marginBottom: "15px" }}>Selected Items</h2>
          <div className="table-scroll">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.totalPrice.toLocaleString()}</td>
                    <td>
                        <button className="delete-btn" onClick={() => handleRemoveCartItem(item.id)}>Delete</button>
                        <button className="delete-btn" onClick={() => handleUpdateCartItem(item.id)}>Update</button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "15px", color: "white", textAlign: "right", fontWeight: "bold" }}>
              Total Items: {totalItems} | Total Price: {totalPrice.toLocaleString()} LKR
              <button style={{ marginLeft: "20px" }} onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Item</h3>
            <form onSubmit={handleAddItemSubmit} className="add-item-form">
              <label>Name:</label>
              <input type="text" name="name" value={newItem.name} onChange={handleAddItemChange} required />
              <label>Quantity:</label>
              <input type="number" name="quantity" value={newItem.quantity} onChange={handleAddItemChange} required />
              <label>Price:</label>
              <input type="number" name="price" value={newItem.price} onChange={handleAddItemChange} required />

              <div className="modal-buttons">
                <button type="submit">Add Item</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
