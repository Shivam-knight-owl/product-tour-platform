import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPlaceholderImage } from '../utils';

export interface TourStep {
  id: string;
  type: 'image' | 'video';
  content: string;
  annotation: string;
}

export interface Tour {
  id: string;
  name: string;
  steps: TourStep[];
  views: number;
  completionRate: number;
  lastUpdated: string;
  isPublic: boolean;
}

interface ToursStore {
  tours: Tour[];
  addTour: (tour: Omit<Tour, 'id' | 'views' | 'completionRate' | 'lastUpdated'>) => void;
  updateTour: (id: string, tour: Partial<Tour>) => void;
  deleteTour: (id: string) => void;
  getTourById: (id: string) => Tour | undefined;
  getPublicTourById: (id: string) => Tour | undefined;
}

export const useTours = create<ToursStore>()(
  persist(
    (set, get) => ({
      tours: [
        {
          id: "1",
          name: "Getting Started Tour",
          steps: [
            {
              id: "1",
              type: "image",
              content: getPlaceholderImage(0),
              annotation: "This is the dashboard where you can manage all your tours.",
            },
            {
              id: "2",
              type: "video",
              content: "/mock-recording.webm",
              annotation: "Click here to create a new tour and start recording.",
            },
          ],
          views: 120,
          completionRate: 85,
          lastUpdated: "2024-02-28",
          isPublic: true,
        },
      ],
      addTour: (newTour) => {
        const tour: Tour = {
          ...newTour,
          id: Date.now().toString(),
          views: 0,
          completionRate: 0,
          lastUpdated: new Date().toISOString().split('T')[0],
          isPublic: newTour.isPublic ?? false,
        };
        set((state) => ({ tours: [...state.tours, tour] }));
      },
      updateTour: (id, updatedTour) => {
        set((state) => ({
          tours: state.tours.map((tour) =>
            tour.id === id
              ? {
                  ...tour,
                  ...updatedTour,
                  lastUpdated: new Date().toISOString().split('T')[0],
                }
              : tour
          ),
        }));
      },
      deleteTour: (id) => {
        set((state) => ({
          tours: state.tours.filter((tour) => tour.id !== id),
        }));
      },
      getTourById: (id) => {
        return get().tours.find((tour) => tour.id === id);
      },
      getPublicTourById: (id) => {
        return get().tours.find((tour) => tour.id === id && tour.isPublic);
      },
    }),
    {
      name: 'tours-storage',
    }
  )
); 