"use client"; 
import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Film, Star, Award, Calendar, Clock, User, Heart } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ProfileHeader } from '@/components/EditProfile'
interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  poster: string;
  rating: number;
  genre: string;
}

const UserProfile: NextPage = () => {
  // Sample user data
  const userData = {
    username: "CinePhantom",
    avatar: "/api/placeholder/100/100",
    joinDate: "2024-07-15",
    watchedMovies: 732,
    watchlist: 54,
    followers: 183,
    following: 97,
    favoriteGenres: ["Sci-Fi", "Thriller", "Film Noir", "Cyberpunk"],
    bio: "Exploring the depths of cinema, one frame at a time. Particularly drawn to mind-bending narratives and visionary directors pushing the boundaries of storytelling.",
  };

  // Sample movies
  const [favoriteMovies] = useState<Movie[]>([
    {
      id: 1,
      title: "Blade Runner 2049",
      director: "Denis Villeneuve",
      year: 2017,
      poster: "/api/placeholder/200/300",
      rating: 4.8,
      genre: "Sci-Fi"
    },
    {
      id: 2,
      title: "Interstellar",
      director: "Christopher Nolan",
      year: 2014,
      poster: "/api/placeholder/200/300",
      rating: 4.7,
      genre: "Sci-Fi"
    },
    {
      id: 3,
      title: "Drive",
      director: "Nicolas Winding Refn",
      year: 2011,
      poster: "/api/placeholder/200/300",
      rating: 4.5,
      genre: "Thriller"
    },
  ]);

  // Sample recent activity
  const recentActivity = [
    { type: "watched", movie: "Dune: Part Two", time: "2 hours ago" },
    { type: "review", movie: "Poor Things", rating: 4.5, time: "Yesterday" },
    { type: "list", name: "Best Cyberpunk Films", time: "2 days ago" },
    { type: "followed", user: "FilmOracle", time: "3 days ago" },
  ];

  const [isCurrentUser] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let position = 0;
    
    const animate = () => {
      position -= 0.5;
      container.style.transform = `translateX(${position}px)`;
      
      // Reset position when it moves too far (after all cells would be off-screen)
      if (position <= -480) { // 30 cells × 16px width
        position = 0;
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);


  return (
    <>
    <Layout>
             <Head>
        <title>{userData.username} | CineFuture Profile</title>
        <meta name="description" content="User profile for CineFuture - The ultimate platform for cinema enthusiasts" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Animated film reel header */}
        <div className="h-32 overflow-hidden relative bg-black">
      <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-blue-600 to-purple-600" />
      <div className="absolute inset-0 overflow-hidden">
        <div ref={containerRef} className="flex items-center absolute">
          {Array.from({ length: 60 }).map((_, i) => (
            <div 
              key={i} 
              className="film-cell h-32 w-16 border-r border-gray-800 flex-shrink-0 relative"
            >
              <div className="absolute top-4 left-4 w-8 h-8 bg-black rounded-full border border-gray-700"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-black rounded-full border border-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            {/* Avatar & Basic Info */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg shadow-blue-500/50">
                <img 
                  src={userData.avatar} 
                  alt={userData.username} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2">
                <Award className="h-5 w-5" />
              </div>
            </div>

            <div className="flex-1">
              <ProfileHeader 
                userData={userData}
                isCurrentUser={isCurrentUser}
              />
              
              <p className="mt-4 text-gray-300 leading-relaxed">{userData.bio}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {userData.favoriteGenres.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-blue-300 border border-blue-500/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Film className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Watched</p>
                  <p className="text-xl font-bold">{userData.watchedMovies}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Watchlist</p>
                  <p className="text-xl font-bold">{userData.watchlist}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <User className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Followers</p>
                  <p className="text-xl font-bold">{userData.followers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Following</p>
                  <p className="text-xl font-bold">{userData.following}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Favorite Movies */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Favorite Films</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">See All</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {favoriteMovies.map((movie) => (
                  <div key={movie.id} className="bg-gray-800/70 rounded-lg overflow-hidden border border-gray-700 group hover:border-blue-500/50 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium w-full transition-colors">
                          View Details
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium">{movie.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-md truncate">{movie.title}</h3>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                        <span>{movie.year}</span>
                        <span className="truncate ml-2">{movie.director}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Filter</button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    {activity.type === "watched" && (
                      <div>
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4 text-blue-400" />
                          <p className="text-sm">
                            Watched <span className="font-medium text-white">{activity.movie}</span>
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                      </div>
                    )}
                    
                    {activity.type === "review" && (
                      <div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <p className="text-sm">
                            Reviewed <span className="font-medium text-white">{activity.movie}</span>
                          </p>
                        </div>
                        <div className="flex mt-2 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < (activity.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    )}
                    
                    {activity.type === "list" && (
                      <div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-400" />
                          <p className="text-sm">
                            Created list <span className="font-medium text-white">{activity.name}</span>
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                      </div>
                    )}
                    
                    {activity.type === "followed" && (
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-400" />
                          <p className="text-sm">
                            Followed <span className="font-medium text-white">{activity.user}</span>
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>

      <style jsx global>{`
        .film-cell {
          position: relative;
        }
        .film-cell::before {
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 8px;
          height: 8px;
          background: #000;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2);
        }
        .film-cell::after {
          content: "";
          position: absolute;
          bottom: 4px;
          left: 4px;
          width: 8px;
          height: 8px;
          background: #000;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2);
        }
      `}</style>
    </>
  );
};

export default UserProfile;