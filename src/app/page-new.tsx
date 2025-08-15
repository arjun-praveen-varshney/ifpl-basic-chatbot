"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import LanguageSelection from "@/components/LanguageSelection";
import ChatScreen from "@/components/ChatScreen";
import ProfileScreen from "@/components/ProfileScreen";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useChat } from "@/hooks/useChat";
import { storageService } from "@/services/storage";
import { Language } from "@/types";

type AppScreen = "welcome" | "language" | "chat" | "profile";

export default function FinGuruApp() {
  const {
    profile,
    loading,
    updateLanguage,
    markOnboardingCompleted,
    addFinancialTopic,
  } = useUserProfile();
  const { conversations } = useChat();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");

  useEffect(() => {
    if (!loading && profile) {
      if (!profile.onboardingCompleted) {
        setCurrentScreen("welcome");
      } else {
        setCurrentScreen("chat");
      }
    }
  }, [profile, loading]);

  const handleWelcomeComplete = () => {
    setCurrentScreen("language");
  };

  const handleLanguageSelect = (language: Language) => {
    updateLanguage(language.code);
  };

  const handleLanguageComplete = () => {
    markOnboardingCompleted();
    setCurrentScreen("chat");
  };

  const handleProfileClick = () => {
    setCurrentScreen("profile");
  };

  const handleProfileBack = () => {
    setCurrentScreen("chat");
  };

  const handleSettingsClick = () => {
    setCurrentScreen("language");
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all your data? This action cannot be undone."
      )
    ) {
      storageService.clearAllData();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">FG</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">FinGuru</h2>
          <p className="text-gray-600">Loading your financial advisor...</p>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p>Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onComplete={handleWelcomeComplete} />
          </motion.div>
        )}

        {currentScreen === "language" && (
          <motion.div
            key="language"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LanguageSelection
              currentLanguage={profile.preferredLanguage}
              onLanguageSelect={handleLanguageSelect}
              onContinue={handleLanguageComplete}
            />
          </motion.div>
        )}

        {currentScreen === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatScreen
              language={profile.preferredLanguage}
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
            />
          </motion.div>
        )}

        {currentScreen === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileScreen
              profile={profile}
              conversations={conversations}
              onBack={handleProfileBack}
              onUpdateProfile={(updates) => {
                // Handle profile updates
                Object.assign(profile, updates);
                storageService.saveUserProfile(profile);
              }}
              onLanguageChange={updateLanguage}
              onClearData={handleClearData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
