import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Fix CORS issue: Allow frontend requests
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle Preflight Requests

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/pdf", pdfRoutes);
app.use("/files", express.static("files"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
