import React, { useState } from 'react';
import { User, X, Calendar } from 'lucide-react';
import axios from 'axios';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    username: string;
    bio: string;
    favoriteGenres: string[];
  };
}

interface ProfileHeaderProps {
  userData: {
    username: string;
    joinDate: string;
    bio: string;
    favoriteGenres: string[];
    avatar: string;
  };
  isCurrentUser: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userData }) => {
  const [formData, setFormData] = useState({
    username: userData.username,
    bio: userData.bio,
    favoriteGenres: userData.favoriteGenres.join(', ')
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert comma-separated genres back to array
      const processedData = {
        ...formData,
        favoriteGenres: formData.favoriteGenres.split(',').map(genre => genre.trim())
      };
      
      // Send data to backend
      await axios.put('/api/profile', processedData);
      
      // Close modal and potentially refresh data
      onClose();
      window.location.reload(); // You might want to use a more elegant state update instead
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Favorite Genres (comma-separated)
                </label>
                <input
                  type="text"
                  name="favoriteGenres"
                  value={formData.favoriteGenres}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, isCurrentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {userData.username}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 mt-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Joined {userData.joinDate}</span>
          </div>
        </div>
        
        {isCurrentUser ? (
          <button 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <User className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2">
            <User className="h-4 w-4" />
            Follow
          </button>
        )}
      </div>
      
      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userData={userData}
      />
    </>
  );
};