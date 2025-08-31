import { Request, Response } from 'express';
import { TransactionService } from '../services/aigeminiservice';
import { Transaction } from '../types/aigemini';
import multer from 'multer';
import * as fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|pdf/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  }
});

export class TransactionController {
  public static async analyzeTransaction(req: Request, res: Response): Promise<void> {
    try {
      const transaction: Transaction = req.body.transaction;
      const analysis = await TransactionService.analyzeTransaction(transaction);
      res.json(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze transaction' });
    }
  }

  public static analyzeReceipt = [
    upload.single('receipt'),
    async (req: Request, res: Response): Promise<void> => {
      let filePath: string | undefined;
      
      try {
        filePath = req.file?.path;
        if (!filePath) {
          res.status(400).json({ 
            message: "No file uploaded", 
            success: false 
          });
          return;
        }

        // Use Gemini to analyze the receipt
        const analysis = await TransactionService.analyzeReceipt(filePath);
        
        res.json({
          ...analysis,
          message: 'Receipt analyzed successfully'
        });

      } catch (error) {
        console.error('Receipt analysis error:', error);
        res.status(500).json({ 
          message: error instanceof Error ? error.message : 'Failed to analyze receipt',
          extractedText: '',
          success: false,
          confidence: 0
        });
      } finally {
        // Clean up uploaded file
        if (filePath && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('Temporary file cleaned up:', filePath);
          } catch (cleanupError) {
            console.error('Failed to cleanup temporary file:', cleanupError);
          }
        }
      }
    }
  ];
}