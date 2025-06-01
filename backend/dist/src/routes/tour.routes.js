import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import { createTour, getUserTours, getTour, updateTour, deleteTour } from '../controllers/tour.controller.js';
const router = Router();
// Protected routes (require authentication and USER role)
router.post('/', authenticateToken, restrictTo([UserRole.USER]), createTour);
router.get('/', authenticateToken, restrictTo([UserRole.USER, UserRole.VIEWER]), getUserTours);
router.put('/:id', authenticateToken, restrictTo([UserRole.USER]), updateTour);
router.delete('/:id', authenticateToken, restrictTo([UserRole.USER]), deleteTour);
// Semi-public route (authentication optional)
router.get('/:id', getTour);
export default router;
