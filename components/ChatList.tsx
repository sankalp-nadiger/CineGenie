"use client";
import React from "react";
import type { ChatGroup } from "@/types";
import { motion } from "framer-motion";

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
  onMarkAsRead,
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
        className={`p-2 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${
          selectedChatId === chat.id
            ? "bg-black border border-gray-700/50 shadow-md shadow-gray-800/40"
            : "hover:bg-gray-800/50 border border-gray-700/30"
        }`}
        onClick={() => {
          onSelectChat(chat);
          if (chat.unreadCount > 0 && onMarkAsRead) {
            onMarkAsRead(chat.id);
          }
        }}
      >
        {/* Chat Avatar & Status */}
        <div className="flex items-center gap-2">
          <div className="relative">
            {/* Chat Image */}
            <div
              className={`h-10 w-10 rounded-xl overflow-hidden border-2 ${
                chat.online ? "border-emerald-500" : "border-transparent"
              }`}
            >
              <img
                src={chat.imageUrl}
                alt={chat.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
      
            {/* Online Status Indicator */}
            {chat.online && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-gray-900"></div>
            )}
          </div>
      
          {/* Chat Details */}
          <div className="flex-1 overflow-hidden">
            {/* Chat Name and Unread Messages */}
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-white text-sm truncate">{chat.name}</h3>
      
              {/* Unread Count */}
              {chat.unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-5 h-5"
                >
                  {chat.unreadCount}
                </motion.span>
              )}
            </div>
      
            {/* Last Message & Status */}
            <div className="flex items-center justify-between w-full mt-0.5">
              {/* Typing Indicator or Last Message */}
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
                <p
                  className={`text-xs truncate flex-1 ${
                    chat.unreadCount > 0 ? "text-gray-100 font-medium" : "text-gray-400"
                  }`}
                >
                  {chat.lastMessage}
                </p>
              )}
      
              {/* Read Indicators (Moved to Rightmost) */}
              <div className="ml-auto">
                {chat.messageStatus === "sent" && <span className="text-gray-500">✓</span>}
                {chat.messageStatus === "delivered" && <span className="text-gray-400">✓✓</span>}
                {chat.messageStatus === "read" && <span className="text-blue-500">✓✓</span>}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      
      ))}
    </div>
  );
};
