import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import AnimatedToolTip from './AnimatedToolTip';
import Link from 'next/link';
import Loader from './Loader'; // Import the Loader component

// ShareModal component for selecting friends to share with
const ShareModal = ({ isOpen, onClose, userId, onShare }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  
  useEffect(() => {
    const fetchFriends = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/users/${userId}/friends`);
        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }
        const data = await response.json();
        setFriends(data);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Could not load friends list');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, [userId, isOpen]);
  
  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };
  
  const handleShare = () => {
    setIsSharing(true);
    onShare(selectedFriends)
      .finally(() => {
        setIsSharing(false);
        onClose();
      });
  };
  
  if (!isOpen) return null;
  
  return (
    <StyledModalOverlay>
      <StyledModal>
        <div className="modal-header">
          <h2>Share Profile</h2>
          <button className="close-btn" onClick={onClose} disabled={isSharing}>&times;</button>
        </div>
        
        <div className="modal-content">
          {isLoading ? (
            <div className="loading-container">
              <Loader />
              <div>Loading friends...</div>
            </div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              <div className="section-title">Mutual Friends</div>
              <div className="friends-list">
                {friends.filter(friend => friend.isMutual).map(friend => (
                  <FriendItem 
                    key={friend.id}
                    friend={friend}
                    isSelected={selectedFriends.includes(friend.id)}
                    onSelect={() => toggleFriendSelection(friend.id)}
                  />
                ))}
              </div>
              <div className="section-title">Other Friends</div>
              <div className="friends-list">
                {friends.filter(friend => !friend.isMutual).map(friend => (
                  <FriendItem 
                    key={friend.id}
                    friend={friend}
                    isSelected={selectedFriends.includes(friend.id)}
                    onSelect={() => toggleFriendSelection(friend.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="selected-count">
            {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} selected
          </div>
          <div className="buttons">
            <button className="cancel-btn" onClick={onClose} disabled={isSharing}>Cancel</button>
            <button 
              className="share-btn" 
              onClick={handleShare}
              disabled={selectedFriends.length === 0 || isSharing}
            >
              {isSharing ? <><Loader size="small" /> Sharing...</> : 'Share'}
            </button>
          </div>
        </div>
      </StyledModal>
    </StyledModalOverlay>
  );
};

// Individual friend item component with selection functionality
const FriendItem = ({ friend, isSelected, onSelect }) => {
  return (
    <StyledFriendItem className={isSelected ? 'selected' : ''} onClick={onSelect}>
      <div className="friend-avatar">
        <img src={friend.avatar} alt={friend.username} />
        {isSelected && <div className="selected-indicator">✓</div>}
      </div>
      <span className="friend-name">{friend.username}</span>
    </StyledFriendItem>
  );
};

export const ProfileCard = ({ userId, onClose, fetchUserProfile }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        // Fetch user data from backend (or our simulated function)
        const data = await fetchUserProfile(userId);
        if (data) {
          setUserData(data);
        } else {
          setError('Unable to load user profile');
        }
      } catch (err) {
        setError('Error loading profile');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, [userId, fetchUserProfile]);
  
  const handleShareProfile = async (selectedFriendIds) => {
    try {
      setIsSharing(true);
      // Capture the profile card as an image if needed
      const profileImage = await captureProfileCard(cardRef);
      
      // Replace with your actual share API endpoint
      const response = await fetch('/api/share-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileId: userId,
          friendIds: selectedFriendIds,
          profileImage: profileImage // Send the image data along with the request
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to share profile');
      }
      
      // Success notification could be added here
      console.log('Profile shared successfully');
      return Promise.resolve();
    } catch (err) {
      console.error('Error sharing profile:', err);
      // Error notification could be added here
      return Promise.reject(err);
    } finally {
      setIsSharing(false);
    }
  };
  const handleShareToGoogleContacts = async (userId) => {
    try {
      setIsSharing(true);
      // Replace with your actual Google Contacts API endpoint
      const response = await fetch('/api/google-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to Google Contacts');
      }
      
      // Success notification
      console.log('Added to Google Contacts successfully');
      return Promise.resolve();
    } catch (err) {
      console.error('Error adding to Google Contacts:', err);
      // Error notification
      return Promise.reject(err);
    } finally {
      setIsSharing(false);
    }
  };
  const openShareModal = () => {
    setIsShareModalOpen(true);
  };
  
  const closeShareModal = () => {
    if (isSharing) return;
    setIsShareModalOpen(false);
  };

  const handleNavigation = () => {
    setIsNavigating(true);
    // The actual navigation will be handled by Next.js Link component
  };
  
  if (isLoading) {
    return (
      <StyledWrapper>
        <div className="card">
          <div className="loading-container">
            <Loader />
            <div>Loading profile...</div>
          </div>
        </div>
      </StyledWrapper>
    );
  }
  
  if (error || !userData) {
    return (
      <StyledWrapper>
        <div className="card">
          <div className="error">{error || 'Profile unavailable'}</div>
          <button onClick={onClose}>Close</button>
        </div>
      </StyledWrapper>
    );
  }
  
  // Prepare data for AnimatedTooltip component
  const mutualFriendsForTooltip = userData.mutualFriends?.slice(0, 5).map((friend, index) => ({
    id: index,
    name: friend,
    designation: 'Mutual Friend',
    image: `/api/placeholder/${100 + index}/${100 + index}` // Placeholder images, replace with actual friend avatars
  })) || [];
  
  return (
    <StyledWrapper>
      <div className="card" ref={cardRef}>
        <div className="close-btn" onClick={onClose}>&times;</div>
        <img src={userData.avatar} alt={userData.username} className="profile-img" />
        <span className="username">{userData.username}</span>
        <p className="info">{userData.bio}</p>
        
        <div className="mutual-friends">
          <h3>Mutual Friends</h3>
          <div className="friends-avatars">
            <AnimatedToolTip items={mutualFriendsForTooltip} />
          </div>
        </div>
        
        {userData.favGenres && (
          <div className="interests">
            <h3>Favorite Genres</h3>
            <div className="genres">
              {userData.favGenres.map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
        )}
        
        <div className="share">
          <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg></a>
          <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg></a>
          <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
            </svg></a>
          <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
              <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
            </svg></a>
        </div>
        
        <div className="button-container">
          <Link href={`/Profile/${userId}`} passHref>
            <button className="primary-btn" onClick={handleNavigation} disabled={isNavigating}>
              {isNavigating ? (
                <div className="button-content">
                  <Loader size="small" />
                  <span>Loading...</span>
                </div>
              ) : (
                'Full Profile'
              )}
            </button>
          </Link>
          <button onClick={openShareModal} className="primary-btn" disabled={isSharing}>
            {isSharing ? (
              <div className="button-content">
                <Loader size="small" />
                <span>Sharing...</span>
              </div>
            ) : (
              'Share Profile'
            )}
          </button>
        </div>

        {/* Google Contacts Integration*/}
{/* <div className="google-contacts">
  <button onClick={handleShareToGoogleContacts} className="secondary-btn" disabled={isSharing}>
    {isSharing ? (
      <div className="button-content">
        <Loader size="small" />
        <span>Connecting...</span>
      </div>
    ) : (
      'Add to Google Contacts'
    )}
  </button>
</div> */}
      </div>
      
      {isShareModalOpen && (
        <ShareModal 
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          userId={userId}
          onShare={handleShareProfile}
        />
      )}
    </StyledWrapper>
  );
};

// Function to handle sharing to Google contacts
const handleShareToGoogleContacts = async (userId) => {
  try {
    setIsSharing(true);
    // Replace with your actual Google Contacts API endpoint
    const response = await fetch('/api/google-contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to Google Contacts');
    }
    
    // Success notification
    console.log('Added to Google Contacts successfully');
    return Promise.resolve();
  } catch (err) {
    console.error('Error adding to Google Contacts:', err);
    // Error notification
    return Promise.reject(err);
  } finally {
    setIsSharing(false);
  }
};

// Additional styling for the new components
const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background: #171717;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  .modal-header {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    h2 {
      color: white;
      margin: 0;
      font-size: 1.2rem;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      
      &:hover {
        color: red;
      }
      
      &:disabled {
        color: rgba(255, 255, 255, 0.3);
        cursor: not-allowed;
      }
    }
  }
  
  .modal-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    
    .section-title {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin-bottom: 10px;
      margin-top: 15px;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    .friends-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .loading-container, .error {
      color: white;
      text-align: center;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }
  
  .modal-footer {
    padding: 15px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .selected-count {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }
    
    .buttons {
      display: flex;
      gap: 10px;
      
      button {
        padding: 8px 16px;
        border-radius: 20px;
        border: none;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .cancel-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        &:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
        }
      }
      
      .share-btn {
        background: white;
        color: black;
        
        &:hover {
          background: red;
          color: white;
        }
        
        &:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          cursor: not-allowed;
        }
      }
    }
  }
`;

const StyledFriendItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  cursor: pointer;
  transition: 0.3s;
  padding: 8px;
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &.selected {
    background: rgba(255, 0, 0, 0.2);
  }
  
  .friend-avatar {
    position: relative;
    width: 60px;
    height: 60px;
    margin-bottom: 8px;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .selected-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      background: black;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      border: 2px solid #171717;
    }
  }
  
  .friend-name {
    color: white;
    font-size: 0.8rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 20em;
    height: auto;
    min-height: 26em;
    background: #171717;
    transition: 1s ease-in-out;
    clip-path: polygon(30px 0%, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0% 30px);
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 1em;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 1.5em;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      color: red;
    }
  }
  
  .friends-avatars {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }

  .profile-img {
    width: 4.8em;
    height: 4.8em;
    background: white;
    border-radius: 15px;
    margin: 1em auto;
    object-fit: cover;
  }
  
  .username {
    font-weight: bold;
    color: white;
    text-align: center;
    display: block;
    font-size: 1.2em;
    margin-top: 0.5em;
  }
  
  .info {
    font-weight: 400;
    color: white;
    display: block;
    text-align: center;
    font-size: 0.9em;
    margin: 1em 0;
  }
  
  .mutual-friends, .interests {
    margin: 1em 0;
    color: white;
    
    h3 {
      font-size: 0.9em;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.5em;
      text-align: center;
    }
  }
  
  .genres {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5em;
  }
  
  .genre-tag {
    font-size: 0.8em;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.3em 0.6em;
    border-radius: 10px;
    color: white;
  }
  
  .loading-container, .error {
    color: white;
    text-align: center;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .share {
    margin-top: 1em;
    display: flex;
    justify-content: center;
    gap: 1em;
  }
  
  .card a {
    color: white;
    transition: .4s ease-in-out;
  }
  
  .card a:hover {
    color: red;
  }
  
  .button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 1em;
  }
  
  .card button {
    padding: 0.8em 1.7em;
    border-radius: 25px;
    border: none;
    font-weight: bold;
    background: #ffffff;
    color: rgb(0, 0, 0);
    transition: .4s ease-in-out;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 120px;
  }
  
  .card button:hover:not(:disabled) {
  background: red;
  color: white;
}

.card button:disabled {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-btn {
  background: white;
  color: black;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  margin-top: 10px;
}

.secondary-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.google-contacts {
  margin-top: 1em;
  text-align: center;
}
`;

// Function to capture profile card as image for sharing
const captureProfileCard = async (cardRef) => {
  try {
    // Import html2canvas dynamically
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default;
    
    const canvas = await html2canvas(cardRef.current);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing profile card:', error);
    return null;
  }
};

export default ProfileCard;