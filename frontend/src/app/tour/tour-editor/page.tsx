'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTours } from '@/lib/store/tours';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tour } from '@/lib/api';

interface TourFormData {
  title: string;
  description?: string;
  isPublic: boolean;
}

interface StepFormData {
  title: string;
  body?: string;
  imageUrl?: string;
}

interface StepWithId extends StepFormData {
  id: string;
}

export default function TourEditorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addTour, isLoading } = useTours();
  const [steps, setSteps] = useState<StepWithId[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TourFormData>({
    defaultValues: {
      isPublic: false,
    },
  });

  const {
    register: registerStep,
    handleSubmit: handleStepSubmit,
    reset: resetStepForm,
    formState: { errors: stepErrors },
  } = useForm<StepFormData>();

  const onAddStep = handleStepSubmit((data) => {
    const newStep = {
      ...data,
      id: Math.random().toString(36).substring(7),
    };
    setSteps((prev) => [...prev, newStep]);
    resetStepForm();
    setCurrentStep(null);
  });

  const onRemoveStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
    if (currentStep === index) {
      setCurrentStep(null);
    }
  };

  const onMoveStep = (index: number, direction: 'up' | 'down') => {
    setSteps((prev) => {
      const newSteps = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
      return newSteps;
    });
  };

  const onSubmit = async (data: TourFormData) => {
    if (steps.length === 0) {
      toast.error('Please add at least one step to the tour');
      return;
    }

    setIsSubmitting(true);
    try {
      const tour = await addTour({
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        steps: steps.map((step, index) => ({
          title: step.title,
          body: step.body,
          imageUrl: step.imageUrl,
          order: index,
        })),
      });
      toast.success('Tour created successfully');
      router.push(`/tour/${tour.id}`);
    } catch (error: any) {
      console.error('Error creating tour:', error);
      toast.error(error.response?.data?.message || 'Failed to create tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Unauthorized</h1>
          <p className="mt-2 text-muted-foreground">Please log in to create tours.</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/auth/login')}
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Create New Tour</h1>
          
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Enter tour title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Enter tour description"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isPublic')}
              id="isPublic"
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="isPublic" className="text-sm font-medium">
              Make this tour public
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Steps</h2>
          
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 text-lg font-medium">Add New Step</h3>
            <form onSubmit={onAddStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  {...registerStep('title', { required: 'Step title is required' })}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter step title"
                />
                {stepErrors.title && (
                  <p className="mt-1 text-sm text-destructive">{stepErrors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea
                  {...registerStep('body')}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter step content"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  {...registerStep('imageUrl')}
                  type="url"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter image URL"
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-start gap-4 rounded-lg border bg-card p-4"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    {step.body && <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>}
                    {step.imageUrl && (
                      <img
                        src={step.imageUrl}
                        alt={step.title}
                        className="mt-2 h-20 rounded object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveStep(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveStep(index, 'up')}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < steps.length - 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveStep(index, 'down')}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Tour...
              </>
            ) : (
              'Create Tour'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 