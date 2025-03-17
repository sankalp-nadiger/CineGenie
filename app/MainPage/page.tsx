"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ChatList } from '@/components/ChatList';
import { ChatRoom } from '@/components/ChatRoom';
import ChatContainer from '@/components/ChatContainer'
import type { ChatGroup } from '@/types';
import SpinningLogo from '@/components/SpinningLogo';
import Button from '@/components/Button';

const MainPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);
  
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

  const [modalType, setModalType] = useState<"none" | "join" | "create">("none");

  return (
    <Layout>
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
          <div className="bg-gray-800 text-white w-80 p-4 rounded-lg shadow-lg">
            {modalType === "join" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Join a Box</h3>
                  <button onClick={() => setModalType("none")} className="text-gray-400 hover:text-gray-200 text-2xl leading-none">
                    &times;
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Paste invite link..."
                  className="w-full p-2 bg-gray-700 text-white rounded mb-4"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2">
                  Join Box
                </button>
                <p className="text-xs text-gray-400">
                  The invite link will be verified on the backend by extracting the token.
                </p>
              </>
            )}
            {modalType === "create" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Create a Box</h3>
                  <button onClick={() => setModalType("none")} className="text-gray-400 hover:text-gray-200 text-2xl leading-none">
                    &times;
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter box name..."
                  className="w-full p-2 bg-gray-700 text-white rounded mb-4"
                />
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-2">
                  Create Box
                </button>
                <p className="text-xs text-gray-400">
                  A unique invite link will be generated for your box.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MainPage;
