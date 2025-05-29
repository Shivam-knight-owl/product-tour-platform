"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Edit, Trash } from "lucide-react";
import { useTours } from "@/lib/store/tours";
import type { Tour, TourStep } from "@/lib/store/tours";
import Image from "next/image";
import { useState } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function TourPage({ params }: PageProps) {
  const router = useRouter();
  const { getTourById, deleteTour } = useTours();
  const [isClient, setIsClient] = useState(false);
  const tour = getTourById(params.id);

  // Fix hydration mismatch
  useState(() => {
    setIsClient(true);
  });

  if (!tour) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tour not found</h1>
          <p className="text-muted-foreground">
            The tour you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handlePlay = () => {
    router.push(`/tour/${params.id}`);
  };

  const handleEdit = () => {
    router.push(`/dashboard/tours/${params.id}/edit`);
  };

  const handleDelete = () => {
    deleteTour(params.id);
    router.push("/dashboard/tours");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tour.name}</h1>
          <p className="text-muted-foreground">
            Last updated {tour.lastUpdated}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border bg-card p-6"
        >
          <h3 className="text-lg font-semibold">Total Views</h3>
          <p className="text-3xl font-bold">{tour.views}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border bg-card p-6"
        >
          <h3 className="text-lg font-semibold">Completion Rate</h3>
          <p className="text-3xl font-bold">{tour.completionRate}%</p>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handlePlay} className="gap-2">
          <Play className="h-4 w-4" />
          Play Tour
        </Button>
        <Button variant="outline" onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="gap-2 text-destructive"
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tour Steps</h2>
          <div className="space-y-4">
            {tour.steps.map((step: TourStep, index: number) => (
              <div
                key={step.id}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <div className="relative flex-shrink-0 w-24 h-24 rounded-lg border bg-muted overflow-hidden">
                  {step.type === "image" ? (
                    isClient && (
                      <Image
                        src={step.content}
                        alt={`Step ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <video
                        src={step.content}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Step {index + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.annotation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 