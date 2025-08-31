import { Router } from 'express';
import { authMiddleware } from "../middleware/auth";
import { 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    getTransactions,
    uploadReceipt,
    uploadTransactionHistory 
} from '../controllers/transactionController';

const router = Router();

// All transaction routes require authentication
router.use(authMiddleware);

// Route to get all transactions
router.get('/', getTransactions);

// Route to add a new transaction
router.post('/', addTransaction);

// Route to update an existing transaction
router.put('/:id', updateTransaction);

// Route to delete a transaction
router.delete('/:id', deleteTransaction);

// Upload routes
router.post('/upload-receipt', uploadReceipt);
router.post('/upload-history', uploadTransactionHistory);

export default router;