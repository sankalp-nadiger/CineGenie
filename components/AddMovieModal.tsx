"use client";
import React, { useState } from 'react';
import type { Movie } from '@/types';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (movie: Omit<Movie, 'id'>) => void;
}

export const AddMovieModal: React.FC<AddMovieModalProps> = ({ isOpen, onClose, onAddMovie }) => {
  const [formData, setFormData] = useState<Omit<Movie, 'id'>>({
    title: '',
    posterUrl: '/api/placeholder/220/330',
    genre: '',
    releaseYear: new Date().getFullYear(),
    director: '',
    watched: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'releaseYear' ? parseInt(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMovie(formData);
    setFormData({
      title: '',
      posterUrl: '/api/placeholder/220/330',
      genre: '',
      releaseYear: new Date().getFullYear(),
      director: '',
      watched: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add Movie to Watchlist</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Movie Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter movie title"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Action, Drama, Comedy"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 mb-1">Release Year</label>
            <input
              type="number"
              id="releaseYear"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 5}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="director" className="block text-sm font-medium text-gray-700 mb-1">Director</label>
            <input
              type="text"
              id="director"
              name="director"
              value={formData.director}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Director's name"
            />
          </div>
          
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="watched"
              name="watched"
              checked={formData.watched}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="watched" className="ml-2 block text-sm text-gray-700">
              I've already watched this movie
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
          <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};