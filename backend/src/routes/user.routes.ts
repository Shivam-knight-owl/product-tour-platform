import { Router } from 'express';
import type { Request, Response, RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import prisma from '../lib/prisma.js';

const router = Router();

interface AuthRequest extends Request {
  user: {
    userId: string;
    role: UserRole;
  }
}

// Protected route - Get user profile
const getProfile: RequestHandler = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as AuthRequest).user.userId },
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

router.get('/profile', authenticateToken, getProfile);

export default router; 