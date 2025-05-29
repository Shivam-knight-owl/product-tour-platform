"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TourStep } from "./tour-step";
import { ScreenRecorder } from "./screen-recorder";
import { ImagePlus, Save } from "lucide-react";
import { useTours } from "@/lib/store/tours";
import type { Tour, TourStep as TourStepType } from "@/lib/store/tours";

interface Props {
  tour?: Tour;
}

export function TourEditor({ tour }: Props) {
  const router = useRouter();
  const { addTour, updateTour } = useTours();
  const [steps, setSteps] = useState<TourStepType[]>(tour?.steps || []);
  const [isRecording, setIsRecording] = useState(false);
  const [tourName, setTourName] = useState(tour?.name || "");
  const [isPublic, setIsPublic] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newStep: TourStepType = {
          id: Date.now().toString(),
          type: "image",
          content: reader.result as string,
          annotation: "",
        };
        setSteps([...steps, newStep]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecordingComplete = (videoUrl: string) => {
    const newStep: TourStepType = {
      id: Date.now().toString(),
      type: "video",
      content: videoUrl,
      annotation: "",
    };
    setSteps([...steps, newStep]);
    setIsRecording(false);
  };

  const handleAnnotationChange = (id: string, annotation: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, annotation } : step
      )
    );
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const handleSaveTour = () => {
    if (tour) {
      // Update existing tour
      updateTour(tour.id, {
        name: tourName,
        steps,
      });
    } else {
      // Create new tour
      addTour({
        name: tourName,
        steps,
        isPublic: isPublic
      });
    }
    router.push("/dashboard/tours");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tour ? "Edit Tour" : "Create New Tour"}
          </h1>
          <p className="text-muted-foreground">
            Add steps, record your screen, or upload images
          </p>
        </div>
        <Button
          onClick={handleSaveTour}
          disabled={!tourName || steps.length === 0}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save Tour
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tourName">Tour Name</Label>
            <Input
              id="tourName"
              placeholder="Enter tour name"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Make tour public</Label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            className="gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            Upload Image
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <ScreenRecorder
            isRecording={isRecording}
            onStart={() => setIsRecording(true)}
            onStop={handleRecordingComplete}
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={steps} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {steps.map((step) => (
              <TourStep
                key={step.id}
                step={step}
                onAnnotationChange={(annotation) =>
                  handleAnnotationChange(step.id, annotation)
                }
                onDelete={() => handleDeleteStep(step.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {steps.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Start by uploading an image or recording your screen
          </p>
        </div>
      )}
    </div>
  );
} 