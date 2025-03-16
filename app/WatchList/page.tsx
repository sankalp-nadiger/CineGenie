"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { MovieCard } from '@/components/MovieCard';
import { AddMovieModal } from '@/components/AddMovieModal';
import type { Movie } from '@/types';

const WatchlistPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'watched' | 'unwatched'>('all');
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: '1',
      title: 'Interstellar',
      posterUrl: '/api/placeholder/220/330',
      genre: 'Sci-Fi',
      releaseYear: 2014,
      director: 'Christopher Nolan',
      watched: false
    },
    {
      id: '2',
      title: 'The Shawshank Redemption',
      posterUrl: '/api/placeholder/220/330',
      genre: 'Drama',
      releaseYear: 1994,
      director: 'Frank Darabont',
      watched: true
    },
    {
      id: '3',
      title: 'Parasite',
      posterUrl: '/api/placeholder/220/330',
      genre: 'Thriller',
      releaseYear: 2019,
      director: 'Bong Joon-ho',
      watched: false
    },
    {
      id: '4',
      title: 'The Dark Knight',
      posterUrl: '/api/placeholder/220/330',
      genre: 'Action',
      releaseYear: 2008,
      director: 'Christopher Nolan',
      watched: true
    }
  ]);

  const addMovie = (movie: Omit<Movie, 'id'>) => {
    const newMovie = {
      ...movie,
      id: `movie-${Date.now()}`
    };
    setMovies([...movies, newMovie]);
    setIsModalOpen(false);
  };

  const toggleWatched = (id: string) => {
    setMovies(movies.map(movie => 
      movie.id === id ? { ...movie, watched: !movie.watched } : movie
    ));
  };

  const removeMovie = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  const filteredMovies = movies.filter(movie => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'watched') return movie.watched;
    if (activeFilter === 'unwatched') return !movie.watched;
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Movie
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${activeFilter === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveFilter('all')}
            >
              All Movies
            </button>
            <button
              className={`py-2 px-4 ${activeFilter === 'unwatched' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveFilter('unwatched')}
            >
              To Watch
            </button>
            <button
              className={`py-2 px-4 ${activeFilter === 'watched' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveFilter('watched')}
            >
              Watched
            </button>
          </div>
        </div>

        {/* Movie grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleWatched={() => toggleWatched(movie.id)}
                onRemove={() => removeMovie(movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 p-6 rounded-lg text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your watchlist is empty</h3>
              <p className="text-gray-600 mb-4">
                {activeFilter !== 'all' 
                  ? `You don't have any ${activeFilter === 'watched' ? 'watched' : 'unwatched'} movies in your list yet.`
                  : 'Start building your watchlist by adding movies you want to watch.'}
              </p>
              {activeFilter === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Your First Movie
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      <AddMovieModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddMovie={addMovie} 
      />
    </Layout>
  );
};

export default WatchlistPage;