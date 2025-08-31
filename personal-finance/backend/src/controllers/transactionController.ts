import { Request, Response } from "express";
import multer from "multer";
import Transaction from "../models/Transaction";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { type, category, amount, date, description } = req.body;

    const transaction = new Transaction({ user: userId, type, category, amount, date, description });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Handle receipt upload and extract text
export const uploadReceipt = [
  upload.single("receipt"),
  async (req: Request, res: Response): Promise<void> => {
    let filePath: string | undefined;
    
    try {
      filePath = req.file?.path;
      if (!filePath) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        res.status(400).json({ message: "Uploaded file not found" });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'];
      const allowedPdfTypes = ['.pdf'];

      if (allowedPdfTypes.includes(ext)) {
        // Extract text from PDF
        try {
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await pdfParse(dataBuffer);
          res.json({ 
            extractedText: pdfData.text || "No text could be extracted from the PDF",
            success: true 
          });
        } catch (pdfError) {
          console.error("PDF parsing error:", pdfError);
          res.status(400).json({ 
            message: "Failed to extract text from PDF. Please ensure the PDF contains readable text.",
            extractedText: "",
            success: false 
          });
        }
      } else if (allowedImageTypes.includes(ext)) {
        // Extract text from image using OCR
        try {
          const result = await Tesseract.recognize(filePath, "eng", {
            logger: m => {
              if (m.status === 'recognizing text') {
                console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
              }
            }
          });
          
          res.json({ 
            extractedText: result.data.text || "No text could be extracted from the image",
            confidence: result.data.confidence,
            success: true 
          });
        } catch (ocrError) {
          console.error("OCR processing error:", ocrError);
          res.status(400).json({ 
            message: "Failed to extract text from image. Please ensure the image is clear and contains readable text.",
            extractedText: "",
            success: false 
          });
        }
      } else {
        res.status(400).json({ 
          message: `Unsupported file type: ${ext}. Please upload a PDF or image file (JPG, PNG, etc.)`,
          success: false 
        });
      }

    } catch (error) {
      console.error("Receipt upload error:", error);
      res.status(500).json({ 
        message: "Error processing receipt upload", 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      });
    } finally {
      // Always try to delete the uploaded file
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log("Temporary file cleaned up:", filePath);
        } catch (cleanupError) {
          console.error("Failed to cleanup temporary file:", cleanupError);
        }
      }
    }
  },
];

// ✅ Handle transaction history from PDF (tabular format)
export const uploadTransactionHistory = [
  upload.single("history"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const filePath = req.file?.path;
      if (!filePath) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      // Example parsing logic: split by new lines
      const lines = pdfData.text.split("\n");
      const transactions: any[] = [];

      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 4) {
          transactions.push({
            date: parts[0],
            category: parts[1],
            amount: parseFloat(parts[2]),
            description: parts.slice(3).join(" "),
          });
        }
      });

      fs.unlinkSync(filePath);
      res.json({ extractedTransactions: transactions });
    } catch (error) {
      res.status(500).json({ message: "Error processing transaction history PDF", error });
    }
  },
];

// ✅ Update an existing transaction
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { type, category, amount, date, description } = req.body;

    // Find transaction and check ownership
    const transaction = await Transaction.findOne({ _id: id, user: userId });
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    // Update fields
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.amount = amount || transaction.amount;
    transaction.date = date || transaction.date;
    transaction.description = description || transaction.description;

    await transaction.save();
    res.json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete a transaction
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
