import React, { useState, useEffect } from 'react';
import { User, X, Calendar, UserPlus, MessageSquare, Loader, Check, Edit } from 'lucide-react';
import axios from 'axios';
import Input from './Message';
// Interface definitions
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    username: string;
    bio: string;
    favoriteGenres: string[];
  };
  onProfileUpdate?: (updatedData: any) => void;
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
  onProfileUpdate?: (updatedData: any) => void;
}

// EditProfileModal Component
const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userData, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    username: userData?.username || '',
    bio: userData?.bio || '',
    favoriteGenres: userData?.favoriteGenres?.join(', ') || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        bio: userData.bio || '',
        favoriteGenres: userData.favoriteGenres?.join(', ') || ''
      });
    }
  }, [userData]);
  
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
        favoriteGenres: formData.favoriteGenres.split(',').map(genre => genre.trim()).filter(Boolean)
      };
      
      // Send data to backend
      await axios.put('/api/profile', processedData);
      
      // Notify parent components of the update
      if (onProfileUpdate) {
        onProfileUpdate(processedData);
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
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
                  rows={3}
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

// ProfileHeader Component
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, isCurrentUser, onProfileUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleProfileUpdate = (updatedData) => {
    if (onProfileUpdate) {
      onProfileUpdate(updatedData);
    }
    setIsModalOpen(false);
  };
  
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
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
};

// FollowButton Component
export const FollowButton = ({ userId, initialFollowStatus = false, onEditProfile = null }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data if we might need to edit the profile
    if (onEditProfile) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      // In a real implementation, you would fetch user data
      // const response = await axios.get(`/api/users/${userId}/profile`, {
      //   withCredentials: true
      // });
      
      // Simulate API request for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample response data
      const data = {
        username: "CinePhantom",
        bio: "Film enthusiast and reviewer",
        favoriteGenres: ["Sci-Fi", "Drama", "Animation"]
      };
      
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data for edit:', err);
    }
  };

  const handleFollowToggle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request
      const endpoint = isFollowing ? `/api/users/${userId}/unfollow` : `/api/users/${userId}/follow`;
      
      // In a real implementation, you would use this axios call
      const response = await axios.post(endpoint, {}, {
        withCredentials: true // This will send the cookies with the request
      });
      
      // For demo purposes, simulate a delay and successful response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Toggle follow status
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow action failed:', err);
      setError('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleProfileUpdate = (updatedData) => {
    // Update local state
    setUserData(updatedData);
    
    // Call parent callback if provided
    if (onEditProfile) {
      onEditProfile(updatedData);
    }
    
    setIsModalOpen(false);
  };

  return (
    <>
      {onEditProfile ? (
        <button 
          onClick={handleEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </button>
      ) : (
        <button 
          onClick={handleFollowToggle}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 
              isFollowing ? 'bg-green-600 hover:bg-red-600 hover:text-white' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isFollowing ? (
            <>
              <Check className="h-4 w-4" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Follow
            </>
          )}
        </button>
      )}
      
      {userData && (
        <EditProfileModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          userData={userData}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export const MessageButton = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageStatus, setMessageStatus] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setMessageStatus(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessageStatus(null);
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    setIsSending(true);
    
    try {
      // Send message to backend
      await axios.post('/api/messages', {
        userId: userId,
        message: messageText
      }, {
        withCredentials: true // This will send the cookies with the request
      });
      
      setMessageStatus('success');
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setIsModalOpen(false);
        setMessageStatus(null);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-amber rounded-lg shadow-xl max-w-4xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Send Message</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {messageStatus === 'success' ? (
                <div className="flex items-center justify-center p-4 text-green-500">
                  <p>Message sent successfully!</p>
                </div>
              ) : messageStatus === 'error' ? (
                <div className="flex items-center justify-center p-4 text-red-500">
                  <p>Failed to send message. Please try again.</p>
                </div>
              ) : isSending ? (
                <div className="flex items-center justify-center p-4">
                  <Loader className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                  <p>Sending message...</p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Input sendMessage={sendMessage} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Enhanced ProfileActions component
export const ProfileActions = ({ userId, isCurrentUser, initialFollowStatus }) => {
  const [userData, setUserData] = useState(null);
  
  const handleProfileUpdate = (updatedData) => {
    // Update any parent components if needed
    setUserData(updatedData);
    // You might want to refresh the page or update other components
  };
  
  return (
    <div className="flex items-center gap-3">
      {isCurrentUser ? (
        <FollowButton 
          userId={userId} 
          onEditProfile={handleProfileUpdate} 
        />
      ) : (
        <>
          <FollowButton userId={userId} initialFollowStatus={initialFollowStatus} />
          {initialFollowStatus && <MessageButton userId={userId} />}
        </>
      )}
    </div>
  );
};

// Enhanced UserProfile component
export const UserProfile = ({ userId }) => {
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [followStatus, setFollowStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, you would fetch user data
        // const response = await axios.get(`/api/users/${userId}`, {
        //   withCredentials: true
        // });
        
        // Simulate API request for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample response data
        const response = {
          data: {
            username: "CinePhantom",
            bio: "Film enthusiast and reviewer",
            favoriteGenres: ["Sci-Fi", "Drama", "Animation"],
            joinDate: "March 2023",
            avatar: "/avatar.jpg",
            isCurrentUser: userId === undefined || userId === null,
            isFollowing: Math.random() > 0.5, // Randomly simulate follow status for demo
          }
        };
        
        setUserData(response.data);
        setIsCurrentUser(response.data.isCurrentUser);
        setFollowStatus(response.data.isFollowing);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  const handleProfileUpdate = (updatedData) => {
    setUserData(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-20">
      <Loader className="h-6 w-6 animate-spin text-blue-500" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader 
        userData={userData} 
        isCurrentUser={isCurrentUser}
        onProfileUpdate={handleProfileUpdate}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <p className="text-gray-300">{userData?.bio}</p>
          {userData?.favoriteGenres?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-400">Favorite Genres:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {userData.favoriteGenres.map((genre, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700 rounded-md text-xs">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <ProfileActions 
          userId={userId} 
          isCurrentUser={isCurrentUser} 
          initialFollowStatus={followStatus} 
        />
      </div>
    </div>
  );
};