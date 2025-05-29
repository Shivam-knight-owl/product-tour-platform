"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { useTours } from "@/lib/store/tours";
import { getPlaceholderImage } from "@/lib/utils";
import Image from "next/image";

interface PageProps {
  params: {
    id: string;
  };
}

export default function TourViewPage({ params }: PageProps) {
  const router = useRouter();
  const { getPublicTourById, updateTour } = useTours();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const tour = getPublicTourById(params.id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Tour Not Available</h1>
          <p className="text-muted-foreground">
            This tour is either private or doesn't exist.
          </p>
          <Button onClick={() => router.push("/dashboard/tours")}>
            View Available Tours
          </Button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      // Update tour statistics
      updateTour(tour.id, {
        views: tour.views + 1,
        completionRate: Math.round(((tour.completionRate * tour.views) + 100) / (tour.views + 1)),
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    router.push("/dashboard/tours");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 p-8 max-w-md"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Tour Complete!</h1>
          <p className="text-muted-foreground">
            You've successfully completed the {tour.name} tour.
          </p>
          <Button onClick={handleFinish}>Finish</Button>
        </motion.div>
      </div>
    );
  }

  const currentTourStep = tour.steps[currentStep];
  const content = currentTourStep.content || getPlaceholderImage(currentStep);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / tour.steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 container max-w-6xl mx-auto py-8 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Step content */}
            <div className="aspect-video relative rounded-lg border overflow-hidden bg-muted">
              {currentTourStep.type === "image" ? (
                isClient && (
                  <Image
                    src={content}
                    alt={`Step ${currentStep + 1}`}
                    fill
                    className="object-contain"
                  />
                )
              ) : (
                isClient && (
                  <video
                    src={content}
                    controls
                    className="w-full h-full"
                    poster={getPlaceholderImage(currentStep)}
                  />
                )
              )}
            </div>

            {/* Annotation */}
            <div className="bg-card rounded-lg border p-6">
              <p className="text-lg">{currentTourStep.annotation}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {tour.steps.length}
          </div>
          <Button onClick={handleNext} className="gap-2">
            {currentStep === tour.steps.length - 1 ? (
              "Complete Tour"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 