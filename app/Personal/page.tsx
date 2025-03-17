"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/types";
import { Card } from "@/components/ui/card";
import { PieChart, BarChart, Activity, Film, ThumbsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenreChart } from "@/components/GenreChart";
import { PlatformChart } from "@/components/PlatformChart";
import { RecentlyWatched } from "@/components/RecentlyWatched";
import { SearchBar } from "@/components/SearchBar";
import { Layout } from "@/components/Layout";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showAddWatchedModal, setShowAddWatchedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields for adding a watched movie
  const [movieName, setMovieName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  // Hardcoded arrays for dropdowns (replace with real data if needed)
  const GENRES = ["Action", "Drama", "Comedy", "Thriller", "Romance", "Horror"];
  const LANGUAGES = ["English", "Spanish", "French", "German", "Japanese"];
  const PLATFORMS = ["Netflix", "Amazon Prime", "Disney+", "Hulu", "HBO Max"];

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchStats = async () => {
      setIsLoading(true);
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

  // Simulate backend submission
  const handleSubmitWatchedMovie = async () => {
    setIsSubmitting(true);
    try {
      // Replace with your real API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Submitted to backend:", {
        movieName,
        selectedGenre,
        selectedLanguage,
        selectedPlatform,
        rating,
        review,
      });

      // Reset fields
      setMovieName("");
      setSelectedGenre("");
      setSelectedLanguage("");
      setSelectedPlatform("");
      setRating("");
      setReview("");

      // Close modal
      setShowAddWatchedModal(false);
    } catch (error) {
      console.error("Error submitting:", error);
      // Handle error UI as needed
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
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
                <h3 className="text-2xl font-bold">
                  {stats?.platformBreakdown[0].platform}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <BarChart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Top Genre</p>
                <h3 className="text-2xl font-bold">
                  {stats?.favoriteGenres[0].genre}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs row + "Watched a Movie?" button on the right */}
{/* Tabs row + "Watched a Movie?" button on the right */}
<div className="flex justify-between items-center mb-4">
  <Tabs defaultValue="overview" className="space-y-4 w-full">
    {/* Row for the TabsList + Button on the right */}
    <div className="flex items-center justify-between w-full mb-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="genres">Genres</TabsTrigger>
        <TabsTrigger value="platforms">Platforms</TabsTrigger>
      </TabsList>
      <button
        onClick={() => setShowAddWatchedModal(true)}
        className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white font-bold py-2 px-4 rounded inline-flex items-center transition ml-auto"
      >
        Watched a Movie?
      </button>
    </div>

    {/* TabsContent sections */}
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

      {/* Add Watched Movie Modal */}
      {showAddWatchedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            {/* Close button */}
            <button
              onClick={() => setShowAddWatchedModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-2xl leading-none"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-600 to-purple-800 bg-clip-text">
              Add Watched Movie
            </h2>

            {isSubmitting ? (
              <div className="flex justify-center items-center py-8">
                <Loader />
              </div>
            ) : (
              <>
                {/* Movie Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Movie Name
                  </label>
                  <input
                    type="text"
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    placeholder="Enter the movie title"
                  />
                </div>

                {/* Genre */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    <option value="">Select Genre</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    <option value="">Select Language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Platform */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Platform
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    <option value="">Select Platform</option>
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Rating (out of 5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    placeholder="e.g., 4.5"
                  />
                </div>

                {/* Review */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Enter your thoughts on the movie..."
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleSubmitWatchedMovie}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-700 hover:to-purple-900 text-white font-bold py-2 px-4 rounded transition"
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}