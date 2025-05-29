"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Clock, BarChart } from "lucide-react";
import { useTours } from "@/lib/store/tours";
import type { Tour } from "@/lib/store/tours";

export default function ToursPage() {
  const { tours } = useTours();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tours</h1>
          <p className="text-muted-foreground">
            Create and manage your product tours
          </p>
        </div>
        <Link href="/dashboard/tours/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Tour
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour: Tour, index: number) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative rounded-lg border bg-card p-6 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{tour.name}</h3>
              <Link href={`/dashboard/tours/${tour.id}`}>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{tour.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span>{tour.completionRate}% completion</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Updated {tour.lastUpdated}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="font-semibold mb-1">No tours yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first product tour
          </p>
          <Link href="/dashboard/tours/new">
            <Button>Create Tour</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 