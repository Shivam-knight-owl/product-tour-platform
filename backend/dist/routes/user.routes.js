import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import prisma from '../lib/prisma.js';
const router = Router();
// Protected route - Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};
router.get('/profile', authenticateToken, getProfile);
export default router;
