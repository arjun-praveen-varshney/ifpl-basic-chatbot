"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  Keyboard,
  Loader2,
  Sparkles,
  TrendingUp,
  Shield,
  PiggyBank,
  Calculator,
  AlertCircle,
} from "lucide-react";
import { Message } from "@/types";
import { useSpeech } from "@/hooks/useSpeech";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
  language: string;
}

const QUICK_QUESTIONS = [
  {
    icon: TrendingUp,
    text: "How to start investing?",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: PiggyBank,
    text: "Best savings strategies",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Shield,
    text: "Insurance planning",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Calculator,
    text: "Budget management",
    color: "from-orange-500 to-amber-600",
  },
];

export default function ChatInput({
  onSendMessage,
  loading,
  language,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize speech functionality
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    speechSupported,
    error: speechError,
    clearError: clearSpeechError,
  } = useSpeech(language);

  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  // Auto-submit when speech recognition stops with content
  useEffect(() => {
    if (!isListening && transcript.trim() && inputMode === "voice") {
      // Small delay to ensure user can see the transcript
      const timer = setTimeout(() => {
        handleSubmit(new Event("submit") as any);
        resetTranscript();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, inputMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = message.trim() || transcript.trim();
    if (messageToSend && !loading) {
      onSendMessage(messageToSend);
      setMessage("");
      resetTranscript();
    }
  };

  const handleQuickQuestion = (question: string) => {
    if (!loading) {
      onSendMessage(question);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    if (inputMode === "voice" && isListening) {
      stopListening();
    }
  };

  const toggleVoiceInput = () => {
    // If speech is not supported, don't switch to voice mode
    if (!speechSupported && inputMode === "text") {
      return;
    }

    setInputMode(inputMode === "text" ? "voice" : "text");
    if (inputMode === "voice" && isListening) {
      stopListening();
    }
  };

  // Auto-switch back to text mode if speech becomes unavailable
  useEffect(() => {
    if (!speechSupported && inputMode === "voice") {
      setInputMode("text");
    }
  }, [speechSupported, inputMode]);

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      if (speechError) {
        clearSpeechError();
      }
      startListening();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="bg-white border-t border-gray-100 p-4">
      {/* Quick Questions */}
      {message === "" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <p className="text-sm text-gray-500 mb-3 flex items-center">
            <Sparkles size={16} className="mr-2 text-blue-500" />
            Quick questions to get started:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_QUESTIONS.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickQuestion(item.text)}
                disabled={loading}
                className={`p-3 rounded-xl text-left text-sm font-medium text-white bg-gradient-to-r ${item.color} hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:transform-none`}
              >
                <item.icon size={16} className="mb-1" />
                <div>{item.text}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Input Mode Toggle */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          disabled={!speechSupported}
          className={`p-3 rounded-xl transition-all duration-200 ${
            inputMode === "voice"
              ? "bg-blue-500 text-white"
              : speechSupported
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-gray-50 text-gray-400 cursor-not-allowed"
          }`}
          title={
            !speechSupported
              ? "Speech recognition is not available"
              : "Toggle input mode"
          }
        >
          {inputMode === "text" ? <Mic size={20} /> : <Keyboard size={20} />}
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          {inputMode === "text" ? (
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about finance..."
              className="w-full p-3 pr-12 border border-gray-200 rounded-xl resize-none max-h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading}
            />
          ) : (
            <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center min-h-[48px] relative">
              {/* Speech Error Display */}
              {speechError && (
                <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-600 text-xs p-2 rounded-t-xl">
                  {speechError}
                </div>
              )}

              {/* Speech not supported message */}
              {!speechSupported && (
                <div className="text-gray-500 text-sm">
                  Speech recognition not supported in this browser
                </div>
              )}

              {/* Speech controls */}
              {speechSupported ? (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    isListening
                      ? "text-red-500"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  <span className="text-sm">
                    {isListening
                      ? "Listening... (Tap to stop)"
                      : "Tap to speak"}
                  </span>
                </button>
              ) : (
                <div className="text-gray-500 text-sm flex items-center space-x-2">
                  <Mic size={20} className="opacity-50" />
                  <span>Speech recognition not available</span>
                </div>
              )}

              {/* Transcript Display */}
              {transcript && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-200">
                  <div className="font-medium">Recognized:</div>
                  <div>"{transcript}"</div>
                </div>
              )}

              {/* Listening Animation */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-50/90 backdrop-blur-sm rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-red-700">
                        Listening...
                      </span>
                      <button
                        type="button"
                        onClick={stopListening}
                        className="ml-2 px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={
            loading ||
            (inputMode === "text" && !message.trim()) ||
            (inputMode === "voice" && !transcript.trim())
          }
          className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
