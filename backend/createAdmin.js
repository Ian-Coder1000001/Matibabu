

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });
    
    if (adminExists) {
      console.log("✅ Admin user already exists with email:", adminExists.email);
    } else {
      // Create admin user
      const adminUser = new User({
        name: "Admin User",
        email: "admin@example.com", // Consistent admin email
        password: "admin123",       // Consistent admin password
        role: "admin"
      });
      
      await adminUser.save();
      console.log("✅ Admin user created successfully!");
      console.log("Email: admin@example.com");
      console.log("Password: admin123");
    }
    
    mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

createAdminUser();