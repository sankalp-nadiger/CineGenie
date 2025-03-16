"use client";

import { useEffect, useState } from "react";
import { WatchEntry, DashboardStats } from "@/types";
import { Card } from "@/components/ui/card";
import { PieChart, BarChart, Activity, Film, Tv2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenreChart } from "@/components/GenreChart";
import { PlatformChart } from "@/components/PlatformChart";
import { RecentlyWatched } from "@/components/RecentlyWatched";
import { SearchBar } from "@/components/SearchBar";
import { Layout } from '@/components/Layout';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchStats = async () => {
      setIsLoading(true);
      // Simulated API response
      const mockStats: DashboardStats = {
        totalWatched: 42,
        favoriteGenres: [
          { genre: "Action", count: 15 },
          { genre: "Drama", count: 12 },
          { genre: "Comedy", count: 8 },
        ],
        platformBreakdown: [
          { platform: "Netflix", count: 20 },
          { platform: "Amazon Prime", count: 12 },
          { platform: "Disney+", count: 10 },
        ],
        recentlyWatched: [],
        averageRating: 4.2,
      };
      setStats(mockStats);
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
     <Layout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0">My Watch Dashboard</h1>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Film className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Watched</p>
              <h3 className="text-2xl font-bold">{stats?.totalWatched}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <h3 className="text-2xl font-bold">{stats?.averageRating}/5</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <PieChart className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Top Platform</p>
              <h3 className="text-2xl font-bold">{stats?.platformBreakdown[0].platform}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <BarChart className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Top Genre</p>
              <h3 className="text-2xl font-bold">{stats?.favoriteGenres[0].genre}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <RecentlyWatched entries={stats?.recentlyWatched || []} />
        </TabsContent>
        <TabsContent value="genres">
          <GenreChart data={stats?.favoriteGenres || []} />
        </TabsContent>
        <TabsContent value="platforms">
          <PlatformChart data={stats?.platformBreakdown || []} />
        </TabsContent>
      </Tabs>
    </div>
     </Layout>
  );
}