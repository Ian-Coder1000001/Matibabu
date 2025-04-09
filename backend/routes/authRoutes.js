import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ Error: JWT_SECRET is missing in environment variables.");
  process.exit(1);
}

// User Registration Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "Email already exists" });
      }
    
      // Create new user (password will be hashed by pre-save hook)
      const newUser = new User({ name, email, password, role: "user" });
      await newUser.save();
      res.json({ message: "User registered successfully" });
  } catch (error) {
      console.error("❌ Registration Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Registration Route
router.post("/admin-register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
      // Validate that email ends with @virtualcareadmin.com
      if (!email.endsWith("@virtualcareadmin.com")) {
          return res.status(400).json({ error: "Admin email must end with @virtualcareadmin.com" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "Email already exists" });
      }
    
      // Create new admin (password will be hashed by pre-save hook)
      const newAdmin = new User({ name, email, password, role: "admin" });
      await newAdmin.save();
      res.json({ message: "Admin registered successfully" });
  } catch (error) {
      console.error("❌ Admin Registration Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
      }
    
      // Generate JWT token with user ID and role
      const token = jwt.sign(
          { id: user._id, role: user.role },
          JWT_SECRET,
          { expiresIn: "1h" }
      );
    
      res.json({ token, role: user.role });
  } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Login Route
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  console.log("👉 Admin login attempt:", { email });
  try {
      // Convert email to lowercase for case-insensitive comparison
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
          console.log("❌ User not found:", email);
          return res.status(401).json({ error: "Invalid email or password" });
      }
    
      console.log("👉 User found:", {
          email: user.email,
          role: user.role,
          passwordLength: user.password?.length || 0
      });
    
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("👉 Password match:", isMatch);
    
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
      }
    
      // Check role after password verification
      if (user.role !== "admin") {
          console.log("❌ Not an admin:", email);
          return res.status(403).json({ error: "Access denied. Not an admin." });
      }
    
      // Generate JWT token with user ID and role
      const token = jwt.sign(
          { id: user._id, role: user.role },
          JWT_SECRET,
          { expiresIn: "1h" }
      );
    
      console.log("✅ Admin login successful:", email);
      res.json({ token, role: user.role });
  } catch (error) {
      console.error("❌ Admin login error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;