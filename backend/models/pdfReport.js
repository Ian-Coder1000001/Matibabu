
import mongoose from "mongoose";

const pdfReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    facility: String,
    patient: String,
    email: String,
    phone: String,
    pdf: String
}, { timestamps: true });

export const PdfReport = mongoose.model("PdfReport", pdfReportSchema);

