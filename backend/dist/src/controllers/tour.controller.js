import { z } from 'zod';
import prisma from '../../prisma/prisma.js';
// Validation schemas
const tourSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    isPublic: z.boolean().default(false)
});
const updateTourSchema = tourSchema.partial();
// Helper function to check tour ownership
const isOwner = async (tourId, userId) => {
    const tour = await prisma.tour.findUnique({
        where: { id: tourId },
        select: { userId: true }
    });
    return tour?.userId === userId;
};
// Create a new tour
export const createTour = async (req, res) => {
    try {
        const validation = tourSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: validation.error.errors
            });
        }
        const tour = await prisma.tour.create({
            data: {
                ...validation.data,
                userId: req.user.userId
            }
        });
        res.status(201).json(tour);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating tour' });
    }
};
// Get all tours for logged-in user
export const getUserTours = async (req, res) => {
    try {
        const tours = await prisma.tour.findMany({
            where: {
                userId: req.user.userId
            },
            include: {
                steps: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });
        res.json(tours);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tours' });
    }
};
// Get single tour
export const getTour = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await prisma.tour.findUnique({
            where: { id },
            include: {
                steps: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        // Check if tour is public or user is owner
        if (!tour.isPublic && tour.userId !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(tour);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tour' });
    }
};
// Update tour
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ownership
        if (!(await isOwner(id, req.user.userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const validation = updateTourSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: validation.error.errors
            });
        }
        const tour = await prisma.tour.update({
            where: { id },
            data: validation.data
        });
        res.json(tour);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating tour' });
    }
};
// Delete tour
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ownership
        if (!(await isOwner(id, req.user.userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma.tour.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting tour' });
    }
};
