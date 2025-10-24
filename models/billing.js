import mongoose from "mongoose";

const billingItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  itemName: String,
  unitPrice: Number,
  quantity: Number,
  totalPrice: Number
});

const billingSchema = new mongoose.Schema({
  items: [billingItemSchema],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Billing", billingSchema);
