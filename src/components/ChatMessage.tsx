"use client";

import { motion } from "framer-motion";
import {
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Message } from "@/types";
import { useSpeech } from "@/hooks/useSpeech";

// Simple date formatter
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface ChatMessageProps {
  message: Message;
  index: number;
  language?: string;
}

export default function ChatMessage({
  message,
  index,
  language = "en",
}: ChatMessageProps) {
  const isBot = message.sender === "bot";

  // Initialize text-to-speech functionality
  const {
    speak,
    stopSpeaking,
    isSpeaking,
    speechSupported: ttsSupported,
  } = useSpeech(language);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleFeedback = (positive: boolean) => {
    // Here you would implement feedback collection
    console.log(
      `Feedback for message ${message.id}: ${
        positive ? "positive" : "negative"
      }`
    );
  };

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(message.content);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex gap-3 p-4 ${isBot ? "bg-gray-50" : "bg-white"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot
            ? "bg-gradient-to-br from-blue-500 to-purple-600"
            : "bg-gradient-to-br from-green-500 to-emerald-600"
        }`}
      >
        {isBot ? (
          <Bot size={16} className="text-white" />
        ) : (
          <User size={16} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900">
            {isBot ? "FinGuru" : "You"}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(new Date(message.timestamp))}
          </span>
        </div>

        {/* Message Text */}
        <div
          className={`prose prose-sm max-w-none ${
            isBot ? "text-gray-800" : "text-gray-900"
          }`}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Actions for bot messages */}
        {isBot && (
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleCopyMessage}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors duration-200"
              title="Copy message"
            >
              <Copy size={14} />
            </button>

            {/* Text-to-Speech Button */}
            {ttsSupported && (
              <button
                onClick={handleTextToSpeech}
                className={`p-1.5 hover:bg-white rounded-lg transition-colors duration-200 ${
                  isSpeaking
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-gray-400 hover:text-blue-600"
                }`}
                title={isSpeaking ? "Stop speaking" : "Read aloud"}
              >
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            )}

            <button
              onClick={() => handleFeedback(true)}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-colors duration-200"
              title="Helpful"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
              title="Not helpful"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
