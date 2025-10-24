// backend/routes/items.js
import express from "express";
import Item from "../models/item.js"; 

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST create item
router.post("/", async (req, res) => {
  const { itemName, quantity, price } = req.body;
  if (!itemName || quantity == null || price == null) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newItem = new Item({ itemName, quantity, price });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ message: "Error creating item", error: err.message });
  }
});

// PUT update item
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { itemName, quantity, price } = req.body;
  try {
    const updated = await Item.findByIdAndUpdate(
      id,
      { itemName, quantity, price },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ message: "Error updating item", error: err.message });
  }
});

// PUT decrement stock by amount
router.put("/:id/decrement", async (req, res) => {
  try {
    const { decrementBy } = req.body;
    if (decrementBy == null) return res.status(400).json({ message: "decrementBy is required" });
    const updated = await Item.findOneAndUpdate(
      { _id: req.params.id, quantity: { $gte: decrementBy } },
      { $inc: { quantity: -decrementBy } },
      { new: true }
    );
    if (!updated) return res.status(400).json({ message: "Insufficient stock or item not found" });
    res.json(updated);
  } catch (err) {
    console.error("Decrement error:", err);
    res.status(500).json({ message: "Error decrementing item", error: err.message });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted", id: deleted._id });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Error deleting item", error: err.message });
  }
});

export default router;