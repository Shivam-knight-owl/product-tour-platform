"use client";

import { useRouter } from "next/navigation";
import { TourEditor } from "@/components/tour/tour-editor";
import { useTours } from "@/lib/store/tours";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditTourPage({ params }: PageProps) {
  const router = useRouter();
  const { getTourById } = useTours();
  const tour = getTourById(params.id);

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

  return <TourEditor tour={tour} />;
} 