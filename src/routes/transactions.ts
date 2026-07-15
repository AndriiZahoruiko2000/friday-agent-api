import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createTransactionController,
  deleteTransactionController,
  getTransactionByIdController,
  getTransactionController,
  updateTransactionController,
} from '../controllers/transactionController.js';

const router = Router();

router.get('/transactions', authenticate, getTransactionController);
router.get(
  '/transactions/:transactionId',
  authenticate,
  getTransactionByIdController,
);
router.post('/transactions', authenticate, createTransactionController);
router.patch(
  '/transactions/:transactionId',
  authenticate,
  updateTransactionController,
);
router.delete(
  '/transactions/:transactionId',
  authenticate,
  deleteTransactionController,
);

export default router;
