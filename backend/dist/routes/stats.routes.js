import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getDashboardStats } from '../controllers/stats.controller.js';
const router = Router();
// Protected routes
router.get('/dashboard', authenticateToken, getDashboardStats);
export default router;
