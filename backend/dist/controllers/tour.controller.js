import { z } from 'zod';
import prisma from '../lib/prisma.js';
// Validation schemas
const stepSchema = z.object({
    title: z.string().min(1, 'Step title is required'),
    body: z.string().optional(),
    imageUrl: z.string().url().optional(),
    order: z.number().int().min(0)
});
const tourSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    isPublic: z.boolean().default(false)
});
const updateTourSchema = tourSchema.partial();
const updateStepSchema = stepSchema.partial();
// Helper function to check tour ownership
const isOwner = async (tourId, userId) => {
    const tour = await prisma.tour.findUnique({
        where: { id: tourId },
        select: { userId: true }
    });
    return tour?.userId === userId;
};
// Get all tours (public or user-specific)
export const getTours = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const sort = req.query.sort || 'createdAt';
        // Determine sort order
        const orderBy = sort === 'views'
            ? { views: 'desc' }
            : { createdAt: 'desc' };
        // If authenticated, return user's tours
        if (userId) {
            const tours = await prisma.tour.findMany({
                where: {
                    userId: userId
                },
                include: {
                    steps: {
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy
            });
            return res.json(tours);
        }
        // If not authenticated, return only public tours
        const publicTours = await prisma.tour.findMany({
            where: {
                isPublic: true
            },
            include: {
                steps: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            orderBy
        });
        res.json(publicTours);
    }
    catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ message: 'Error fetching tours' });
    }
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
            },
            include: {
                steps: true
            }
        });
        res.status(201).json(tour);
    }
    catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ message: 'Error creating tour' });
    }
};
// Get single tour
export const getTour = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
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
        // Check access permissions and handle view counting
        if (tour.isPublic || tour.userId === userId) {
            // Increment views only for public tours when viewed by non-owners
            if (tour.isPublic && tour.userId !== userId) {
                await prisma.tour.update({
                    where: { id },
                    data: { views: { increment: 1 } }
                });
                // Update the view count in the response
                tour.views += 1;
            }
            return res.json(tour);
        }
        return res.status(403).json({
            message: 'Access denied. This tour is private.'
        });
    }
    catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({ message: 'Error fetching tour' });
    }
};
// Update tour
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        // Validate ownership
        if (!(await isOwner(id, userId))) {
            return res.status(403).json({
                message: 'Access denied. You can only update your own tours.'
            });
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
            data: validation.data,
            include: {
                steps: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });
        res.json(tour);
    }
    catch (error) {
        console.error('Error updating tour:', error);
        res.status(500).json({ message: 'Error updating tour' });
    }
};
// Delete tour
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        // Validate ownership
        if (!(await isOwner(id, userId))) {
            return res.status(403).json({
                message: 'Access denied. You can only delete your own tours.'
            });
        }
        await prisma.tour.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting tour:', error);
        res.status(500).json({ message: 'Error deleting tour' });
    }
};
// Add a new step to a tour
export const addStep = async (req, res) => {
    try {
        const { tourId } = req.params;
        // Validate ownership
        if (!(await isOwner(tourId, req.user.userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const validation = stepSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: validation.error.errors
            });
        }
        const step = await prisma.step.create({
            data: {
                ...validation.data,
                tourId
            }
        });
        res.status(201).json(step);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding step' });
    }
};
// Update a specific step
export const updateStep = async (req, res) => {
    try {
        const { tourId, stepId } = req.params;
        // Validate ownership
        if (!(await isOwner(tourId, req.user.userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const validation = updateStepSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Invalid input',
                errors: validation.error.errors
            });
        }
        const step = await prisma.step.update({
            where: {
                id: stepId,
                tourId // Ensure step belongs to the tour
            },
            data: validation.data
        });
        res.json(step);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating step' });
    }
};
// Delete a specific step
export const deleteStep = async (req, res) => {
    try {
        const { tourId, stepId } = req.params;
        // Validate ownership
        if (!(await isOwner(tourId, req.user.userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma.step.delete({
            where: {
                id: stepId,
                tourId // Ensure step belongs to the tour
            }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting step' });
    }
};
