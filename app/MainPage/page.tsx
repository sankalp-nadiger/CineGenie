"use client";
import React, { useState} from 'react';
import { Layout } from '@/components/Layout';
import { ChatList } from '@/components/ChatList';
import { ChatRoom } from '@/components/ChatRoom';
import ChatContainer from '@/components/ChatContainer'
import type { ChatGroup } from '@/types';
import { useRouter } from 'next/navigation';
import SpinningLogo from '@/components/SpinningLogo';
import Button from '@/components/Button';
import Loader from '@/components/Loader'

const MainPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [groupImage, setGroupImage] = useState(null);
  const [modalType, setModalType] = useState<"none" | "join" | "create">("none");
  const router = useRouter();
  // Chat groups state
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([
    { 
      id: '1', 
      name: 'Marvel Universe', 
      members: ['user1', 'user2', 'user3'], // Example members
      imageUrl: '/api/placeholder/40/40',
      lastMessage: 'Did you see the new trailer?',
      unreadCount: 3,
      online: true,
      typing: false,
      timestamp: new Date().toISOString(),
      messageStatus: 'delivered'
    },
    { 
      id: '2', 
      name: 'Horror Movie Fans', 
      members: ['user4', 'user5'], 
      imageUrl: '/api/placeholder/40/40',
      lastMessage: 'That ending was insane!',
      unreadCount: 0,
      online: false,
      typing: false,
      timestamp: new Date().toISOString(),
      messageStatus: 'read'
    },
    { 
      id: '3', 
      name: 'Oscar Predictions', 
      members: ['user6', 'user7', 'user8'], 
      imageUrl: '/api/placeholder/40/40',
      lastMessage: 'My top pick is definitely...',
      unreadCount: 12,
      online: true,
      typing: true, // Someone is typing in this group
      timestamp: new Date().toISOString(),
      messageStatus: 'sent'
    },
    { 
      id: '4', 
      name: 'Sci-Fi Discussions', 
      members: ['user9', 'user10'], 
      imageUrl: '/api/placeholder/40/40',
      lastMessage: 'The worldbuilding in Dune was...',
      unreadCount: 5,
      online: false,
      typing: false,
      timestamp: new Date().toISOString(),
      messageStatus: 'delivered'
    },
    { 
      id: '5', 
      name: 'Animation Appreciation', 
      members: ['user11', 'user12', 'user13'], 
      imageUrl: '/api/placeholder/40/40',
      lastMessage: 'Studio Ghibli marathon this weekend?',
      unreadCount: 0,
      online: true,
      typing: false,
      timestamp: new Date().toISOString(),
      messageStatus: 'read'
    }
  ]);
  

  // Function to mark a chat as read
  const handleMarkAsRead = (chatId: string) => {
    setChatGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === chatId 
          ? {...group, unreadCount: 0} 
          : group
      )
    );
  };

  const handleSubmit = async (type) => {
    try {
      if (type === 'join') {
        // Get form data for joining a box
        const form = document.querySelector('form');
        const inviteLink = form.elements.inviteLink.value;
        
        // Send request to backend
        const response = await fetch('/api/boxes/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteLink })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Navigate to the specific chatroom
          router.push(`/box/${data.boxId}`);
        } else {
          alert(data.message || 'Failed to join box');
        }
      } else if (type === 'create') {
        // Get form data for creating a box
        const form = document.querySelector('form');
        const boxName = form.elements.boxName.value;
        const description = form.elements.description.value;
        
        // Create form data for image upload
        const formData = new FormData();
        formData.append('boxName', boxName);
        formData.append('description', description);
        if (groupImage) {
          formData.append('image', groupImage);
        }
        
        // Send request to backend
        const response = await fetch('/api/boxes/create', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Navigate to the newly created chatroom
          router.push(`/box/${data.boxId}`);
        } else {
          alert(data.message || 'Failed to create box');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout setSelectedChat={setSelectedChat}>
      <div className="flex h-screen bg-gray-100">
        {/* Chat list sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 
  className="text-xl font-bold mb-6 cursor-pointer"
  onClick={() => setSelectedChat(null)}
>
  Discussion Rooms
</h2>

          <ChatList 
            chatGroups={chatGroups} 
            selectedChatId={selectedChat?.id} 
            onSelectChat={(chat) => setSelectedChat(chat)}
            onMarkAsRead={handleMarkAsRead} 
          />
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatContainer chatGroup={selectedChat} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-800 via-violet-900 to-gray-800">
              <div className="text-center p-8">
                <h2 
                  className="
                    text-4xl 
                    font-bold 
                    mb-4 
                    text-transparent 
                    bg-clip-text 
                    bg-gradient-to-r 
                    from-blue-600 
                    to-indigo-800
                    drop-shadow-[0_0_8px_rgba(0,50,128,0.7)]
                  "
                >
                  Landed at 
                  <span 
                    className="
                      ml-2
                      text-transparent 
                      bg-clip-text 
                      bg-gradient-to-r 
                      from-red-600 
                      to-rose-800
                      drop-shadow-[0_0_8px_rgba(128,0,0,0.7)]
                    "
                  >
                    GenieBox
                  </span>
                </h2>
                <p 
                  className="
                    text-lg 
                    mb-6
                    text-transparent 
                    bg-clip-text 
                    bg-gradient-to-r 
                    from-white 
                    to-yellow-100 
                    drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]
                  "
                >
                  Select a chat room to start discussing your favorite 
                  <span 
                    className="
                      mx-1
                      text-transparent 
                      bg-clip-text
                      bg-gradient-to-r 
                      from-yellow-400 
                      to-yellow-600
                      drop-shadow-[0_0_4px_rgba(255,255,0,0.6)]
                      font-semibold
                    "
                  >
                    movies and shows
                  </span> 
                  with your homies
                </p>

                <div className="relative h-64 w-64 mx-auto mb-8">
                  <SpinningLogo />
                </div>

                <div className="flex space-x-20 justify-center">
                  <Button onClick={() => setModalType("join")}>Join a Box</Button>
                  <Button onClick={() => setModalType("create")}>Create a Box</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Join or Create Box */}
      {modalType !== "none" && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-800 text-white w-96 p-5 rounded-lg shadow-lg relative">
      {modalType === "join" && (
        <form onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          handleSubmit('join');
        }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Join a Box</h3>
            <button 
              type="button"
              onClick={() => setModalType("none")} 
              className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          <input
            type="text"
            name="inviteLink"
            placeholder="Paste invite link..."
            className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2 relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : null}
            <span className={isLoading ? "opacity-0" : ""}>Join Box</span>
          </button>
          <p className="text-xs text-gray-400">
            The invite link will be verified on the backend by extracting the token.
          </p>
        </form>
      )}
      
      {modalType === "create" && (
        <form onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          handleSubmit('create');
        }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Create a Box</h3>
            <button 
              type="button"
              onClick={() => setModalType("none")} 
              className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          
          {/* Group Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              {groupImage ? (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 mb-2">
                  <img 
                    src={URL.createObjectURL(groupImage)} 
                    alt="Group" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1 cursor-pointer hover:bg-indigo-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => setGroupImage(e.target.files[0])}
                />
              </label>
            </div>
            <span className="text-xs text-gray-400">Add group photo</span>
          </div>
          
          <input
            type="text"
            name="boxName"
            placeholder="Enter box name..."
            className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            required
          />
          
          <textarea
            name="description"
            placeholder="Box description (optional)"
            className="w-full p-2 bg-gray-700 text-white rounded mb-4 resize-none"
            rows="3"
          ></textarea>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-2 relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : null}
            <span className={isLoading ? "opacity-0" : ""}>Create Box</span>
          </button>
          
          <p className="text-xs text-gray-400">
            A unique invite link will be generated for your box.
          </p>
        </form>
      )}
    </div>
  </div>
)}
    </Layout>
  );
};

export default MainPage;
