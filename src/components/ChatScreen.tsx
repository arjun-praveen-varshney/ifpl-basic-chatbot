"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Plus, Settings, User } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import { Conversation } from "@/types";

interface ChatScreenProps {
  language: string;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

export default function ChatScreen({
  language,
  onProfileClick,
  onSettingsClick,
}: ChatScreenProps) {
  const {
    conversations,
    currentConversation,
    loading,
    error,
    startNewConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    clearError,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = (message: string) => {
    sendMessage(message, language);
  };

  const handleNewConversation = () => {
    startNewConversation();
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="w-80 bg-white border-r border-gray-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">FG</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800">Arjun</h1>
                <p className="text-sm text-gray-500">Your Financial Advisor</p>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus size={20} />
            <span className="font-medium">New Conversation</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Start your first chat!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={currentConversation?.id === conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                  onDelete={() => deleteConversation(conversation.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={onProfileClick}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <User size={18} />
              <span className="text-sm">Profile</span>
            </button>
            <button
              onClick={onSettingsClick}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-gray-800">
                {currentConversation?.title ||
                  "Choose a conversation or start a new one"}
              </h2>
              {currentConversation && (
                <p className="text-sm text-gray-500">
                  {currentConversation.messages.length} messages
                  {currentConversation.topics.length > 0 && (
                    <span className="ml-2">
                      • Topics: {currentConversation.topics.join(", ")}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {!currentConversation ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-white" size={40} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to FinGuru!
                </h3>
                <p className="text-gray-600 mb-6">
                  Start a new conversation to get personalized financial advice
                  and insights.
                </p>
                <button
                  onClick={handleNewConversation}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Start Chatting
                </button>
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {currentConversation.messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  index={index}
                  language={language}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-t border-red-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Chat Input */}
        {currentConversation && (
          <ChatInput
            onSendMessage={handleSendMessage}
            loading={loading}
            language={language}
          />
        )}
      </div>
    </div>
  );
}

// Conversation Item Component
interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
}: ConversationItemProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const timeAgo = new Date(conversation.updatedAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${
        isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <h4
          className={`font-medium text-sm truncate pr-2 ${
            isActive ? "text-blue-700" : "text-gray-800"
          }`}
        >
          {conversation.title}
        </h4>
        <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo}</span>
      </div>

      {lastMessage && (
        <p className="text-xs text-gray-600 truncate">{lastMessage.content}</p>
      )}

      {conversation.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {conversation.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
            >
              {topic}
            </span>
          ))}
          {conversation.topics.length > 2 && (
            <span className="text-xs text-gray-500">
              +{conversation.topics.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
