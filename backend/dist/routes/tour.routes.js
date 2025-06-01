import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getTours, getTour, createTour, updateTour, deleteTour } from '../controllers/tour.controller.js';
const router = Router();
// Public routes (no authentication required)
router.get('/', getTours);
router.get('/:id', getTour);
// Protected routes (authentication required)
router.post('/', authenticateToken, createTour);
router.put('/:id', authenticateToken, updateTour);
router.delete('/:id', authenticateToken, deleteTour);
export default router;
