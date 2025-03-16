"use client";
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ChatList } from '@/components/ChatList';
import { ChatRoom } from '@/components/ChatRoom';
import type { ChatGroup } from '@/types';

const MainPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);
  
  // Make the chat groups into state so we can update them
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([
    { 
      id: '1', 
      name: 'Marvel Universe', 
      lastMessage: 'Did you see the new trailer?',
      unreadCount: 3,
      imageUrl: '/api/placeholder/40/40'
    },
    { 
      id: '2', 
      name: 'Horror Movie Fans', 
      lastMessage: 'That ending was insane!',
      unreadCount: 0,
      imageUrl: '/api/placeholder/40/40'
    },
    { 
      id: '3', 
      name: 'Oscar Predictions', 
      lastMessage: 'My top pick is definitely...',
      unreadCount: 12,
      imageUrl: '/api/placeholder/40/40'
    },
    { 
      id: '4', 
      name: 'Sci-Fi Discussions', 
      lastMessage: 'The worldbuilding in Dune was...',
      unreadCount: 5,
      imageUrl: '/api/placeholder/40/40'
    },
    { 
      id: '5', 
      name: 'Animation Appreciation', 
      lastMessage: 'Studio Ghibli marathon this weekend?',
      unreadCount: 0,
      imageUrl: '/api/placeholder/40/40'
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

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100">
        {/* Chat list sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6">Discussion Rooms</h2>
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
            <ChatRoom chatGroup={selectedChat} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome to MovieChat</h2>
                <p className="text-gray-600 mb-6">Select a chat room to start discussing your favorite movies and shows</p>
                <img src="/api/placeholder/400/225" alt="Movies collage" className="rounded-lg shadow-lg mx-auto" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MainPage;