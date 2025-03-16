"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, PlayCircle, Tv, BarChart3, ChevronRight, Clock, MessageCircle } from 'lucide-react';

// Types
interface MediaItem {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  reviewCount: number;
  type: 'movie' | 'series';
  recentPopularityScore: number;
  genres: string[];
}

const TrendingPage = () => {
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series'>('all');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    const fetchTrendingItems = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch from your backend API
        // For this example, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data representing trending items based on review scores
        const mockTrendingItems: MediaItem[] = [
          {
            id: 1,
            title: "Dune: Part Two",
            posterPath: "/gvMviyl3YgUJsdT2thw3FJ2iK2.jpg",
            releaseDate: "2024-02-28",
            voteAverage: 8.9,
            reviewCount: 1245,
            type: "movie",
            recentPopularityScore: 98.5,
            genres: ["Sci-Fi", "Adventure"]
          },
          {
            id: 2,
            title: "Kingdom of the Planet of the Apes",
            posterPath: "/ckCyHBTG4cEeWXtLnQWXgqvExNu.jpg",
            releaseDate: "2024-05-10",
            voteAverage: 7.8,
            reviewCount: 872,
            type: "movie",
            recentPopularityScore: 92.3,
            genres: ["Sci-Fi", "Action"]
          },
          {
            id: 3,
            title: "The Penguin",
            posterPath: "/gPbM0MK8CP8A174rmUwGsADNYKD.jpg",
            releaseDate: "2024-09-19",
            voteAverage: 8.7,
            reviewCount: 1028,
            type: "series",
            recentPopularityScore: 96.7,
            genres: ["Crime", "Drama"]
          },
          {
            id: 4,
            title: "Shogun",
            posterPath: "/zFUYbGyt98KCoEQeHGFfKLCYr1g.jpg",
            releaseDate: "2024-02-27",
            voteAverage: 9.0,
            reviewCount: 1842,
            type: "series",
            recentPopularityScore: 99.4,
            genres: ["Drama", "History"]
          },
          {
            id: 5,
            title: "Deadpool & Wolverine",
            posterPath: "/jXpYmGYmGMxhNnKhxBNQZZ0lqU9.jpg",
            releaseDate: "2024-07-26",
            voteAverage: 8.5,
            reviewCount: 2156,
            type: "movie",
            recentPopularityScore: 97.1,
            genres: ["Action", "Comedy"]
          },
          {
            id: 6, 
            title: "The Acolyte",
            posterPath: "/w0CTytOiKeGnY3RFI1HF4UMrCPM.jpg",
            releaseDate: "2024-06-04",
            voteAverage: 7.6,
            reviewCount: 964,
            type: "series",
            recentPopularityScore: 89.2,
            genres: ["Sci-Fi", "Action"]
          },
          {
            id: 7,
            title: "Challengers",
            posterPath: "/yHXLBW8JGvbUcnI4Y9ddiKWQvv9.jpg",
            releaseDate: "2024-04-26",
            voteAverage: 7.7,
            reviewCount: 745,
            type: "movie",
            recentPopularityScore: 83.9,
            genres: ["Drama", "Romance"]
          },
          {
            id: 8,
            title: "House of the Dragon",
            posterPath: "/lm7rUPfQ2cJ14noWESH34XzXmex.jpg",
            releaseDate: "2024-06-16",
            voteAverage: 8.4,
            reviewCount: 1875,
            type: "series",
            recentPopularityScore: 95.8,
            genres: ["Drama", "Fantasy"]
          },
          {
            id: 9,
            title: "Civil War",
            posterPath: "/4MCKNAc6AbWjEsM2h9Zu5gpYPjf.jpg",
            releaseDate: "2024-04-12",
            voteAverage: 7.9,
            reviewCount: 812,
            type: "movie",
            recentPopularityScore: 85.6,
            genres: ["Action", "Thriller"]
          },
          {
            id: 10,
            title: "Fallout",
            posterPath: "/pF3UVPykKIO3PyZ2XwqcEhhm5CR.jpg",
            releaseDate: "2024-04-11",
            voteAverage: 8.6,
            reviewCount: 1503,
            type: "series",
            recentPopularityScore: 94.5,
            genres: ["Sci-Fi", "Adventure"]
          }
        ];
        
        // Filter and sort based on activeTab and timeRange
        // In a real app, these parameters would be sent to your backend API
        let filteredItems = [...mockTrendingItems];
        
        if (activeTab !== 'all') {
          filteredItems = filteredItems.filter(item => item.type === activeTab);
        }
        
        // Sort by popularity score
        filteredItems.sort((a, b) => b.recentPopularityScore - a.recentPopularityScore);
        
        setTrendingItems(filteredItems);
      } catch (error) {
        console.error('Error fetching trending items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingItems();
  }, [activeTab, timeRange]);

  const getTrendingMovies = () => {
    return trendingItems.filter(item => item.type === 'movie');
  };

  const getTrendingSeries = () => {
    return trendingItems.filter(item => item.type === 'series');
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const glowEffect = {
    boxShadow: "0 0 15px rgba(80, 100, 240, 0.5), 0 0 30px rgba(80, 100, 240, 0.3)"
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with futuristic design */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 backdrop-blur-lg bg-black/50 border-b border-indigo-500/30" style={{background: "linear-gradient(180deg, rgba(20, 20, 40, 0.9) 0%, rgba(10, 10, 30, 0.8) 100%)"}}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center">
            <TrendingUp className="h-8 w-8 mr-2 text-indigo-400" />
            Trending Now
          </h1>
          
          {/* Time range selector with neon effect */}
          <div className="mt-4 md:mt-0 flex space-x-1 p-1 rounded-full bg-gray-800/50 backdrop-blur-md border border-indigo-500/20">
            {['day', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'day' | 'week' | 'month')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  timeRange === range 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-700/70 text-gray-300'
                }`}
                style={timeRange === range ? glowEffect : {}}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 p-1 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-indigo-500/30">
            {[
              { id: 'all', label: 'All', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'movies', label: 'Movies', icon: <PlayCircle className="h-4 w-4" /> },
              { id: 'series', label: 'Series', icon: <Tv className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'movies' | 'series')}
                className={`px-5 py-2 flex items-center justify-center space-x-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-700/70 text-gray-300'
                }`}
                style={activeTab === tab.id ? glowEffect : {}}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sections based on active tab */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl aspect-[2/3]"></div>
                <div className="mt-2 h-4 bg-gray-800 rounded"></div>
                <div className="mt-1 h-3 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Conditional rendering based on active tab */}
            {(activeTab === 'all' || activeTab === 'movies') && getTrendingMovies().length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-indigo-400 flex items-center">
                    <PlayCircle className="h-6 w-6 mr-2" />
                    Trending Movies
                  </h2>
                  <button className="text-sm text-indigo-400 flex items-center hover:text-indigo-300 transition-colors">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {getTrendingMovies().slice(0, 5).map((movie) => (
                    <motion.div 
                      key={movie.id} 
                      className="group cursor-pointer"
                      variants={itemVariants}
                    >
                      <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-indigo-500/20 bg-gray-800/40 transition-all duration-300 hover:scale-105 hover:border-indigo-400/50" style={{boxShadow: "0 10px 30px -15px rgba(80, 100, 240, 0.3)"}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `/api/placeholder/500/750?text=${encodeURIComponent(movie.title)}`;
                          }}
                        />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm font-medium">{movie.voteAverage}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4 text-indigo-300" />
                              <span className="text-xs font-medium text-indigo-300">{movie.reviewCount}</span>
                              </div>
                         </div>
                       </div>
                       
                       {/* Popularity indicator */}
                       <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center border border-indigo-500/30">
                         <TrendingUp className="h-3 w-3 text-indigo-400 mr-1" />
                         <span className="text-xs font-medium text-indigo-300">{movie.recentPopularityScore.toFixed(1)}</span>
                       </div>
                     </div>
                     
                     <div className="mt-3 px-1">
                       <h3 className="font-medium text-white truncate">{movie.title}</h3>
                       <div className="flex items-center justify-between mt-1">
                         <div className="flex items-center text-xs text-gray-400">
                           <Clock className="h-3 w-3 mr-1" />
                           {new Date(movie.releaseDate).getFullYear()}
                         </div>
                         <div className="flex flex-wrap gap-1">
                           {movie.genres.map((genre, idx) => (
                             <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-500/30">
                               {genre}
                             </span>
                           ))}
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </motion.div>
             </div>
           )}
           
           {/* Series Section */}
           {(activeTab === 'all' || activeTab === 'series') && getTrendingSeries().length > 0 && (
             <div>
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-purple-400 flex items-center">
                   <Tv className="h-6 w-6 mr-2" />
                   Trending Series
                 </h2>
                 <button className="text-sm text-purple-400 flex items-center hover:text-purple-300 transition-colors">
                   View all <ChevronRight className="h-4 w-4 ml-1" />
                 </button>
               </div>

               <motion.div 
                 className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
               >
                 {getTrendingSeries().slice(0, 5).map((series) => (
                   <motion.div 
                     key={series.id} 
                     className="group cursor-pointer"
                     variants={itemVariants}
                   >
                     <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-purple-500/20 bg-gray-800/40 transition-all duration-300 hover:scale-105 hover:border-purple-400/50" style={{boxShadow: "0 10px 30px -15px rgba(140, 100, 240, 0.3)"}}>
                       <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                       <img
                         src={`https://image.tmdb.org/t/p/w500${series.posterPath}`}
                         alt={series.title}
                         className="w-full aspect-[2/3] object-cover"
                         onError={(e) => {
                           (e.target as HTMLImageElement).src = `/api/placeholder/500/750?text=${encodeURIComponent(series.title)}`;
                         }}
                       />
                       
                       <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                         <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <div className="flex items-center space-x-2">
                             <Star className="h-4 w-4 text-yellow-400" />
                             <span className="text-sm font-medium">{series.voteAverage}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <MessageCircle className="h-4 w-4 text-purple-300" />
                             <span className="text-xs font-medium text-purple-300">{series.reviewCount}</span>
                           </div>
                         </div>
                       </div>
                       
                       {/* Popularity indicator */}
                       <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center border border-purple-500/30">
                         <TrendingUp className="h-3 w-3 text-purple-400 mr-1" />
                         <span className="text-xs font-medium text-purple-300">{series.recentPopularityScore.toFixed(1)}</span>
                       </div>
                     </div>
                     
                     <div className="mt-3 px-1">
                       <h3 className="font-medium text-white truncate">{series.title}</h3>
                       <div className="flex items-center justify-between mt-1">
                         <div className="flex items-center text-xs text-gray-400">
                           <Clock className="h-3 w-3 mr-1" />
                           {new Date(series.releaseDate).getFullYear()}
                         </div>
                         <div className="flex flex-wrap gap-1">
                           {series.genres.map((genre, idx) => (
                             <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30">
                               {genre}
                             </span>
                           ))}
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </motion.div>
             </div>
           )}
           
           {/* No results state */}
           {trendingItems.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20">
               <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-8 border border-indigo-500/20 mb-6">
                 <TrendingUp className="h-12 w-12 text-indigo-400" />
               </div>
               <h3 className="text-xl font-medium text-white">No trending items found</h3>
               <p className="mt-2 text-gray-400">Try changing your filters or check back later</p>
             </div>
           )}
         </>
       )}
     </main>
   </div>
 );
};

export default TrendingPage;