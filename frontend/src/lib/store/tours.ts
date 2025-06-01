import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toursApi } from '@/lib/api';
import { toast } from 'sonner';
import type { Tour, TourStep } from '@/lib/api';

interface CreateTourInput {
  title: string;
  description?: string;
  isPublic: boolean;
  steps: {
    title: string;
    body?: string;
    imageUrl?: string;
    order: number;
  }[];
}

interface CreateStepInput {
  title: string;
  body?: string;
  imageUrl?: string;
  order: number;
}

interface ToursStore {
  tours: Tour[];
  isLoading: boolean;
  error: string | null;
  selectedTour: Tour | null;
  fetchTours: () => Promise<void>;
  addTour: (tour: CreateTourInput) => Promise<Tour>;
  updateTour: (id: string, tour: Partial<CreateTourInput>) => Promise<Tour>;
  deleteTour: (id: string) => Promise<void>;
  getTourById: (id: string) => Promise<Tour | undefined>;
  getPublicTourById: (id: string) => Promise<Tour | undefined>;
  addStep: (tourId: string, step: CreateStepInput) => Promise<TourStep>;
  updateStep: (tourId: string, stepId: string, step: Partial<CreateStepInput>) => Promise<TourStep>;
  deleteStep: (tourId: string, stepId: string) => Promise<void>;
  setSelectedTour: (tour: Tour | null) => void;
}

export const useTours = create<ToursStore>()(
  persist(
    (set, get) => ({
      tours: [],
      isLoading: false,
      error: null,
      selectedTour: null,

      setSelectedTour: (tour) => set({ selectedTour: tour }),

      fetchTours: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await toursApi.getAll();
          set({ tours: response.data.data, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching tours:', error);
          set({ error: error.response?.data?.message || 'Failed to fetch tours', isLoading: false });
          toast.error('Failed to fetch tours');
        }
      },

      addTour: async (newTour) => {
        set({ isLoading: true, error: null });
        try {
          const response = await toursApi.create(newTour);
          const tour = response.data.data;
          set((state) => ({ 
            tours: [...state.tours, tour],
            isLoading: false 
          }));
          toast.success('Tour created successfully');
          return tour;
        } catch (error: any) {
          console.error('Error creating tour:', error);
          set({ error: error.response?.data?.message || 'Failed to create tour', isLoading: false });
          toast.error('Failed to create tour');
          throw error;
        }
      },

      updateTour: async (id, updatedTour) => {
        set({ isLoading: true, error: null });
        try {
          const response = await toursApi.update(id, updatedTour);
          const tour = response.data.data;
          set((state) => ({
            tours: state.tours.map((t) => t.id === id ? tour : t),
            selectedTour: state.selectedTour?.id === id ? tour : state.selectedTour,
            isLoading: false
          }));
          toast.success('Tour updated successfully');
          return tour;
        } catch (error: any) {
          console.error('Error updating tour:', error);
          set({ error: error.response?.data?.message || 'Failed to update tour', isLoading: false });
          toast.error('Failed to update tour');
          throw error;
        }
      },

      deleteTour: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await toursApi.delete(id);
          set((state) => ({
            tours: state.tours.filter((tour) => tour.id !== id),
            selectedTour: state.selectedTour?.id === id ? null : state.selectedTour,
            isLoading: false
          }));
          toast.success('Tour deleted successfully');
        } catch (error: any) {
          console.error('Error deleting tour:', error);
          set({ error: error.response?.data?.message || 'Failed to delete tour', isLoading: false });
          toast.error('Failed to delete tour');
          throw error;
        }
      },

      getTourById: async (id) => {
        try {
          const response = await toursApi.getOne(id);
          const tour = response.data.data;
          set((state) => ({
            selectedTour: tour,
            tours: state.tours.map((t) => t.id === id ? tour : t)
          }));
          return tour;
        } catch (error: any) {
          console.error('Error fetching tour:', error);
          toast.error(error.response?.data?.message || 'Failed to fetch tour');
          return undefined;
        }
      },

      getPublicTourById: async (id) => {
        try {
          const response = await toursApi.getOne(id);
          const tour = response.data.data;
          if (!tour.isPublic) {
            toast.error('This tour is private');
            return undefined;
          }
          return tour;
        } catch (error: any) {
          console.error('Error fetching public tour:', error);
          toast.error(error.response?.data?.message || 'Failed to fetch tour');
          return undefined;
        }
      },

      addStep: async (tourId, step) => {
        set({ isLoading: true, error: null });
        try {
          const response = await toursApi.addStep(tourId, step);
          const newStep = response.data.data;
          set((state) => ({
            tours: state.tours.map((tour) =>
              tour.id === tourId
                ? { ...tour, steps: [...tour.steps, newStep] }
                : tour
            ),
            selectedTour: state.selectedTour?.id === tourId
              ? { ...state.selectedTour, steps: [...state.selectedTour.steps, newStep] }
              : state.selectedTour,
            isLoading: false
          }));
          toast.success('Step added successfully');
          return newStep;
        } catch (error: any) {
          console.error('Error adding step:', error);
          set({ error: error.response?.data?.message || 'Failed to add step', isLoading: false });
          toast.error('Failed to add step');
          throw error;
        }
      },

      updateStep: async (tourId, stepId, updatedStep) => {
        set({ isLoading: true, error: null });
        try {
          const response = await toursApi.updateStep(tourId, stepId, updatedStep);
          const step = response.data.data;
          set((state) => ({
            tours: state.tours.map((tour) =>
              tour.id === tourId
                ? {
                    ...tour,
                    steps: tour.steps.map((s) =>
                      s.id === stepId ? step : s
                    ),
                  }
                : tour
            ),
            selectedTour: state.selectedTour?.id === tourId
              ? {
                  ...state.selectedTour,
                  steps: state.selectedTour.steps.map((s) =>
                    s.id === stepId ? step : s
                  ),
                }
              : state.selectedTour,
            isLoading: false
          }));
          toast.success('Step updated successfully');
          return step;
        } catch (error: any) {
          console.error('Error updating step:', error);
          set({ error: error.response?.data?.message || 'Failed to update step', isLoading: false });
          toast.error('Failed to update step');
          throw error;
        }
      },

      deleteStep: async (tourId, stepId) => {
        set({ isLoading: true, error: null });
        try {
          await toursApi.deleteStep(tourId, stepId);
          set((state) => ({
            tours: state.tours.map((tour) =>
              tour.id === tourId
                ? {
                    ...tour,
                    steps: tour.steps.filter((step) => step.id !== stepId),
                  }
                : tour
            ),
            selectedTour: state.selectedTour?.id === tourId
              ? {
                  ...state.selectedTour,
                  steps: state.selectedTour.steps.filter((step) => step.id !== stepId),
                }
              : state.selectedTour,
            isLoading: false
          }));
          toast.success('Step deleted successfully');
        } catch (error: any) {
          console.error('Error deleting step:', error);
          set({ error: error.response?.data?.message || 'Failed to delete step', isLoading: false });
          toast.error('Failed to delete step');
          throw error;
        }
      },
    }),
    {
      name: 'tours-storage',
      partialize: (state) => ({ tours: state.tours }),
    }
  )
); 