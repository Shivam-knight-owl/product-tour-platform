"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTours } from '@/lib/store/tours';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import type { Tour } from '@/lib/api';

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params?.id as string;
  const { user } = useAuth();
  const { getTourById, getPublicTourById, isLoading } = useTours();
  const [tour, setTour] = useState<Tour | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const tourData = user 
          ? await getTourById(tourId)
          : await getPublicTourById(tourId);
        
        if (tourData) {
          setTour(tourData);
          setError(null);
        } else {
          setError('Tour not found or not accessible');
        }
      } catch (error: any) {
        console.error('Error fetching tour:', error);
        setError(error.response?.data?.message || 'Failed to load tour');
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId, user, getTourById, getPublicTourById]);

  const currentStep = tour?.steps[currentStepIndex];
  const isLastStep = currentStepIndex === (tour?.steps.length ?? 0) - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    if (tour?.isPublic) {
      window.location.href = '/tours';
    } else {
      window.location.href = '/dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold text-destructive">
          {error || 'Tour not found'}
        </h1>
        <Button onClick={handleClose}>
          Return to {tour?.isPublic ? 'Tours' : 'Dashboard'}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black/50">
      <div className="container relative mx-auto flex max-w-4xl flex-col items-center justify-center rounded-lg bg-background p-8 shadow-lg">
        <Button
          variant="ghost"
          className="absolute right-4 top-4"
          onClick={handleClose}
        >
          ✕
        </Button>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">{tour.title}</h1>
          {tour.description && (
            <p className="text-muted-foreground">{tour.description}</p>
          )}
        </div>

        <div className="relative min-h-[300px] w-full">
          <AnimatePresence mode="wait">
            {currentStep && (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-semibold">{currentStep.title}</h2>
                {currentStep.body && <p>{currentStep.body}</p>}
                {currentStep.imageUrl && (
                  <img
                    src={currentStep.imageUrl}
                    alt={currentStep.title}
                    className="mx-auto max-h-[400px] rounded-lg object-contain"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex w-full items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={isFirstStep}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {tour.steps.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={isLastStep}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 