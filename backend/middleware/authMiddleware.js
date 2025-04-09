import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware to Protect Routes (Verify Token)
export const protect = async (req, res, next) => {
    let token;
    
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find the user by ID to confirm they exist
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

// ✅ Middleware to Allow Only Admins
export const adminOnly = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized access." });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next();
};
