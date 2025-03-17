"use client";

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, Film, Star, TrendingUp, Clock, Filter } from 'lucide-react';
import { Layout } from '@/components/Layout';

// Types
interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  overview: string;
  genres: string[];
}

interface Genre {
  id: number;
  name: string;
}

const DiscoverPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Fetch genres (using mock data)
    const fetchGenres = async () => {
      try {
        const mockGenres = [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
          { id: 18, name: 'Drama' },
          { id: 14, name: 'Fantasy' },
          { id: 27, name: 'Horror' },
          { id: 10749, name: 'Romance' },
          { id: 878, name: 'Science Fiction' },
          { id: 53, name: 'Thriller' }
        ];
        setGenres(mockGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    // Fetch movies (using mock data)
    const fetchMovies = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockMovies: Movie[] = [
          {
            id: 1,
            title: 'Inception',
            posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            releaseDate: '2010-07-16',
            voteAverage: 8.4,
            overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            genres: ['Action', 'Science Fiction', 'Adventure']
          },
          {
            id: 2,
            title: 'The Shawshank Redemption',
            posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            releaseDate: '1994-09-23',
            voteAverage: 8.7,
            overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
            genres: ['Drama', 'Crime']
          },
          {
            id: 3,
            title: 'Pulp Fiction',
            posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
            releaseDate: '1994-09-10',
            voteAverage: 8.5,
            overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
            genres: ['Thriller', 'Crime']
          },
          {
            id: 4,
            title: 'The Dark Knight',
            posterPath: '/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg',
            releaseDate: '2008-07-16',
            voteAverage: 8.5,
            overview: 'Batman raises the stakes in his war on crime. With the help of Lieutenant Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.',
            genres: ['Action', 'Crime', 'Drama', 'Thriller']
          },
          {
            id: 5,
            title: 'Parasite',
            posterPath: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
            releaseDate: '2019-05-30',
            voteAverage: 8.5,
            overview: 'All unemployed, Ki-taek and his family take peculiar interest in the wealthy and glamorous Parks, as they ingratiate themselves into their lives.',
            genres: ['Comedy', 'Thriller', 'Drama']
          },
          {
            id: 6,
            title: 'Interstellar',
            posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            releaseDate: '2014-11-05',
            voteAverage: 8.3,
            overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            genres: ['Adventure', 'Drama', 'Science Fiction']
          },
          {
            id: 7,
            title: 'Whiplash',
            posterPath: '/6Wdl9N6dL0Hi0T1qJLWSz6gMLbd.jpg',
            releaseDate: '2014-10-10',
            voteAverage: 8.4,
            overview: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
            genres: ['Drama', 'Music']
          },
          {
            id: 8,
            title: 'The Matrix',
            posterPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            releaseDate: '1999-03-30',
            voteAverage: 8.2,
            overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
            genres: ['Action', 'Science Fiction']
          }
        ];
        
        let filteredMovies = [...mockMovies];
        
        if (debouncedSearch) {
          filteredMovies = filteredMovies.filter(movie => 
            movie.title.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }
        
        if (selectedGenres.length > 0) {
          filteredMovies = filteredMovies.filter(movie => 
            selectedGenres.some(genreId => {
              const genreName = genres.find(g => g.id === genreId)?.name || '';
              return movie.genres.includes(genreName);
            })
          );
        }
        
        if (sortBy === 'popularity.desc') {
          // No extra sorting logic needed in this example
        } else if (sortBy === 'vote_average.desc') {
          filteredMovies.sort((a, b) => b.voteAverage - a.voteAverage);
        } else if (sortBy === 'release_date.desc') {
          filteredMovies.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        }
        
        setMovies(filteredMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [debouncedSearch, selectedGenres, sortBy, genres]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-white">Discover Movies</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            {/* <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="block appearance-none bg-gray-800 border border-gray-700 rounded-lg pl-3 pr-10 py-2 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity.desc">Most Popular</option>
                  <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Recently Released</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Filter Button and Genre Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200">
                <Filter className="h-4 w-4 mr-1" />
                <span>Genres:</span>
              </div>
              
              {genres.slice(0, 6).map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
              
              {genres.length > 6 && (
                <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  +{genres.length - 6} more
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[2/3]"></div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
                <div className="aspect-[2/3] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <div className="font-medium text-sm mb-1">{movie.title}</div>
                      <div className="flex items-center text-xs">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        {movie.voteAverage}
                      </div>
                    </div>
                  </div>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image if poster path is invalid
                      (e.target as HTMLImageElement).src = `/api/placeholder/500/750?text=${encodeURIComponent(movie.title)}`;
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{movie.title}</h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(movie.releaseDate).getFullYear()}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      {movie.voteAverage}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Film className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No movies found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
    </Layout>
  );
};

export default DiscoverPage;