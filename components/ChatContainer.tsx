"use client";
import React, { useState } from "react";
import {ChatRoom} from "./ChatRoom"; // Import ChatRoom
import Input from "./Message"; // Import Message input
import type { ChatGroup, Message } from "@/types"; // Import correct types

interface ChatContainerProps {
  chatGroup: ChatGroup;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chatGroup }) => {
  // State to hold chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "user1",
      username: "MovieBuff42",
      content: "What did everyone think about the new sci-fi film?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      userId: "user2",
      username: "FilmCritic99",
      content: "The visual effects were amazing, but the story was weak.",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
    },
  ]);

  // Function to handle sending messages
  const sendMessage = (messageText: string) => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        userId: "currentUser",
        username: "You",
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update state
    }
  };

  return (
    <div className="flex flex-col h-screen justify-between bg-gray-800">
      <ChatRoom chatGroup={chatGroup} messages={messages} /> {/* Pass messages */}
      <Input sendMessage={sendMessage} /> {/* Pass function */}
    </div>
  );
};

export default ChatContainer;
