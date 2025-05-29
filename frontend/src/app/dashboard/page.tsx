"use client";

import { useTours } from "@/lib/store/tours";

export default function DashboardPage() {
  const { tours } = useTours();

  // Calculate dashboard statistics
  const activeTours = tours.length;
  const totalViews = tours.reduce((sum: number, tour: { views: number }) => sum + tour.views, 0);
  const averageCompletionRate = tours.length
    ? Math.round(
        tours.reduce((sum: number, tour: { completionRate: number }) => sum + tour.completionRate, 0) / tours.length
      )
    : 0;

  // Get recent tours, sorted by last updated
  const recentTours = [...tours]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your product tour dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Active Tours</h3>
          <p className="text-3xl font-bold">{activeTours}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Total Views</h3>
          <p className="text-3xl font-bold">{totalViews}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Avg. Completion Rate</h3>
          <p className="text-3xl font-bold">{averageCompletionRate}%</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        {recentTours.length > 0 ? (
          <div className="divide-y">
            {recentTours.map((tour) => (
              <div key={tour.id} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{tour.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {tour.lastUpdated}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{tour.views} views</p>
                  <p className="text-sm text-muted-foreground">
                    {tour.completionRate}% completion
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
} 