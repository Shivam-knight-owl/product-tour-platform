import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prisma.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Get user with role
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        // Add user info to request
        req.user = {
            userId: user.id,
            role: user.role
        };
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
