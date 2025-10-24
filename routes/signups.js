import express from "express";
import bcrypt from "bcrypt";
import Signup from "../models/signup.js";

const router = express.Router();

// Signup route
router.post("/", async (req, res) => {
    const { name, age, birthday, role, password } = req.body;

    // Validate request
    if (!name || !age || !birthday || !role || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await Signup.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Signup({
            name,
            age,
            birthday,
            role,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ GET all users
router.get("/", async (req, res) => {
  try {
    const users = await Signup.find().sort({ createdAt: -1 }); // newest first
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await Signup.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;