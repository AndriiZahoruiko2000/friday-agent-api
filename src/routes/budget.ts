import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createBudgetController,
  deleteBudgetController,
  getBudgetByIdController,
  getBudgetController,
  updateBudgetController,
} from '../controllers/budgetController.js';

const router = Router();

router.get('/budget', authenticate, getBudgetController);
router.get('/budget/:budgetId', authenticate, getBudgetByIdController);
router.post('/budget', authenticate, createBudgetController);
router.patch('/budget/:budgetId', authenticate, updateBudgetController);
router.delete('/budget/:budgetId', authenticate, deleteBudgetController);

export default router;
