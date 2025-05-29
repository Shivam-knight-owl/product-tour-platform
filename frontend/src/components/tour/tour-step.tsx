"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface TourStepProps {
  step: {
    id: string;
    type: "image" | "video";
    content: string;
    annotation: string;
  };
  onAnnotationChange: (annotation: string) => void;
  onDelete: () => void;
}

export function TourStep({ step, onAnnotationChange, onDelete }: TourStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border bg-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 cursor-move items-center justify-center rounded-md border bg-background hover:bg-accent"
        >
          ⋮⋮
        </div>
        <div className="flex-1 space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            {step.type === "image" ? (
              <img
                src={step.content}
                alt="Tour step"
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                src={step.content}
                controls
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="space-y-2">
            <ReactQuill
              value={step.annotation}
              onChange={onAnnotationChange}
              placeholder="Add a description for this step..."
              theme="snow"
              modules={{
                toolbar: [
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                ],
              }}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive"
        >
          ×
        </Button>
      </div>
    </motion.div>
  );
} 