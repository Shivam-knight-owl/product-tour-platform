"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { TourStep } from "@/lib/store/tours";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface TourStepsListProps {
  steps: TourStep[];
  onChange: (steps: TourStep[]) => void;
  onDelete?: (stepId: string) => void;
}

export function TourStepsList({ steps, onChange, onDelete }: TourStepsListProps) {
  const [items, setItems] = useState(steps);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        onChange(newItems);
        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <SortableItem id={step.id}>
                <div className="flex-1 p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {step.type === "video" ? "📹 Recording" : "🖼️ Image"}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {step.annotation}
                      </p>
                    </div>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </SortableItem>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
} 