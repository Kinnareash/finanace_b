import { Router } from 'express';
import { TransactionController } from '../controllers/aigeminiController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/analyze', authMiddleware, TransactionController.analyzeTransaction);
router.post('/analyze-receipt', authMiddleware, TransactionController.analyzeReceipt);

export default router;