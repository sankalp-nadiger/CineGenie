"use client";
import React from 'react';
import type { ChatGroup } from '@/types';
import { motion } from 'framer-motion';

interface ChatListProps {
  chatGroups: ChatGroup[];
  selectedChatId?: string;
  onSelectChat: (chat: ChatGroup) => void;
  onMarkAsRead?: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  chatGroups, 
  selectedChatId, 
  onSelectChat,
  onMarkAsRead
}) => {
  return (
    <div className="space-y-1 py-2">
      {chatGroups.map((chat) => (
        <motion.div 
          key={chat.id}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${
            selectedChatId === chat.id 
              ? 'bg-gradient-to-r from-indigo-900/80 to-blue-900/80 border border-indigo-500/30 shadow-lg shadow-indigo-500/20' 
              : 'hover:bg-gray-800/50 border border-gray-700/30'
          }`}
          onClick={() => {
            onSelectChat(chat);
            if (chat.unreadCount > 0 && onMarkAsRead) {
              onMarkAsRead(chat.id);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`h-12 w-12 rounded-2xl overflow-hidden border-2 ${
                chat.online ? 'border-emerald-500' : 'border-transparent'
              }`}>
                <img 
                  src={chat.imageUrl} 
                  alt={chat.name} 
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" 
                />
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-gray-900"></div>
              )}
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white truncate">{chat.name}</h3>
                <div className="flex items-center gap-2">
                  {chat.timestamp && (
                    <span className="text-xs text-gray-400">{chat.timestamp}</span>
                  )}
                  {chat.unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center justify-center min-w-6 h-6"
                    >
                      {chat.unreadCount}
                    </motion.span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {chat.typing ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-indigo-400">typing</span>
                    <div className="flex space-x-1">
                      <motion.div 
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                        className="h-1 w-1 rounded-full bg-indigo-400" 
                      />
                      <motion.div 
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                        className="h-1 w-1 rounded-full bg-indigo-400" 
                      />
                      <motion.div 
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                        className="h-1 w-1 rounded-full bg-indigo-400" 
                      />
                    </div>
                  </div>
                ) : (
                  <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-100 font-medium' : 'text-gray-400'}`}>
                    {chat.lastMessage}
                  </p>
                )}
                
                {chat.messageStatus === 'sent' && (
                  <span className="text-gray-500 flex-shrink-0">✓</span>
                )}
                {chat.messageStatus === 'delivered' && (
                  <span className="text-gray-400 flex-shrink-0">✓✓</span>
                )}
                {chat.messageStatus === 'read' && (
                  <span className="text-blue-500 flex-shrink-0">✓✓</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};