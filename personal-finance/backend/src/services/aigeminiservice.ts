import { Transaction, AnalysisResponse } from '../types/aigemini';
import * as fs from 'fs';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  safetySettings: safetySettings,
});

export class TransactionService {
  private static extractCategory(response: string): string {
    const categoryMatch = response.match(/category:?\s*([^\n.]+)/i);
    return categoryMatch ? categoryMatch[1].trim() : 'Uncategorized';
  }

  private static extractTrends(response: string): string[] {
    const trends = response.match(/trend[s]?:?\s*([^\n]+)/ig);
    return trends ? trends.map(t => t.replace(/^trends?:?\s*/i, '').trim()) : [];
  }

  private static extractAnomalies(response: string): string[] {
    const anomalies = response.match(/anomal[y|ies]+:?\s*([^\n]+)/ig);
    return anomalies ? anomalies.map(a => a.replace(/^anomal[y|ies]+:?\s*/i, '').trim()) : [];
  }

  private static extractFilters(response: string): string[] {
    const filters = response.match(/filter[s]?:?\s*([^\n]+)/ig);
    return filters ? filters.map(f => f.replace(/^filter[s]?:?\s*/i, '').trim()) : [];
  }

  public static async analyzeTransaction(transaction: Transaction): Promise<AnalysisResponse> {
    const prompt = `
      Analyze this transaction and provide:
      1. Suggested category
      2. Any notable trends
      3. Potential anomalies
      4. Relevant filters
      
      Transaction details:
      ${JSON.stringify(transaction, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return {
      suggestedCategory: this.extractCategory(response),
      trends: this.extractTrends(response),
      anomalies: this.extractAnomalies(response),
      suggestedFilters: this.extractFilters(response),
      parsedReceipt: transaction.items ? {
        merchant: transaction.merchant || 'Unknown',
        date: transaction.date,
        items: transaction.items,
        total: transaction.amount
      } : undefined
    };
  }

  public static async analyzeReceipt(filePath: string): Promise<{
    extractedText: string;
    suggestedCategory: string;
    merchant: string;
    amount: number;
    date: string;
    success: boolean;
    confidence: number;
  }> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      // Read the image file
      const imageData = fs.readFileSync(filePath);
      const base64Image = imageData.toString('base64');

      // Determine the MIME type based on file extension
      const ext = filePath.toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext.endsWith('.png')) mimeType = 'image/png';
      else if (ext.endsWith('.webp')) mimeType = 'image/webp';
      else if (ext.endsWith('.pdf')) mimeType = 'application/pdf';

      const prompt = `
        Analyze this receipt image and extract the following information in JSON format:
        {
          "merchant": "name of the store/restaurant",
          "amount": total amount as a number (in Indian Rupees if currency conversion needed),
          "date": "transaction date in YYYY-MM-DD format (extract from receipt date/time stamp)",
          "category": "expense category from this list: Food, Transport, Entertainment, Shopping, Bills, Healthcare, Education, Other",
          "extractedText": "full text content from the receipt",
          "items": ["list of items purchased if visible"]
        }

        IMPORTANT INSTRUCTIONS:
        1. DATE EXTRACTION: Look carefully for any date/time stamps on the receipt. Common formats include:
           - MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
           - Date: 08/31/2025, 31-Aug-2025, Aug 31 2025
           - Transaction time stamps
           Extract the actual transaction date, not today's date

        2. CATEGORY MAPPING: Map the merchant and items to one of these exact categories:
           - Food: Restaurants, cafes, grocery stores, food delivery, bars, bakeries, street food, tiffin services
           - Transport: Petrol pumps, parking, metro, bus, auto-rickshaw, taxi, Ola/Uber, train tickets
           - Entertainment: Movies, games, sports events, streaming services, concerts, books, recreation
           - Shopping: Clothing, electronics, general retail, online shopping, department stores, markets
           - Bills: Electricity, phone, internet, DTH, insurance, subscriptions, rent, maintenance
           - Healthcare: Pharmacy, doctor visits, medical services, health insurance, dental, lab tests
           - Education: Schools, courses, books, training, educational materials, tuition, coaching
           - Other: Anything that doesn't fit the above categories

        3. AMOUNT: Extract the final total amount paid (after tax), not subtotals

        If any information is unclear:
        - For merchant: use "Unknown" if not clear
        - For amount: use 0 if not clear
        - For date: use current date (${new Date().toISOString().split('T')[0]}) only if receipt date is completely unclear
        - For category: use "Other" if uncertain
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response.text();
      
      // Try to parse JSON response
      let parsedData;
      try {
        // Clean the response to extract JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        // Fallback to text extraction
        return {
          extractedText: response,
          suggestedCategory: 'Other',
          merchant: 'Unknown',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          success: true,
          confidence: 0.5
        };
      }

      return {
        extractedText: parsedData.extractedText || response,
        suggestedCategory: this.validateCategory(parsedData.category) || 'Other',
        merchant: parsedData.merchant || 'Unknown',
        amount: parseFloat(parsedData.amount) || 0,
        date: this.validateDate(parsedData.date) || new Date().toISOString().split('T')[0],
        success: true,
        confidence: 0.9
      };

    } catch (error) {
      console.error('Gemini receipt analysis error:', error);
      throw new Error(`Failed to analyze receipt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate and normalize category against our predefined list
  private static validateCategory(category: string): string {
    if (!category) return 'Other';
    
    const validCategories = [
      'Food', 'Transport', 'Entertainment', 'Shopping', 
      'Bills', 'Healthcare', 'Education', 'Other'
    ];
    
    // Check exact match
    if (validCategories.includes(category)) {
      return category;
    }
    
    // Try to match common variations
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('food') || categoryLower.includes('restaurant') || 
        categoryLower.includes('grocery') || categoryLower.includes('cafe') ||
        categoryLower.includes('dining') || categoryLower.includes('meal') ||
        categoryLower.includes('tiffin') || categoryLower.includes('sweet') ||
        categoryLower.includes('bakery') || categoryLower.includes('street food')) {
      return 'Food';
    }
    if (categoryLower.includes('transport') || categoryLower.includes('petrol') || 
        categoryLower.includes('fuel') || categoryLower.includes('parking') ||
        categoryLower.includes('uber') || categoryLower.includes('ola') || categoryLower.includes('taxi') ||
        categoryLower.includes('auto') || categoryLower.includes('metro') ||
        categoryLower.includes('bus') || categoryLower.includes('train')) {
      return 'Transport';
    }
    if (categoryLower.includes('entertainment') || categoryLower.includes('movie') || 
        categoryLower.includes('game') || categoryLower.includes('concert') ||
        categoryLower.includes('sport') || categoryLower.includes('book')) {
      return 'Entertainment';
    }
    if (categoryLower.includes('shopping') || categoryLower.includes('retail') || 
        categoryLower.includes('store') || categoryLower.includes('clothing') ||
        categoryLower.includes('electronics')) {
      return 'Shopping';
    }
    if (categoryLower.includes('bill') || categoryLower.includes('utility') || 
        categoryLower.includes('subscription') || categoryLower.includes('insurance') ||
        categoryLower.includes('rent') || categoryLower.includes('electricity') ||
        categoryLower.includes('phone') || categoryLower.includes('internet') ||
        categoryLower.includes('dth') || categoryLower.includes('maintenance')) {
      return 'Bills';
    }
    if (categoryLower.includes('health') || categoryLower.includes('medical') || 
        categoryLower.includes('pharmacy') || categoryLower.includes('doctor') ||
        categoryLower.includes('dental') || categoryLower.includes('hospital')) {
      return 'Healthcare';
    }
    if (categoryLower.includes('education') || categoryLower.includes('school') || 
        categoryLower.includes('course') || categoryLower.includes('tuition') ||
        categoryLower.includes('training') || categoryLower.includes('university')) {
      return 'Education';
    }
    
    return 'Other';
  }

  // Validate and normalize date format
  private static validateDate(dateString: string): string | null {
    if (!dateString) return null;
    
    try {
      // Try to parse the date
      const date = new Date(dateString);
      
      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        // Try different date formats
        const dateFormats = [
          /(\d{1,2})\/(\d{1,2})\/(\d{4})/,  // MM/DD/YYYY or DD/MM/YYYY
          /(\d{4})-(\d{1,2})-(\d{1,2})/,   // YYYY-MM-DD
          /(\d{1,2})-(\d{1,2})-(\d{4})/,   // DD-MM-YYYY
        ];
        
        for (const format of dateFormats) {
          const match = dateString.match(format);
          if (match) {
            const [, part1, part2, part3] = match;
            // Assume MM/DD/YYYY format for US receipts
            const testDate = new Date(parseInt(part3), parseInt(part1) - 1, parseInt(part2));
            if (!isNaN(testDate.getTime())) {
              return testDate.toISOString().split('T')[0];
            }
          }
        }
        return null;
      }
      
      // Return in YYYY-MM-DD format
      return date.toISOString().split('T')[0];
    } catch (error) {
      return null;
    }
  }
}