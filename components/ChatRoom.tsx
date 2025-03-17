"use client";
import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import Input from "./Message";
import { ChatGroup, Message } from '@/types';

interface ChatRoomProps {
  chatGroup: ChatGroup;
  messages: Message[];
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ chatGroup, messages: initialMessages }) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);

  // Modal states: "none" | "participants" | "contacts" | "profile"
  const [modalState, setModalState] = useState<"none" | "participants" | "contacts" | "profile">("none");
  
  // State to track which user's profile is being viewed
  const [selectedUser, setSelectedUser] = useState(null);

  // New state to control group description visibility
  const [showGroupDescription, setShowGroupDescription] = useState(false);

  // Dummy data for participants and Google contacts.
  const participants = [
    { id: 'user1', username: 'MovieBuff42', avatar: '/api/placeholder/40/40', bio: 'Film enthusiast and popcorn connoisseur.' },
    { id: 'user2', username: 'FilmCritic99', avatar: '/api/placeholder/40/40', bio: 'Professional film reviewer with a focus on sci-fi.' },
    { id: 'user3', username: 'SciFiFan', avatar: '/api/placeholder/40/40', bio: 'Sci-fi novels, movies, and TV shows are my passion.' },
  ];

  const googleContacts = [
    { id: 'g1', name: 'Alice Google', email: 'alice@example.com', avatar: '/api/placeholder/40/40' },
    { id: 'g2', name: 'Bob Google', email: 'bob@example.com', avatar: '/api/placeholder/40/40' },
    { id: 'g3', name: 'Charlie Google', email: 'charlie@example.com', avatar: '/api/placeholder/40/40' },
  ];

  // Function to handle clicking on a user's profile
  const handleProfileClick = (userId: string) => {
    const user = participants.find(p => p.id === userId);
    if (user) {
      setSelectedUser(user);
      setModalState("profile");
    }
  };
  const sendMessage = (text: string) => {
    if (text.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        userId: "currentUser",
        username: "You",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update messages state
    }
  };

  // Function to fetch user profile data from the backend
  const fetchUserProfile = async (userId: string) => {
    try {
      const user = participants.find(p => p.id === userId);
      if (user) {
        return {
          ...user,
          mutualFriends: ['John Doe', 'Jane Smith', 'Alex Johnson'],
          joinDate: '2023-05-15',
          favGenres: ['Sci-Fi', 'Thriller', 'Documentary']
        };
      }
      throw new Error('User not found');
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        userId: 'currentUser',
        username: 'You',
        content: messageText,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Simulate copying a unique invite link to clipboard.
  const copyUniqueLink = () => {
    const uniqueLink = "https://example.com/invite/unique-code";
    navigator.clipboard.writeText(uniqueLink).then(() => {
      alert("Unique link copied to clipboard!");
    });
  };

  // Simulate sending a backend request to add a contact to the group.
  const handleAddContactToGroup = async (contactId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Request to add contact ${contactId} to group sent.`);
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Failed to send request.");
    }
  };

  return (
    <div className="flex flex-col h-full relative">
  {/* Background image container */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('/chat.png')",
      backgroundSize: "55%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  />
  <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
  <div className="relative flex flex-col h-full">
      {/* Chat header */}
      <div 
        className="bg-gray-900 p-4 shadow-sm flex items-center border-b border-gray-700 cursor-pointer"
        onClick={() => setShowGroupDescription(!showGroupDescription)}
      >
        <img
          src={chatGroup.imageUrl}
          alt={chatGroup.name}
          className="h-10 w-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <h2 className="font-bold text-lg">{chatGroup.name}</h2>
          <p className="text-sm text-gray-400">
            {chatGroup.membersCount || '48'} members
          </p>
        </div>
        {/* Prevent toggling description when clicking the Participants button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalState("participants");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
        >
          Participants
        </button>
      </div>

      {/* Group Description */}
      {showGroupDescription && (
        <div className="bg-gray-700 p-4 border-b border-gray-600">
          <p className="text-sm text-gray-300">
            {chatGroup.description || "No description available for this group."}
          </p>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.userId === 'currentUser';
          return (
            <div key={message.id} className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              {!isCurrentUser && (
                <img
                  src={message.avatar || '/api/placeholder/40/40'}
                  alt={message.username}
                  className="h-8 w-8 rounded-full mr-2 cursor-pointer"
                  onClick={() => handleProfileClick(message.userId)}
                />
              )}
              <div className={`max-w-sm p-2 text-sm rounded-md ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                {!isCurrentUser && (
                  <p className="text-sm font-medium text-gray-400 mb-1 cursor-pointer" onClick={() => handleProfileClick(message.userId)}>
                    {message.username}
                  </p>
                )}
                <p>{message.content}</p>
                <p className="text-xs mt-1 text-gray-400 text-right">{formatTime(message.timestamp)}</p>
              </div>
              {isCurrentUser && (
                <img
                  src={message.avatar || '/api/placeholder/40/40'}
                  alt="You"
                  className="h-8 w-8 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <div className="p-2 bg-gray-900 border-t border-gray-700 flex items-center justify-center">
      <Input sendMessage={sendMessage} />
</div>


      {/* Modal Overlay */}
      {modalState !== "none" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {modalState === "participants" && (
            <div className="bg-gray-800 text-white w-80 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Participants</h3>
                <button onClick={() => setModalState("none")} className="text-gray-400 hover:text-gray-200 text-2xl leading-none">
                  &times;
                </button>
              </div>
              <ul className="max-h-60 overflow-y-auto mb-4">
                {participants.map((participant) => (
                  <li key={participant.id} className="flex items-center mb-3 cursor-pointer" onClick={() => handleProfileClick(participant.id)}>
                    <img src={participant.avatar} alt={participant.username} className="h-8 w-8 rounded-full mr-2" />
                    <span>{participant.username}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                  onClick={() => setModalState("contacts")}
                >
                  Add Member
                </button>
                <button
                  onClick={copyUniqueLink}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition"
                >
                  Invite to Group
                </button>
              </div>
            </div>
          )}
          {modalState === "contacts" && (
            <div className="bg-gray-800 text-white w-80 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Google Contacts</h3>
                <div>
                  <button onClick={() => setModalState("participants")} className="text-gray-400 hover:text-gray-200 mr-2">
                    Back
                  </button>
                  <button onClick={() => setModalState("none")} className="text-gray-400 hover:text-gray-200 text-2xl leading-none">
                    &times;
                  </button>
                </div>
              </div>
              <ul className="max-h-60 overflow-y-auto mb-4">
                {googleContacts.map((contact) => (
                  <li key={contact.id} className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <img src={contact.avatar} alt={contact.name} className="h-8 w-8 rounded-full mr-2" />
                      <div>
                        <p>{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddContactToGroup(contact.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Add to Group
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {modalState === "profile" && selectedUser && (
            <div className="flex justify-center items-center">
              <ProfileCard 
                userId={selectedUser.id} 
                onClose={() => setModalState("none")} 
                fetchUserProfile={fetchUserProfile} 
              />
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};
