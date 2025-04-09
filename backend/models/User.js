
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        unique: true,
        lowercase: true, // Store emails in lowercase
        trim: true      // Remove whitespace
    },
    password: String,
    role: { type: String, default: "user" }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre("save", async function (next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified("password")) return next();
    
    try {
        // Hash the password with cost factor 10
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

export const User = mongoose.model("User", userSchema);