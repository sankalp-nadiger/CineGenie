"use client";
import React, { useState } from 'react';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onToggleWatched: () => void;
  onRemove: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleWatched, onRemove }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="relative">
        <img 
          src={movie.posterUrl} 
          alt={`${movie.title} poster`} 
          className="w-full h-64 object-cover"
        />
        {movie.watched && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            Watched
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
        <div className="text-sm text-gray-600 mb-2">
          <span>{movie.releaseYear}</span> • <span>{movie.genre}</span>
        </div>
        <p className="text-sm text-gray-500">Dir. {movie.director}</p>
        
        <div className="mt-4 pt-3 border-t flex justify-between">
          <button
            onClick={onToggleWatched}
            className={`px-3 py-1 rounded text-sm ${
              movie.watched 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {movie.watched ? 'Mark Unwatched' : 'Mark Watched'}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showOptions && (
              <div className="absolute right-0 bottom-8 bg-white shadow-lg rounded-md py-1 min-w-32 z-10">
                <button
                  onClick={() => {
                    onRemove();
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};