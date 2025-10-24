// backend/routes/billing.js
import express from "express";
import mongoose from "mongoose";
import Item from "../models/item.js";
import Billing from "../models/billing.js";
import PDFDocument from "pdfkit";

const router = express.Router();

// POST /api/billing
// Body: { items: [ { itemId, itemName, unitPrice, quantity, totalPrice } ], totalAmount }
router.post("/", async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  // Normalize input
  const normalized = items.map(i => ({
    itemId: i.itemId,
    itemName: i.itemName,
    unitPrice: Number(i.unitPrice),
    quantity: Number(i.quantity),
    totalPrice: Number(i.totalPrice)
  }));

  // Option B: Fallback (no transactions) - validate first then update sequentially
  try {
    // Validate stocks first (atomic check prior to updates)
    const insufficient = [];
    for (const it of normalized) {
      const dbItem = await Item.findById(it.itemId);
      if (!dbItem) {
        insufficient.push({ itemId: it.itemId, reason: "Not found" });
        continue;
      }
      if (dbItem.quantity < it.quantity) {
        insufficient.push({ itemId: it.itemId, requested: it.quantity, available: dbItem.quantity });
      }
    }

    if (insufficient.length > 0) {
      return res.status(400).json({ message: "Insufficient stock", errors: insufficient });
    }

    // All validated — perform updates
    const updatedItems = [];
    for (const it of normalized) {
      const updated = await Item.findByIdAndUpdate(it.itemId, { $inc: { quantity: -it.quantity } }, { new: true });
      updatedItems.push(updated);
    }

    // Create billing
    const billingDoc = new Billing({
      items: normalized.map(n => ({
        itemId: n.itemId,
        itemName: n.itemName,
        unitPrice: n.unitPrice,
        quantity: n.quantity,
        totalPrice: n.totalPrice
      })),
      totalAmount: Number(totalAmount)
    });
    const saved = await billingDoc.save();

    return res.status(201).json({ billing: saved, updatedItems });
  } catch (err) {
    console.error("Billing fallback error:", err);
    return res.status(500).json({ message: "Billing failed", error: err.message });
  }
});

// GET /api/billings - fetch all billings
router.get("/", async (req, res) => {
  try {
    const billings = await Billing.find().sort({ createdAt: -1 });
    res.json(billings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch billings" });
  }
});

// GET /api/billings/:id/pdf - generate PDF for a billing
router.get("/:id/pdf", async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) return res.status(404).json({ message: "Billing not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", `attachment; filename=receipt_${billing._id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Billing ID: ${billing._id}`);
    doc.text(`Date: ${billing.createdAt.toDateString()}`);
    doc.moveDown();

    // Table header
    doc.font("Helvetica-Bold");
    doc.text("Item Name", 50);
    doc.text("Unit Price", 200);
    doc.text("Quantity", 300);
    doc.text("Total", 400);
    doc.moveDown();
    doc.font("Helvetica");

    billing.items.forEach(item => {
      doc.text(item.itemName, 50);
      doc.text(item.unitPrice.toFixed(2), 200);
      doc.text(item.quantity, 300);
      doc.text(item.totalPrice.toFixed(2), 400);
      doc.moveDown();
    });

    doc.moveDown();
    doc.font("Helvetica-Bold").text(`Total Amount: ${billing.totalAmount.toFixed(2)}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

export default router;