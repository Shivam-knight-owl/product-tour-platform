import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { Prisma } from '@prisma/client';

type TourStats = {
  id: string;
  title: string;
  views: number;
  isPublic: boolean;
  createdAt?: Date;
};

/**
 * Get dashboard statistics for the logged-in user
 * @route GET /api/stats/dashboard
 * @access Private
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // Fetch all stats in parallel for better performance
    const [
      totalTours, 
      publicTours, 
      privateTours, 
      totalViews,
      mostViewedTour,
      latestTour
    ] = await Promise.all([
      // Total tours count
      prisma.tour.count({ 
        where: { userId } 
      }),
      
      // Public tours count
      prisma.tour.count({ 
        where: { 
          userId, 
          isPublic: true 
        } 
      }),
      
      // Private tours count
      prisma.tour.count({ 
        where: { 
          userId, 
          isPublic: false 
        } 
      }),

      // Total views across all tours
      prisma.tour.aggregate({
        where: { userId },
        _sum: {
          views: true
        }
      }) as Promise<{ _sum: { views: number | null } }>,

      // Most viewed tour
      prisma.tour.findFirst({
        where: { userId },
        orderBy: [{ views: 'desc' }] as Prisma.TourOrderByWithRelationInput[],
        select: { 
          id: true, 
          title: true, 
          views: true, 
          isPublic: true 
        }
      }) as Promise<TourStats | null>,
      
      // Latest tour details
      prisma.tour.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { 
          id: true, 
          title: true, 
          createdAt: true, 
          isPublic: true,
          views: true
        }
      }) as Promise<TourStats | null>
    ]);

    // Return formatted stats
    res.status(200).json({
      totalTours,
      publicTours,
      privateTours,
      totalViews: totalViews._sum.views || 0,
      mostViewedTour,
      latestTour // Will be null if no tours exist
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 