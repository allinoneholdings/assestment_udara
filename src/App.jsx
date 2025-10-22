import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import Login from './pages/login.jsx';
import About from './pages/About.jsx';
import Cashier from './pages/Cashier.jsx';
import Admin from './pages/Admin.jsx';
import Manager from './pages/Manager.jsx';
import Item from './pages/Item.jsx';
import Billing from './pages/billing.jsx';
import Management from './pages/Management.jsx';
import Receipt from './pages/Receipt.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/items" element={<Item />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/management" element={<Management />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </Router>
  );
}
export default App
