"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MessageSquare,
  TrendingUp,
  Calendar,
  BookOpen,
  Award,
  ArrowLeft,
  Edit3,
  Globe,
  Trash2,
  Download,
} from "lucide-react";
import { UserProfile, Conversation } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/config/languages";

interface ProfileScreenProps {
  profile: UserProfile;
  conversations: Conversation[];
  onBack: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onLanguageChange: (languageCode: string) => void;
  onClearData: () => void;
}

export default function ProfileScreen({
  profile,
  conversations,
  onBack,
  onUpdateProfile,
  onLanguageChange,
  onClearData,
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name || "");

  const handleSaveName = () => {
    onUpdateProfile({ name: editedName });
    setIsEditing(false);
  };

  const handleExportData = () => {
    const dataToExport = {
      profile,
      conversations,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finguru-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalMessages = conversations.reduce(
    (total, conv) => total + conv.messages.length,
    0
  );
  const userMessages = conversations.reduce(
    (total, conv) =>
      total + conv.messages.filter((msg) => msg.sender === "user").length,
    0
  );
  const allTopics = conversations.reduce(
    (topics: string[], conv) => [...topics, ...conv.topics],
    []
  );
  const uniqueTopics = [...new Set(allTopics)];

  const getLanguageName = (code: string) => {
    const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Chat</span>
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={32} />
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveName}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {profile.name || "FinGuru User"}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                  <p className="text-gray-600">Financial Learning Journey</p>
                </div>
              )}
            </div>

            {/* Language Settings */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe size={16} className="inline mr-2" />
                Preferred Language
              </label>
              <select
                value={profile.preferredLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.flag} {language.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="text-blue-500" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    Conversations
                  </span>
                </div>
                <span className="font-semibold text-blue-600">
                  {conversations.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="text-green-500" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    Messages Sent
                  </span>
                </div>
                <span className="font-semibold text-green-600">
                  {userMessages}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="text-purple-500" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    Topics Explored
                  </span>
                </div>
                <span className="font-semibold text-purple-600">
                  {uniqueTopics.length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Activity Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Recent Conversations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="mr-2 text-blue-500" size={20} />
                Recent Conversations
              </h3>

              {conversations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No conversations yet
                </p>
              ) : (
                <div className="space-y-3">
                  {conversations.slice(0, 5).map((conversation) => (
                    <div
                      key={conversation.id}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 truncate">
                          {conversation.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            conversation.updatedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {conversation.messages.length} messages
                      </p>
                      {conversation.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {conversation.topics.map((topic) => (
                            <span
                              key={topic}
                              className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Topics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="mr-2 text-purple-500" size={20} />
                Financial Topics Explored
              </h3>

              {uniqueTopics.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Start chatting to see your learning progress
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uniqueTopics.map((topic) => (
                    <div
                      key={topic}
                      className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg text-center"
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {topic}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {allTopics.filter((t) => t === topic).length}{" "}
                        discussions
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Data Management
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <Download size={20} />
                  <span>Export Data</span>
                </button>

                <button
                  onClick={onClearData}
                  className="flex items-center justify-center space-x-2 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                  <span>Clear All Data</span>
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Export your data for backup or clear all conversations and start
                fresh.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
