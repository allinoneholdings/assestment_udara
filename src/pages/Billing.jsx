import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import Footer from "../components/Footer.jsx";

export default function Billing() {

  const API_BASE = "http://localhost:5000/api";
  const API_ITEMS = `${API_BASE}/items`;
  const API_BILLING = `${API_BASE}/billing`;

    // Items from backend
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterQuantity, setFilterQuantity] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  // Billing (in-memory)
  // cart: [{ id: itemId, name, unitPrice, quantity, totalPrice }]
  const [cart, setCart] = useState(() => {
    try {
      const raw = sessionStorage.getItem("billing_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // per-row billing quantities (for the item list controls)
  const [billingQuantities, setBillingQuantities] = useState(() => {
    try {
      const raw = sessionStorage.getItem("billing_quantities");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  const [toast, setToast] = useState(null);
  const [showCheckoutProcessing, setShowCheckoutProcessing] = useState(false);

  // fetch items
  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await fetch(API_ITEMS);
      const data = await res.json();
      // normalize: use { id: _id, itemName, quantity, price }
      const norm = data.map(d => ({
        id: d._id,
        itemName: d.itemName,
        quantity: d.quantity,
        price: d.price,
        createdAt: d.createdAt
      }));
      setItems(norm);

      // ensure billingQuantities has a default for each item (1)
      setBillingQuantities(prev => {
        const copy = { ...prev };
        norm.forEach(i => {
          if (copy[i.id] == null) copy[i.id] = 1;
        });
        sessionStorage.setItem("billing_quantities", JSON.stringify(copy));
        return copy;
      });
    } catch (err) {
      console.error("Failed to fetch items", err);
      showToast("error", "Failed to load items");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // keep cart & billingQuantities in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("billing_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem("billing_quantities", JSON.stringify(billingQuantities));
  }, [billingQuantities]);

  // small toast helper
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  // Derived values
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = cart.reduce((s, it) => s + it.totalPrice, 0);

  // Handlers
  const updateBillingQty = (itemId, newQty) => {
    if (newQty < 1) return;
    setBillingQuantities(prev => {
      const copy = { ...prev, [itemId]: newQty };
      return copy;
    });
  };

  // Add to cart or update existing cart item (only in memory)
  const handleBuy = (item) => {
    const unitPrice = item.price; // keep behaviour consistent
    const qty = billingQuantities[item.id] || 1;

    // Validate qty relative to stock
    if (qty > item.quantity) {
      showToast("error", `Requested ${qty} exceeds stock ${item.quantity}`);
      return;
    }

    setCart(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: qty,
          totalPrice: unitPrice * qty
        };
        return copy;
      } else {
        return [
          ...prev,
          { id: item.id, name: item.itemName, unitPrice, quantity: qty, totalPrice: unitPrice * qty }
        ];
      }
    });
    showToast("success", `Added to cart: ${item.itemName} x${qty}`);
  };

  const handleRemoveCartItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showToast("success", "Removed from cart");
  };

  const handleUpdateCartItem = (id) => {
    const existing = cart.find(c => c.id === id);
    if (!existing) return;
    // simple prompt update (keeps parity with your previous flow), but uses in-memory only
    const str = prompt(`Update quantity for ${existing.name}:`, existing.quantity);
    if (!str) return;
    const newQty = parseInt(str, 10);
    if (isNaN(newQty) || newQty <= 0) return showToast("error", "Invalid quantity");

    // Check stock
    const stock = items.find(i => i.id === id);
    if (stock && newQty > stock.quantity) {
      return showToast("error", `Requested ${newQty} exceeds stock ${stock.quantity}`);
    }

    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: newQty, totalPrice: c.unitPrice * newQty } : c));
    setBillingQuantities(prev => ({ ...prev, [id]: newQty }));
    showToast("success", "Cart updated");
  };

  // Checkout: call backend to create billing and update item stocks atomically (if possible)
  const handleCheckout = async () => {
    if (cart.length === 0) return showToast("error", "Cart is empty");
    setShowCheckoutProcessing(true);

    const payload = {
      items: cart.map(c => ({
        itemId: c.id,
        itemName: c.name,
        unitPrice: c.unitPrice,
        quantity: c.quantity,
        totalPrice: c.totalPrice
      })),
      totalAmount: totalPrice
    };

    try {
      const res = await fetch(API_BILLING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        // show detailed errors if provided
        if (data && data.errors) {
          const first = data.errors[0];
          showToast("error", `Stock issue: ${first.itemName || first.itemId || ""} (available ${first.available || first.reason || "?"})`);
        } else {
          showToast("error", data.message || "Checkout failed");
        }
        setShowCheckoutProcessing(false);
        return;
      }

      // Success — clear cart and refresh items
      showToast("success", "Checkout successful");
      setCart([]);
      setBillingQuantities({});
      sessionStorage.removeItem("billing_cart");
      sessionStorage.removeItem("billing_quantities");

      // Re-fetch items to get updated stocks
      await fetchItemsAfterCheckout();
    } catch (err) {
      console.error("Checkout error:", err);
      showToast("error", "Checkout failed");
    } finally {
      setShowCheckoutProcessing(false);
    }
  };

  // Helper to re-fetch items after checkout
  const fetchItemsAfterCheckout = async () => {
    try {
      const res = await fetch(API_ITEMS);
      const data = await res.json();
      const norm = data.map(d => ({
        id: d._id,
        itemName: d.itemName,
        quantity: d.quantity,
        price: d.price,
        createdAt: d.createdAt
      }));
      setItems(norm);
    } catch (err) {
      console.error("Failed to refresh items", err);
      showToast("error", "Failed to refresh items");
    }
  };

  // Filters & search
  const uniqueNames = Array.from(new Set(items.map(i => i.itemName))).sort();

  const filteredUsers = items.filter((user) => {
    const matchesSearch = user.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesName = filterName ? user.itemName === filterName : true;

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

            {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "success" : "error"}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.text}
        </div>
      )}

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
          </div>

            <div className="filter-row">
              <select onChange={(e) => setFilterName(e.target.value)} value={filterName}>
                <option value="">Name</option>
                {uniqueNames.map(n => <option key={n} value={n}>{n}</option>)}
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
                <th>Stocks</th>
                <th>Quantity</th>
                <th>Price (LKR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {filteredUsers.map((user) => {
                  const stockQuantity = user.quantity;
                  const unitPrice = user.price;
                  const billingQuantity = billingQuantities[user.id] || 1;
                  const billingPrice = unitPrice * billingQuantity;

                  return (
                    <tr key={user.id}>
                      <td>{user.itemName}</td>
                      <td>{stockQuantity}</td>
                      <td>
                        <div className="quantity-controls">
                          <button onClick={() => updateBillingQty(user.id, Math.max(1, billingQuantity - 1))}>-</button>
                          <span>{billingQuantity}</span>
                          <button onClick={() => updateBillingQty(user.id, Math.min(stockQuantity, billingQuantity + 1))}>+</button>
                        </div>
                      </td>
                      <td>{billingPrice.toLocaleString()}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleBuy(user)}>Buy</button>
                      </td>
                    </tr>
                  );
              })}
              {filteredUsers.length === 0 && <tr><td colSpan="5" style={{ color: "#fff" }}>No items found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      </div>

        {/* Cart Section */}
        {cart.length > 0 && (
          <div className="cart-section">
            <h2 style={{ color: "white", marginBottom: "15px" }}>Selected Items (Pending)</h2>
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
                  {cart.map(item => (
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
              <button style={{ marginLeft: "20px" }} disabled={showCheckoutProcessing} onClick={handleCheckout}>
                {showCheckoutProcessing ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
