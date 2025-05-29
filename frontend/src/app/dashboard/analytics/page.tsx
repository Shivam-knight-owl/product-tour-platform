"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTours } from "@/lib/store/tours";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Eye, ArrowUpRight, Users, Target } from "lucide-react";

export default function AnalyticsPage() {
  const { tours } = useTours();

  // Calculate total views and average completion rate
  const totalViews = tours.reduce((sum, tour) => sum + tour.views, 0);
  const avgCompletionRate = Math.round(
    tours.reduce((sum, tour) => sum + tour.completionRate, 0) / (tours.length || 1)
  );

  // Sort tours by views for popular tours section
  const popularTours = [...tours]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Sort tours by completion rate for most effective tours
  const effectiveTours = [...tours]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);

  // Prepare data for the chart
  const chartData = tours.map((tour) => ({
    name: tour.name,
    views: tour.views,
    completionRate: tour.completionRate,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your product tours performance and engagement
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Across all product tours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Completion Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Users completing tours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tours.length}</div>
            <p className="text-xs text-muted-foreground">
              Active product tours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Performance</CardTitle>
          <CardDescription>
            Views and completion rates for all tours
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="views"
                fill="#2563eb"
                name="Views"
              />
              <Bar
                yAxisId="right"
                dataKey="completionRate"
                fill="#16a34a"
                name="Completion Rate (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Popular Tours */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Tours</CardTitle>
            <CardDescription>Most viewed product tours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularTours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/dashboard/tours/${tour.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{tour.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tour.views} views
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Effective Tours */}
        <Card>
          <CardHeader>
            <CardTitle>Most Effective Tours</CardTitle>
            <CardDescription>
              Tours with highest completion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {effectiveTours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/dashboard/tours/${tour.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{tour.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tour.completionRate}% completion rate
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 