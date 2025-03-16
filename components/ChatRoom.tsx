"use client";
import React, { useState } from 'react';
import type { ChatGroup, Message } from '@/types';

interface ChatRoomProps {
  chatGroup: ChatGroup;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ chatGroup }) => {
  const [messageText, setMessageText] = useState('');
  
  // Sample messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'MovieBuff42',
      content: 'What did everyone think about the new sci-fi film that just came out?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      userId: 'user2',
      username: 'FilmCritic99',
      content: 'The visual effects were amazing, but the story felt a bit weak in the third act.',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
    },
    {
      id: '3',
      userId: 'user3',
      username: 'SciFiFan',
      content: 'I actually loved it! The world-building was incredible and the characters had great chemistry.',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
    }
  ]);

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

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Chat header */}
      <div className="bg-gray-800 p-4 shadow-sm flex items-center border-b border-gray-700">
        <img src={chatGroup.imageUrl} alt={chatGroup.name} className="h-10 w-10 rounded-full mr-3" />
        <div>
          <h2 className="font-bold text-lg">{chatGroup.name}</h2>
          <p className="text-sm text-gray-400">48 members</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.userId === 'currentUser';
          
          return (
            <div key={message.id} className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}> 
              {!isCurrentUser && (
                <img src={message.avatar} alt={message.username} className="h-8 w-8 rounded-full mr-2" />
              )}
              <div className={`max-w-md p-3 rounded-lg ${
                isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}>
                {!isCurrentUser && (
                  <p className="text-sm font-medium text-gray-400 mb-1">{message.username}</p>
                )}
                <p>{message.content}</p>
                <p className="text-xs mt-1 text-gray-400 text-right">{formatTime(message.timestamp)}</p>
              </div>
              {isCurrentUser && (
                <img src={message.avatar} alt="You" className="h-8 w-8 rounded-full ml-2" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Message input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-white border-none rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};
