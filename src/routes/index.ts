import { Router } from 'express';
import authRouter from './auth.js';
import budgetRoute from './budget.js';
import transactionRoute from './transactions.js';

const router = Router();

router.use('/auth', authRouter);
router.use(budgetRoute);
router.use(transactionRoute);

export default router;
