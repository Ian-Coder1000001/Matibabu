import express from "express";
import multer from "multer";
import { PdfReport } from "../models/pdfReport.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./files"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ User Uploads a PDF (Only logged-in users can upload)
router.post("/upload", protect, upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const newPdf = new PdfReport({
            userId: req.user.id,
            facility: req.body.facility,
            patient: req.body.patient,
            email: req.body.email,
            phone: req.body.phone,
            pdf: req.file.filename,
        });

        await newPdf.save();
        res.json({ message: "File uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: "Upload failed" });
    }
});

// ✅ User Retrieves Their Uploaded PDFs (Only logged-in users)
router.get("/user", protect, async (req, res) => {
    try {
        const userReports = await PdfReport.find({ userId: req.user.id });
        res.json({ data: userReports });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve files" });
    }
});

// ✅ Admin Retrieves All Reports (Only admins can access)
router.get("/admin/reports", protect, adminOnly, async (req, res) => {
    try {
        const reports = await PdfReport.aggregate([
            { $group: { _id: { month: { $month: "$createdAt" } }, submissions: { $push: "$$ROOT" } } }
        ]);
        res.json({ data: reports });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve reports" });
    }
});

export default router;
